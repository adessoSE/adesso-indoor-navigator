# **A**desso-indoor-navigato**R**

## Known bugs
- White screen after first start of the app: Completely quit and restart the app on your phone without starting a new build

## Setup

### Step 1 -  Follow steps 1-4 in the quickstart guide
- Install node and add to path
- Install react native cli: `npm install -g react-native-cli`
- Install viroreact cli `npm install -g react-viro-cli`
- Install and ruby
- [Mac / Linux only] Install watchman

### Step 2 - Clone & install repository
```bash
git clone https://github.com/adessoAG/adesso-indoor-navigator
npm install
```

### Step 3 - Edit `.env`
Now you need to configure your project to use your own Viro API key and your own firebase database. Please create a copy of `./sample.env` named `./.env` and replace the sample data with your information.

#### WARNING
The `.env` is included in the `.gitignore` and will **not** be commited into your git repository. You must keep track of it **on your own**.

### Step 4 - Create two specific JSON files
For data privacy reasons, we removed two JSON files from the repository. In order for the build to succeed, you will need to at least create these files:

1. `./js/res/json/floorplan_adesso.json`
2. `./js/res/json/Javascript2018_Arena.json`

You can fill them with some content similar to their template files (`[...]_template.json`).

**Hint:** You can generate some randomized JSON [here](https://www.json-generator.com/).

### Step 5

#### Android
For general information, see [
https://docs.viromedia.com/docs/installing-viro-android](
https://docs.viromedia.com/docs/installing-viro-android)
- [Maybe unnecessary] `sh setup-ide.sh --android`
- Install ADB
- Install JDK (http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
- Install and Configure Android Studio (Google APIs, Android SDK Platform 28, Sources for Android 28)
- Open the `android/build.gradle` with Android Studio
- Disable instant run in Android Studio settings
- Create a `./android/local.properties` and fill it with ```sdk.dir=[Path to your SDK folder]```. For more information, please take a look at [this question on StackOverflow](https://stackoverflow.com/questions/20673378/where-does-local-properties-go-for-android-project/25318217).
- Enable developer mode and USB debugging on your local Android device

#### iOS
For general information, see [https://docs.viromedia.com/docs/starting-a-new-viro-project-1](https://docs.viromedia.com/docs/starting-a-new-viro-project-1)
- [Maybe unnecessary] `sh setup-ide.sh --ios`
- Install homebrew
- Install cocoapods
- Open .xcworkspace file with Xcode

## Build and installation
### Android
1. Build and run project. Make sure to build the project for your development device and not for the emulator.
2. `npm start` to start the packager server
3. `adb reverse tcp:8081 tcp:8081`

### iOS
1. Build and run project
2. `npm start`

## Attributions
["Green Arrow Icon"](https://poly.google.com/view/7eaXP_9tC-e) by [Thomas Balouet](https://poly.google.com/user/3hZPO-XRoBS) is licensed under [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/)
