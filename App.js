import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,TouchableOpacity, KeyboardAvoidingView , TouchableNativeFeedback, Dimensions, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createBottomTabNavigator } from 'react-navigation';
import Home from './Home';
import Settings from './Settings';
import Loved from './Loved';
import Myhouse from './Myhouse';
import {theme} from './lib/theme';
import BottomNavigation, { FullTab ,Badge,ShiftingTab} from 'react-native-material-bottom-navigation';

import {post, setLocal, getLocal, get, resetLocal } from './lib/utilies';




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
      this.getAllHouse(user);
    }else{
      this.getAllHouse();
    }
  }

  updateUser = (user) => {
    this.setState({user:user});
  }

  getAllHouseWithMy = (user) => {
    post('/all', (response) =>{
      console.log(response)
        if(response.data !== null){
            this.setState({houses:response.data.data});
        }
    })
  }

  getAllHouse = () => {
    get('/adds', (response) =>{
      console.log(response)
        if(response.data !== null){
            this.setState({houses:response.data.data});
        }
    })
  }

  signout = () => {
    this.setState({myhouse:[]});
    this.setState({user:[]});
    this.setState({activeScreen:'Home'});
    resetLocal('user');
  }

  chkClr(screen){
    if(this.state.activeScreen === screen){
      return "#4ebd65";
    }else{
      return "#000";
    }
  }

  cngSrn(srn, srlPosition){
    this.setState({activeScreen:srn});
    this.navigationSrl.scrollTo({x: srlPosition, y: 0, animated: true})
  }

  returnTab = () => {
      return [
        {
          key: 'Home',
          icon: 'home',
          label: "Houses",
          barColor: 'transparent',
          pressColor: 'rgba(0, 0,0, 0.16)'
        },
        {
          key: 'Myhouse',
          icon: 'map-signs',
          label: "My house",
          barColor: 'transparent',
          pressColor: 'rgba(0, 0,0, 0.16)'
        },
        {
          key: 'Loved',
          icon: 'heart',
          label: "Loved",
          barColor: 'transparent',
          pressColor: 'rgba(0, 0,0, 0.16)'
        },
        {
          key: 'Settings',
          icon: 'cog',
          label: "Settings",
          barColor: 'transparent',
          pressColor: 'rgba(0, 0,0, 0.16)'
        }
      ];
  }

  renderIcon = icon => ({ isActive }) => (
    <Icon size={20} color={isActive?"#4ebd65":"#000"} name={icon} />
  )
 
  renderTab = ({ tab, isActive }) => (
    <FullTab
      isActive={isActive}
      key={tab.key}
      label={tab.label}
      labelStyle={{color:isActive?"#4ebd65":"#000", fontSize:10}}
      renderIcon={this.renderIcon(tab.icon)}
    />
  )

  changeActiveTab = (tab, position) =>{
    this.setState({activeScreen:tab});
    this.navScroll.scrollTo({x: position, y: 0, animated: true});
  }

  chkNavPos = (event) => {
    console.log(this.navScroll);
  }



  render() {
    let {width, height} = Dimensions.get('window');
    return (
      <View  style={{ flex: 1 , backgroundColor:'#fff'}}>
        {/* <ScrollView horizontal={true} style={{ height:Dimensions.get('window').height - 50 }}>
          {(this.state.activeScreen === 'Home') && 
            <Home houses={this.state.houses}  />
          }
          {(this.state.activeScreen === 'Myhouse') && 
            <Myhouse updateUser={this.updateUser} user={this.state.user} houses={this.state.houses}  />
          }
          {(this.state.activeScreen === 'Loved') && 
            <Loved houses={this.state.houses}  />
          }
          {(this.state.activeScreen === 'Settings') && 
            <Settings houses={this.state.houses} signout={this.signout} />
          }
        </ScrollView> */}
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
            <Myhouse updateUser={this.updateUser} user={this.state.user} houses={this.state.houses} />
          </View>
          <View style={styles.singleNav}>
            <Loved />
          </View>
          <View style={styles.singleNav}>
            <Settings />
          </View>
        </ScrollView>
        {/* <BottomNavigation
          onTabPress={newTab => this.changeActiveTab(newTab.key)}
          renderTab={this.renderTab}
          tabs={this.returnTab()}

        /> */}
        <View style={{flexDirection:'row', height:50, alignItems:'center', justifyContent:'center', backgroundColor:'#fff'}}>
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
    width:'24%',
    height:45,
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
    borderWidth:1,
    borderColor:'#000'
  }
})