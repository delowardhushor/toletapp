import React, {Component} from 'react';
import {Platform, StyleSheet,WebView,ImageBackground,TouchableOpacity,Button, ToastAndroid, ScrollView, Dimensions, Text,TextInput, View} from 'react-native';
import { theme } from './lib/theme';


type Props = {};
export default class ConfirmCode extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    confirmCode(){

    }

  render() {
    return (
        <View style={styles.back}>
          <View>
            <Text style={styles.text}>Please Confirm Code Sent To Your Phone</Text>
          </View>
          <View style={styles.container}>
            <TextInput 
                style={styles.input} 
                placeholderTextColor = '#ddd'
                placeholder='Code' 
                onChangeText={(pin) => this.setState({pin})} 
            />
          </View>
          <TouchableOpacity onPress={() => this.props.confirmCode(this.state.pin)} style={styles.fillButton}>
            <Text style={[styles.text, {color:'#fff'}]}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.changePage('Login')} style={styles.strokButton}>
            <Text style={styles.text}>Want To Sign In?</Text>
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
