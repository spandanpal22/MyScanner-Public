import React, {Component, useContext} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  // Button,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Avatar, Button} from 'react-native-elements';

import {StackActions} from '@react-navigation/native';

import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-community/google-signin';
GoogleSignin.configure({
  webClientId:
    '507096145651-1o1b4ji0isplbrvr66aa00vdodlstdj0.apps.googleusercontent.com',
});

const popAction = StackActions.pop(1);

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idToken: null,
      userName: null,
      userPhoto: null,
    };
  }

  async componentDidMount() {
    // this.requestUserPermission();
    this.isSignedIn();
    var token = await AsyncStorage.getItem('userToken');
    token = JSON.parse(token);
    console.log(token.user.photo);
    this.setState({
      userName: token.user.name,
      userPhoto: token.user.photo,
    });
    this.state.idToken;
  }

  isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    console.log(isSignedIn);
    this.setState({isLoggedIn: isSignedIn});
  };

  _signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      await auth()
        .signOut()
        .then(() => console.log('User signed out!'));
      this.setState({idToken: null}); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
    this.setState({
      userName: null,
      userPhoto: null,
    });
    await AsyncStorage.setItem('isLoggedIn', 'false');
    await AsyncStorage.setItem('userToken', 'null');
  };

  render() {
    const {navigate} = this.props.navigation;

    return (
      <>
        <SafeAreaView>
          <View style={{marginTop: "45%"}}>
            <Avatar
              size="large"
              rounded
              source={{
                uri: this.state.userPhoto,
              }}
              containerStyle={{alignSelf: 'center'}}
            />
          </View>
          <View style={{marginTop: 20}}>
            <Text style={{textAlign: 'center', fontSize: 25}}>Welcome</Text>
          </View>
          <View style={{marginTop: 5}}>
            <Text style={{textAlign: 'center', fontSize: 15}}>
              {this.state.userName}
            </Text>
          </View>
          <View style={{marginTop: 20}}>
            <Button
              title="Start Scanning"
              onPress={() => {
                console.log('Scanning Started');
                navigate('Camera');
              }}
              buttonStyle={{
                backgroundColor :'#32cf80',
              }}
            />
          </View>
          <View style={{marginTop: 20}}>
            <Button
              title="Show All Generated PDFs"
              onPress={() => {
                console.log('last PDFs');
                navigate('Your Last PDFs');
              }}
              buttonStyle={{
                backgroundColor :'#a16ceb',
              }}
            />
          </View>
          <View style={{marginTop: 50}}>
            <Button
              title="Log Out"
              onPress={() =>
                this._signOut()
                  .then(() => console.log('Logged out from Google!'))
                  .then(() => {
                    // this.props.navigation.dispatch(popAction);
                    this.props.navigation.dispatch(
                      StackActions.replace('Login'),
                    );
                  })
              }
              buttonStyle={{
                backgroundColor :'#eb4034',
                marginLeft:30,
                marginRight:30,
                borderRadius: 10,
              }}
            />
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});
