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
  ScrollView,
  Dimensions,
  Modal,
  TouchableHighlight,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Card, Icon} from 'react-native-elements';

import Pdf from 'react-native-pdf';
import RNShareFile from 'react-native-share-file';

var pdfPath;

class ShowLastPDFS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pdfPaths: [],
      isPDFpathValid: false,
      modalVisible: false,
    };
  }

  componentDidMount() {
    this.getLastPDFpaths();
  }

  viewPDF = PDFPath => {
    pdfPath = 'file://' + PDFPath;
    // console.log(pdfPath);
    this.setModalVisible(true);
  };

  setModalVisible = visible => {
    this.setState({modalVisible: visible});
  };

  getLastPDFpaths = async () => {
    var lastPDFPaths = await AsyncStorage.getItem('lastPDFPaths');
    lastPDFPaths = JSON.parse(lastPDFPaths);
    if (lastPDFPaths == null) {
      this.setState({
        isPDFpathValid: false,
      });
    } else {
      lastPDFPaths = lastPDFPaths.reverse();
      this.setState({
        pdfPaths: lastPDFPaths,
        isPDFpathValid: true,
      });
    }
  };

  render() {
    const source = {uri: pdfPath};

    if (!this.state.isPDFpathValid) {
      return (
        <SafeAreaView>
          <View style={{marginBottom: 20, marginTop: 10}}>
            <Text
              style={{textAlign: 'center', fontWeight: 'bold', fontSize: 23}}>
              All PDFs
            </Text>
          </View>
          <View style={{marginTop: 20}}>
            <Text style={{color: '#f02613', textAlign: 'center'}}>
              You haven't scanned any PDFs yet.
            </Text>
          </View>
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              this.setModalVisible(!this.state.modalVisible);
              // Alert.alert("Modal has been closed.");
            }}>
            <View style={styles.centeredView}>
              <View style={[styles.modalView, {backgroundColor: '#b785ed'}]}>
                <Text
                  style={[
                    styles.modalText,
                    {fontWeight: 'bold', fontSize: 15},
                  ]}>
                  PDF Preview
                </Text>
                <View style={styles.container}>
                  <Pdf
                    source={source}
                    onLoadComplete={(numberOfPages, filePath) => {
                      console.log(`number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page, numberOfPages) => {
                      console.log(`current page: ${page}`);
                    }}
                    onError={error => {
                      Alert.alert('File does not exist anymore.');
                      console.log(error);
                    }}
                    onPressLink={uri => {
                      console.log(`Link pressed: ${uri}`);
                    }}
                    style={styles.pdf}
                  />
                </View>

                <TouchableHighlight
                  style={{
                    ...styles.openButton,
                    backgroundColor: '#2196F3',
                    marginTop: 10,
                  }}
                  onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                  }}>
                  <Text style={styles.textStyle}>Close PDF</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>

          <View style={{marginBottom: 5, marginTop: 10}}>
            <Text
              style={{textAlign: 'center', fontWeight: 'bold', fontSize: 23}}>
              All PDFs
            </Text>
          </View>
          <View style={{}}>
            <ScrollView>
              {this.state.pdfPaths.map((item, key) => (
                <>
                  <Card key={key} title="Location">
                    <Text style={{marginBottom: 10}}>{item}</Text>
                    <Button
                      icon={<Icon name="code" color="#ffffff" />}
                      color='#27e6ac'
                      title="VIEW NOW"
                      onPress={() => {
                        this.viewPDF(item);
                        console.log('Viewed PDF');
                      }}
                    />
                    <View style={{marginTop:10}}></View>
                    <Button
                      icon={<Icon name="code" color="#ffffff" />}
                      color='#25a2e6'
                      title="SHARE"
                      onPress={() => {
                        RNShareFile.share({
                          url: item,
                        });
                        console.log('PDF Shared');
                      }}
                    />
                  </Card>
                </>
              ))}
              <View style={{marginBottom: '33%'}} />
            </ScrollView>
          </View>
        </SafeAreaView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
});

export default ShowLastPDFS;
