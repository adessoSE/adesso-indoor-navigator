import util from 'util';
import child_process, { spawn } from 'child_process';
import Promise from 'core-js/es6/promise';
import chalk from 'chalk';
const exec = util.promisify(child_process.exec);

export const getDeviceId = async () => {
    console.log('Looking for devices...');
    const { stdout } = await exec('adb devices');
    const adbDevices = stdout.match(/^([0-9a-z]+)\s+device$/gim);

    let result = null;

    if(!Array.isArray(adbDevices)) {
        console.warn(chalk.red('No devices found! Please make sure at least one android device is plugged in and ' +
        'has USB debugging enabled.'));
    } else if(adbDevices.length === 1) {
        result = adbDevices[0].split(/\s+/)[0];
        console.log('Found device with ID ' + result);
    } else {
        console.warn(chalk.red('Too many device IDs found! Please choose one of the following and then re-run ' +
        'this command with the extra argument --deviceId [your chosen ID]\n'));
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
        console.warn(chalk.red('Could not find device with ID ' + deviceId + '! Please make sure it is ' +
        'connected to your computer via USB and has USB debugging enabled.'));
    }

    return deviceIsAvailable;
};

export const runAdbReverse = async () => {
    const command = 'adb reverse tcp:8081 tcp:8081';
    console.log('Running `' + command + '`');
    await exec(command);
    console.log('Finished `' + command + '`');
};

export const startBundler = () => {
    console.log('Starting bundler');
    const bundlerProcess = spawn('node', [
        'node_modules/react-native/local-cli/cli.js',
        'start'
    ]);

    bundlerProcess.stdout.setEncoding('utf8');
    bundlerProcess.stderr.setEncoding('utf8');
    
    bundlerProcess.stdout.on('data', (data) => {
        console.log(data);
    });
    
    bundlerProcess.stderr.on('data', (data) => {
        console.error(chalk.red(data));
    });
    
    bundlerProcess.on('close', (code) => {
        let message = 'Bundler process exited with code ' + code;

        if(code !== 0) {
            message = chalk.red(message);
        }

        console.log(message);
    });

    bundlerProcess.on('error', error => console.error(chalk.red(error)));
};

export const buildApk = (deviceId) => new Promise((resolve, reject) => {
    console.log('Building APK...');
    const buildProcess = spawn('node', [
        'node_modules/react-native/local-cli/cli.js',
        'run-android',
        '--deviceId',
        deviceId,
        '--no-packager'
    ]);

    let buildWasSuccessful = true;

    buildProcess.stdout.setEncoding('utf8');
    buildProcess.stderr.setEncoding('utf8');
    
    const dataBelongsToKnownInstallationErrors = data =>
        data.indexOf('app/build/outputs/apk/app-debug.apk') > -1 ||
        data.indexOf('Activity class {com.virosample/com.virosample.MainActivity} does not exist') > -1;

    let warningHasBeenPrinted = false;
    const handleData = (data, loggingFunction) => {
        if(dataBelongsToKnownInstallationErrors(data)) {
            if(!warningHasBeenPrinted) {
                console.warn(chalk.yellow('WARNING: There will be some error messages regarding the installation of ' +
                'the APK. This Error is expected! If it is the only error, there is no need wo worry.'));
                warningHasBeenPrinted = true;
            }

            data = chalk.yellow(data);
        }
        
        loggingFunction(data);
    };
    
    buildProcess.stdout.on('data', (data) => {
        handleData(data, console.log);
    });
    
    buildProcess.stderr.on('data', (data) => {
        handleData(chalk.red(data), console.error);

        if(!dataBelongsToKnownInstallationErrors(data)) {
            buildWasSuccessful = false;
        }
    });
    
    buildProcess.on('close', (code) => {
        //TODO add other expected errors
        if(code === 0 && buildWasSuccessful) {
            console.log('Build process exited with code ' + code);
            resolve();
        } else {
            console.log(chalk.red('Build process exited with code ' + code));
            reject(new Error('Something went wrong during the build process. For further information, please ' +
            'check previous log statements.'));
        }
    });

    buildProcess.on('error', error => {
        console.error(chalk.red(error));
    });
});

/**
 * Installs APK on device and returns wether installation was successful or not
 * @param {number} deviceId 
 * @returns {boolean} True if installation was susccessful
 */
export const installApk = async (deviceId) => {
    console.log('Installing APK');
    const command = 'adb -s ' + deviceId +
    ' install android/app/build/outputs/apk/ar/debug/app-ar-debug.apk';
    
    try {
        await exec(command);
        console.log('Installation successful');
        return true;
    } catch(e) {
        if(e.stderr.indexOf('INSTALL_FAILED_ALREADY_EXISTS') > -1) {
            console.warn(chalk.red('Installation of the APK failed. Please uninstall the old APK and then run ' +
            '`npm build-android -- -n`'));
            return false;
        } else {
            //Unknown error, which should be passed along to caller
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
        try {
            if(!program.noBuild) {
                await buildApk(deviceId);
            } else {
                console.log(chalk.yellow('Skipping build but running one task that is usually ' +
                'taken over by the build'));
                await runAdbReverse();
            }
            
            const installationWasSuccessful = await installApk(deviceId);
            if(installationWasSuccessful) {
                startBundler();
            }
        } catch(e) {
            console.error(chalk.red(e));
        }
    }
};

export default run;