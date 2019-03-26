import React, {Component} from 'react';
import {Platform, StyleSheet,WebView,Animated,Image, Easing,Modal, ImageBackground,Dimensions,Keyboard, TouchableOpacity,Button, ToastAndroid, ScrollView, Text,TextInput, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loading from './resources/Loading';
import SingleRent from './resources/SingleRent';
import { theme } from './lib/theme';
import {post, setLocal, getLocal, baseurl } from './lib/utilies';


type Props = {};
export default class Login extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            mode : 'In',
            showPin : false,
            showForget : false,
            scrollEnable : false,

            Loading:false
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
        if(this.state.mode === 'In' && this.state.logMobile && this.state.logPassword){
            this.login();
        }else if(this.state.mode === 'Up' && this.state.mobile && this.state.password && this.state.name){
            this.signUp();
        }else{
            ToastAndroid.show("Fill Empty", 1000);
        }
    }

    signUp(){
        post('/public/api/signup', {
            name:this.state.name, 
            mobile:this.state.mobile, 
            password:this.state.password
        }, (response) => {
            console.log(response)
            if(response.data.success){
                ToastAndroid.show("Please Confirm Pin", 3000);
                this.setState({showPin:true});
            }else{
                ToastAndroid.show(response.data.msg, 3000);
            }
        });
    }

    confirmPin = (pin) => {
        post('/public/api/verify', {
            mobile:this.state.mobile, 
            password:this.state.password,
            pin:this.state.pin,
        }, (response) => {
            if(response.data.success){
                ToastAndroid.show("Welcome to The World Of Home", 3000);
                setLocal('user', response.data.userdata);
                this.props.updateUser(response.data.userdata);
                this.props.changePage('myHouse');
            }else{
                ToastAndroid.show(response.data.msg, 3000);
            }
        });
      }

    sendCngPassPin(){
        post('/public/api/setpin', {
            mobile:this.state.forgetMobile, 
        }, (response) => {
            console.log(response)
            if(response.data.success){
                ToastAndroid.show("Please Confirm Pin", 3000);
                this.setState({showPin:true});
            }else{
                ToastAndroid.show(response.data.msg, 3000);
            }
        });
    }

    cngPass(){
        post('/public/api/cngpass', {
            mobile:this.state.forgetMobile, 
            pin:this.state.forgetPin, 
            password:this.state.forgetPass, 
        }, (response) => {
            console.log(response)
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

    login(){
        post('/public/api/signin', {
            mobile:this.state.logMobile, 
            password:this.state.logPassword
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
        this.setState({showForget:false});
        this.setState({showPin:false});
        this.setState({mode:'In'});
    }

    showSignUp(){
        this.anim(this.animatedSignin, -Dimensions.get('window').width*.7, 300);
        this.anim(this.animatedSignup, 0, 600);
        this.setState({showForget:false});
        this.setState({showPin:false});
        this.setState({mode:'Up'});
    }

    componentWillUnmount() {
        this.keyboardDidShowSub.remove();
        this.keyboardDidHideSub.remove();
    }

    handleKeyboardDidShow = (event) => {
        this.setState({scrollEnable:true});
    }

    handleKeyboardDidHide = () => {
        this.Scroll.scrollTo({x: 0, y: 0, animated: true});
        this.setState({scrollEnable:false});
    }

  render() {
    let {height,width} = Dimensions.get('window');
    return (
        <ScrollView
        showsVerticalScrollIndicator={false}
          ref={(c) => { this.Scroll = c }}
          scrollEnabled={this.state.scrollEnable}>
        <ImageBackground source={{uri:baseurl()+'/img/1.png'}} style={{width: width, height: height, position:'relative'}}>
            <View style={{position:'absolute', width:width*2,height:width*2,borderRadius:width,backgroundColor:'#fff', top:-width*1.5,left:-width}}>    
            </View>
            <Image style={styles.logo} source={{uri:baseurl()+'/img/tolet.png'}} />
            <View style={styles.logoTextWrapper}>
                <Text style={styles.logoText}>TOLET</Text>
            </View>
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
                    {(!this.state.showPin) &&              
                        <View style={{paddingTop:10, width:'80%',alignItems:'center',justifyContent:'center'}}>
                            <Text style={styles.bigText}>SIGN UP</Text>
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
                                <Text style={{color:'#cc76fd'}}>Sign Up</Text>
                            </TouchableOpacity>
                        </View> 
                    }
                    {(this.state.showPin) &&
                        <View style={{paddingTop:10, width:'80%',alignItems:'center',justifyContent:'center'}}>
                            <Text style={styles.bigText}>Verification Pin</Text>
                            <View style={{width:'100%', paddingBottom:10}}>
                                <View style={styles.label}>
                                    <Text style={styles.labelText}>Pin</Text>
                                    <Icon name="lock" size={16} color="rgba(255,255,255,0.5)" />
                                </View>
                                <TextInput 
                                    style={styles.input} 
                                    onChangeText={(pin) => this.setState({pin})} 
                                    ref={ input => {
                                        this.inputs['pin'] = input;
                                    }}
                                    onSubmitEditing={() => {
                                        this.confirmPin();
                                    }}
                                    secureTextEntry={true}
                                    returnKeyType='next'
                                    selectTextOnFocus={true}
                                    autoCapitalize="none"
                                    blurOnSubmit={false}
                                />
                            </View>
                            <TouchableOpacity onPress={() => this.confirmPin()} style={[{backgroundColor:'#fff', height:35, width:100,borderRadius:30,
                            justifyContent:'center',marginTop:25, alignItems:'center'}, styles.shadow]}>
                                <Text style={{color:'#cc76fd'}}>Done</Text>
                            </TouchableOpacity>
                        </View> 
                    }              
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
                source={{uri:baseurl()+'/img/1.png'}} 
                style={{width:'100%', height:'100%', alignItems:'center'}}>  
                {(!this.state.showForget) &&           
                    <View style={{paddingTop:10, width:'80%',alignItems:'center',justifyContent:'center'}}>
                        <Text style={styles.bigText}>SIGN IN</Text>
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
                        <View style={{width:'100%', paddingBottom:10}}>
                            <TouchableOpacity onPress={() => this.setState({showForget:true})} style={[styles.label, {height:40,marginTop:0, justifyContent:'center', alignItems:'center'}]}>
                                <Text style={styles.labelText}>Forget Password</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => this.checkMode()} style={[{backgroundColor:'#fff', height:35, width:100,borderRadius:30,
                        justifyContent:'center',marginTop:15, alignItems:'center'}, styles.shadow]}>
                            <Text style={{color:'#cc76fd'}}>Sign In</Text>
                        </TouchableOpacity>
                    </View>                
                }
                {(this.state.showForget && !this.state.showPin) &&           
                    <View style={{paddingTop:10, width:'80%',alignItems:'center',justifyContent:'center'}}>
                        <Text style={styles.bigText}>RECOVER PASSWORD</Text>
                        <View style={{width:'100%'}}>
                            <View style={styles.label}>
                                <Text style={styles.labelText}>Mobile Number</Text>
                                <Icon name="phone" size={16} color="rgba(255,255,255,0.5)" />
                            </View>
                            <TextInput 
                                style={styles.input} 
                                onChangeText={(forgetMobile) => this.setState({forgetMobile})} 
                                ref={ input => {
                                    this.inputs['forgetMobile'] = input;
                                }}
                                onSubmitEditing={() => {
                                    this.sendCngPassPin();
                                }}
                                returnKeyType='next'
                                selectTextOnFocus={true}
                                autoCapitalize="none"
                                blurOnSubmit={false}
                            />
                        </View>
                        <TouchableOpacity onPress={() => this.sendCngPassPin()} style={[{backgroundColor:'#fff', height:35, width:100,borderRadius:30,
                        justifyContent:'center',marginTop:15, alignItems:'center'}, styles.shadow]}>
                            <Text style={{color:'#cc76fd'}}>Done</Text>
                        </TouchableOpacity>
                    </View>                
                }

                {(this.state.showForget && this.state.showPin) &&           
                    <View style={{paddingTop:10, width:'80%',alignItems:'center',justifyContent:'center'}}>
                        <Text style={styles.bigText}>CHANGE PASSWORD</Text>
                        <View style={{width:'100%'}}>
                            <View style={styles.label}>
                                <Text style={styles.labelText}>Pin</Text>
                                <Icon name="phone" size={16} color="rgba(255,255,255,0.5)" />
                            </View>
                            <TextInput 
                                style={styles.input} 
                                onChangeText={(forgetPin) => this.setState({forgetPin})} 
                                ref={ input => {
                                    this.inputs['forgetPin'] = input;
                                }}
                                onSubmitEditing={() => {
                                    this.focusNextField('forgetPass');
                                }}
                                returnKeyType='next'
                                selectTextOnFocus={true}
                                autoCapitalize="none"
                                blurOnSubmit={false}
                            />
                        </View>
                        <View style={{width:'100%'}}>
                            <View style={styles.label}>
                                <Text style={styles.labelText}>New Password</Text>
                                <Icon name="lock" size={16} color="rgba(255,255,255,0.5)" />
                            </View>
                            <TextInput 
                                style={styles.input} 
                                onChangeText={(forgetPass) => this.setState({forgetPass})} 
                                ref={ input => {
                                    this.inputs['forgetPass'] = input;
                                }}
                                onSubmitEditing={() => {
                                    this.focusNextField('forgetConPass');
                                }}
                                returnKeyType='next'
                                selectTextOnFocus={true}
                                autoCapitalize="none"
                                blurOnSubmit={false}
                            />
                        </View>
                        <View style={{width:'100%'}}>
                            <View style={styles.label}>
                                <Text style={styles.labelText}>Confirm Password</Text>
                                <Icon name="lock" size={16} color="rgba(255,255,255,0.5)" />
                            </View>
                            <TextInput 
                                style={styles.input} 
                                onChangeText={(forgetConPass) => this.setState({forgetConPass})} 
                                ref={ input => {
                                    this.inputs['forgetConPass'] = input;
                                }}
                                onSubmitEditing={() => {
                                    this.cngPass();
                                }}
                                returnKeyType='done'
                                selectTextOnFocus={true}
                                autoCapitalize="none"
                                blurOnSubmit={false}
                            />
                        </View>
                        <TouchableOpacity onPress={() => this.cngPass()} style={[{backgroundColor:'#fff', height:35, width:100,borderRadius:30,
                        justifyContent:'center',marginTop:15, alignItems:'center'}, styles.shadow]}>
                            <Text style={{color:'#cc76fd'}}>Done</Text>
                        </TouchableOpacity>
                    </View>                
                }
            </ImageBackground>
            
            </Animated.View>
            
        </ImageBackground>
            {(this.state.mode == 'Up')&&
                <TouchableOpacity onPress={() => this.showSignIn()} style={[styles.signBtn, styles.shadow, {width:width*.25}]}>
                    <Text style={{color:'#fff'}}>
                        Sign In
                    </Text>
                </TouchableOpacity>
            }
            {(this.state.mode == 'In')&&
                <TouchableOpacity onPress={() => this.showSignUp()} style={[styles.signBtn,styles.shadow ,{top:'43%', width:width*.25}]}>
                    <Text style={{color:'#fff'}}>
                        Sign Up
                    </Text>
                </TouchableOpacity>
            }
            {(this.state.Loading) && <Loading />}
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
        fontSize:24,
        textAlign:'center'
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
        top:10,
        left:10
    },
    logoTextWrapper:{
        position:'absolute',
        height:Dimensions.get('window').width*0.2,
        width:Dimensions.get('window').width*0.2,
        position:'absolute',
        top:Dimensions.get('window').width*0.2,
        alignItems:'center',
        left:10,
    },
    logoText:{
        color:'#a3176e',
        fontWeight:'bold',
        
        textAlign:'center'
    }
});
