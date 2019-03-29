import React, {Component} from 'react';
import {Platform, StyleSheet,TouchableOpacity,Image, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


type Props = {};
export default class HouseDetails extends Component<Props> {

  render() {

    return (
      <View style={{flex:1}}>
        <Image 
            style={{height:300,width:"100%"}}
            source={{uri: "http://falgunit.com/tolet/img/1.png"}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({

});
