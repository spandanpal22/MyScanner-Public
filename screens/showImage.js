import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  Button,
  TouchableOpacity,
  ScrollView
} from 'react-native';
// import {ScrollView} from 'react-native-gesture-handler';
import { StackActions } from '@react-navigation/native';

export default class ShowImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uris: this.props.route.params.uris,
    };
  }

  componentDidMount() {
    console.log(this.state.uris);
  }

  retry = () => {
    this.props.navigation.dispatch(StackActions.replace('Camera'));
  };

  generatePDF = () => {
    console.log('Generate PDF');
    // this.props.navigation.navigate('Generate PDF', {
    //   uris: this.state.uris,
    // });
    this.props.navigation.dispatch(
      StackActions.replace('Generate PDF', {
        uris: this.state.uris,
      }),
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.MainContainer}>
        <View style={styles.RetryView}>
          <TouchableOpacity style={styles.RetryButton} onPress={this.retry.bind(this)}>
            <Text style={{ fontWeight: 'bold', color: '#fff' }}>RETRY</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <ScrollView>
            {this.state.uris.map((item, key) => (
              // <Text key={key}>Hello</Text>
              <Image
                key={key}
                source={{ uri: item }}
                style={styles.capturedImage}
              />
            ))}
          </ScrollView>
        </View>
        <View style={styles.bottomView}>
          <Button
            title="Generate PDF"
            color="#4bbf6a"
            style={styles.genPDFbutton}
            onPress={() => {
              this.generatePDF();
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  genPDFbutton: {
    // height:200,
    // width:400
    // marginTop: 10,
    // marginBottom:10,
  },
  RetryButton: {
    backgroundColor: '#eb4034',
    height: 30,
    width: 200,
    padding: 5,
    alignItems: 'center',
    borderRadius: 5,
  },
  RetryView: {
    flex: 0.09,
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  capturedImage: {
    height: 450,
    width: 300,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  MainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomView: {
    flex: 1,
    width: '100%',
    height: 50,
    // marginTop: 10,
    // marginBottom: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
});
