# Octopus
Octopus is a build tool (custom task runner) used in PrivateSky to handle all deps and other tasks necessary in projects.

## Documentation


More documentation found at: https://privatesky.xyz/?Tools/octopus

## Developer notes

Octopus is a set of commands that got executed as a "postinstall" hook defined inside **package.json** file you find in pretty all PrivateSky projects.

Order of execution is: npm > package.json > "scripts" > "post install" > run.js > index.js

Excerpt from a package.json file: 
```
...
scripts": {
    "postinstall": "node ./node_modules/octopus/scripts/run",
    ...
```

### Configurations for Visual Studio Code

To configure a set of launchers for Visual Studio Code add the following lines of code to the **launch.json** file

```json
...
"configurations": [

        {
            "type": "node",
            "request": "launch",
            "name": "Octopus",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "program": "${workspaceFolder}/scripts/run.js",
            "env": {"DEV": "true"}
        },

        {
            "type": "node",
            "request": "launch",
            "name": "Freeze",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "program": "${workspaceFolder}/scripts/freeze.js",
            "env": {"DEV": "false"}
        },

        {
            "type": "node",
            "request": "launch",
            "name": "Server",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "program": "${workspaceFolder}/scripts/run.js",
            "env": {"DEV": "true"},
            "args": ["run"]
        },        
    ]
...
```




