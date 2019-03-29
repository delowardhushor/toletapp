import React, {Component} from 'react';
import {Platform,Dimensions,Animated, StyleSheet, Text,Image, View,TouchableOpacity,TouchableWithoutFeedback, TouchableNativeFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { theme } from '../lib/theme';
import { baseurl } from '../lib/utilies';

let {width,height} = Dimensions.get('window');

type Props = {};
export default class SingleRent extends Component<Props> {
  render() {
    console.log(this.props.last)
    return (
        <View style={[styles.singleHouse, {paddingBottom:this.props.last === true ? 100 : 0 }]}>
            <TouchableNativeFeedback style={{borderRadius:10, overflow:'hidden'}} onPress={() => this.props.showDetails()}>
                <Animated.View style={{height:height-350, padding:15}}>
                    <Image 
                        ref={(image) => this.listImage = image}
                        style={{flex:1, height:null,width:null,resizeMode:'cover', borderRadius:10}}
                        source={{uri: baseurl()+'/img/'+JSON.parse(this.props.houseData.image)[0]}}
                    />
                </Animated.View>
            </TouchableNativeFeedback>
            <View style={styles.rentType}>
                <Text style={styles.rentTypeText}>FOR {this.props.houseData.type}</Text>
            </View>
            <View style={styles.detailSection}>
                <Text style={styles.rent}>${this.props.houseData.cost}/m</Text>
                <Text style={styles.detailText}>{this.props.houseData.room} <Icon name='bed' size={12} /></Text>
                <Text style={styles.detailText}>{this.props.houseData.bath} <Icon name='bath' size={12} /></Text>
                <Text style={styles.rent}>{this.props.houseData.square} sq ft</Text>
            </View>
            <View style={[styles.container, {flexDirection:'row', justifyContent:'space-between'}]}>
                <View style={{flex:.7, justifyContent:'center'}}>
                    <Text style={styles.address}>{this.props.houseData.address}</Text>
                </View>
                <View style={{flex:.3, justifyContent:'center'}}>
                <TouchableWithoutFeedback style={styles.viewBtn} >
                    <Text style={styles.viewBtnText}><Icon name='search' size={10} color={'#fff'} /> Details</Text>
                </TouchableWithoutFeedback>
                </View>
            </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        alignSelf:'center',
        width:'90%'
    },
    singleHouse:{
        position:'relative',
        marginTop:15,
    },
    rentType:{
        position:'absolute',
        top:30,
        left:30,
        backgroundColor:theme().backClr,
        paddingVertical:3,
        paddingHorizontal:10,
        borderRadius:20,
    },
    rentTypeText:{
        color:'#fff',
        fontSize:11,
        textTransform:'capitalize'
    },
    detailSection:{
        flexDirection:'row', 
        justifyContent:'space-between',
        paddingVertical:10,
        width:'90%',
        alignSelf:'center'
    },
    address:{
        fontWeight:'700',
        fontSize:12,
        color:theme().clr,
    },
    detailText:{
        color:theme().clr,
        fontSize:14,
        fontWeight:'600',
    },
    rent:{
        color:theme().backClr,
        fontSize:14,
        fontWeight:'500'
    },
    viewBtn:{
        backgroundColor:theme().backClr,
        borderRadius:15,
        paddingHorizontal:10,
        paddingVertical:3,
        alignItems:'center',
    },
    viewBtnText:{
        fontSize:11,
        color:'#fff',
    }
});
