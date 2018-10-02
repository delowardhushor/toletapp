import React, {Component} from 'react';
import {Platform,ScrollView, StyleSheet, Text, View,Image,Dimensions, TextInput,TouchableNativeFeedback, FlatList } from 'react-native';
import { theme } from './lib/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import SingleRent from './resources/SingleRent';

type Props = {};
export default class Home extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
          
        };
    }

    render() {
        return (
            <View>
                <View style={styles.headerWrapper}>
                    <View style={styles.header}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder='Search by Location'
                        />
                        <Text style={styles.searchIcon}><Icon name='search' size={12}  /></Text>
                    </View>
                </View>
                <ScrollView style={{height:Dimensions.get('window').height-100}}>
                    <SingleRent />
                    <SingleRent />
                    <SingleRent />
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    alignSelf:'center',
    width:'90%'
  },
  headerWrapper:{
    height:35,
    backgroundColor:theme().CntBackClr,
    color:theme().clr,
    alignItems:'center',
    justifyContent:'center',
    flexDirection:'row',
    paddingVertical:10,
  },
  header:{
    flexDirection:'row', 
    borderRadius:20, 
    backgroundColor:'#fff',
    alignSelf:'center',
    width:'90%',
    justifyContent:'space-between',
    alignItems:'center'
  },
  searchInput:{
      height:25,
      padding:0,
      fontSize:12,
      paddingHorizontal:10,
      flex:.9,
  },
  searchIcon:{
    flex:.1,
    textAlign:'right',
    paddingRight:10
  }
});
