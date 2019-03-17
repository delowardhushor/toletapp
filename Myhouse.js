import React, {Component} from 'react';
import {Platform, StyleSheet,WebView,TouchableOpacity, ToastAndroid, Modal,KeyboardAvoidingView, ImageBackground,AsyncStorage, ScrollView, Dimensions, Text,TextInput, View} from 'react-native';
import SingleRent from './resources/SingleRent';
import Icon from 'react-native-vector-icons/FontAwesome';
import { theme } from './lib/theme';
import Login from './Login';
import ForgetPass from './ForgetPass';
import ConfirmCode from './ConfirmCode';
import {setLocal, getLocal , post} from './lib/utilies';
import AddHouse from './AddHouse';



type Props = {};
export default class Myhouse extends Component<Props> {

  constructor(props) {
      super(props);
      this.state = {
          page : 'myHouse',
          watchChange: true,
          pendingMobile: '',
          pendingPass: '',
      };
  }

  componentWillReceiveProps(){
    if(this.props.user.length == 0 ){
      this.changePage('Login');
    }
  }

  setPendingUser = (mobile, pass) => {
    this.setState({pendingMobile:mobile});
    this.setState({pendingPass:pass});
  }

  componentWillMount(){
    if(this.props.user.length == 0 ){
      this.changePage('Login');
    }
    console.log("hello")
  }

  changePage = (value) =>{
    this.setState({page:value});
  }

  confirmCode = (pin) => {
    post('/verify', {
        mobile:this.state.pendingMobile, 
        password:this.state.pendingPass,
        pin:pin,
    }, (response) => {
        console.log(response);
        if(response.data.success){
            ToastAndroid.show("Welcome to The World Of Home", 3000);
            setLocal('user', response.data.userdata);
            this.changePage('myHouse');
        }else{
            ToastAndroid.show(response.data.msg, 3000);
        }
    });
  }
  

  render() {
    // var imageschk = this.state.houseData
    // const images = this.state.houseData.images.map((image) => {
    //   return (
    //     <TouchableOpacity>
    //       <Image
    //           style={styles.singleImage}
    //           source={image}
    //       />
    //     </TouchableOpacity>
    //   );
    // })
    return (
        <KeyboardAvoidingView enabled>
          {(this.state.page === 'Login') && 
            <Login updateUser={this.props.updateUser} setPendingUser={this.setPendingUser} changePage={this.changePage} />
          }
          {(this.state.page === 'ForgetPass') && 
            <ForgetPass changePage={this.changePage} />
          }
          {(this.state.page === 'ConfirmCode') && 
            <ConfirmCode confirmCode={this.confirmCode} changePage={this.changePage} />
          }
          {(this.state.page === 'myHouse') && 
            <View>
              <TouchableOpacity onPress={() => this.changePage('AddHouse')} style={styles.addBtnWrapper}>
                <Text><Icon name='plus' size={12} color='#fff' /></Text>
              </TouchableOpacity>
              <View style={styles.houseHeader}><Text style={styles.headerText}>Your Houses</Text></View>
            </View>
          }
          {(this.state.page === 'AddHouse') &&
            <AddHouse changePage={this.changePage} />
          }
        </KeyboardAvoidingView>
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
  addBtnWrapper:{
    height:30,
    width:30,
    backgroundColor:theme().backClr,
    borderRadius:15,
    alignItems:'center',
    justifyContent:'center',
    position:'absolute',
    top:12,
    right:'5%',
  },
  houseHeader:{
    height: 50,
    alignItems:'center',
    justifyContent:'center'
  },
  headerText:{
    color:theme().clr,
    fontSize:16,
  },
  singleImage:{
    height:100, 
    width:150, 
    alignItems:'center', 
    justifyContent:'center'
  },
  addImageBtn:{
    paddingHorizontal:20,
    paddingVertical:10,
    borderRadius:20,
    backgroundColor:theme().backClr,
    color:'#fff',
    fontSize:12
  },
  fullWidth:{
    width:'100%',
  }
});
