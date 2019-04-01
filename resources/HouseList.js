import React, {Component} from 'react';
import {Platform,Dimensions,Animated, StyleSheet, Text,Image, View,TouchableOpacity,TouchableWithoutFeedback, TouchableNativeFeedback, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { theme } from '../lib/theme';
import { baseurl } from '../lib/utilies';
import moment from 'moment';

let {width,height} = Dimensions.get('window');

type Props = {};
export default class HouseList extends Component<Props> {

  render() {
    return (
        <FlatList style={{height:Dimensions.get('window').height-100}}
            data={this.props.houses}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => 
                <TouchableWithoutFeedback onPress={() => this.props.openHouse(item)}>
                    <View style={[{height:260, width:width*.9,alignSelf:'center',marginTop:20,position:'relative', borderRadius:5, overFlow:'hidden'}, styles.shadow]}>
                        <Image 
                            style={{flex:1, height:null,width:null,resizeMode:'cover', borderTopRightRadius:5, borderTopLeftRadius:5}}
                            source={{uri: baseurl()+'/img/'+JSON.parse(item.image)[0]}}
                        />
                        <View style={{height:40,flexDirection:'row', alignItems:'center', justifyContent:'space-around'}}>
                            <Text style={styles.shortDetailsText}><Icon name="bed" size={12} /> {item.room} room</Text>
                            <Text style={styles.shortDetailsText}><Icon name="bath" size={12} /> {item.bath} Bathroom</Text>
                            <Text style={styles.rent}>{item.square} sq ft</Text>
                        </View>
                        <View style={{position:'absolute',height:35, bottom:40, left:0,right:0, backgroundColor:'rgba(0,0,0,0.5)',paddingLeft:10, paddingTop:6, flexDirection:'row'}}>
                            <Text style={{color:'#fff', opacity:.8, fontSize:16, fontWeight:'900'}}>৳{item.cost}</Text>
                            <Text style={{paddingTop:3,color:'#fff', fontSize:12}}> {item.type === 'Sale' ? '' : 'per month'}</Text>
                        </View>
                        <Text style={[styles.absoluteText, {left:10}]}>{item.type}</Text>
                        <Text style={[styles.absoluteText, {right:10}]}>Avaliable Form: {moment(item.date).format('MMMM YY')}</Text>
                        <Text style={[styles.absoluteText, {top:190, left:'auto', right:10}]}><Icon name="map-marker" size={12} /> {item.area}</Text>
                    </View>
                </TouchableWithoutFeedback>
                }
            />
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