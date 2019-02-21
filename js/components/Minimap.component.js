import React from 'react';
import {
    Image,
    StyleSheet
} from 'react-native';

export const Minimap = () => {
    let style = StyleSheet.create({
        minimap: {
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'flex-end',
            position: 'absolute',
            backgroundColor: 'transparent',
            width: 1160 / 4.5,
            height: 640 / 4.5 
        }
    });

    // TODO remove file from gitignore when image is fetched from database
    const image = require('../res/dortmund_4.png');

    return (
        <Image
            source={image}
            style={style.minimap}
        />
    );
};

export default Minimap;