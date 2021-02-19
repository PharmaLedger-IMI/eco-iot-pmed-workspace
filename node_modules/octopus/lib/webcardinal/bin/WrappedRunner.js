class WrappedRunner {
    constructor(octopusRunner) {
        this.octopusRunner = octopusRunner;
    }

    async run(tasks = []) {
        const config = {
            workDir: '.',
            dependencies: tasks
        }

        return new Promise((resolve, reject) => {
            this.octopusRunner.run(config, (error, result) => {
                if (error) {
                    reject(error);
                    return
                }
                console.log('[Octopus]', result, '\n');
                resolve(null, result);
            })
        });
    }
}

module.exports = WrappedRunner;