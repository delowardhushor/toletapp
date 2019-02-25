import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableNativeFeedback, Dimensions, ScrollView} from 'react-native';
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
          barColor: '#fff',
          pressColor: 'rgba(0, 0,0, 0.16)'
        },
        {
          key: 'Myhouse',
          icon: 'map-signs',
          label: "My house",
          barColor: '#fff',
          pressColor: 'rgba(0, 0,0, 0.16)'
        },
        {
          key: 'Loved',
          icon: 'heart',
          label: "Loved",
          barColor: '#fff',
          pressColor: 'rgba(0, 0,0, 0.16)'
        },
        {
          key: 'Settings',
          icon: 'cog',
          label: "Settings",
          barColor: '#fff',
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

  changeActiveTab(tab){
    this.setState({activeScreen:tab});
  }



  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {(this.state.activeScreen === 'Home') && <Home houses={this.state.houses}  />}
          {(this.state.activeScreen === 'Myhouse') && <Myhouse houses={this.state.houses}  />}
          {(this.state.activeScreen === 'Loved') && <Loved houses={this.state.houses}  />}
          {(this.state.activeScreen === 'Settings') && <Settings houses={this.state.houses} />}
        </View>
        <BottomNavigation
          onTabPress={newTab => this.changeActiveTab(newTab.key)}
          renderTab={this.renderTab}
          tabs={this.returnTab()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bottomNav: {
    height:50,
    width:'100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    position:'absolute',
    bottom:0,
    flexDirection:'row'
  },
  btnETxWrapper:{
    width: '25%', 
    height: 50, 
    backgroundColor: '#fff', 
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center'
  },
  btnText:{
    fontSize:12
  }
})