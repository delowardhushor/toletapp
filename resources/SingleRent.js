import React, {Component} from 'react';
import {Platform, StyleSheet, Text,Image, View,TouchableOpacity, TouchableNativeFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { theme } from '../lib/theme';

type Props = {};
export default class SingleRent extends Component<Props> {
  render() {
      console.log(this.props.last)
    return (
        <View style={[styles.singleHouse, {paddingBottom:this.props.last === true ? 100 : 0 }]}>
            <Image 
                style={{height:200,width:"100%", }}
                source={{uri: 'https://www.mcdonaldjoneshomes.com.au/sites/default/files/designs/feature_images/granny-flat-9-living-kitchen-alfresco-r.jpg'}}
            />
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
                <TouchableOpacity style={styles.viewBtn} >
                    <Text style={styles.viewBtnText}><Icon name='search' size={10} color={'#fff'} /> Details</Text>
                </TouchableOpacity>
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
        marginBottom:15,
    },
    rentType:{
        position:'absolute',
        top:10,
        left:10,
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
