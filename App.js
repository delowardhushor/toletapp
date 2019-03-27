import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,TouchableOpacity, KeyboardAvoidingView ,TouchableWithoutFeedback, Dimensions, ScrollView, Animated, Easing} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createBottomTabNavigator } from 'react-navigation';
import Home from './Home';
import Settings from './Settings';
import Loved from './Loved';
import Myhouse from './Myhouse';
import {theme} from './lib/theme';
import BottomNavigation, { FullTab ,Badge,ShiftingTab} from 'react-native-material-bottom-navigation';

import {post, setLocal, getLocal, get, resetLocal } from './lib/utilies';


let {width,height} = Dimensions.get('window');

type Props = {};
export default class App extends Component<Props> {

  constructor(props){
    super(props);
    this.state = {
      activeScreen:"Home",
      houses:[],
      user:[],
      myhouse:[],
    };
  }

  async componentWillMount(){
    var user = await getLocal('user');
    if(user != null){
      this.setState({user:user});
      this.getAllHouseWithMy(user);
    }else{
      this.getAllHouse();
    }
    this.animateNavActiveIndicator = new Animated.Value(0);
  }
  
  componentDidMount(){
    
  }

  updateUser = (user) => {
    this.setState({user:user});
    this.getAllHouseWithMy(user);
  }

  getAllHouseWithMy = (user) => {
    post('/public/api/adds/withmyhouse',{
      mobile:user.mobile,
      token:user.token
    }, (response) => {
      console.log(response)
        if(response.data.success){
            this.setState({houses:response.data.Adds});
            this.setState({Myhouse:response.data.Myhouse});
        }
    })
  }

  getAllHouse = () => {
    get('/public/api/adds', (response) =>{
        if(response.data.success){
            this.setState({houses:response.data.Adds});
        }
    })
  }

  signout = () => {
    this.setState({myhouse:[]});
    this.setState({user:[]});
    this.changeActiveTab('Home', 0);
    resetLocal('user');
  }

  changeActiveTab = (tab, position) =>{
    this.setState({activeScreen:tab});
    this.navScroll.scrollTo({x: position, y: 0, animated: true});
    this.anim(this.animateNavActiveIndicator, (position/width)*(width*0.25), 200);
  }

  chkNavPos = (event) => {
    console.log(this.navScroll);
  }

  anim(section, value, time){
      Animated.timing(section, {
          toValue:value,
          duration:time,
      }).start();
  }



  render() {
    let {activeScreen} = this.state;
    return (
      <View  style={{ flex: 1 , backgroundColor:'#fff'}}>
        <ScrollView 
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          ref={(c) => { this.navScroll = c }} 
          style={styles.navScroll} 
          horizontal={true}>
          <View style={styles.singleNav}>
              <Home houses={this.state.houses} />
          </View>
          <View style={styles.singleNav}>
            {(activeScreen == 'Myhouse') &&
              <Myhouse changeActiveTab={this.changeActiveTab} updateUser={this.updateUser} user={this.state.user} Myhouse={this.state.Myhouse} />
            }
            </View>
          <View style={styles.singleNav}>
            {(activeScreen == 'Loved') &&
              <Loved />
            }
          </View>
          <View style={styles.singleNav}>
            {(activeScreen == 'Settings') &&
              <Settings signout={this.signout} />
            }
          </View>
        </ScrollView>
        <View style={{flexDirection:'row',position:'relative', height:50, alignItems:'center', justifyContent:'space-around', backgroundColor:'#fff'}}>
          <TouchableWithoutFeedback style={[styles.navBtn , activeScreen === "Home" ? styles.activeBtn : {}]} onPress={() => this.changeActiveTab("Home", 0)}>
            <View style={{alignItems:'center', width:width/4}}>
              <Icon name="home" size={20} color={activeScreen === 'Home' ? "#a3176e" : "#000"} />
              <Text style={[styles.navBtnText, {color:activeScreen === 'Home' ? "#a3176e" : "#000"}]}>Home</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback style={[styles.navBtn , activeScreen === "Myhouse" ? styles.activeBtn : {}]} onPress={() => this.changeActiveTab("Myhouse",width )}>
            <View style={{alignItems:'center', width:width/4}}>
              <Icon name="map-signs" size={20} color={activeScreen === 'Myhouse' ? "#a3176e" : "#000"} />
              <Text style={[styles.navBtnText, {color:activeScreen === 'Myhouse' ? "#a3176e" : "#000"}]}>My House</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback style={[styles.navBtn , activeScreen === "Loved" ? styles.activeBtn : {}]} onPress={() => this.changeActiveTab("Loved", width*2)}>
            <View style={{alignItems:'center', width:width/4}}>
              <Icon name="heart" size={20} color={activeScreen === 'Loved' ? "#a3176e" : "#000"} />
              <Text style={[styles.navBtnText, {color:activeScreen === 'Loved' ? "#a3176e" : "#000"}]}>Loved</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback style={[styles.navBtn , activeScreen === "Settings" ? styles.activeBtn : {}]} onPress={() => this.changeActiveTab("Settings", width*3)}>
            <View style={{alignItems:'center', width:width/4}}>
              <Icon name="cogs" size={20} color={activeScreen === 'Settings' ? "#a3176e" : "#000"} />
              <Text style={[styles.navBtnText, {color:activeScreen === 'Settings' ? "#a3176e" : "#000"}]}>Settings</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  navBtn:{
    width:width/4,
    height:50,
    alignItems:'center',
    justifyContent:'center',
  },
  navBtnText:{
    fontSize:11,
    fontWeight:'900',
    color:'#000'
  },
  navScroll:{
    width:width,
    height:height-50,
  },
  singleNav:{
    width:width,
    height:'100%'
  },
  activeBtn:{
    borderRadius:20,
    //borderWidth:1,
    borderColor:'#000'
  }
})