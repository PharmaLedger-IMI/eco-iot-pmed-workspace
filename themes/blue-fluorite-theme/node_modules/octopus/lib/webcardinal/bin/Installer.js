const fs = require('fs');
const path = require('path');
const util = require('util');
const config = require('../config');
const WrappedRunner = require('./WrappedRunner');

class Installer {
    constructor(runner, devPath, components) {
        this.runner = new WrappedRunner(runner);
        this.devPath = devPath || config.devPath;
        this.components = components || [];
        this.dependencies = config.dependencies || [];
    }

    get configuration() {
        return {
            clone: {
                repository: ({ name, src, target }) => {
                    if (!name || !src) {
                        throw "WebCardinal name or source (src) attributes for component not found!";
                    }

                    if (!target) {
                        target = path.join(this.devPath, './components');
                    }

                    return {
                        name,
                        src,
                        actions: [
                            {
                                type: 'smartClone',
                                target,
                                collectLog: false
                            }
                        ]
                    }
                },

                components: _ => {
                    return this.components.map(component => this.configuration.clone.repository(component));
                },

                dependencies: _ => {
                    let tasks = [];

                    for (const packageName of Object.keys(this.data.packages)) {
                        for (const dependency of this.dependencies) {
                            if (dependency.found) { continue; }

                            const { name, src } = dependency;
                            const target = path.join(this.devPath, './dependencies');
                            dependency.found = true;
                            tasks.push(this.configuration.clone.repository({ name, src, target }));
                        }
                    }

                    return tasks;
                }
            },

            install: {
                components: _ => {
                    let tasks = [];
                    const { components, packages } = this.data;

                    for (let component of Object.keys(components)) {
                        const componentPath = path.join(this.devPath, './components', component);
                        if (!fs.existsSync(componentPath)) { continue; }

                        const packageName = components[component];
                        const packageJSON = packages[packageName];

                        let dependencies = []
                        for (const dependency of Object.keys(packageJSON.dependencies)) {
                            if (packages[dependency]) {
                                dependencies.push(`&& npm install ../.${packages[dependency].src}`);
                            }
                        }
                        for (const dependency of Object.keys(packageJSON.devDependencies)) {
                            if (packages[dependency]) {
                                dependencies.push(`&& npm install --save-dev ../.${packages[dependency].src}`);
                            }
                        }

                        tasks.push({
                            name: `install-webcardinal-component_${component}`,
                            actions: [
                                {
                                    type: 'execute',
                                    cmd: `cd ${componentPath} ${dependencies.join(' ')} && npm install`
                                }
                            ]
                        });
                    }

                    return tasks;
                },

                dependencies: _ => {
                    let tasks = [];
                    const { dependencies } = this.data;

                    for (let dependency of Object.keys(dependencies)) {
                        const dependencyPath = path.join(this.devPath, './dependencies', dependency);
                        if (!fs.existsSync(dependencyPath)) { continue; }

                        tasks.push({
                            name: `install-webcardinal-dependency_${dependency}`,
                            actions: [
                                {
                                    type: 'execute',
                                    cmd: `cd ${dependencyPath} && npm install && npm run build`
                                }
                            ]
                        })
                    }
                    return tasks;
                }
            }
        }
    }

    async clone() {
        await this.runner.run(await this.configuration.clone.components());
        this.data = await this.getDataPackages();
        await this.runner.run(await this.configuration.clone.dependencies());
    }

    async install() {
        this.data = await this.getDataPackages();
        await this.runner.run(await this.configuration.install.dependencies());
        await this.runner.run(await this.configuration.install.components());
    }

    async getDataPackages(components = [], dependencies = {}) {
        const readDataFromPackageJSON = async packagePath => {
            try {
                const readFile = util.promisify(fs.readFile);
                return JSON.parse(await readFile(path.join(packagePath, 'package.json'), 'UTF8'));
            } catch (error) {
                throw error;
            }
        };

        const saveDataFromPackageJSON = async (items, target) => {
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const src = `./${target}/${item.name}`;
                const itemPath = path.join(this.devPath, src);
                if (!fs.existsSync(itemPath)) { continue; }

                const packageJSON = await readDataFromPackageJSON(itemPath);
                const { dependencies, devDependencies } = packageJSON;
                data[target][item.name] = packageJSON.name;
                data.packages[packageJSON.name] = { src, dependencies, devDependencies };
            }
        };

        const data = {
            components: {}, dependencies: {}, packages: {}
        };

        if (Object.keys(dependencies).length === 0) {
            dependencies = this.dependencies;
        }
        await saveDataFromPackageJSON(dependencies, 'dependencies');

        if (components.length === 0) {
            components = this.components;
        }
        await saveDataFromPackageJSON(components, 'components');

        return data;
    }
}

module.exports = Installer;