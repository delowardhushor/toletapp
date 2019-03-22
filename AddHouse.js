import React, {Component} from 'react';
import {Platform,Image,FlatList, StyleSheet,WebView,CheckBox, ToastAndroid ,TouchableOpacity,Modal, ImageBackground,AsyncStorage, ScrollView, Dimensions, Text,TextInput, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { theme } from './lib/theme';
import Area from './resources/area.json';
import { getLocal, post } from './lib/utilies';

let {width,height} = Dimensions.get('window');


type Props = {};
export default class AddHouse extends Component<Props> {

  constructor(props) {
      super(props);
      this.state = {
        houseData: {
          area:'',
          images:[],
          type:'rent',
          cost:0,
          room:0,
          bath:0,
          size:0,
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

  focusNextField(id) {
    setTimeout(() => {
      this.inputs[id].focus();
    }, 100);
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

  cngCurrentMap(map){
    if(map.url.indexOf('/place/') !== -1){
      this.setState({currentMap:map.url});
      alert(map.url)
      ToastAndroid.show("Map Added", 1000);
    }
  }

  selectMap(){
    if(this.state.currentMap !== ''){
      this.cngHouseData('location', this.state.currentMap);
      ToastAndroid.show("Map Added", 1000);
    }else{
      ToastAndroid.show("Map is Not Seleted", 1000);
    }
  }

  addHouse(){
    let {type, area, images, location, address, details, cost, size, room, bath } = this.state.houseData;
    post('/adds/store', {
      users_id:2,
      type:type,
      room:room,
      bath:bath,
      image:JSON.stringify(images),
      location:location,
      address:address,
      square:size,
      details:details,
      cost:cost,
      area:area,
    }, (response) => {
      if(response.data.success === true){
          ToastAndroid.show('House Added', 1000);
          this.props.changePage('myHouse');
      }else{
          ToastAndroid.show(response.data.msg, 1000);
      }
    });
  }

  chkNextable = () => {
    if(this.state.currentSection === 'selectArea'){
      if(this.state.houseData.area){
        return {'yes':true,position:width,section:'addLocation'};
      }else{
        return {'yes':false,msg:'Please Select a Area'};
      }
    }
  }

  ForwardCurrentSection = () => {
    if(this.state.currentSection === 'selectArea'){
      if(this.state.houseData.area){
        this.changeAddHouseScroll('addLocation', width);
      }else{
        ToastAndroid.show('Please Select a Area', 1000);
      }
    }else if(this.state.currentSection === 'selectArea'){
      this.changeAddHouseScroll('addLocation', width);
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

    let {currentSection} = this.state;

    return (
      <View>
        <View style={[styles.header]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => this.props.changePage('myHouse')}>
            <Icon name='chevron-left' color='#000' size={22} />
          </TouchableOpacity>
          <Text style={{color:'#000', fontSize:16, fontWeight:'bold'}}>ADD YOUR HOUSE</Text>
        </View>
        <View style={styles.headerProgress}>

          <View style={[styles.hr,]}></View>

          <View style={[styles.shadow,styles.proIcon,currentSection === 'selectArea' ? styles.activeproIcon : {}]}>
            <Icon color={currentSection === 'selectArea' ? '#fff' : '#a3176e'} name='map' />
          </View>

          <View style={[styles.shadow,styles.proIcon,currentSection === 'addLocation' ? styles.activeproIcon : {}]}>
            <Icon color={currentSection === 'addLocation' ? '#fff' : '#a3176e'} name='map-marker' />
          </View>

          <View style={[styles.shadow,styles.proIcon,currentSection === 'selectArea' ? styles.activeproIcon : {}]}>
            <Icon color={currentSection === 'selectArea' ? '#fff' : '#a3176e'} name='user' />
          </View>

          <View style={[styles.shadow,styles.proIcon,currentSection === 'selectArea' ? styles.activeproIcon : {}]}>
            <Icon color={currentSection === 'selectArea' ? '#fff' : '#a3176e'} name='plus' />
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
                ref={ input => {
                    this.inputs['search'] = input;
                }}
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
                  <TouchableOpacity onPress={() => this.cngHouseData('area',item)} style={{width:'90%',paddingVertical:8,paddingHorizontal:20, justifyContent:'space-between',alignSelf:'center', alignItems:'center',flexDirection:'row', borderRadius:30, backgroundColor:this.state.houseData.area === item ? '#a3176e':'#fff'}}>
                    <Text style={{fontSize:14,fontWeight:'600', color:this.state.houseData.area === item ? '#fff':'#000'}}>{item}</Text>
                    <Icon name='check' size={14} color="#eee" />
                  </TouchableOpacity>
              }
            />                        
          </View>

          <View style={{ width:width, height:height-170}}>
            <Text style={{marginVertical:10, textAlign:'center', fontSize:14, color:theme().clr}}>Please Wait 5-6 seconds After mark showen</Text>
            <WebView
              onNavigationStateChange={(map) => this.cngCurrentMap(map)}
              source={{uri: 'https://www.google.com/maps/@23.7449219,90.3896284,15z'}}
            />
          </View>
          
          <View style={styles.singlenav}>
            <View style={[styles.shadow,{marginTop:20, width:'90%'}]}>
             <Text>sdffsdfsdfsdf</Text>
            </View>
          </View>

        </ScrollView>
        <View style={styles.btmTab}>
          <TouchableOpacity style={styles.navBtn} onPress={() => this.backwardCurrentSection()}>
            <Text style={styles.navBtnText}><Icon name='chevron-left' color='#000' sixe={14}  /> BACK</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navBtn, {alignItems:'flex-end'}]} onPress={() => this.ForwardCurrentSection()}>
            <Text style={styles.navBtnText}>NEXT <Icon name='chevron-right' color='#000' sixe={14} /></Text>
          </TouchableOpacity>
        </View>
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
    //borderWidth:2,
    // borderColor:'#000',
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
    backgroundColor:'#ccc',
  },
  singlenav:{
    alignItems:'center',
    justifyContent:'center',
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
    marginTop:20,
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
    marginTop:10
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
  }
});
