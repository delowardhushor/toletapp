import {AsyncStorage, ToastAndroid } from 'react-native';
import axios from 'axios';

export function baseurl(){
    return "https://beaked-negligence.000webhostapp.com/api";
}

export function post(url, input, resfun){
    var formData = new FormData();
    for(property in input ){
        formData.append(property, input[property]);
    }

    axios({
        method: 'POST',
        url: baseurl()+url,
        data:formData
    })
    .then((res) => {
        console.log(res)
      resfun(res);
    })
    .catch((err) => {
        console.log(err)
      resfun(err);
    })
}

export function get(url, resfun){
    axios({
        method: 'GET',
        url: baseurl()+url,
    })
    .then((response) => {
      resfun(response);
    })
    .catch((err) => {
      resfun(err);
    })
}

export async function setLocal(name, value){
    try {
      await AsyncStorage.setItem(name, JSON.stringify(value));
    } catch (error) {
        ToastAndroid.show("Couldn't Save", 1000);
    }
}

export async function getLocal(name){
    var itemValue = [];
    try {
        const value = await AsyncStorage.getItem(name);
        itemValue = JSON.parse(value);
    } catch (error) {
        ToastAndroid.show('Error Occured', 1000);
    }
    return itemValue;
}

export async function resetLocal(name) {
    try {
      await AsyncStorage.removeItem(name);
    } catch (error) {
        ToastAndroid.show("Error resetting data", 1000);
    }
}