import React, {Component} from 'react';
// import * as React from 'react';
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

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-community/google-signin';
GoogleSignin.configure({
  webClientId:
    '507096145651-1o1b4ji0isplbrvr66aa00vdodlstdj0.apps.googleusercontent.com',
});

import Camera from '../screens/camera';
import ShowImage from '../screens/showImage';
import Login from '../screens/login';
import SplashScreen from '../screens/splashScreen';
import Home from '../screens/home';
import GeneratePDF from '../screens/generatePDF';
import ShowLastPDFS from '../screens/showPDFS';

// const AuthContext = React.createContext();

const Stack = createStackNavigator();

class Navigator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isLoggedIn: false,
    };
  }

  componentDidMount() {
    this.isSignedIn();
    // var isLoggedIn = AsyncStorage.getItem('isLoggedIn');
    // console.log('IsLoggedIn ',isLoggedIn)
    setTimeout(() => {
      this.setState({
        isLoading: false,
      });
    }, 1000);
    // this.setState({
    //   isLoading: false,
    // });
  }

  isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    console.log(isSignedIn);
    this.setState({isLoggedIn: isSignedIn});
  };

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          {this.state.isLoading ? (
            // We haven't finished checking for the token yet
            <Stack.Screen
              name="Splash"
              component={SplashScreen}
              options={{
                headerShown: false,
                cardStyle: {backgroundColor: '#f2dada'},
              }}
            />
          ) : this.state.isLoggedIn ? (
            // User is signed in
            <>
              <Stack.Screen
                name="Home"
                component={Home}
                options={{
                  headerShown: false,
                  cardStyle: {backgroundColor: '#daf2e0'},
                }}
              />
              <Stack.Screen
                name="Camera"
                component={Camera}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen name="Captured Images" component={ShowImage} />
              <Stack.Screen
                name="Generate PDF"
                component={GeneratePDF}
                options={{
                  cardStyle: {backgroundColor: '#daf2e0'},
                }}
              />
              <Stack.Screen
                name="Your Last PDFs"
                component={ShowLastPDFS}
                options={{
                  cardStyle: {backgroundColor: '#daf2e0'},
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Login"
                component={Login}
                options={{
                  title: 'Sign in',
                  // When logging out, a pop animation feels intuitive
                  animationTypeForReplace: this.state.isSignout
                    ? 'pop'
                    : 'push',
                  cardStyle: {backgroundColor: '#e3daf2'},
                  headerTitleAlign: 'center',
                }}
              />
            </>
          ) : (
            // User is signed in
            <>
              <Stack.Screen
                name="Login"
                component={Login}
                options={{
                  title: 'Sign in',
                  // When logging out, a pop animation feels intuitive
                  animationTypeForReplace: this.state.isSignout
                    ? 'pop'
                    : 'push',
                  cardStyle: {backgroundColor: '#e3daf2'},
                  headerTitleAlign: 'center',
                }}
              />
              <Stack.Screen
                name="Home"
                component={Home}
                options={{
                  headerShown: false,
                  cardStyle: {backgroundColor: '#daf2e0'},
                }}
              />
              <Stack.Screen
                name="Camera"
                component={Camera}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen name="Captured Images" component={ShowImage} />
              <Stack.Screen
                name="Generate PDF"
                component={GeneratePDF}
                options={{
                  cardStyle: {backgroundColor: '#daf2e0'},
                }}
              />
              <Stack.Screen
                name="Your Last PDFs"
                component={ShowLastPDFS}
                options={{
                  cardStyle: {backgroundColor: '#daf2e0'},
                  headerShown: false,
                }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default Navigator;

// const isSignedIn = async () => {
//   const isSignedIn = await GoogleSignin.isSignedIn();
//   this.setState({ isLoginScreenPresented: !isSignedIn });
// };

// export default function Navigator({ navigation }) {
//   const [state, dispatch] = React.useReducer(
//     (prevState, action) => {
//       switch (action.type) {
//         case 'RESTORE_TOKEN':
//           return {
//             ...prevState,
//             userToken: action.token,
//             isLoading: false,
//           };
//         case 'SIGN_IN':
//           return {
//             ...prevState,
//             isSignout: false,
//             userToken: action.token,
//           };
//         case 'SIGN_OUT':
//           return {
//             ...prevState,
//             isSignout: true,
//             userToken: null,
//           };
//       }
//     },
//     {
//       isLoading: true,
//       isSignout: false,
//       userToken: null,
//     },
//   );

//   React.useEffect(() => {
//     // Fetch the token from storage then navigate to our appropriate place
//     const bootstrapAsync = async () => {
//       let userToken;

//       try {
//         userToken = await AsyncStorage.getItem('userToken');
//       } catch (e) {
//         // Restoring token failed
//         console.log('Restoring token failed ', e);
//       }

//       // After restoring token, we may need to validate it in production apps

//       // This will switch to the App screen or Auth screen and this loading
//       // screen will be unmounted and thrown away.
//       dispatch({ type: 'RESTORE_TOKEN', token: userToken });
//     };

//     bootstrapAsync();
//   }, []);

//   const authContext = React.useMemo(
//     () => ({
//       signIn: async data => {
//         // In a production app, we need to send some data (usually username, password) to server and get a token
//         // We will also need to handle errors if sign in failed
//         // After getting token, we need to persist the token using `AsyncStorage`
//         // In the example, we'll use a dummy token
//         // Get the users ID token
//         await GoogleSignin.hasPlayServices();
//         const idToken = await GoogleSignin.signIn().catch(error => {
//           console.log('*******************error' + error);
//         });
//         this.setState({ idToken: idToken });

//         console.log('************************');
//         console.log(idToken);

//         // Create a Google credential with the token
//         const googleCredential = auth.GoogleAuthProvider.credential(
//           idToken.idToken,
//         );

//         console.log('#########################In Navigator');
//         console.log(googleCredential);

//         // Sign-in the user with the credential
//         auth().signInWithCredential(googleCredential);

//         dispatch({ type: 'SIGN_IN', token: idToken });
//       },
//       signOut: async () => {
//         try {
//           await GoogleSignin.revokeAccess();
//           await GoogleSignin.signOut();
//           await auth()
//             .signOut()
//             .then(() => console.log('User signed out!'));
//           this.setState({ idToken: null, isLoggedIn: false }); // Remember to remove the user from your app's state as well
//         } catch (error) {
//           console.error(error);
//         }
//         dispatch({ type: 'SIGN_OUT' })
//       },
//       signUp: async data => {
//         // In a production app, we need to send user data to server and get a token
//         // We will also need to handle errors if sign up failed
//         // After getting token, we need to persist the token using `AsyncStorage`
//         // In the example, we'll use a dummy token

//         dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
//       },
//     }),
//     [],
//   );

//   return (
//     <AuthContext.Provider value={authContext}>
//       <NavigationContainer>
//         <Stack.Navigator>
//           {state.isLoading ? (
//             // We haven't finished checking for the token yet
//             <Stack.Screen name="Splash" component={SplashScreen} />
//           ) : state.userToken == null ? (
//             // No token found, user isn't signed in
//             <Stack.Screen
//               name="SignIn"
//               component={Login}
//               options={{
//                 title: 'Sign in',
//                 // When logging out, a pop animation feels intuitive
//                 animationTypeForReplace: state.isSignout ? 'pop' : 'push',
//               }}
//             />
//           ) : (
//                 // User is signed in
//                 <Stack.Screen name="Home" component={Home} />
//               )}
//         </Stack.Navigator>
//       </NavigationContainer>
//     </AuthContext.Provider>
//   );
// }

// export {AuthContext};
