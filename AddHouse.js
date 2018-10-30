import React, {Component} from 'react';
import {Platform,Image,FlatList, StyleSheet,WebView,CheckBox ,TouchableOpacity,Modal, ImageBackground,AsyncStorage, ScrollView, Dimensions, Text,TextInput, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { theme } from './lib/theme';
import Area from './resources/area.json';
import { getLocal } from './lib/utilies';



type Props = {};
export default class AddHouse extends Component<Props> {

  constructor(props) {
      super(props);
      this.state = {
          houseData: {
            area:'',
            images:[],
            type:'rent',
            price:0,
            room:0,
            bath:0,
            address:'',
            details:''
          },
          searchText:'',
          searchedLocation:Area,
          watchChange:true,
      };
  }

  selectPhoto = () => {
    var ImagePicker = require('react-native-image-picker');
    var options = {
      title: 'Select Photo',
      // quality:0.5,  
      maxWidth: 150,
      maxHeight: 200,
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };

    ImagePicker.showImagePicker(options, (response) => {

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        let source = {
          uri: response.uri
        };
        // this.setState({
        //   pic: source
        // });
        var houseData = this.state.houseData;
        houseData.images.push(source);
        this.setState({houseData:houseData});
        //this.state.houseData.images.push(source);
      }

    });
  }

  clrSearch(){
    this.setState({searchText:''});
    this.setState({searchedLocation:Area});
  }

  searchArea = (searchText) => {
    this.setState({searchText:searchText});
    var searchedLocation = [];
    for(var i = 0; i < Area.length; i++){
        if(Area[i].toLowerCase().indexOf(searchText.toLowerCase()) !== -1){
            searchedLocation.push(Area[i]);
        }
    }
    this.setState({searchedLocation:searchedLocation});
    this.setState({watchChange:!this.state.watchChange});
  }

  selectArea(areaName){
    var houseData = this.state.houseData;
    houseData.area = areaName;
    this.setState({houseData:houseData});
  }

  clrArea(){
    var houseData = this.state.houseData;
    houseData.area = '';
    this.setState({houseData:houseData});
  }

  cngHouseData(fieldName, value){
    var houseData = this.state.houseData;
    houseData[fieldName] = value;
    this.setState({houseData:houseData});
  }

  cngType(){
    var houseData = this.state.houseData;
    if(houseData.type === 'rent'){
      houseData.type = 'sale'
    }
    else if(houseData.type === 'sale'){
      houseData.type = 'rent'
    }
    this.setState({houseData:houseData});
  }
  

  render() {
    const images = this.state.houseData.images.map((image, i) => {
      return (
        <TouchableOpacity key={i}>
          <Image
              style={styles.singleImage}
              source={image}
          />
        </TouchableOpacity>
      );
    })

    return (
              <ScrollView>
                {(this.state.houseData.area === '') &&
                <View style={{alignItems:'center', justifyContent:'center'}}>
                  <View style={{backgroundColor:theme().backClr, flexDirection:"row", alignItems:'center', justifyContent:'center'}}>
                    <TouchableOpacity onPress={() => this.props.changePage('myHouse')} style={{flex:.1, alignItems:'center'}}>
                      <Text>
                        <Icon color='#fff' name='chevron-left' size={14} />
                      </Text>
                    </TouchableOpacity>
                    <TextInput 
                      placeholderTextColor='#fff' 
                      style={{flex:.8}} 
                      placeholder='Search Location' 
                      value={this.state.searchText}
                      onChangeText={(searchText) => this.searchArea(searchText)}
                    />
                    <TouchableOpacity onPress={() => this.clrSearch()} style={{flex:.1, alignItems:'center'}}>
                      <Text>
                        <Icon color='#fff' name='times' size={14} />
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <FlatList
                      keyboardShouldPersistTaps={'always'}
                      extraData={this.state.watchChange}
                      data={this.state.searchedLocation}
                      renderItem={({item, i}) =>
                        <TouchableOpacity key={i} onPress={() => this.selectArea(item)} style={styles.areaList}>
                            <Text style={styles.areaName}>{item}</Text>
                            <Text><Icon name='check-circle' color={theme().backClr} /></Text>
                        </TouchableOpacity>
                      }
                  />
                  {(this.state.searchedLocation.length == 0 && this.state.searchText !== '') &&
                  <View style={styles.noResultText}><Text>No Location Found</Text></View>
                  }
                </View>
                }
                {(this.state.houseData.area !== '') &&
                <View style={{alignItems:'center'}}>
                  <TouchableOpacity onPress={() => this.selectPhoto()} style={[styles.singleImage , {marginVertical:10, width:Dimensions.get('window').width}]}>
                    <Text style={styles.addImageBtn}>Add Image</Text>
                  </TouchableOpacity>
                  {(this.state.houseData.images.length > 0) &&
                  <ScrollView horizontal={true} >
                    <View style={{flex:1, alignItems:'center', justifyContent:'center', flexDirection:'row', height:50}}>
                      {images}
                    </View>
                  </ScrollView>
                  }
                  <View style={{width:'90%', alignContent:'center'}}>
                    <View style={styles.inpurWrapper}>
                      <Text style={[styles.AddHouseInptLabel, {flex:.8,}]}>Location: {this.state.houseData.area}</Text>
                      <TouchableOpacity onPress={() => this.clrArea()} style={{ flex:.2, alignContent:'center',justifyContent:'center', paddingVertical:3, backgroundColor:theme().backClr, borderRadius:20}}>
                        <Text style={{color:'#fff', textAlign:'center'}}>Change</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.inpurWrapper}>
                      <Text style={styles.AddHouseInptLabel}>For:</Text>
                      <CheckBox onValueChange={() => this.cngType()} value={this.state.houseData.type === 'rent' ? true : false } />
                      <Text style={styles.checkboxText}>Rent</Text>
                      <CheckBox onValueChange={() => this.cngType()} value={this.state.houseData.type === 'sale' ? true : false } />
                      <Text style={styles.checkboxText}>Sale</Text>
                    </View>
                    <View style={styles.inpurWrapper}>
                      <Text style={styles.AddHouseInptLabel}>Flat Size:</Text>
                      <TextInput onChangeText={(size) => this.cngHouseData('size', size)} value={this.state.houseData.size} placeholderTextColor='grey' style={styles.AddHouseInpt} placeholder='Flat Size(sq2)' />
                    </View>
                    <View style={styles.inpurWrapper}>
                      <Text style={styles.AddHouseInptLabel}>Bed Room:</Text>
                      <TextInput onChangeText={(room) => this.cngHouseData('room', room)} value={this.state.houseData.room} placeholderTextColor='grey' style={styles.AddHouseInpt} placeholder='How Many Bed Room?' />
                    </View>
                    <View style={styles.inpurWrapper}>
                      <Text style={styles.AddHouseInptLabel}>Bath Room:</Text>
                      <TextInput onChangeText={(bath) => this.cngHouseData('bath', bath)} value={this.state.houseData.bath} placeholderTextColor='grey' style={styles.AddHouseInpt} placeholder='How Many Bath Room?' />
                    </View>
                    <View style={styles.inpurWrapper}>
                      <Text style={styles.AddHouseInptLabel}>Price{this.state.houseData.type === 'rent'? "/per month":''}:</Text>
                      <TextInput onChangeText={(cost) => this.cngHouseData('cost', cost)} value={this.state.houseData.cost} placeholderTextColor='grey' style={styles.AddHouseInpt} placeholder='' />
                    </View>
                    <View style={styles.inpurWrapper}>
                      <Text style={styles.AddHouseInptLabel}>Full Address</Text>
                      <TextInput multiline={true} onChangeText={(address) => this.cngHouseData('address', address)} value={this.state.houseData.address} placeholderTextColor='grey' style={styles.AddHouseInpt} placeholder='House Address' />
                    </View>
                    <View style={styles.inpurWrapper}>
                      <Text style={styles.AddHouseInptLabel}>Details</Text>
                      <TextInput multiline={true} onChangeText={(details) => this.cngHouseData('details', details)} value={this.state.houseData.details} placeholderTextColor='grey' style={styles.AddHouseInpt} placeholder='More Details' />
                    </View>
                    <TouchableOpacity style={{alignItems:'flex-end', marginTop:10}}><Text style={styles.addImageBtn}>Add</Text></TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={() => this.props.changePage('myHouse')} style={[styles.addBtnWrapper, {backgroundColor:theme().clr2}]}>
                    <Text><Icon name='times' size={12} color='#fff' /></Text>
                  </TouchableOpacity>
                </View>
                }
              </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height:'100%',
   // width:'100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  addBtnWrapper:{
    height:30,
    width:30,
    backgroundColor:theme().backClr,
    borderRadius:15,
    alignItems:'center',
    justifyContent:'center',
    position:'absolute',
    top:10,
    right:10,
  },
  singleImage:{
    height:50, 
    width:75, 
    alignItems:'center', 
    justifyContent:'center',
    borderRadius:5,
    marginHorizontal:2
  },
  addImageBtn:{
    paddingHorizontal:20,
    paddingVertical:10,
    borderRadius:20,
    backgroundColor:theme().backClr,
    color:'#fff',
    fontSize:12
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
  inpurWrapper:{
    flexDirection:'row', 
    alignItems:'center', 
    marginVertical:10,
  },
  AddHouseInptLabel:{
    color:theme().clr, 
    fontSize:16,
    flex:.4
  },
  AddHouseInpt:{
    borderBottomColor:theme().backClr,
    borderBottomWidth:1,
    paddingBottom:0,
    paddingTop:0,
    color:theme().clr, 
    fontSize:16,
    flex:.6,
    color:theme().backClr,
  }
});
