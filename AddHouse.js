import React, {Component} from 'react';
import {Platform,Image,FlatList, StyleSheet,WebView,CheckBox, ToastAndroid ,TouchableOpacity,Modal, ImageBackground,AsyncStorage, ScrollView, Dimensions, Text,TextInput, View} from 'react-native';
import axios from 'axios';
import DatePicker from 'react-native-datepicker'
import Icon from 'react-native-vector-icons/FontAwesome';
import { theme } from './lib/theme';
import Area from './resources/area.json';
import { getLocal, post, baseurl } from './lib/utilies';
import Loading from './resources/Loading';
import FloatingLabelInput from './resources/FloatingLabelInput';

let {width,height} = Dimensions.get('window');

type Props = {};
export default class AddHouse extends Component<Props> {

  constructor(props) {
      super(props);
      this.state = {
        houseData: {
          date:'',
          area:'',
          image:[],
          type:'',
          cost:'',
          room:'',
          bath:'',
          size:'',
          address:'',
          details:'',
          location:'',
        },
        searchText:'',
        searchedLocation:Area,
        watchChange:true,
        mapVisible:false,
        currentMap:'',

        currentSection:'selectArea',

      };

      this.focusNextField = this.focusNextField.bind(this);
      this.inputs = {};
  }

  focusNextField = (id, position) => {
    this.inputs[id].focusNextField();
    this.scrolldetailsScroll(position);
  }

  componentWillMount(){
    let {updateHouse} = this.props;
    
    if(updateHouse){
      var houseData = JSON.parse(JSON.stringify(this.state.houseData));
      houseData.date = updateHouse.date;
      houseData.area = updateHouse.area;
      houseData.image = JSON.parse(updateHouse.image);
      houseData.type = updateHouse.type;
      houseData.cost = updateHouse.cost;
      houseData.room = updateHouse.room;
      houseData.bath = updateHouse.bath;
      houseData.size = updateHouse.square;
      houseData.address = updateHouse.address;
      houseData.details = updateHouse.details;
      houseData.location = updateHouse.location
      this.setState({houseData:houseData})
    }
  }

  scrolldetailsScroll = (position) => {
    this.detailsScroll.scrollTo({x: 0, y: position, animated: true});
  }

  selectPhoto = () => {
    var ImagePicker = require('react-native-image-picker');
    var options = {
      title: 'Select Image',
      // quality:0.5,  
      maxWidth: 720,
      maxHeight: 600,
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
        this.saveImage(source);
      }
    });
  }

  saveImage(source){
    this.setState({Loading:true});
    const data = new FormData();
    data.append('image', {
      uri: source.uri,
      type: 'image/png',
      name: 'image.png'
    });
    data.append('mobile', this.props.user.mobile);
    data.append('token', this.props.user.token);
    axios({
      method: 'post',
      url: baseurl()+"/public/api/upload",
      data: data,
      config: {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    })
    .then((res) => {
      if(res.data.success){
        var houseData = this.state.houseData;
        houseData.image.push(res.data.image);
        this.setState({houseData:houseData, watchChange:!this.state.watchChange});
      }
    })
    .catch((err)=> {
      ToastAndroid.show("Server Error, Please Try Later", 1000);
    })
    this.setState({Loading:false});
  }

  removeImage(index){
    var houseData = JSON.parse(JSON.stringify(this.state.houseData));
    houseData.image.splice(index, 1);
    this.setState({houseData:houseData, watchChange:!this.state.watchChange});
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

  cngHouseData(fieldName, value){
    var houseData = this.state.houseData;
    houseData[fieldName] = value;
    this.setState({houseData:houseData});
  }

  cngCurrentMap(map){
    if(map.url.indexOf('/place/') !== -1){
      this.cngHouseData('location', map.url);
    }
  }

  addHouse(){
    let {date, type, area, image, location, address, details, cost, size, room, bath } = this.state.houseData;
    console.log(this.props.user)
    post('/public/api/adds/store', {
      mobile:this.props.user.mobile,
      token:this.props.user.token,
      valid_date:date,
      type:type,
      room:room,
      bath:bath,
      image:image.length > 0 ? JSON.stringify(image) : JSON.stringify(['default.png']),
      location:location,
      address:address,
      square:size,
      details:details,
      cost:cost,
      area:area
    }, (response) => {
      console.log(response);
      if(response.data.success === true){
        this.props.updateUser(this.props.user);
        ToastAndroid.show('House Added', 1000);
        this.props.changePage('myHouse');
      }else{
          ToastAndroid.show(response.data.msg, 1000);
      }
    });
  }

  chkNextable = () => {
    let {houseData, currentSection} = this.state;
    if(currentSection === 'selectArea'){
      if(houseData.area){
        return {'yes':true,position:width,section:'addLocation'};
      }else{
        return {'yes':false,msg:'Please Select a Area'};
      }
    }else if(currentSection === 'addLocation'){
      if(houseData.location){
        return {'yes':true,position:width*2,section:'selectType'};
      }else{
        return {'yes':false,msg:'Please Select Tolet Type'};
      }
    }else if(currentSection === 'selectType'){
      if(houseData.type){
        return {'yes':true,position:width*3,section:'addImage'};
      }else{
        return {'yes':false,msg:'Please Set Your'};
      }
    }else if(currentSection === 'addImage'){
        return {'yes':true,position:width*4,section:'addDetails'};
    }else if(currentSection === 'addDetails'){
      if(houseData.date && houseData.size && houseData.room && houseData.bath && houseData.cost && houseData.address){
        return {'yes':true};
      }else{
        return {'yes':false,msg:'Fill Empty'};
      }
    }else{
      return {'yes':false};
    }
  }

  ForwardCurrentSection = () => {
    var nextable =  this.chkNextable();
    if(this.state.currentSection === 'addDetails' && nextable.yes){
      this.addHouse();
    }else if(nextable.yes){
      this.changeAddHouseScroll(nextable.section, nextable.position);
    }else{
      ToastAndroid.show(nextable.msg, 2000);
    }
  }

  backwardCurrentSection = () => {
    if(this.state.currentSection === 'addLocation'){
      this.changeAddHouseScroll('selectArea', 0);
    }
  }

  changeAddHouseScroll = (tab, position) =>{
    this.setState({currentSection:tab});
    this.addHouseScroll.scrollTo({x: position, y: 0, animated: true});
  }

  handleTextChange = (text) => {
    this.cngHouseData('cost', text) 
  }
  

  render() {

    let {currentSection} = this.state;

    var nextable = this.chkNextable();

    console.log(this.state.houseData)
    
    return (
      <View>
        <View style={[styles.header]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => this.props.changePage('myHouse')}>
            <Icon name='chevron-left' color='#000' size={22} />
          </TouchableOpacity>
          <Text style={{color:'#000', fontSize:16, fontWeight:'bold'}}>{this.props.updateHouse ? "UPDATE" :"ADD"} YOUR HOUSE</Text>
        </View>
        <View style={styles.headerProgress}>

          <View style={[styles.hr,]}></View>

          <View style={[styles.shadow,styles.proIcon,currentSection === 'selectArea' ? styles.activeproIcon : {}]}>
            <Icon color={currentSection === 'selectArea' ? '#fff' : '#a3176e'} name='map' />
          </View>

          <View style={[styles.shadow,styles.proIcon,currentSection === 'addLocation' ? styles.activeproIcon : {}]}>
            <Icon color={currentSection === 'addLocation' ? '#fff' : '#a3176e'} name='map-marker' />
          </View>

          <View style={[styles.shadow,styles.proIcon,currentSection === 'selectType' ? styles.activeproIcon : {}]}>
            <Icon color={currentSection === 'selectType' ? '#fff' : '#a3176e'} name='info' />
          </View>

          <View style={[styles.shadow,styles.proIcon,currentSection === 'addImage' ? styles.activeproIcon : {}]}>
            <Icon color={currentSection === 'addImage' ? '#fff' : '#a3176e'} name='image' />
          </View>

          <View style={[styles.shadow,styles.proIcon,currentSection === 'addDetails' ? styles.activeproIcon : {}]}>
            <Icon color={currentSection === 'addDetails' ? '#fff' : '#a3176e'} name='edit' />
          </View>

        </View>
        
        <ScrollView 
          horizontal={true}
          scrollEnabled={false}
          ref={(c) => { this.addHouseScroll = c }} 
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}
          style={{height:height-170, width:width, flexDirection:'row'}}>

          <View style={styles.singlenav}>
            <Text style={styles.p}>Select House Area</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Search Area"
                onChangeText={(search) => this.setState({search})} 
                onSubmitEditing={() => {
                    this.search();
                }}
                returnKeyType='done'
                selectTextOnFocus={true}
                autoCapitalize="none"
                blurOnSubmit={true}
            />
            <FlatList
              extraData={this.state.watchChange}
              style={{width:width}}
              data={Area}
              initialNumToRender={2}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => 
                  <TouchableOpacity onPress={() => this.cngHouseData('area',item)} style={[styles.selectItem,{ backgroundColor:this.state.houseData.area === item ? '#a3176e':'#fff'}]}>
                    <Text style={{fontSize:14,fontWeight:'600', color:this.state.houseData.area === item ? '#fff':'#000'}}>{item}</Text>
                    <Icon name='check' size={14} color="#eee" />
                  </TouchableOpacity>
              }
            />                        
          </View>

          <View style={{ width:width, height:height-170}}>
            <Text style={{marginVertical:10, textAlign:'center', fontSize:14, color:theme().clr}}>Press and hold on your location</Text>
            <WebView
              onNavigationStateChange={(map) => this.cngCurrentMap(map)}
              source={{uri: 'https://www.google.com/maps/@23.7449219,90.3896284,15z'}}
            />
          </View>

          <View style={styles.singlenav}>
            <Text style={styles.p}>Select House Type</Text>
            <View style={{width:width}}>
                <TouchableOpacity onPress={() => this.cngHouseData('type','Single-Room-Rent')} style={  [styles.selectItem,{ backgroundColor:this.state.houseData.type === 'Single-Room-Rent' ? '#a3176e':'#fff'}]}>
                  <Text style={{fontSize:14,fontWeight:'600', color:this.state.houseData.type === 'Single-Room-Rent' ? '#fff':'#000'}}>Single Room Rent</Text>
                  <Icon name='check' size={14} color="#eee" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.cngHouseData('type','Flat-Rent')} style={  [styles.selectItem,{ backgroundColor:this.state.houseData.type === 'Flat-Rent' ? '#a3176e':'#fff'}]}>
                  <Text style={{fontSize:14,fontWeight:'600', color:this.state.houseData.type === 'Flat-Rent' ? '#fff':'#000'}}>Flat Rent</Text>
                  <Icon name='check' size={14} color="#eee" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.cngHouseData('type','Sub-Late')} style={  [styles.selectItem,{ backgroundColor:this.state.houseData.type === 'Sub-Late' ? '#a3176e':'#fff'}]}>
                  <Text style={{fontSize:14,fontWeight:'600', color:this.state.houseData.type === 'Sub-Late' ? '#fff':'#000'}}>Sub-Let</Text>
                  <Icon name='check' size={14} color="#eee" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.cngHouseData('type','Room-Mate')} style={  [styles.selectItem,{ backgroundColor:this.state.houseData.type === 'Room-Mate' ? '#a3176e':'#fff'}]}>
                  <Text style={{fontSize:14,fontWeight:'600', color:this.state.houseData.type === 'Room-Mate' ? '#fff':'#000'}}>Room Mate</Text>
                  <Icon name='check' size={14} color="#eee" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.cngHouseData('type','Office-Space')} style={  [styles.selectItem,{ backgroundColor:this.state.houseData.type === 'Office-Space' ? '#a3176e':'#fff'}]}>
                  <Text style={{fontSize:14,fontWeight:'600', color:this.state.houseData.type === 'Office-Space' ? '#fff':'#000'}}>Office Space</Text>
                  <Icon name='check' size={14} color="#eee" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.cngHouseData('type','Flat-Sale')} style={  [styles.selectItem,{ backgroundColor:this.state.houseData.type === 'Flat-Sale' ? '#a3176e':'#fff'}]}>
                  <Text style={{fontSize:14,fontWeight:'600', color:this.state.houseData.type === 'Flat-Sale' ? '#fff':'#000'}}>Flat Sale</Text>
                  <Icon name='check' size={14} color="#eee" />
                </TouchableOpacity>
            </View>                        
          </View>
          
          <View style={styles.singlenav}>
             
             <TouchableOpacity style={[{marginTop:10, marginBottom:10,height:40, width:120, alignItems:'center', justifyContent:'center',borderRadius:20, backgroundColor:'#fff' } , styles.shadow]} onPress={() => this.selectPhoto()}>
              <Text style={styles.p}><Icon name='plus' size={12} color="#a3176e" /> Add Image</Text>
             </TouchableOpacity>
             <FlatList
              extraData={this.state.watchChange}
              style={{width:width}}
              data={this.state.houseData.image}
              initialNumToRender={2}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => 
                <View style={{width:width*.9,marginTop:10, alignSelf:'center', borderRadius:10, overflow:'hidden'}}>
                  <Image style={{width:'100%', height:250}} source={{uri:baseurl()+'/img/'+item}} />
                  <TouchableOpacity style={{position:'absolute', top:15, right:15}} onPress={() => this.removeImage(index)}>
                    <Icon name="trash-o" size={24} color='#a3176e' />
                  </TouchableOpacity>
                </View>
              }
            />    
          </View>

          <View style={styles.singlenav}>
              <ScrollView style={{width:width*.8}}
                ref={(c) => { this.detailsScroll = c }}>

                <Text style={styles.p}>Add House Detalis</Text>

                <View style={{height:40, flexDirection:'row',alignItems:'center', justifyContent:"space-between"}}>
                  <Text style={styles.p}>Avabilable From</Text>
                  <DatePicker
                      date={this.state.houseData.date}
                      mode="date"
                      placeholder="select date"
                      format="YYYY/M/D"
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      onDateChange={(date) => this.cngHouseData('date', date)}
                  />                
                </View>

                <FloatingLabelInput
                  selectTextOnFocus={true}
                  returnKeyType='next'
                  blurOnSubmit={false}
                  keyboardType='numeric'
                  label="House or Flat Size (sq)"
                  value={this.state.houseData.size}
                  onChangeText={(size) => this.cngHouseData('size', size)}
                  ref={ input => {
                    this.inputs['size'] = input;
                  }}
                  onSubmitEditing={() => {
                      this.focusNextField('room', 106);
                  }}
                />

                <FloatingLabelInput
                  selectTextOnFocus={true}
                  returnKeyType='next'
                  blurOnSubmit={false}
                  keyboardType='numeric'
                  label="Number of Room"
                  value={this.state.houseData.room}
                  onChangeText={(room) => this.cngHouseData('room', room)}
                  ref={ input => {
                    this.inputs['room'] = input;
                  }}
                  onSubmitEditing={() => {
                      this.focusNextField('bath', 152);
                  }}
                />

                <FloatingLabelInput
                  selectTextOnFocus={true}
                  returnKeyType='next'
                  blurOnSubmit={false}
                  keyboardType='numeric'
                  label="Number of Bath/Toilet"
                  value={this.state.houseData.bath}
                  onChangeText={(bath) => this.cngHouseData('bath', bath)}
                  ref={ input => {
                    this.inputs['bath'] = input;
                  }}
                  onSubmitEditing={() => {
                      this.focusNextField('cost', 198);
                  }}
                />

                <FloatingLabelInput
                  selectTextOnFocus={true}
                  returnKeyType='done'
                  blurOnSubmit={false}
                  keyboardType='numeric'
                  label={this.state.houseData.type === 'Flat-Sale' ? 'Selling price (৳)' : 'Rent per Month (৳)'}
                  value={this.state.houseData.cost}
                  onChangeText={(cost) => this.cngHouseData('cost', cost)}
                  ref={ input => {
                    this.inputs['cost'] = input;
                  }}
                  onSubmitEditing={() => {
                      this.inputs['address'].focus();
                      this.scrolldetailsScroll(250);
                  }}
                />

                <Text style={[styles.p, {marginTop:20, marginBottom:0}]}>Full Address</Text>
                <TextInput 
                  multiline
                  style = {{textAlignVertical: "top", borderBottomColor:'#ddd', borderBottomWidth:1}} 
                  underlineColorAndroid='transparent' 
                  onChangeText = {(address) => this.cngHouseData('address',address )} 
                  blurOnSubmit={false} 
                  autoCapitalize="none"
                  returnKeyType={ "next" }
                  ref={ input => {
                    this.inputs['address'] = input;
                  }}
                  onSubmitEditing={() => {
                    this.inputs['details'].focus();
                    this.scrolldetailsScroll(320);
                  }}
	    			     />

                <Text style={[styles.p, {marginTop:20, marginBottom:0}]}>Details</Text>
                <TextInput 
                  multiline
                  style = {{textAlignVertical: "top", borderBottomColor:'#ddd', borderBottomWidth:1}} 
                  underlineColorAndroid='transparent' 
                  onChangeText = {(details) => this.cngHouseData('details',details )} 
                  blurOnSubmit={false} 
                  autoCapitalize="none"
                  returnKeyType={ "done" }
                  ref={ input => {
                    this.inputs['details'] = input;
                  }}
                  onSubmitEditing={() => {
                    alert("done");
                  }}
	    			     />

                <View style={{height:300}}></View>
              </ScrollView>
              
          </View>

        </ScrollView>
        <View style={styles.btmTab}>
          <TouchableOpacity style={styles.navBtn} onPress={() => this.backwardCurrentSection()}>
            <Text style={[styles.navBtnText, {opacity:currentSection === 'selectArea' ? .2 : 1}]}><Icon name='chevron-left' color='#000' sixe={14}  /> BACK</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navBtn, {alignItems:'flex-end'}]} onPress={() => this.ForwardCurrentSection()}>
            <Text style={[styles.navBtnText, {opacity:nextable.yes ? 1 : .2}]}>{this.state.currentSection === 'addImage' && this.state.houseData.image.length === 0 ? 'SKIP' : this.state.currentSection === 'addDetails' ? 'Publish' : 'Next'} <Icon name={this.state.currentSection === 'addDetails' ? 'check' :'chevron-right'} color='#000' sixe={14} /></Text>
          </TouchableOpacity>
        </View>
        {(this.state.Loading) && <Loading />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header:{
    height:50, 
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#fff'
  },
  backBtn:{
    height:50,
    width:width*.2,
    justifyContent:'center',
    alignItems:'center',
    position:'absolute',
    left:0,
    top:0
  },
  headerProgress:{
    width:width*.8,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    alignSelf:'center',
    position:'relative',
    height:50
  },
  proIcon:{
    height:30,
    width:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#fff',
    borderRadius:15,
  },
  activeproIcon:{
    backgroundColor:'#a3176e',
  },
  hr:{
    height:2,
    width:width*.8,
    position:'absolute',
    top:24,
    backgroundColor:'#a3176e',
  },
  singlenav:{
    alignItems:'center',
    width:width
  },
  btmTab:{
    height:50,
    width:width,
    alignItems:'center',
    flexDirection:'row',
    justifyContent:'space-between'
  },
  navBtn:{
    width:width*.5,
    height:50,
    alignItems:'flex-start',
    paddingHorizontal:5,
    justifyContent:'center',
  },
  navBtnText:{
    fontSize:14,
    color:'#000'
  },
  input:{
    height:40,
    width:'90%',
    alignSelf:'center',
    color:'#000',
    backgroundColor:'#fff',
    borderRadius:30,
    fontSize:14,
    fontWeight:'600',
    justifyContent:'center',
    padding:2,
    paddingLeft:20,
    borderColor:'#ddd',
    borderWidth:1
  },
  p:{
    fontSize:14,
    fontWeight:'600',
    color:'#000',
    textAlign:'center',
    marginTop:10,
    marginBottom:10
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
  lowOpacity:{
    opacity:0.3
  },
  highOpacity:{
    opacity:1
  },
  selectItem:{
    width:'90%',
    paddingVertical:8,
    paddingHorizontal:20, 
    justifyContent:'space-between',
    alignSelf:'center', 
    alignItems:'center',
    flexDirection:'row', 
    borderRadius:30,
    borderColor:'#ddd',
    borderWidth:.5,
    marginTop:5
  }
});
