import React, {Component} from 'react';
import {Platform,Keyboard,ToastAndroid,Slider, CheckBox, ScrollView, StyleSheet,TouchableOpacity, Text, View,Image,Dimensions, TextInput,TouchableNativeFeedback, FlatList } from 'react-native';
import { theme } from './lib/theme';
import { baseurl, get, post } from './lib/utilies';
import Icon from 'react-native-vector-icons/FontAwesome';
import SingleRent from './resources/SingleRent';
import Search from './resources/Search';
import Area from './resources/area.json';
import _ from 'lodash';
import axios from 'axios';

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
            houses:this.props.houses,
        };
    }

    componentWillMount(){

    }

    componentWillReceiveProps(){
        this.setState({watchChange:!this.state.watchChange});
    }

    render() {
        return (
            <View>
                <Search />
                <FlatList style={{height:Dimensions.get('window').height-100}}
                    extraData={this.state.watchChange}
                    data={this.props.houses}
                    initialNumToRender={2}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, index}) => 
                        <SingleRent 
                            key={index} 
                            houseData = {item} 
                            last = {this.props.houses.length == index+1 ? true : false} 
                        />
                    }
                />
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
