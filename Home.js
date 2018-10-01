import React, {Component} from 'react';
import {Platform,ScrollView, StyleSheet, Text, View,Image, TextInput,TouchableNativeFeedback, FlatList } from 'react-native';
import { theme } from './lib/theme';
import Icon from 'react-native-vector-icons/FontAwesome';

type Props = {};
export default class Home extends Component<Props> {
  render() {
    return (
      <View>
        <View style={styles.header}>
            <Text>Rent It</Text>
            <TouchableNativeFeedback >
                <Text><Icon name='search' size={20} color={theme().clr} /></Text>
            </TouchableNativeFeedback>
        </View>
        <ScrollView>
            <View style={styles.singleHouse}>
                <Image 
                    style={{height:200,width:"100%"}}
                    source={{uri: 'https://www.mcdonaldjoneshomes.com.au/sites/default/files/designs/feature_images/granny-flat-9-living-kitchen-alfresco-r.jpg'}}
                />
                <View style={styles.rentType}>
                    <Text style={{color:'#fff'}}>FOR SALE</Text>
                </View>
                <View style={styles.detailSection}>
                    <Text>$12.00/m</Text>
                    <Text>2 <Icon name='bed'  /></Text>
                    <Text>1 <Icon name='bath' /></Text>
                    <Text>1200 sq ft</Text>
                </View>
                <View>
                    <Text>Mohammadpur</Text>
                </View>
            </View>
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
  },
  header:{
    backgroundColor:theme().CntBackClr,
    color:theme().clr,
    alignItems:'center',
    justifyContent:'space-around',
    flexDirection:'row',
    paddingVertical:10,
  },
  singleHouse:{
      position:'relative',
  },
  rentType:{
      position:'absolute',
      top:10,
      left:10,
      backgroundColor:theme().backClr,
      paddingVertical:5,
      paddingHorizontal:15,
      borderRadius:20,
  },
  detailSection:{
    flexDirection:'row', 
    justifyContent:'space-around',
    paddingVertical:10
  }
});
