import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Header from '../../components/Header';
import colors from '../../styles/Colors';
import styles from './styles';

class HelloWorld extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: (
      <Header backgroundColor={colors.WHITE} statusBarStyle="dark-content" title="Hello World" />
    ),
  });

  render() {
    return (
      <View style={styles.container}>
        <Text>Hello World</Text>
      </View>
    );
  }
}

export default HelloWorld;
