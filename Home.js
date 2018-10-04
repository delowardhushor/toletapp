import React, {Component} from 'react';
import {Platform,Keyboard,ToastAndroid,Slider, CheckBox, ScrollView, StyleSheet,TouchableOpacity, Text, View,Image,Dimensions, TextInput,TouchableNativeFeedback, FlatList } from 'react-native';
import { theme } from './lib/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import SingleRent from './resources/SingleRent';
import Search from './resources/Search';
import Area from './resources/area.json';
import _ from 'lodash';

type Props = {};
export default class Home extends Component<Props> {

    constructor(props){
        super(props);
        this.state = {
            watchChange:false,
            searchText:'',
            filteredArea:[],
            selectedArea:'',
            price:25000,
            searchData:{
                'onebed':true,
                'twobed':true,
                'threebed':true,
                'threeupbed':true,
            },
        };
    }

    componentWillMount(){

    }

    render() {
        return (
            <View>
                <Search />
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
  }
});
