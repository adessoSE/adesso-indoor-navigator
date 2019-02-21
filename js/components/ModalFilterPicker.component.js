import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal-filter-picker';

class ModalFilterPicker extends React.Component { 
  constructor(props) {
    super(props);
  }
  
  onSelect = pickedTitle => {
    /* Filter the current picked entry  */
    // TODO: options and locations.poi should come from the same source
    // TODO: handle case that destinationLocation is not found. Maybe use Array.prototype.indexOf
    let destinationLocation = this.props.locations.pois.filter(
      poi => poi.title === pickedTitle
    )[0];

    this.props.onDestinationUpdate(pickedTitle, destinationLocation);
  }
  
  render() {
    return (
      this.props.options !== null ? (
        <Modal
          title={'Select Destination'}
          onSelect={this.onSelect}
          onCancel={this.props.onCancel}
          options={this.props.options}
          placeholderText={'Büro, Vorname, Nachname'}
        />
      ) : null
    );
  }
}

ModalFilterPicker.propTypes = {
  onCancel: PropTypes.func,
  onDestinationUpdate: PropTypes.func,
  locations: PropTypes.object,
  options: PropTypes.any // TODO: Set correct PropType
};

export default ModalFilterPicker;
