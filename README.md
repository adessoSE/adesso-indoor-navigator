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

### Step 3 - Edit and link ReactNativeHeading
ReactNativeHeading figures out, what direction your device is heading and gives you that information, by default. This project also requires information about the accuracy of said information, so some files of the module need to be changed.

Navigate to `./node_modules/@zsajjad/react-native-heading/Reactnativeheading.m` and perform the following change:

```diff
--- a/node_modules/@zsajjad/react-native-heading/Reactnativeheading.m
+++ b/node_modules/@zsajjad/react-native-heading/Reactnativeheading.m
@@ -61,72 +61,73@@
 - (void)locationManager:(CLLocationManager *)manager didUpdateHeading:(CLHeading *)newHeading {
    if (newHeading.headingAccuracy < 0)
        return;
    
-   // Use the true heading if it is valid.
-   CLLocationDirection heading = ((newHeading.trueHeading > 0) ?
-                                  newHeading.trueHeading : newHeading.magneticHeading);
-   
-   [self sendEventWithName:@"headingUpdated" body:@(heading)];
+  _heading = @{
+   @"trueHeading": @(newHeading.trueHeading),
+   @"headingAccuracy": @(newHeading.headingAccuracy)
+   };
+
+   [self sendEventWithName:@"headingUpdated" body:(_heading)];
}

@end
```

After modifying ReactNativeHeading, you need to follow [these instructions](https://github.com/zsajjad/react-native-heading/blob/master/README.md#setup) in order to link it to the rest of the project.

## Attributions
["Green Arrow Icon"](https://poly.google.com/view/7eaXP_9tC-e) by [Thomas Balouet](https://poly.google.com/user/3hZPO-XRoBS) is licensed under [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/)