import React, {Component} from 'react';
import {Platform,Keyboard,ToastAndroid,Slider, CheckBox, ScrollView, StyleSheet,TouchableOpacity, Text, View,Image,Dimensions, TextInput,TouchableNativeFeedback, FlatList } from 'react-native';
import { theme } from '../lib/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import Area from './area.json';
import _ from 'lodash';

type Props = {};
export default class Search extends Component<Props> {

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
        this.focusNextField = this.focusNextField.bind(this);
        this.inputs = {};
    }

    componentWillMount(){

    }

    focusNextField(name) {
        setTimeout(() => {
          this.inputs[name].focus();
        }, 100);
    }

    searchArea = (searchText) => {
        this.setState({searchText:searchText});
        var filteredArea = [];
        for(var i = 0; i < Area.length; i++){
            if(Area[i].toLowerCase().indexOf(searchText.toLowerCase()) !== -1){
                filteredArea.push(Area[i]);
            }
        }
        this.setState({filteredArea:filteredArea});
        this.setState({watchChange:!this.state.watchChange});
    }

    clearSearchText(){
        this.setState({searchText:''});
        Keyboard.dismiss();
    }

    selectArea(area){
        this.setState({selectedArea:area});
    }

    removeArea(){
        this.setState({selectedArea:''});
        this.focusNextField('searchInput');
    }

    cngBed(field){
        var searchData = this.state.searchData;
        searchData[field] = !searchData[field];
        this.setState({searchData:searchData});
    }

    cngPriceRange(price){
        this.setState({price:price})
    }

    render() {
        return (
            <View style={styles.headerWrapper}>
                {this.state.selectedArea === '' ?
                <View style={styles.header}>
                    <TextInput
                        ref={ input => {
                            this.inputs['searchInput'] = input;
                        }}
                        selectTextOnFocus={true}
                        style={styles.searchInput}
                        placeholder='Search by Location'
                        value={this.state.searchText}
                        onChangeText={(searchText) => this.searchArea(searchText)}
                    />
                    <TouchableOpacity onPress={() => this.clearSearchText()} style={{flex:.1}}>
                        <Text style={styles.searchIcon}><Icon name={this.state.searchText == '' ? 'search' : 'times'} size={14}  /></Text>
                    </TouchableOpacity>
                </View>
                :
                <TouchableOpacity onPress={() =>  this.removeArea()} style={styles.areaHeader}>
                    <Text style={styles.selectAreaText}>{this.state.selectedArea}</Text>
                    <Text style={styles.searchIcon}><Icon name='times' size={14} color={theme().clr2}  /></Text>
                </TouchableOpacity>
                }
                {(this.state.selectedArea !==  '') &&
                <View style={styles.container}>
                    <View style={{flexDirection:'row', justifyContent:'space-around'}}>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <CheckBox onValueChange={() => this.cngBed('onebed')} value={this.state.searchData.onebed} />
                            <Text style={styles.checkboxText}>1 <Icon name='bed' size={14} /></Text>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <CheckBox onValueChange={() => this.cngBed('twobed')} value={this.state.searchData.twobed} />
                            <Text style={styles.checkboxText}>2 <Icon name='bed' size={14} /></Text>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <CheckBox onValueChange={() => this.cngBed('threebed')} value={this.state.searchData.threebed} />
                            <Text style={styles.checkboxText}>3 <Icon name='bed' size={14} /></Text>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <CheckBox onValueChange={() => this.cngBed('threeupbed')} value={this.state.searchData.threeupbed} />
                            <Text style={styles.checkboxText}>3+ <Icon name='bed' size={14} /></Text>
                        </View>
                    </View>
                    <Slider
                        minimumValue={0}
                        maximumValue={50000}
                        value={this.state.price}
                        onSlidingComplete={(price) => this.cngPriceRange(price)}
                    />
                    <View style={{flexDirection:'row', paddingBottom:10, justifyContent:'space-around'}}>
                        <Text style={styles.rangeTitle}>0</Text>
                        <Text style={styles.rangeTitle}>10K</Text>
                        <Text style={styles.rangeTitle}>20K</Text>
                        <Text style={styles.rangeTitle}>30K</Text>
                        <Text style={styles.rangeTitle}>50+K</Text>
                    </View>
                </View>
                }
                {(this.state.filteredArea.length > 0 &&  this.state.selectedArea === ''  && this.state.searchText !== '') &&
                <FlatList
                    keyboardShouldPersistTaps={'always'}
                    extraData={this.state.watchChange}
                    data={this.state.filteredArea}
                    renderItem={({item}) =>
                        <TouchableOpacity onPress={() => this.selectArea(item)} style={styles.areaList}>
                            <Text style={styles.areaName}>{item}</Text>
                            <Text><Icon name='check-circle' color={theme().backClr} /></Text>
                        </TouchableOpacity>
                    }
                />
                }
                {(this.state.filteredArea.length == 0 && this.state.selectedArea === '' && this.state.searchText !== '') &&
                <View style={styles.noResultText}><Text>No Area Found</Text></View>
                }
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
    backgroundColor:theme().CntBackClr,
    color:theme().clr,
    alignItems:'center',
    justifyContent:'center',
  },
  header:{
    flexDirection:'row', 
    borderRadius:20, 
    backgroundColor:'#fff',
    alignSelf:'center',
    width:'90%',
    justifyContent:'space-between',
    alignItems:'center',
    marginVertical:5,
  },
  areaHeader:{
    flexDirection:'row', 
    borderRadius:20, 
    backgroundColor:'#fff',
    alignSelf:'center',
    width:'90%',
    justifyContent:'space-between',
    alignItems:'center',
    marginVertical:5,
    padding:3,
  },
  searchInput:{
      height:30,
      padding:0,
      fontSize:14,
      paddingHorizontal:15,
      flex:.9,
  },
  selectAreaText:{
    padding:0,
    fontSize:14,
    paddingHorizontal:15,
    flex:.9,
    color:theme().clr,
},
  searchIcon:{
    textAlign:'right',
    paddingRight:10
  },
  areaList:{
    width:Dimensions.get('window').width*.9,
    padding:5, 
    flexDirection:'row', 
    justifyContent:'space-between', 
    alignItems:'center'
  },
  areaName:{
      fontSize:12,
      color:theme().clr,
      fontWeight:'800'
  },
  areaBtn:{
      borderRadius:20,
      padding:5,
      paddingLeft:8,
      backgroundColor:theme().backClr,
      margin:2,
  },
  areabtnText:{
      fontSize:11,
      color:'#fff'
  },
  checkboxText:{
      fontSize:14,
      fontWeight:'900',
  },
  rangeTitle:{
      fontSize:10,
      fontWeight:'600',
  },
  noResultText:{
      fontSize:14,
      fontWeight:'800',
      paddingBottom:10,
  }
});
