const fs = require('fs');
const path = require('path');
const util = require('util');
const config = require('../config');
const Installer = require('./Installer');
const WrappedRunner = require('./WrappedRunner');

const FLAGS = {
  DEVELOPMENT: 'dev'
}

class Builder {
  constructor(runner, devPath, buildPath, options = {}) {
    this.devPath = devPath || config.devPath;
    this.buildPath = buildPath || config.buildPath;
    this.options = options;
    this.runner = new WrappedRunner(runner);
    this.installer = new Installer(runner, this.devPath);
    this.core = undefined; // @webcardinal/core or @cardinal/core with different payloads

    // DEV or dev are accepted
    for (const key of Object.keys(options)) {
      if (key.toLowerCase() === FLAGS.DEVELOPMENT) {
        this.options[FLAGS.DEVELOPMENT] = this.options[key];
        delete this.options[key];
      }
    }

    // components folder is the root
    this.devPath = path.join(this.devPath, 'components');
    this.buildPath = path.join(this.buildPath, 'components');
  }

  get configuration() {
    const exists = async component => {
      const components = await this.configuration.components();
      return components.includes(component);
    }

    return {
      components: async (componentsPath = this.devPath) => {
        if (!fs.existsSync(componentsPath)) {
          return [];
        }

        const readDirectory = util.promisify(fs.readdir);
        try {
          return await readDirectory(componentsPath);
        } catch (error) {
          console.error(error);
          return [];
        }
      },

      build: async (component, isSafe = false) => {
        const build = (this.options[FLAGS.DEVELOPMENT]? 'dev' : 'build');

        if (!isSafe && !await exists(component)) {
          return {};
        }

        return {
          name: `build-webcardinal-component_${component}`,
          actions: [
            {
              type: 'remove',
              target: path.join(this.buildPath, component)
            },
            {
              type: 'execute',
              cmd: `cd ${path.join(this.devPath, component)} && npm run ${build}`
            }
          ]
        }
      },

      /**
       * The build process is always in the following order
       * 1. @webcardinal/core
       * 2. @cardinal/core
       * 3. file system order (alphabetical order) for the remaining components
       */
      buildAll: async () => {
        let components = await this.configuration.components();
        if (components.length === 0) {
          throw "No WebCardinal components found!";
        }

        // installation data
        let data = await this.installer.getDataPackages(components.map(name => ({ name })));
        const { packages } = data;

        // find the core, build it first
        let configuration = [];
        if (packages['@cardinal/core']) {
          this.core = packages['@cardinal/core'];
          this.core.component = this.core.src.split('/').pop();
          components = components.filter(component => this.core.component !== component);
          configuration.push(await this.configuration.build(this.core.component, true))
        }

        if (packages['@webcardinal/core']) {
          this.core = packages['@webcardinal/core'];
          this.core.component = this.core.src.split('/').pop();
          components = components.filter(component => this.core.component !== component);
          configuration = [await this.configuration.build(this.core.component, true), ...configuration];
        }

        if (!this.core || !this.core.component) {
          throw "No WebCardinal core found! (@webcardinal/core or @cardinal/core) #build";
        }

        // build remaining components
        for (const component of components) {
          configuration.push(await this.configuration.build(component, true));
        }

        return configuration;
      },

      copy: async (component, isSafe = false) => {
        if (!isSafe && !await exists(component)) {
          return {};
        }

        let target = path.join(this.buildPath, component);
        let actions = [
          {
            type: 'remove',
            target
          },
          {
            type: 'copy',
            src: path.join(this.devPath, component, 'build/dist/webcardinal'),
            target
          }
        ];

        if (this.core && this.core.component === component) {
          target = path.join(this.buildPath, '../base');
          actions.push(
            {
              type: 'remove',
              target
            },
            {
              type: 'copy',
              src: path.join(this.devPath, `${component}/base`),
              target
            }
          )
        }

        let src = path.join(this.devPath, component, 'extended');
        target = path.join(this.buildPath, '../extended', component);
        if (fs.existsSync(src)) {
          actions.push(
              {
                type: 'remove',
                target
              },
              {
                type: 'copy',
                src,
                target
              }
          )
        }

        return {
          name: `copy-webcardinal-component_${component}`,
          actions
        }
      },

      copyAll: async () => {
        const components = await this.configuration.components();
        let configuration = [];
        for (const component of components) {
          configuration.push(await this.configuration.copy(component, true));
        }
        return configuration;
      }
    }
  }

  async build(components) {
    let tasks = [];
    if (!components || !Array.isArray(components)) {
      tasks = await this.configuration.buildAll();
    } else {
      for (let component of components) {
        tasks.push(await this.configuration.build(component));
      }
    }
    return this.runner.run(tasks);
  }

  async copy(components) {
    let tasks = [];
    if (!components || !Array.isArray(components)) {
      tasks = await this.configuration.copyAll();
    } else {
      for (let component of components) {
        tasks.push(await this.configuration.copy(component));
      }
    }
    return this.runner.run(tasks);
  }

  async merge() {
    let components = await this.configuration.components(this.buildPath);
    if (!components.includes(this.core.component)) {
      throw "No WebCardinal core found! (@webcardinal/core or @cardinal/core) #merge"
    }
    components = components.filter(component => component !== this.core.component);

    let directory = path.join(this.buildPath).split(path.sep).pop();
    let module = `./${directory}/${this.core.component}`;
    let content = {
      js: `import '${module}/webcardinal.esm.js';\n`,
      css: `@import "${module}/webcardinal.css";\n`
    }

    for (const component of components) {
      module = `./${directory}/${component}`;

      content.js += `import '${module}/webcardinal.esm.js';\n`
      if (fs.existsSync(path.join(this.buildPath, component, 'webcardinal.css'))) {
        content.css += `@import "${module}/webcardinal.css";\n`;
      }
    }

    const writeFile = util.promisify(fs.writeFile);
    await writeFile(path.join(this.buildPath, '../webcardinal.js'), content.js);
    await writeFile(path.join(this.buildPath, '../webcardinal.css'), content.css);
  }
}

module.exports = Builder;
