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
      resfun(res);
    })
    .catch((err) => {
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