import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,TouchableOpacity, KeyboardAvoidingView , TouchableNativeFeedback, Dimensions, ScrollView, Animated, Easing} from 'react-native';
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
      activeScreen:"Myhouse",
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
  }

  getAllHouseWithMy = (user) => {
    post('/adds/withmyhouse',{
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
    get('/adds', (response) =>{
      console.log(response)
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
    this.anim(this.animateNavActiveIndicator, (position/width)*(width*0.25), 450);
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
    let {width, height} = Dimensions.get('window');
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
            {(this.state.activeScreen == 'Myhouse') &&
              <Myhouse updateUser={this.updateUser} user={this.state.user} Myhouse={this.state.Myhouse} />
            }
            </View>
          <View style={styles.singleNav}>
            {(this.state.activeScreen == 'Loved') &&
              <Loved />
            }
          </View>
          <View style={styles.singleNav}>
            {(this.state.activeScreen == 'Settings') &&
              <Settings signout={this.signout} />
            }
          </View>
        </ScrollView>
        <View style={{height:7, width:width, position:'relative'}}>
          <Animated.View style={{position:'absolute',top:2,left:this.animateNavActiveIndicator, width:width/4}}>
            <View style={{height:3,marginHorizontal:20, backgroundColor:'#000', borderRadius:5}}></View>
          </Animated.View>
        </View>
        <View style={{flexDirection:'row',position:'relative', height:40, alignItems:'center', justifyContent:'space-around', backgroundColor:'#fff'}}>
          <TouchableOpacity style={[styles.navBtn , this.state.activeScreen === "Home" ? styles.activeBtn : {}]} onPress={() => this.changeActiveTab("Home", 0)}>
            <Icon name="home" size={20} color="#000" />
            <Text style={styles.navBtnText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navBtn , this.state.activeScreen === "Myhouse" ? styles.activeBtn : {}]} onPress={() => this.changeActiveTab("Myhouse",width )}>
            <Icon name="map-signs" size={20} color="#000" />
            <Text style={styles.navBtnText}>My House</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navBtn , this.state.activeScreen === "Loved" ? styles.activeBtn : {}]} onPress={() => this.changeActiveTab("Loved", width*2)}>
            <Icon name="heart" size={20} color="#000" />
            <Text style={styles.navBtnText}>Loved</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navBtn , this.state.activeScreen === "Settings" ? styles.activeBtn : {}]} onPress={() => this.changeActiveTab("Settings", width*3)}>
            <Icon name="cogs" size={20} color="#000" />
            <Text style={styles.navBtnText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  navBtn:{
    width:'20%',
    height:40,
    alignItems:'center',
    justifyContent:'center',
  },
  navBtnText:{
    fontSize:11,
    fontWeight:'900',
    color:'#000'
  },
  navScroll:{
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height-50,
  },
  singleNav:{
    width:Dimensions.get('window').width,
    height:'100%'
  },
  activeBtn:{
    borderRadius:20,
    //borderWidth:1,
    borderColor:'#000'
  }
})