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
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {StackActions} from '@react-navigation/native';

import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-community/google-signin';
GoogleSignin.configure({
  webClientId:
    '507096145651-1o1b4ji0isplbrvr66aa00vdodlstdj0.apps.googleusercontent.com',
});

const popAction = StackActions.pop(1);

// import { AuthContext } from '../navigator/navigator';

// const { signIn } = useContext(AuthContext);

export default class Login extends Component {
  constructor(props) {
    super(props);
    // const { signIn } = React.useContext(AuthContext);
    this.state = {
      idToken: null,
      isLoggedIn: false,
    };
  }

  componentDidMount() {
    // this.requestUserPermission();
    // const { signIn } = React.useContext(AuthContext);
    this.isSignedIn();
  }

  // async requestUserPermission() {
  //   const authStatus = await messaging().requestPermission();
  //   console.log('status msg', authStatus);
  //   const enabled =
  //     authStatus === AuthorizationStatus.AUTHORIZED ||
  //     authStatus === AuthorizationStatus.PROVISIONAL;

  //   if (enabled) {
  //     console.log('Authorization status:', authStatus);
  //   }
  // }

  isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    console.log(isSignedIn);
    this.setState({isLoggedIn: isSignedIn});
  };

  async onGoogleButtonPress() {
    // Get the users ID token
    await GoogleSignin.hasPlayServices();
    const idToken = await GoogleSignin.signIn().catch(error => {
      console.log('*******************error' + error);
    });
    this.setState({idToken: idToken});

    console.log('************************');
    console.log(idToken);

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(
      idToken.idToken,
    );

    console.log('#########################');
    console.log(googleCredential);

    // Sign-in the user with the credential
    auth().signInWithCredential(googleCredential);
    console.log(JSON.stringify(this.state.idToken));
    await AsyncStorage.setItem('isLoggedIn', toString(this.state.isLoggedIn));
    await AsyncStorage.setItem('userToken', JSON.stringify(this.state.idToken));
  }

  _signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      await auth()
        .signOut()
        .then(() => console.log('User signed out!'));
      this.setState({idToken: null, isLoggedIn: false}); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
    await AsyncStorage.setItem('isLoggedIn', 'false');
    await AsyncStorage.setItem('userToken', 'null');
  };

  render() {
    // const signIn = useContext(AuthContext);
    // let value = this.context;
    const {navigate} = this.props.navigation;

    if (!this.state.isLoggedIn) {
      return (
        <>
          <SafeAreaView style={{top:"20%"}}>
            <View>
              <Image source={require('../static/images/logo.png')} style={{height:100, width:100, alignSelf:'center'}} />
              <Text style={{fontSize:25,textAlign:'center'}}>My Scanner</Text>
            </View>
            <View style={{marginTop: 80}}>
              <Text style={{textAlign: 'center',fontSize:17}}>Sign In</Text>
            </View>
            <View style={{marginTop: 10, alignItems: 'center'}}>
              <GoogleSigninButton
                // title="Google Sign-In"
                style={{width: 192, height: 48}}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={() => {
                  // this.onGoogleButtonPress()
                  // <AuthContext.Consumer>
                  //   {this.context => (signIn)}
                  //   {/* signIn() */}
                  //   {/* console.log('thi') */}
                  // </AuthContext.Consumer>
                  // signIn()
                  this.onGoogleButtonPress()
                    .then(() => console.log('Signed in with Google!'))
                    .then(() => {
                      // this.props.navigation.dispatch(popAction);
                      this.props.navigation.dispatch(
                        StackActions.replace('Home'),
                      );
                    });
                }}
              />
            </View>
          </SafeAreaView>
        </>
      );
    } else {
      return (
        <View>
          <Text>Log out</Text>
          <Button
            title="Google Log Out"
            onPress={() =>
              this._signOut()
                .then(() => console.log('Logged out from Google!'))
                .then(() => navigate('Login'))
            }
          />
        </View>
      );
    }
  }
}
