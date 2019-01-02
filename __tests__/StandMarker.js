import 'react-native';
import React from 'react';
import StandMarker from '../js/StandMarker';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock('react-native');

describe('<StandMarker>', () => {
    it('renders correctly', () => {
        const tree = renderer.create(
          <StandMarker name={'Test'} />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('Should have a fontSize of 8 if none is set', () => {
        const tree = renderer.create(
            <StandMarker name={'Test'} />
        );
    });
});