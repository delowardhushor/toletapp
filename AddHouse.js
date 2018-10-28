import React, {Component} from 'react';
import {Platform,Image, StyleSheet,WebView,TouchableOpacity,Modal, ImageBackground,AsyncStorage, ScrollView, Dimensions, Text,TextInput, View} from 'react-native';
import SingleRent from './resources/SingleRent';
import Icon from 'react-native-vector-icons/FontAwesome';
import { theme } from './lib/theme';
import Login from './Login';
import ForgetPass from './ForgetPass';
import ConfirmCode from './ConfirmCode';
import { getLocal } from './lib/utilies';



type Props = {};
export default class AddHouse extends Component<Props> {

  constructor(props) {
      super(props);
      this.state = {
          houseData: {
            images:[]
          },
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
      //scrllUpDowm(this.refs._scrollView)

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
    console.log(this.state.houseData);
    return (
              <View style={{alignItems:'center'}}>
                  <TouchableOpacity onPress={() => this.selectPhoto()} style={[styles.singleImage , {width:Dimensions.get('window').width}]}>
                    <Text style={styles.addImageBtn}>Add Image</Text>
                  </TouchableOpacity>
                  <ScrollView horizontal={true} >
                    <View style={{flex:1, alignItems:'center', justifyContent:'center', flexDirection:'row', height:50}}>
                      {images}
                    </View>
                  </ScrollView>
                  <View style={{width:'90%', alignContent:'center', backgroundColor:'#000'}}>
                    <Text>asdasdasd</Text>
                  </View>
                  <TouchableOpacity onPress={() => this.props.changePage('myHouse')} style={[styles.addBtnWrapper, {backgroundColor:theme().clr2}]}>
                    <Text><Icon name='times' size={12} color='#fff' /></Text>
                  </TouchableOpacity>
              </View>
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
  houseHeader:{
    height: 50,
    alignItems:'center',
    justifyContent:'center'
  },
  headerText:{
    color:theme().clr,
    fontSize:14
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
  fullWidth:{
    width:'100%',
  }
});
