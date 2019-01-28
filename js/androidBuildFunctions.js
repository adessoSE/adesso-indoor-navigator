import util from 'util';
import child_process, { spawn } from 'child_process';
import Promise from 'core-js/es6/promise';
const exec = util.promisify(child_process.exec);

export const getDeviceId = async () => {
    console.log('Looking for devices...');
    const { stdout } = await exec('adb devices');
    const adbDevices = stdout.match(/^([0-9a-z]+)\s+device$/gim);

    let result = null;

    if(!Array.isArray(adbDevices)) {
        console.warn('No devices found! Please make sure at least one android device is plugged in and has USB ' +
        'debugging enabled.');
    } else if(adbDevices.length === 1) {
        result = adbDevices[0].split(/\s+/)[0];
        console.log('Found device with ID ' + result);
    } else {
        console.warn('Too many device IDs found! Please choose one of the following and then re-run this command with' +
        'the extra argument --deviceId [your chosen ID]\n');
        adbDevices.map(line => line.split(/\s+/)[0]).forEach((id, index) => console.log((index + 1) + '. ' + id));
    }

    return result;
};

export const verifyDeviceIsAvailable = async (deviceId) => {
    console.log('Running adb devices...');
    const { stdout } = await exec('adb devices');
    const deviceIsAvailable = stdout.indexOf(deviceId) > -1;

    if(deviceIsAvailable) {
        console.log('Found device with ID ' + deviceId);
    } else {
        console.warn('Could not find device with ID ' + deviceId + '! Please make sure it is ' +
        'connected to your computer via USB and has USB debugging enabled.');
    }

    return deviceIsAvailable;
};

export const startBundler = () => {
    console.log('Starting bundler');
    const bundlerProcess = spawn('node node_modules/react-native/local-cli/cli.js start');
    
    bundlerProcess.stdout.on('data', (data) => {
        console.log('bundler', data);
    });
    
    bundlerProcess.stderr.on('data', (data) => {
        console.error('bundler', data);
    });
    
    bundlerProcess.on('close', (code) => {
        console.log('Bundler process exited with code ' + code);
    });

    bundlerProcess.on('error', console.error);
};

export const buildApk = (deviceId) => new Promise((resolve, reject) => {
    console.log('Building APK...');
    const buildProcess = spawn('node node_modules/react-native/local-cli/cli.js run-android --deviceId ' + deviceId);
    
    buildProcess.stdout.on('data', (data) => {
        console.log(data);
    });
    
    buildProcess.stderr.on('data', (data) => {
        console.error(data);
    });
    
    buildProcess.on('close', (code) => {
        console.log('Build process exited with code ' + code);
        resolve();
    });

    buildProcess.on('error', console.error);
});

export const installApk = async (deviceId) => {
    console.log('Installing APK');
    const command = 'adb -s ' + deviceId +
    ' install android/app/build/outputs/apk/ar/debug/app-ar-debug.apk';
    
    try {
        const { stdout } = await exec(command);
    } catch(e) {
        if(e.stderr.indexOf('INSTALL_FAILED_ALREADY_EXISTS') > -1) {
            console.warn('Installation of the APK failed. Please uninstall the old APK and then run ' +
            '`npm build-android -- -n`');
        } else {
            throw e;
        }
    }
};

export const run = async (program) => {
    let deviceId = null;

    //Find or confirm device ID
    if(program.deviceId) {
        const deviceIsAvailable = await verifyDeviceIsAvailable(program.deviceId);
        if(deviceIsAvailable) {
            deviceId = program.deviceId;
        }
    } else {
        deviceId = await getDeviceId();
    }

    if(deviceId !== null) {
        // startBundler();

        if(!program.noBuild) {
            await buildApk(deviceId);
        } else {
            console.log('Skipping build');
        }

        await installApk(deviceId);
    }
};

export default run;