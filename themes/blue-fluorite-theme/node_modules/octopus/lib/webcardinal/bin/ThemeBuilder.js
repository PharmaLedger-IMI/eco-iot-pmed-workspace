const fs = require('fs');
const path = require('path');
const util = require('util');
const config = require('../config');
const WrappedRunner = require('./WrappedRunner');

class ThemeBuilder {
  constructor(runner, devPath, buildPath) {
    this.runner = new WrappedRunner(runner);
    this.devPath = devPath || path.join(config.devPath, 'themes');
    this.buildPath = buildPath || './themes';
  }

  get configuration() {
    const exists = async theme => {
      const themes = await this.configuration.themes();
      return themes.includes(theme);
    }

    return {
      themes: async(themesPath = this.devPath) => {
        const readDirectory = util.promisify(fs.readdir);

        if (!fs.existsSync(themesPath)) {
          return [];
        }

        try {
          return await readDirectory(themesPath);
        } catch (error) {
          console.error(error);
          return [];
        }
      },

      copy: async (theme, isSafe = false) => {
        if (!isSafe && !await exists(theme)) {
          return {};
        }

        let target = path.join(this.buildPath, theme);
        return {
          name: `copy-webcardinal-theme_${theme}`,
          actions: [
            {
              type: 'remove',
              target
            },
            {
              type: 'copy',
              src: path.join(this.devPath, theme, 'src'),
              target
            }
          ]
        }
      },

      copyAll: async() => {
        const themes = await this.configuration.themes();
        let configuration = [];
        for (const theme of themes) {
          configuration.push(await this.configuration.copy(theme, true));
        }
        return configuration;
      }
    }
  }

  async copy(theme) {
    const tasks = theme ? await this.configuration.copy(theme) : await this.configuration.copyAll();
    await this.runner.run(tasks);
  }
}

module.exports = ThemeBuilder;
