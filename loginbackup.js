import React, {Component} from 'react';
import {Platform, StyleSheet,WebView,ImageBackground,TouchableOpacity,Button, ToastAndroid, ScrollView, Dimensions, Text,TextInput, View} from 'react-native';
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
                ref={ input => {
                    this.inputs['name'] = input;
                }}
                onSubmitEditing={() => {
                    this.focusNextField('mobile');
                }}
                returnKeyType='next'
                selectTextOnFocus={true}
                autoCapitalize="none"
                blurOnSubmit={false}
                autoFocus={this.state.mode === 'Up' ? true:false}
            />
            }
            <TextInput 
                style={styles.input} 
                placeholderTextColor = '#ddd'
                placeholder='Mobile' 
                onChangeText={(mobile) => this.setState({mobile})} 
                ref={ input => {
                    this.inputs['mobile'] = input;
                }}
                onSubmitEditing={() => {
                    this.focusNextField('password');
                }}
                returnKeyType='next'
                selectTextOnFocus={true}
                autoCapitalize="none"
                blurOnSubmit={false}
                autoFocus={this.state.mode === 'In' ? true:false}
            />
            <TextInput 
                style={styles.input} 
                placeholderTextColor = '#ddd'
                placeholder='Password' 
                onChangeText={(password) => this.setState({password})} 
                ref={ input => {
                    this.inputs['password'] = input;
                }}
                onSubmitEditing={() => {
                    this.checkMode();
                }}
                returnKeyType='done'
                selectTextOnFocus={true}
                autoCapitalize="none"
                blurOnSubmit={true}
                secureTextEntry={true}
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
