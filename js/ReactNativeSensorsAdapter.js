import ReactNativeSensors, {
    orientation,
    SensorTypes,
    setUpdateIntervalForType
} from 'react-native-sensors';

setUpdateIntervalForType(SensorTypes.orientation, 1000);

let sub, callbacks = [];

export default {
    start: async (threshold) => {
        sub = orientation.subscribe((...args) => {
            callbacks.forEach(cb => cb(...args));
        }, error => {
            console.error(error);
        });
    },
    stop: () => {
        sub.unsubscribe();
    },
    onUpdate: callback => {
        callbacks.push(callback);
    }
};