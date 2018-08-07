
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


export default class AsymmetricKeyConfig extends React.Component {


  render() {
    return (
      <View style={styles.container}>
        <Text>Asymetric222222222222 key id: {this.props.keyId}</Text>
        <Text>Public key: {this.props.pubKey}</Text>

      </View>
    );
  }
  componentWillMount() {

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
