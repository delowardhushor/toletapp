import React, {Component} from 'react';
import {Platform, StyleSheet,ScrollView, Dimensions, Text, View} from 'react-native';
import SingleRent from './resources/SingleRent';

type Props = {};
export default class Loved extends Component<Props> {
  render() {
    return (
      <View>
        <ScrollView style={{height:Dimensions.get('window').height-100}}>
          <SingleRent />
          <SingleRent />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});
