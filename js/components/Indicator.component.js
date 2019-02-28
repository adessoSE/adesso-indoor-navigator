import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

let getStyleFromDirection = direction => {
    let style = {
        viewStyle: {
            position: 'absolute',
            alignItems: 'flex-start'
        },
        imageStyle: {
            width: 73,
            height: 147
        }
    };

    switch(direction) {
        case 'top':
            style.viewStyle.left = '45%';
            // style.viewStyle.right = 0;
            style.viewStyle.top = -15;
            style.imageStyle.transform = [{ rotate: "90deg" }];
            break;
        case 'bottom':
            style.viewStyle.left = '45%';
            // style.viewStyle.right = 0;
            style.viewStyle.bottom = 80;
            style.imageStyle.transform = [{ rotate: "-90deg" }];
            break;
        case 'left':
            style.viewStyle.left = 15;
            style.viewStyle.top = '35%';
            // right: 0,
            break;
        case 'right':
            style.viewStyle.right = 15;
            style.viewStyle.top = '35%';
            style.imageStyle.transform = [{ rotate: "180deg" }];
            break;
        default:
            break;
    }

    return StyleSheet.create(style);
};

const Indicator = ({ directions }) => {
    if (Array.isArray(directions)) {
        return directions.map((direction, index) => {
            if (direction === 'top' || direction === 'bottom' || direction === 'left' || direction === 'right') {
                let style = getStyleFromDirection(direction);
                return (
                <View style={style.viewStyle} key={index}>
                    <Image
                    style={style.imageStyle}
                    source={require('../res/left.png')}
                    />
                </View>
                );
            } else {
                return null;
            }
        });
    } else {
        return null;
    }
};

Indicator.propTypes = {
  directions: PropTypes.array,
};

export default Indicator;