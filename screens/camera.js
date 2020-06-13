import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

import {RNCamera} from 'react-native-camera';
import {StackActions} from '@react-navigation/native';

export default class Camera extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFlashOn: false,
      flashMode: RNCamera.Constants.FlashMode.off,
      uris: [],
      isDoneDisabled: true,
    };
  }

  takePicture = async () => {
    if (this.camera) {
      const options = {quality: 1, base64: true};
      const data = await this.camera.takePictureAsync(options);
      this.state.uris.push(data.uri);
      if (this.state.isDoneDisabled) {
        this.setState({
          isDoneDisabled: false,
        });
      }
      console.log(data.uri);
    }
  };

  doneScanning = () => {
    // this.props.navigation.navigate('ShowImage');
    console.log(this.state.uris);
    this.props.navigation.dispatch(
      StackActions.replace('Captured Images', {
        uris: this.state.uris,
      }),
    );
  };

  toggleFlash = () => {
    if (this.state.isFlashOn) {
      this.setState({
        isFlashOn: false,
        flashMode: RNCamera.Constants.FlashMode.off,
      });
    } else {
      this.setState({
        isFlashOn: true,
        flashMode: RNCamera.Constants.FlashMode.on,
      });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={this.state.flashMode}
          autoFocus={RNCamera.Constants.AutoFocus.on}
          useNativeZoom={true}
          autoFocusPointOfInterest={{x: 0.5, y: 0.5}}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          captureAudio={false}
        />
        <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
          <TouchableOpacity
            onPress={this.toggleFlash.bind(this)}
            style={[
              styles.flash,
              {backgroundColor: this.state.isFlashOn ? '#fcec03' : '#fff'},
            ]}>
            <Text style={{fontSize: 14}}> FLASH </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.takePicture.bind(this)}
            style={styles.capture}>
            <Text style={{fontSize: 14}}> SNAP </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.doneScanning.bind(this)}
            style={[
              styles.capture,
              {opacity: this.state.isDoneDisabled ? 0.5 : 1},
            ]}
            disabled={this.state.isDoneDisabled}>
            <Text style={{fontSize: 14}}> DONE </Text>
          </TouchableOpacity>
        </View>
      </View>
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
  flash: {
    flex: 0,
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});
