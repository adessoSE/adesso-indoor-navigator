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

## Build and installation
### Android
1. Connect your phone to your computer via a USB cable
2. Run `npm run build-android`. Once you see a box that sais "Running Metro Bundler..." you can open the app on your phone!
To just install the latest development APK, just run `npm run build-android -- -n` (or `... -- --no-build`).

### iOS
Coming soon...

## Attributions
["Green Arrow Icon"](https://poly.google.com/view/7eaXP_9tC-e) by [Thomas Balouet](https://poly.google.com/user/3hZPO-XRoBS) is licensed under [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/)
