# **A**desso-indoor-navigato**R**

- [**A**desso-indoor-navigato**R**](#adesso-indoor-navigator)
  - [Known bugs](#known-bugs)
  - [For adesso employees](#for-adesso-employees)
  - [Setup](#setup)
    - [Step 1 - Follow steps 1-4 in the quickstart guide](#step-1---follow-steps-1-4-in-the-quickstart-guide)
      - [Recommendations](#recommendations)
    - [Step 2 - Clone & install repository](#step-2---clone--install-repository)
    - [Step 3 - Edit `.env`](#step-3---edit-env)
      - [WARNING](#warning)
    - [Step 4 - Create images for the minimap](#step-4---create-images-for-the-minimap)
    - [Step 5](#step-5)
      - [Android](#android)
      - [iOS](#ios)
    - [Step 6](#step-6)
      - [Register](#register)
    - [Setting POIs](#setting-pois)
  - [Build and installation](#build-and-installation)
    - [Android](#android-1)
    - [iOS](#ios-1)
  - [Attributions](#attributions)

## Known bugs
- White screen after first start of the app: Completely quit and restart the app on your phone without starting a new build
- Blue indicators don't lead you towards the direction of your target. See #11

## For adesso employees
Some of the following instructions will require you create certain files. These files can be found [here](https://confluence.adesso.de/pages/viewpage.action?pageId=88609425) but you will need to enter your adesso credentials.

## Setup

### Step 1 -  Follow steps 1-4 in the quickstart guide
- Install node and add to path
- Install react native cli: `npm install -g react-native-cli`
- Install viroreact cli `npm install -g react-viro-cli`
- Install and ruby
- [Mac / Linux only] Install watchman

#### Recommendations

**For Mac users**:

Use rbenv:
- Install using Homebrew: `$ brew install rbenv`
- Initiliaze rbenv: `$ rbenv init`
- Install Ruby (at least 2.2.0): `$ rbenv install 2.3.0`
- Set Global Ruby installation: `$ rbenv global 2.3.0`

Afterwards install CocoaPods: `$ gem install cocoapods`
 

### Step 2 - Clone & install repository
```bash
git clone https://github.com/adessoAG/adesso-indoor-navigator
npm install
```

### Step 3 - Edit `.env`
Now you need to configure your project to use your own Viro API key and your own firebase database. Please create a copy of `./sample.env` named `./.env` and replace the sample data with your information.

#### WARNING
The `.env` is included in the `.gitignore` and will **not** be commited into your git repository. You must keep track of it **on your own**.

### Step 4 - Create images for the minimap
For data privacy reasons, we removed an image of the adesso office in Dortmund from the repository. In order for the build to succeed, you will need to at least create a
`./js/res/dortmund_4.png`. For ideal results, it should have a width of 550px and a height of 387px.

(Can be found in Confluence as linked above)

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

### Step 6

#### Register

You can register your account [here](https://adesso-indoor-nav-setup.firebaseapp.com/auth/register). You will receive a confirmation E-Mail to your entered address.

### Setting POIs

To add or change positions you have to login first. Afterwards navigate to the Overview tab, select your site and click on edit.

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
