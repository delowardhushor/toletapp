import React, {Component} from 'react';
import {Platform, StyleSheet,WebView,ImageBackground,Dimensions,TouchableOpacity,Button, ToastAndroid, ScrollView, Text,TextInput, View} from 'react-native';
import SingleRent from './resources/SingleRent';
import { theme } from './lib/theme';
import {post, setLocal, getLocal } from './lib/utilies';


type Props = {};
export default class Login extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            mode : 'In'
        };
        this.focusNextField = this.focusNextField.bind(this);
        this.inputs = {};
    }

    focusNextField(id) {
        setTimeout(() => {
          this.inputs[id].focus();
        }, 100);
    }

    changeMode(){
        if(this.state.mode === 'Up'){
            this.setState({mode:'In'});
            this.focusNextField('mobile');
        }else{
            this.setState({mode:'Up'});
            this.focusNextField('name');
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
            console.log(response)
            if(response.data.success){
                ToastAndroid.show("Please Confirm Pin", 3000);
                this.props.setPendingUser(this.state.mobile,this.state.password);
                this.props.changePage('ConfirmCode');
            }else{
                ToastAndroid.show(response.data.msg, 3000);
            }
        });
    }

    login(){
        post('/signin', {
            mobile:this.state.mobile, 
            password:this.state.password
        }, (response) => {
            if(response.data.success){
                ToastAndroid.show('Welcome', 1000);
                setLocal('user', response.data.userdata);
                this.props.updateUser(response.data.userdata);
                this.props.changePage('myHouse');
            }else{
                ToastAndroid.show(response.data.msg, 3000);
            }
        });
    }

  render() {
    let {height,width} = Dimensions.get('window');
    return (
        <ImageBackground source={{uri:'https://falgunit.com/tolet/img/1.png'}} style={{width: width, height: height, position:'relative'}}>
            <Text>Inside</Text>
            <ImageBackground 
                source={{uri:'https://falgunit.com/tolet/img/1.png'}} 
                style={[{
                    width:width*.7, 
                    height:height*.7,
                    position: 'absolute',
                    top:height*.1,
                    right:'0%',
                    borderTopLeftRadius:30,
                    borderBottomLeftRadius:30,
                    overflow:'hidden',
                    alignItems:'center',
                    justifyContent:'center',
                    zIndex:1
                }, styles.shadow]}>
                <View style={{position:'relative', height:'100%', width:'100%', alignItems:'center', justifyContent:'center'}}>
                <Text style={styles.bigText}>Sign up</Text>
                <ScrollView style={{paddingBottom:200}}>
                    <Text>Hwllo</Text>
                </ScrollView>
                </View>
            </ImageBackground>
            <TouchableOpacity style={[{backgroundColor:'#fff', height:35, width:100,borderRadius:30,
                justifyContent:'center', alignItems:'center', position:'absolute', right:width*.2, bottom:height*.175, zIndex:2}, styles.shadow]}>
                <Text style={{}}>Signup</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.signBtn, styles.shadow]}>
                <Text style={{color:'#fff'}}>
                    Sign In
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.signBtn,styles.shadow ,{top:'43%'}]}>
                <Text style={{color:'#fff'}}>
                    Sign Up
                </Text>
            </TouchableOpacity>
        </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
    shadow:{
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
    },
    signBtn:{
        height:35,
        width:70,
        backgroundColor:'#cc76fd',
        position:'absolute',
        borderTopRightRadius:30,
        borderBottomRightRadius:30,
        top:'35%',
        left:0,
        justifyContent:'center',
        alignItems:'center'
    },
    bigText:{
        fontWeight:'100',
        color:'#ddd',
        fontSize:34
    }
});
