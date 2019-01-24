# **A**desso-indoor-navigato**R**

## Setup

### Step 1 - Clone & install repository
```bash
git clone https://github.com/adessoAG/adesso-indoor-navigator
npm install
```

### Step 2 - Edit `config.js`
Now you need to configure your project to use your own Viro API key and your own firebase database. Please create a copy of `./configTemplate.js` named `./config.js` and replace the test data with your information.

#### WARNING
The `config.js` is included in the `.gitignore` and will **not** be commited into your git repository. You must keep track of it **on your own**.

### Step 3 - Create two more JSON files
For data privacy reasons, we removed two JSON files from the repository. In order for the build to succeed, you will need to at least create these files:

1. `./js/res/json/floorplan_adesso.json`
2. `./js/res/json/Javascript2018_Arena.json`

You can fill them with some content similar to their template files (`[...]_template.json`).

**Hint:** You can generate some randomized JSON [here](https://www.json-generator.com/).

### [Android only] Step 4 - Create `local.properties`
In order for Gradle to be able to build the project, you need to create a `./android/local.properties` and fill it with
```
sdk.dir=[Path to your SDK folder]

```

For more information, please take a look at [this question on StackOverflow](https://stackoverflow.com/questions/20673378/where-does-local-properties-go-for-android-project/25318217).

## Build and run
### Android
This process will be automized soon, but until then, you will have to go through all this trouble to build the app. Sorry!

1. Connect your phone to your computer via a USB cable
2. Run `adb devices`, identify the device you want to run the app on and copy its ID.
3. Run `react-native run-android --deviceId [YOUR_DEVICE_ID]` in order to build the APK. Don't worry when something red shows up. If the message right before it is
   ```
   adb: failed to stat app/build/outputs/apk/app-debug.apk: No such file or directory
   Command failed: adb -s 9886784442384a5439 install app/build/outputs/apk/app-debug.apk
   ```
   you're fine and you can proceed with the installation. If it isn't, probably something broke. Feel free to open an issue or to even fix the problem on your own and open a pull request!

### iOS
Coming soon...

## Installation
### Android
This process will also be automized soon!

1. Connect your phone to your computer via a USB cable
2. Run `adb devices`, identify the device you want to run the app on and copy its ID.
3. Run `adb -s [YOUR_DEVICE_ID] install android/app/build/outputs/apk/ar/debug/app-ar-debug.apk` in order to install the APK on your device. Please note that this command wil fail if you already have an older version of it installed on your device. If this is the case, you can simply uninstall the older version and re-run the command.
4. During the build process, another command line should have opened and started running a Metro Bundler. This other command line may or may not have survived the build. If it didn't, run `npm start`.
5. Open the installed app and enjoy your AR experience!

### iOS
Coming soon...

## Attributions
["Green Arrow Icon"](https://poly.google.com/view/7eaXP_9tC-e) by [Thomas Balouet](https://poly.google.com/user/3hZPO-XRoBS) is licensed under [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/)
