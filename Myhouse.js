import React, {Component} from 'react';
import {Platform, StyleSheet,WebView,ImageBackground, ScrollView, Dimensions, Text,TextInput, View} from 'react-native';
import SingleRent from './resources/SingleRent';
import { theme } from './lib/theme';
import Login from './Login';
import ForgetPass from './ForgetPass';
import ConfirmCode from './ConfirmCode';


type Props = {};
export default class Myhouse extends Component<Props> {

  constructor(props) {
      super(props);
      this.state = {
          page : 'Login'
      };
  }

    // _onNavigationStateChange(webViewState){
    //     console.log(webViewState.url)
    // }

  changePage = (value) =>{
    console.log("sdsdsd");
    this.setState({page:value});
  }
  

  render() {
    return (
        <View>
          {(this.state.page === 'Login') && 
            <Login changePage={this.changePage} />
          }
          {(this.state.page === 'ForgetPass') && 
            <ForgetPass changePage={this.changePage} />
          }
          {(this.state.page === 'ConfirmCode') && 
            <ConfirmCode changePage={this.changePage} />
          }
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
  input:{
    height:30,
    padding:0,
    fontSize:14,
    paddingHorizontal:15,
    borderWidth:1,
    borderRadius:20,
    borderColor:theme().backClr,
    width:'90%'
  },
});
