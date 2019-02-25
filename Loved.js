import React, {Component} from 'react';
import {Platform, StyleSheet,TouchableOpacity, WebView, ScrollView, Dimensions, Text,Linking, View} from 'react-native';
import SingleRent from './resources/SingleRent';

type Props = {};
export default class Loved extends Component<Props> {
  render() {
    console.log(this.props)
    return (
      // <ScrollView>
      //   <TouchableOpacity style={styles.settingList} onPress={ ()=>{ Linking.openURL('https://www.google.com/maps/place/%E0%A6%97%E0%A6%BE%E0%A6%AC%E0%A6%A4%E0%A6%B2%E0%A7%80/@23.7657164,90.3048664,12z/data=!4m2!3m1!1s0x3755c0f596a1ef75:0x1c386acb29c34356')}}>
      //     <Text style={styles.settingListText}>Privacy Policy</Text>
      //   </TouchableOpacity>
      // </ScrollView>
      <View style={{height:230, width:250}}>
        <Text>asdfafda</Text>
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
