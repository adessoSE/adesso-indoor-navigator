package com.virosample;

import com.facebook.react.ReactActivity;
import com.joshblour.reactnativeheading.ReactNativeHeadingPackage;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "ViroSample";
    }

    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new ReactNativeHeadingPackage() // <------ add the package
        );
    }
}
