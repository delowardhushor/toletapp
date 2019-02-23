import React, {Component} from 'react';
import {Platform, StyleSheet,TouchableOpacity, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { theme } from './lib/theme';
import { getLocal, resetLocal } from './lib/utilies';


type Props = {};
export default class Settings extends Component<Props> {

  signout(){
    this.props.signout();
    
  }

  render() {
    console.log(this)
    return (
      <View style={styles.container}>
        <View style={styles.adoutTolet}>
          <Text style={styles.head}>About Tolet</Text>
          <Text style={styles.body}>About Tolet</Text>
        </View>
        <TouchableOpacity  onPress={() => this.signout()} style={styles.logoutBtn}>
          <Text style={{color:'#fff'}}>Sign Out</Text>
        </TouchableOpacity>
        <View style={styles.aboutDev}>
          <TouchableOpacity  onPress={() => this.signout()} style={styles.aboutDevBtn}>
            <Icon name="info" color="#fff" /><Text style={{color:'#fff', marginLeft:5}}>About Creator</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  logoutBtn:{
    paddingHorizontal:20,
    paddingVertical:5,
    borderRadius:20,
    backgroundColor:theme().backClr,
    marginTop:50
  },
  adoutTolet:{
    alignItems:'center',
    marginTop:50,
  },
  head:{
    fontSize:30,
    textAlign:'center',
    fontWeight:'bold',
    color:theme().clr
  },
  body:{
    fontSize:14,
    textAlign:'center',
    color:theme().clr2
  },
  aboutDev:{
    position:'absolute',
    backgroundColor:'transparent',
    bottom:60,
  },
  aboutDevBtn:{
    paddingHorizontal:20,
    paddingVertical:5,
    borderRadius:20,
    backgroundColor:theme().backClr,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  }
});
