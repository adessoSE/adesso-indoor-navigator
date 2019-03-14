import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';

const style = StyleSheet.create({
  logo: {
    width: '100%',
    height: 90,
    resizeMode: 'contain'
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderColor: 'rgb(204, 204, 204)'
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#0275d8',
    marginTop: 10,
    color: 'white',
    padding: 10
  }
});

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignedIn: false,
      userData: {
        email: '',
        password: '',
        submitted: false
      },
      email: '',
      password: ''
    };
  }

  handleSubmit = () => {
    const { email, password } = this.state;

    if (email && password) {
      this.login();
    }
  };

  login = () => {
    /* Firebase Authentication */
    this.props.firebaseApp
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
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
  };

  render() {
    return (
      <View>
        <Image
          style={style.logo}
          source={require('../res/Adesso_AG_logo.png')}
        />
        <TextInput
          placeholder='E-Mail'
          onChangeText={email => this.setState({ email })}
          style={style.input}
          autoFocus={true}
          textContentType='emailAddress'
        />
        <TextInput
          name='password'
          placeholder='Password'
          onChangeText={password => this.setState({ password })}
          style={style.input}
          textContentType='password'
          secureTextEntry={true}
        />
        <TouchableOpacity onPress={this.handleSubmit} style={style.button}>
          <Text style={{ color: 'white' }}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

LoginForm.propTypes = {
  firebaseApp: PropTypes.object
};

export default LoginForm;
