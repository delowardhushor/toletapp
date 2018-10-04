import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createBottomTabNavigator } from 'react-navigation';
import Home from './Home';
import Settings from './Settings';
import Loved from './Loved';
import Myhouse from './Myhouse';
import {theme} from './lib/theme';

const BottomTab = createBottomTabNavigator(
  {
    Home: Home,
    Myhouse: Myhouse,
    Loved: Loved,
    Settings: Settings,
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

type Props = {};
export default class App extends Component<Props> {
  render() {
    console.log("theme");
    return (
      <BottomTab />
    );
  }
}