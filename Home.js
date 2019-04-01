import React, {Component} from 'react';
import {Platform,Keyboard,Modal, ToastAndroid,Slider, CheckBox, ScrollView, StyleSheet,TouchableOpacity, Text, View,Image,Dimensions,Linking, TextInput,TouchableWithoutFeedback, FlatList } from 'react-native';
import { theme } from './lib/theme';
import { baseurl, get, post } from './lib/utilies';
import Icon from 'react-native-vector-icons/FontAwesome';
import HouseDetails from './resources/HouseDetails';
import Search from './resources/Search';
import Area from './resources/area.json';
import _ from 'lodash';
import axios from 'axios';
import HouseList from './resources/HouseList';

let {width,height} = Dimensions.get('window');

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
            activeHouse: null,
        };
    }

    componentWillMount(){
        
    }

    openHouse = (item) => {
        this.setState({activeHouse:item})
    }

    hideDetails = () => {
        this.setState({activeHouse:null});
    }

    render() {

        return (
            <View>
                <Search />
                <HouseList houses={this.props.houses} openHouse={this.openHouse} />
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.activeHouse ? true : false}
                    onRequestClose={() => {
                        this.setState({activeHouse:null});
                    }}
                >
                    <HouseDetails activeHouse={this.state.activeHouse} hideDetails={this.hideDetails}/>
                </Modal>
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
