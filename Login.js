import React, {Component} from 'react';
import {Platform, StyleSheet,WebView,Animated,Image, Easing,Modal, ImageBackground,Dimensions,Keyboard, TouchableOpacity,Button, ToastAndroid, ScrollView, Text,TextInput, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import SingleRent from './resources/SingleRent';
import { theme } from './lib/theme';
import {post, setLocal, getLocal } from './lib/utilies';


type Props = {};
export default class Login extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            mode : 'In',
            modelVisible:true,
        };
        this.focusNextField = this.focusNextField.bind(this);
        this.inputs = {};
    }

    focusNextField(id) {
        setTimeout(() => {
          this.inputs[id].focus();
        }, 100);
    }

    checkMode(){
        if(this.state.mode === 'In' && this.state.logMobile && this.state.logP){
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
                this.setState({modelVisible:false});
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
                this.setState({modelVisible:false});
                this.props.changePage('myHouse');
            }else{
                ToastAndroid.show(response.data.msg, 3000);
            }
        });
    }

    componentWillMount() {
        this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
        this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
        this.animatedSignup = new Animated.Value(-Dimensions.get('window').width*.7);
        this.animatedSignin = new Animated.Value(-Dimensions.get('window').width*.7);
    }

    componentDidMount(){
        this.showSignIn();
    }

    anim(section, value, time){
        Animated.timing(section, {
            toValue:value,
            duration:time,
            //easing:Easing.bounce
        }).start();
    }

    showSignIn(){
        this.anim(this.animatedSignup, -Dimensions.get('window').width*.7, 300);
        this.anim(this.animatedSignin, 0, 600);
        this.setState({mode:'In'});
    }

    showSignUp(){
        this.anim(this.animatedSignin, -Dimensions.get('window').width*.7, 300);
        this.anim(this.animatedSignup, 0, 600);
        this.setState({mode:'Up'});
    }

    componentWillUnmount() {
        this.keyboardDidShowSub.remove();
        this.keyboardDidHideSub.remove();
    }

    handleKeyboardDidShow = (event) => {

    }

    handleKeyboardDidHide = () => {
        this.Scroll.scrollTo({x: 0, y: 0, animated: true})
    }

  render() {
    let {height,width} = Dimensions.get('window');
    return (
        <ScrollView
        showsVerticalScrollIndicator={false}
          ref={(c) => { this.Scroll = c }}
          scrollEnabled={false}>
        <ImageBackground source={{uri:'https://falgunit.com/tolet/img/1.png'}} style={{width: width, height: height, position:'relative'}}>
            <View style={{position:'absolute', width:width*2,height:width*2,borderRadius:width,backgroundColor:'#fff', top:-width*1.5,left:-width}}>    
            </View>
            <Image style={styles.logo} source={{uri:'https://falgunit.com/tolet/img/logo.png'}} />
            <View style={{position:'absolute', width:width*2,height:width*2,borderRadius:width,backgroundColor:'#fff', bottom:-width*1.5,right:-width}}>
            </View>
            <Animated.View
                style={[{
                    width:width*.7, 
                    height:height*.7,
                    position: 'absolute',
                    top:height*.08,
                    right:this.animatedSignup,
                    borderTopLeftRadius:30,
                    borderBottomLeftRadius:30,
                    overflow:'hidden',
                    alignItems:'center',
                    justifyContent:'center',
                    zIndex:1
                }, styles.shadow]}>
            <ImageBackground 
                source={{uri:'https://falgunit.com/tolet/img/1.png'}} 
                style={{width:'100%', height:'100%', alignItems:'center'}}>                
                <View style={{paddingTop:10, width:'80%',alignItems:'center',justifyContent:'center'}}>
                    <Text style={styles.bigText}>Sign Up</Text>
                    <View style={{width:'100%'}}>
                        <View style={styles.label}>
                            <Text style={styles.labelText}>Name</Text>
                            <Icon name="user" size={16} color="rgba(255,255,255,0.5)" />
                        </View>
                        <TextInput 
                            style={styles.input} 
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
                        />
                    </View>
                    <View style={{width:'100%'}}>
                        <View style={styles.label}>
                            <Text style={styles.labelText}>Mobile Number</Text>
                            <Icon name="phone" size={16} color="rgba(255,255,255,0.5)" />
                        </View>
                        <TextInput 
                            style={styles.input} 
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
                        />
                    </View>
                    <View style={{width:'100%', paddingBottom:10}}>
                        <View style={styles.label}>
                            <Text style={styles.labelText}>Password</Text>
                            <Icon name="lock" size={16} color="rgba(255,255,255,0.5)" />
                        </View>
                        <TextInput 
                            style={styles.input} 
                            onChangeText={(password) => this.setState({password})} 
                            ref={ input => {
                                this.inputs['password'] = input;
                            }}
                            onSubmitEditing={() => {
                                this.checkMode();
                            }}
                            secureTextEntry={true}
                            returnKeyType='next'
                            selectTextOnFocus={true}
                            autoCapitalize="none"
                            blurOnSubmit={false}
                        />
                    </View>
                    <TouchableOpacity onPress={() => this.checkMode()} style={[{backgroundColor:'#fff', height:35, width:100,borderRadius:30,
                    justifyContent:'center',marginTop:15, alignItems:'center'}, styles.shadow]}>
                        <Text style={{color:'#cc76fd'}}>Sign up</Text>
                    </TouchableOpacity>
                </View>                
            </ImageBackground>
            
            </Animated.View>


            <Animated.View
                style={[{
                    width:width*.7, 
                    height:height*.7,
                    position: 'absolute',
                    top:height*.08,
                    right:this.animatedSignin,
                    borderTopLeftRadius:30,
                    borderBottomLeftRadius:30,
                    overflow:'hidden',
                    alignItems:'center',
                    justifyContent:'center',
                    zIndex:1
                }, styles.shadow]}>
            <ImageBackground 
                source={{uri:'https://falgunit.com/tolet/img/1.png'}} 
                style={{width:'100%', height:'100%', alignItems:'center'}}>                
                <View style={{paddingTop:10, width:'80%',alignItems:'center',justifyContent:'center'}}>
                    <Text style={styles.bigText}>Sign In</Text>
                    <View style={{width:'100%'}}>
                        <View style={styles.label}>
                            <Text style={styles.labelText}>Mobile Number</Text>
                            <Icon name="phone" size={16} color="rgba(255,255,255,0.5)" />
                        </View>
                        <TextInput 
                            style={styles.input} 
                            onChangeText={(logMobile) => this.setState({logMobile})} 
                            ref={ input => {
                                this.inputs['logMobile'] = input;
                            }}
                            onSubmitEditing={() => {
                                this.focusNextField('logPassword');
                            }}
                            returnKeyType='next'
                            selectTextOnFocus={true}
                            autoCapitalize="none"
                            blurOnSubmit={false}
                        />
                    </View>
                    <View style={{width:'100%', paddingBottom:10}}>
                        <View style={styles.label}>
                            <Text style={styles.labelText}>Password</Text>
                            <Icon name="lock" size={16} color="rgba(255,255,255,0.5)" />
                        </View>
                        <TextInput 
                            style={styles.input} 
                            onChangeText={(logPassword) => this.setState({logPassword})} 
                            ref={ input => {
                                this.inputs['logPassword'] = input;
                            }}
                            onSubmitEditing={() => {
                                this.checkMode();
                            }}
                            secureTextEntry={true}
                            returnKeyType='next'
                            selectTextOnFocus={true}
                            autoCapitalize="none"
                            blurOnSubmit={false}
                        />
                    </View>
                    <TouchableOpacity onPress={() => this.checkMode()} style={[{backgroundColor:'#fff', height:35, width:100,borderRadius:30,
                    justifyContent:'center',marginTop:15, alignItems:'center'}, styles.shadow]}>
                        <Text style={{color:'#cc76fd'}}>Sign In</Text>
                    </TouchableOpacity>
                </View>                
            </ImageBackground>
            
            </Animated.View>
            
        </ImageBackground>
            <TouchableOpacity onPress={() => this.showSignIn()} style={[styles.signBtn, styles.shadow, {width:this.state.mode === 'In' ? width*.25:width*.2}]}>
                <Text style={{color:'#fff'}}>
                    Sign In
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.showSignUp()} style={[styles.signBtn,styles.shadow ,{top:'43%', width:this.state.mode === 'Up' ? width*.25:width*.2}]}>
                <Text style={{color:'#fff'}}>
                    Sign Up
                </Text>
            </TouchableOpacity>
        </ScrollView>
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
        elevation: 15,
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
        color:'rgba(255,255,255,0.5)',
        fontSize:34,
        alignItems:'center'
    },
    input:{
        height:40,
        width:'100%',
        alignSelf:'center',
        backgroundColor:'rgba(255,255,255,0.3)',
        color:'rgba(255,255,255,0.6)',
        fontSize:16,
        justifyContent:'center',
        padding:2,
        paddingLeft:10
    },
    label:{
        alignSelf:'center',
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:20,
        marginBottom:5,
        alignItems:'center'
    },
    labelText:{
        fontSize:14,
        color:'rgba(255,255,255,0.5)',
    },
    logo:{
        height:Dimensions.get('window').width*0.2,
        width:Dimensions.get('window').width*0.2,
        position:'absolute',
        top:30,
        left:10
    }
});
