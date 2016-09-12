import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  Switch,
  Slider,
  Picker,
  PickerIOS,
  AsyncStorage,
  Dimensions
} from 'react-native';

import Form from 'react-native-form'
import Button from 'react-native-button';

var inputStyle = {
  height: 20, borderColor: 'gray', borderWidth: .5
};

export default class LoginTab extends Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      username: '',
      fullname: '',
      password: ''
    };
  }

  submitUser() {
    var newUser = JSON.stringify({
      username: this.state.username,
      password: this.state.password
    });

    fetch('http://localhost:3000/api/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: newUser
    })
    .then( resp => { resp.json()
      .then( json => {
        try {
          AsyncStorage.multiSet([['@MySuperStore:token', json.token], ['@MySuperStore:username', this.state.username]], (err) => {
            if ( err ){ console.warn(err); }
            this.props.updateStatus(true);
          });
        } catch (error) {
          console.log('AsyncStorage error: ' + error.message);
        }
      });
    });

  }

  updateUsername(val) {
    var newProp = {'username': val.text};
    this.setState(newProp);
  }

  updatePassword(val) {
    var newProp = {'password': val.text};
    this.setState(newProp);
  }

  getState(){
    return this.state;
  }

  render() {

    return (
      <View style={styles.viewContainer}>
        <Form style={styles.formContainer}>

          <View style={styles.fieldContainer}>
            <Text style={styles.subHeader} > Email </Text>
            <TextInput
              onChangeText= { (text) => this.updateUsername( {text} ) }
              style= { styles.container }
              name="username"
              type="TextInput"/>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.subHeader} > Password </Text>
            <TextInput
              secureTextEntry={ true }
              onChangeText= { (text) => this.updatePassword( {text} ) }
              style= { styles.container }
              name="password"
              type="TextInput"/>
          </View>

        </Form>

        <Button
          style={styles.button}
          styleDisabled={{color: 'red'}}
          onPress={ () => this.submitUser() }>
          Log In
        </Button>

      </View>
    );

  }
}


const styles = StyleSheet.create({
  viewContainer: {
    width: Dimensions.get('window').width*.7,
    paddingTop: 6,
    paddingBottom:6,
    marginTop:52,
    marginBottom: 52,
    flex: 1,
    flexDirection:'column',
    justifyContent:'flex-start'
  },
  fieldContainer:{
    marginBottom:16
  },
  subHeader: {
    fontSize: 12,
    fontWeight: '700',
    color:"#424242",
    marginLeft:12,
    marginBottom:4.5
  },
  container: {
    backgroundColor: '#fafafa',
    flex: 1,
    flexDirection: 'column',
    paddingLeft:6,
    marginLeft:12,
    marginRight:12,
    borderWidth:1,
    height:32,
    borderColor: '#cccccc',
    justifyContent:'space-between',
    fontSize: 14,
    fontWeight: '400',
    borderRadius:3
  },
  button:{
    height:40,
    backgroundColor:"#424242",
    marginLeft:12,
    marginRight:12,
    marginTop:12,
    paddingTop:8.5,
    color:'white',
    fontSize: 16,
    fontWeight: '400',
    borderRadius:3
  }
});

