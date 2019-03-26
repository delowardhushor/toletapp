import React, {Component} from 'react';
import {ActivityIndicator, View, Dimensions} from 'react-native';

let {height, width} = Dimensions.get('window');

type Props = {};
export default class Loading extends Component<Props> {

  render() {

    return (
      <View style={{height:height, width:width, position:'absolute', justifyContent:'center', alignItems:'center'}}>
        <ActivityIndicator size='large' />
      </View>
    );
  }
}