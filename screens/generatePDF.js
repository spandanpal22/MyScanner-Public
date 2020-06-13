import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StatusBar,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Button,
  Dimensions,
  Keyboard,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {StackActions} from '@react-navigation/native';

import RNImageToPdf from 'react-native-image-to-pdf';

const window = Dimensions.get('window');
const screen = Dimensions.get('screen');

var allPDFPaths = [];

export default class GeneratePDF extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uris: this.props.route.params.uris,
      //   allPDFPaths:[],
      isEditable: true,
      isGeneratePDFNotReady: true,
      pdfName: '',
      pdfPath: '',
      dimensions: {
        window,
        screen,
      },
    };
  }

  componentDidMount() {
    // this.askPermission();
    this.removeSubStrFromURI();
  }

  removeSubStrFromURI = () => {
    var arr = this.state.uris;
    var newURI = [];
    for (var i = 0; i < arr.length; i++) {
      newURI.push(arr[i].substr(8));
      // console.log(newURI[i]);
    }
    this.setState({uris: newURI});
  };

  generateMyPDF = async () => {
    this.setState({
      isGeneratePDFNotReady: true,
    });
    Keyboard.dismiss();

    var pdfName = this.state.pdfName;
    pdfName = pdfName.concat('.pdf');
    console.log(pdfName);
    console.log(this.state.uris);
    try {
      const options = {
        imagePaths: this.state.uris,
        name: pdfName,
        maxSize: {
          // optional maximum image dimension - larger images will be resized
          width: 900,
          height: Math.round(
            (this.state.dimensions.screen.height /
              this.state.dimensions.screen.width) *
              900,
          ),
        },
        // maxSize: {
        //   // optional maximum image dimension - larger images will be resized
        //   width: 4960,
        //   height: 7016,
        // },
        quality: 0.7, // optional compression paramter
      };
      const pdf = await RNImageToPdf.createPDFbyImages(options);

      this.setState({
        pdfLocation: pdf.filePath,
      });
      console.log(pdf.filePath);
      this.setState({
        pdfName: '',
        isGeneratePDFNotReady: true,
      });
      this.textInput.clear();

      Alert.alert(
        'PDF Successfully Generated',
        'Would you like to create a duplicate of the same or view the PDF?',
        [
          {
            text: 'View the PDF',
            onPress: async () => {
              console.log('View the PDF');
              allPDFPaths.push(pdf.filePath);
              var lastPDF;
              var keys = await AsyncStorage.getAllKeys();
              var ifLastPDFPathsExists = keys.includes("lastPDFPaths");
              if (ifLastPDFPathsExists) {
                try {
                  lastPDF = await AsyncStorage.getItem('lastPDFPaths');
                  lastPDF = JSON.parse(lastPDF);
                  lastPDF = lastPDF.concat(allPDFPaths);
                  await AsyncStorage.removeItem('lastPDFPaths');
                  await AsyncStorage.setItem(
                    'lastPDFPaths',
                    JSON.stringify(lastPDF),
                  );
                } catch (error) {
                  console.log('Remove and Set Error: ', error);
                }
              } else {
                try {
                  await AsyncStorage.setItem(
                    'lastPDFPaths',
                    JSON.stringify(allPDFPaths),
                  );
                } catch (error) {
                  console.log('Set Error: ', error);
                }
              }
              console.log(ifLastPDFPathsExists);
              console.log('Keys : ', keys);
              //navigate to showPDFS
              //   this.props.navigation.navigate('Your Last PDFs');
              this.props.navigation.dispatch(
                StackActions.replace('Your Last PDFs'),
              );
            },
            style: 'cancel',
          },
          {
            text: 'Create Duplicate',
            onPress: () => {
              console.log('Create duplicate');
              allPDFPaths.push(pdf.filePath);
            },
          },
        ],
        {cancelable: false},
      );
    } catch (e) {
      console.log(e);
      alert('Some error occured while generating your PDF. ');
    }
  };

  render() {
    return (
      <SafeAreaView>
        <View style={{marginTop: '50%', marginBottom: 10}}>
          <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 15}}>
            {' '}
            Enter your PDF name
          </Text>
        </View>
        <View>
          <TextInput
            ref={input => {
              this.textInput = input;
            }}
            style={styles.nameInput}
            placeholder="Enter PDF name"
            onChangeText={pdfName => {
              this.setState({pdfName});
              if (pdfName.length != 0) {
                this.setState({isGeneratePDFNotReady: false});
              } else if (pdfName.length == 0) {
                this.setState({isGeneratePDFNotReady: true});
              }
            }}
            maxLength={50}
            textContentType={'name'}
            autoCompleteType={'name'}
            // editable={this.state.editable}
          />
          <TouchableOpacity
            style={{marginTop: 20}}
            disabled={this.state.isGeneratePDFNotReady}>
            <Button
              title="Generate PDF"
              buttonStyle={styles.submitButton}
              onPress={this.generateMyPDF.bind(this)}
              disabled={this.state.isGeneratePDFNotReady}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  nameInput: {
    backgroundColor: 'white',
    padding: 10,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  submitButton: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
  },
});
