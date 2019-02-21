import React from 'react';
import { Button, View } from 'react-native';
import t from 'tcomb-form-native';
import PropTypes from 'prop-types';

import strings from '../../i18n/strings';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignedIn: false,
      userData: {
        email: '',
        password: ''
      },
    };
  }
  
  Form = t.form.Form;

  User = t.struct({
    email: t.String,
    password: t.String
  });

  formStyles = {
    ...this.Form.stylesheet,
    formGroup: {
      normal: {
        marginBottom: 10
      }
    },
    controlLabel: {
      normal: {
        color: 'blue',
        fontSize: 18,
        marginBottom: 7,
        fontWeight: '600'
      },
      // the style applied when a validation error occours
      error: {
        color: 'red',
        fontSize: 18,
        marginBottom: 7,
        fontWeight: '600'
      }
    }
  };

  options = {
    fields: {
      email: {
        error: strings.firebase.emailInputErrorMessage,
        autoCorrect: false,
        autoCapitalize: 'none',
        autoFocus: true,
        textContentType: 'username'
      },
      password: {
        error: strings.firebase.passwordErrorMessage,
        password: true,
        secureTextEntry: true,
        textContentType: 'password'
      }
    },
    stylesheet: this.formStyles
  };

  handleSubmit = () => {
    const value = this._form.getValue();
    /* Set email and password */
    if (value) {
      this.setState(
        {userData: value},
        () => this.login()
      );
    }
  };

  login = () => {
    /* Firebase Authentication */
    this.props.firebaseApp
      .auth()
      .signInWithEmailAndPassword(
        this.state.userData.email,
        this.state.userData.password
      )
      .then(credential => {
        // If login is successful, firebase will trigger an event which is caught in App.js:150
        if (credential) {
          console.log('Signed In');
        }
      })
      /* Catch if login was invalid */
      .catch(error => {
        console.log(`Error while authenticating: ${error}`);
        /* this.setState({
          isSignedIn: false
        }) */
      });
  }
  
  render() {
    return (
      <View>
        <this.Form
          ref={c => (this._form = c)} // assign a ref
          type={this.User}
          options={this.options}
        />
        <Button title='Sign in' onPress={this.handleSubmit} />
      </View>
    );
  }
}

LoginForm.propTypes = {
  firebaseApp: PropTypes.object
};

export default LoginForm;
