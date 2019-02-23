import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableNativeFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createBottomTabNavigator } from 'react-navigation';
import Home from './Home';
import Settings from './Settings';
import Loved from './Loved';
import Myhouse from './Myhouse';
import {theme} from './lib/theme';

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
    resetLocal('user');
    //createBottomTabNavigator.navigate("Home")
    //console.log(createBottomTabNavigator.navigator)
  }

  chkClr(screen){
    if(this.state.activeScreen === screen){
      return "#4ebd65";
    }else{
      return "#000";
    }
  }

  render() {
    const BottomTab = createBottomTabNavigator(
      {
        Home: props => <Home houses={this.state.houses} />,
        Myhouse: props => <Myhouse myhouse={this.state.myhouse} />, 
        Loved: props => <Loved />,
        Settings: props => <Settings signout={this.signout} />,
      },
      {
        navigationOptions: ({ navigation }) => ({
          tabBarIcon: ({ focused, tintColor }) => {
            const { routeName } = navigation.state;
            let iconName;
            if (routeName === 'Home') {
              iconName = 'home';
            }if (routeName === 'Myhouse') {
              iconName = 'map-signs';
            } else if (routeName === 'Settings') {
              iconName = 'cog';
            }else if (routeName === 'Loved') {
              iconName = 'heart';
            }
            return <Icon name={iconName} size={20} color={tintColor} />;
          },
        }),
        tabBarOptions: {
          activeTintColor: theme().backClr,
          inactiveTintColor: theme().clr,
        },
      }
    );
    console.log(this)
    return (
      <View style={{flex:1}}>
        <View style={styles.bottomNav}>
          <TouchableNativeFeedback
              onPress={this._onPressButton}
              background={TouchableNativeFeedback.SelectableBackground()}>
            <View style={styles.btnETxWrapper}>
              <Icon name="home" size={22} color={this.state.activeScreen == "Home" ? '#4ebd65' : '#000'} />
              <Text style={[styles.btnText, {color:this.state.activeScreen == "Home" ? '#4ebd65' : '#000'}]}>Home</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
              onPress={this._onPressButton}
              background={TouchableNativeFeedback.SelectableBackground()}>
            <View style={styles.btnETxWrapper}>
              <Icon name="map-signs" size={22} color={() => this.chkClr('Home')} />
              <Text style={styles.btnText}>Home</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
              onPress={this._onPressButton}
              background={TouchableNativeFeedback.SelectableBackground()}>
            <View style={styles.btnETxWrapper}>
              <Icon name="heart" size={22} color={() => this.chkClr('Home')} />
              <Text style={styles.btnText}>Home</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
              onPress={this._onPressButton}
              background={TouchableNativeFeedback.SelectableBackground()}>
            <View style={styles.btnETxWrapper}>
              <Icon name="cog" size={22} color={() => this.chkClr('Home')} />
              <Text style={styles.btnText}>Home</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
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