import React, {Component} from 'react';
import {Platform,ScrollView, StyleSheet,TouchableOpacity,Image, Text, View, TouchableWithoutFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { theme } from '../lib/theme';
import moment from 'moment';
import { baseurl, get, post } from '../lib/utilies';


type Props = {};
export default class HouseDetails extends Component<Props> {

  render() {

    let {activeHouse} = this.props;

    return (
      <View style={{flex:1}}>
        <View style={{flex:2,zIndex:1001, borderWidth:1, borderBottomWidth:0, borderTopWidth:0}} ref={(view) => this.viewHouse = view}>
          <Image
              source={{uri :activeHouse ? baseurl()+'/img/'+JSON.parse(activeHouse.image)[0] : null}}
              style={[{flex:1, resizeMode:'cover', top: 0, left: 0, height: null, width:null}]}
          >
          </Image>
          <TouchableWithoutFeedback onPress={() => this.props.hideDetails()}>
              <View style={[styles.detailsAbsBtn, {left:10}]}>
                  <Text style={styles.detailsAbsBtnText}><Icon size={12} name='chevron-left' /></Text>
              </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => this.props.hideDetails()}>
              <View style={[styles.detailsAbsBtn, {right:10}]}>
                  <Text style={styles.detailsAbsBtnText}><Icon size={22} name='heart' /></Text>
              </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={[{flex:2,zIndex:1000, backgroundColor:'#fff', padding:20}]}>
        {(activeHouse) &&
          <ScrollView style={{flex:1}}>
              <Text style={{borderBottomWidth:1, borderBottomColor:'#ddd', paddingBottom:5}}><Icon name="list-ul" /> Avaliable Date & Area</Text>
              <View style={{height:30,flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                  <Text style={styles.shortDetailsText}><Icon name="calendar" size={12} /> {moment(activeHouse.date).format('Do MMMM YY')}</Text>
                  <Text style={styles.shortDetailsText}><Icon name="map-marker" size={12} /> {activeHouse.area}</Text>
              </View>
              <Text style={{borderBottomWidth:1, borderBottomColor:'#ddd', paddingBottom:5, marginTop:20}}><Icon name="list-ul" /> Features</Text>
              <View style={{height:30,flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                  <Text style={styles.shortDetailsText}><Icon name="bed" size={12} /> {activeHouse.room} room</Text>
                  <Text style={styles.shortDetailsText}><Icon name="bath" size={12} /> {activeHouse.bath} Bathroom</Text>
                  <Text style={styles.rent}>{activeHouse.square} sq ft</Text>
              </View>
              <View style={{height:40,flexDirection:'row', alignItems:'center', justifyContent:'space-between', borderBottomWidth:1, borderBottomColor:'#ddd', marginTop:20}}>
                  <Text><Icon name="map-signs" /> Full Address</Text>
                  <TouchableWithoutFeedback onPress={() => Linking.openURL(activeHouse.location)}>
                      <View style={[styles.directionBtn, styles.shadow]}>
                          <Text style={{color:'#fff'}}><Icon name="map-marker" /> GET DIRECTION</Text>
                      </View>
                  </TouchableWithoutFeedback>
              </View>
              <Text style={[styles.shortDetailsText, {width:'100%', marginTop:5, marginBottom:20}]}>{activeHouse.address}</Text>
              <Text style={{borderBottomWidth:1, borderBottomColor:'#ddd', paddingBottom:5, marginTop:10}}><Icon name="info" /> Details</Text>
              <Text style={[styles.shortDetailsText, {width:'100%', marginTop:5, marginBottom:20}]}>{activeHouse.details}</Text>
              <Text style={{borderBottomWidth:1, borderBottomColor:'#ddd', paddingBottom:5, marginTop:10}}><Icon name="list-alt" /> Owner Info</Text>
              <View style={{height:50,flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                  <View>
                      <Text style={styles.shortDetailsText}><Icon name="user" size={12} /> {activeHouse.users_name}</Text>
                      <Text style={styles.shortDetailsText}><Icon name="phone" size={12} /> {activeHouse.users_mobile}</Text>
                  </View>
                  <View style={{flexDirection:'row'}}>
                      <TouchableWithoutFeedback onPress={() => Linking.openURL('tel:'+activeHouse.users_mobile)}>
                          <View style={[styles.callMsgBtn, styles.shadow]}>
                              <Text style={{color:'#fff'}}><Icon name="phone" size={14} /></Text>
                          </View>
                      </TouchableWithoutFeedback>
                      <TouchableWithoutFeedback onPress={() => Linking.openURL('sms:'+activeHouse.users_mobile)}>
                          <View style={[styles.callMsgBtn, styles.shadow]}>
                              <Text style={{color:'#fff'}}><Icon name="wechat" size={14}  /></Text>
                          </View>
                      </TouchableWithoutFeedback>
                  </View>
                  
              </View>
              <View style={{height:100}}></View>
          </ScrollView>
        }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  shortDetailsText:{
      color:theme().clr,
      fontSize:14,
      fontWeight:'600',
  },
  rent:{
      color:'#a3176e',
      fontSize:14,
      fontWeight:'500'
  },
  absoluteText:{
      position:'absolute',
      paddingHorizontal:10,
      paddingVertical:3,
      borderRadius:20,
      backgroundColor:'rgba(0,0,0,0.5)',
      color:'#fff',
      fontSize:12,
      fontWeight:'bold',
      top:10,
      opacity:.8
  },
  shadow:{
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 6,
      },
      shadowOpacity: 0.8,
      shadowRadius: 10,
      elevation: 5,
  },
  detailsAbsBtn:{
      position:'absolute', 
      top:10,
      height:50, 
      width:50, 
      alignItems:'center', 
      justifyContent:'center',
      backgroundColor:'rgba(0,0,0,.3)',
      borderRadius:5
  },
  detailsAbsBtnText:{
      fontSize:24, 
      fontWeight:'bold', 
      color:'#fff'
  },
  directionBtn:{
      paddingHorizontal:10,
      paddingVertical:3,
      borderRadius:20,
      backgroundColor:'#a3176e'
  },
  callMsgBtn:{
      height:40,
      width:40,
      borderRadius:20,
      alignItems:'center',
      justifyContent:'center',
      backgroundColor:'#a3176e',
      marginLeft:5,
  }
});
