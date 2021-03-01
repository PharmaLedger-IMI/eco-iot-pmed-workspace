# iot-pmed-workspace

*iot-pmed-workspace*  bundles all the necessary dependencies for building and running SSApps in a single package.

For more details about what a *workspace* is check out the [template-workspace](https://github.com/PrivateSky/template-workspace).

## IOT-PMED Space

This workspace is intended to build 5 modules as described in the projects tab and the open issues.
Currently, it includes 1 patient app and its wallet.
To add more modules, we will include either more SAPPs or cardinal webpages (for prototypes and alpha versions).

To add modules for the alpha versions prototypes we can use cardinal as described in the documentation here:
[PrivateSkyCardinal.xyz](https://privatesky.xyz/?Howto/a-site-with-cardinal)

## Installation

In order to use the workspace, we need to follow a list of steps presented below. 

If you have trouble installing the *iot-pmed-workspace*, please try to follow the guide provided on [PrivateSky.xyz](https://privatesky.xyz/?Start/installation)

### Step 1: Clone the workspace

```sh
$ git clone https://github.com/PharmaLedger-IMI/iot-pmed-workspace.git
```

After the repository was cloned, you must install all the dependencies.

```sh
$ cd iot-pmed-workspace
#Important: for the development mode we proceed with npm run dev-install
#For normal installation, the command is: npm install
$ npm run dev-install 
```
**Note:** this command might take quite some time depending on your internet connection and you machine processing power.

### Step 2: Launch the "server"

While in the *iot-pmed-workspace* folder run:

```sh
$ npm run server
```

At the end of this command you get something similar to:

![alt text](scr-npm-run-server.png)


### Step 3: Build all things needed for the application to run.

Open a new console inside *iot-pmed-workspace* folder and run:

```sh
# Note: Run this in a new console inside "iot-pmed-workspace" folder
$ npm run build-all
```



## Running 
To run the application launch your browser (preferably Chrome) in Incognito mode and access the http://localhost:8080 link.



## Prepare & release a new stable version of the workspace
Steps:
1. start from a fresh install of the workspace.
```
git clone https://github.com/PharmaLedger-IMI/iot-pmed-workspace
cd iot-pmed-workspace
```

2. run the installation process of the workspace
```
npm install
```
3. run the server and build the ssapps and wallets
```
npm run server
npm run build-all
```
4. verify that the builds are successfully and the ssapps are functioning properly
5. execute the freeze command
```
npm run freeze
```
6. verify the output of freeze command and check for errors. If any, correct them and run again the freeze command.
7. commit the new version of the octopus.json file obtained with the freeze command.
