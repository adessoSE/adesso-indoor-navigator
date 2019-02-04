import program from 'commander';
import {run} from './js/androidBuildFunctions';

program
    .option('-d, --deviceId <deviceId>', 'Device to run build process for')
    .option('-n, --noBuild', 'Skip the build and just install the APK')
    .parse(process.argv);

run(program);