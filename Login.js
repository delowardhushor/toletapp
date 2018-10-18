import React, {Component} from 'react';
import {Platform, StyleSheet,WebView,ImageBackground,TouchableOpacity,Button, ToastAndroid, ScrollView, Dimensions, Text,TextInput, View} from 'react-native';
import SingleRent from './resources/SingleRent';
import { theme } from './lib/theme';
import {post } from './lib/utilies';


type Props = {};
export default class Login extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            mode : 'In'
        };
    }

    changeMode(){
        if(this.state.mode === 'Up'){
            this.setState({mode:'In'});
        }else{
            this.setState({mode:'Up'});
        }
    }

    checkMode(){
        if(this.state.mode === 'In' && this.state.mobile && this.state.password){
            this.login();
        }else if(this.state.mode === 'Up' && this.state.mobile && this.state.password && this.state.name){
            this.signUp();
        }else{
            ToastAndroid.show("Fill Empty", 1000);
        }
    }

    signUp(){
        post('/signup', {
            name:this.state.name, 
            mobile:this.state.mobile, 
            password:this.state.password
        }, (response) => {
            if(response.data.success === true){
                ToastAndroid.show("Welcome To Tolet", 1000);
            }else{
                ToastAndroid.show(response.data.msg, 1000);
            }
        });
    }

    login(){

    }

  render() {
    return (
        <View style={styles.back}>
          <View>
            <Text style={styles.text}>Please Sign In for This Feature</Text>
          </View>
          
          <View style={styles.container}>
            {(this.state.mode == 'Up') &&
            <TextInput 
                style={styles.input} 
                value={this.state.name}
                placeholderTextColor = '#ddd'
                placeholder='Your Name'
                onChangeText={(name) => this.setState({name})} 
            />
            }
            <TextInput 
                style={styles.input} 
                placeholderTextColor = '#ddd'
                placeholder='Mobile' 
                onChangeText={(mobile) => this.setState({mobile})} 
            />
            <TextInput 
                style={styles.input} 
                placeholderTextColor = '#ddd'
                placeholder='Password' 
                onChangeText={(password) => this.setState({password})} 
            />
          </View>
          <TouchableOpacity onPress={() => this.checkMode()} style={styles.fillButton}>
            <Text style={[styles.text, {color:'#fff'}]}>Sign {this.state.mode}</Text>
          </TouchableOpacity>
          {(this.state.mode === 'In') &&
          <TouchableOpacity onPress={() => this.props.changePage('ForgetPass')} >
            <Text style={[styles.text, {color:'#fff'}]}>Forget Password?</Text>
          </TouchableOpacity>
          }
          <TouchableOpacity onPress={() => this.changeMode()} style={styles.strokButton}>
            <Text style={styles.text}>{this.state.mode === 'In' ? "Don't" : ''} Have a Account?</Text>
          </TouchableOpacity>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        alignSelf:'center',
        width:'90%'
    },
    back:{
        backgroundColor:theme().clr,
        height:'100%',
        flexDirection:'column',
        justifyContent:'space-around',
        alignItems:'center'
    },
    input:{
        borderBottomWidth:1,
        borderBottomColor:theme().backClr,
        textAlign:'center',
        color:theme().backClr
    },
    text:{
        fontSize:12,
        fontWeight:'200',
        color:theme().backClr
    },
    fillButton:{
        width:'60%',
        alignItems:'center',
        paddingVertical:10,
        backgroundColor:theme().backClr,
        borderRadius:20,
    },
    strokButton:{
        width:'60%',
        alignItems:'center',
        paddingVertical:10,
        borderWidth:1,
        borderColor:theme().backClr,
        borderRadius:20,
    }
});
