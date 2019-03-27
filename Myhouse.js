import React, {Component} from 'react';
import {Platform, StyleSheet,WebView,TouchableOpacity, Image, ToastAndroid, Modal,KeyboardAvoidingView, ImageBackground,AsyncStorage, ScrollView, Dimensions, Text,TextInput, View} from 'react-native';
import SingleRent from './resources/SingleRent';
import Icon from 'react-native-vector-icons/FontAwesome';
import { theme } from './lib/theme';
import Login from './Login';
import ForgetPass from './ForgetPass';
import ConfirmCode from './ConfirmCode';
import {setLocal, getLocal , post} from './lib/utilies';
import AddHouse from './AddHouse';

let {width,height} = Dimensions.get('window');


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

  }

  setPendingUser = (mobile, pass) => {
    this.setState({pendingMobile:mobile});
    this.setState({pendingPass:pass});
  }

  componentWillMount(){
    if(this.props.user.length == 0 ){
      this.changePage('Login');
    }
  }

  changePage = (value) =>{
    this.setState({page:value});
    this.props.changeActiveTab('Myhouse', width);
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
            <View style={{position:'relative', height:height-50}}>
              <View style={styles.houseHeader}><Text style={styles.headerText}>Your Houses</Text>
              </View>
              <TouchableOpacity onPress={() => this.changePage('AddHouse')} style={[styles.addBtnWrapper,styles.shadow]}>
                <Icon name="plus" color='#fff' size={22} />
              </TouchableOpacity>
            </View>
          }
          
            <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.page === 'AddHouse' ? true : false}
            onRequestClose={() => {
              this.setState({page:'myHouse'});
              this.props.changeActiveTab('Myhouse', width);
            }}>
            {(this.state.page === 'AddHouse') &&
              <AddHouse updateUser={this.props.updateUser} changePage={this.changePage} user={this.props.user} />
            }
            </Modal>
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
    height:50,
    width:50,
    backgroundColor:'#a3176e',
    borderRadius:25,
    alignItems:'center',
    justifyContent:'center',
    position:'absolute',
    bottom:50,
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
  },
  shadow:{
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.34,
    shadowRadius: 2.27,
    elevation: 15,
  },
});
