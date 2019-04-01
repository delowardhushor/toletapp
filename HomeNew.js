import React, {Component} from 'react';
import {Platform,Animated,Keyboard,Modal, ToastAndroid,Slider, CheckBox, ScrollView, StyleSheet,TouchableOpacity, Text, View,Image,Dimensions,Linking, TextInput,TouchableWithoutFeedback, FlatList } from 'react-native';
import { theme } from './lib/theme';
import { baseurl, get, post } from './lib/utilies';
import Icon from 'react-native-vector-icons/FontAwesome';
import HouseDetails from './resources/HouseDetails';
import Search from './resources/Search';
import Area from './resources/area.json';
import _ from 'lodash';
import axios from 'axios';
import moment from 'moment';

let {width,height} = Dimensions.get('window');

type Props = {};
export default class Home extends Component<Props> {

    constructor(props){
        super(props);
        this.state = {
            watchChange:false,
            searchText:'',
            filteredArea:[],
            selectedArea:'',
            price:25000,
            searchData:{
                'onebed':true,
                'twobed':true,
                'threebed':true,
                'threeupbed':true,
            },
            activeHouse: null,
        };
    }

    componentWillMount(){
        this.allImages = {}
        this.oldPosition = {}
        this.position = new Animated.ValueXY();
        this.dimensions = new Animated.ValueXY();
        this.animation = new Animated.Value(0);
        this.activeHouseImageStyle = null;
    }

    openHouse = (index) => {
        this.allImages[index].measure((x, y, width, height, pageX, pageY) => {
            this.oldPosition.x = pageX;
            this.oldPosition.y = pageY;
            this.oldPosition.width = width;
            this.oldPosition.height = height;

            this.position.setValue({
                x:pageX,
                y:pageY
            });

            this.dimensions.setValue({
                x:width,
                y:height
            });

            this.setState({activeHouse:this.props.houses[index]}, () => {
                this.viewHouse.measure((dx, dy, dWidth, dHeight, dPageX, dPageY) => {
                    Animated.parallel([
                        Animated.timing(this.position.x, {
                            toValue: dPageX,
                            duration: 200
                        }),
                        Animated.timing(this.position.y, {
                            toValue: dPageY,
                            duration: 200
                        }),
                        Animated.timing(this.dimensions.x, {
                            toValue: dWidth,
                            duration: 200
                        }),
                        Animated.timing(this.dimensions.y, {
                            toValue: dHeight,
                            duration: 200
                        }),
                        Animated.timing(this.animation, {
                            toValue: 1,
                            duration: 200
                        })
                    ]).start();

                })
            })
        })
    }

    hideDetails = () => {
        Animated.parallel([
            Animated.timing(this.position.x, {
                toValue: this.oldPosition.x,
                duration: 200
            }),
            Animated.timing(this.position.y, {
                toValue: this.oldPosition.y,
                duration: 200
            }),
            Animated.timing(this.dimensions.x, {
                toValue: this.oldPosition.width,
                duration: 200
            }),
            Animated.timing(this.dimensions.y, {
                toValue: this.oldPosition.height,
                duration: 200
            }),
            Animated.timing(this.animation, {
                toValue: 0,
                duration: 200
            })
        ]).start(()=>{
            this.setState({activeHouse:null});
        });
    }

    componentWillReceiveProps(){
        this.setState({watchChange:!this.state.watchChange});
    }

    render() {

        const activeHouseImageStyle = {
            width: this.dimensions.x,
            height: this.dimensions.y,
            left: this.position.x,
            top: this.position.y,
        }

        const animatedContentY = this.animation.interpolate({
            inputRange:[0,1],
            outputRange:[-150,0]
        })

        const animatedContentOpacity = this.animation.interpolate({
            inputRange:[0,0.5,1],
            outputRange:[0,0,1]
        })

        const animatedContentStyle = {
            opacity:animatedContentOpacity,
            transform: [{
                translateY:animatedContentY
            }]
        }

        const animatedCrossOpacity = {
            opacity: this.animation
        }
        

        return (
            <View>
                <Search />
                <FlatList style={{height:Dimensions.get('window').height-100}}
                    extraData={this.state.watchChange}
                    data={this.props.houses}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={2}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, index}) => 
                        <TouchableWithoutFeedback onPress={() => this.openHouse(index)}>
                            <Animated.View style={[{height:260, width:width*.9,alignSelf:'center',marginTop:20,position:'relative', borderRadius:5, overFlow:'hidden'}, styles.shadow]}>
                                <Image 
                                    ref={(image) => this.allImages[index] = image}
                                    style={{flex:1, height:null,width:null,resizeMode:'cover', borderTopRightRadius:5, borderTopLeftRadius:5}}
                                    source={{uri: baseurl()+'/img/'+JSON.parse(item.image)[0]}}
                                />
                                <View style={{height:40,flexDirection:'row', alignItems:'center', justifyContent:'space-around'}}>
                                    <Text style={styles.shortDetailsText}><Icon name="bed" size={12} /> {item.room} room</Text>
                                    <Text style={styles.shortDetailsText}><Icon name="bath" size={12} /> {item.bath} Bathroom</Text>
                                    <Text style={styles.rent}>{item.square} sq ft</Text>
                                </View>
                                <View style={{position:'absolute',height:35, bottom:40, left:0,right:0, backgroundColor:'rgba(0,0,0,0.5)',paddingLeft:10, paddingTop:6, flexDirection:'row'}}>
                                    <Text style={{color:'#fff', opacity:.8, fontSize:16, fontWeight:'900'}}>৳{item.cost}</Text>
                                    <Text style={{paddingTop:3,color:'#fff', fontSize:12}}> {item.type === 'Sale' ? '' : 'per month'}</Text>
                                </View>
                                <Text style={[styles.absoluteText, {left:10}]}>{item.type}</Text>
                                <Text style={[styles.absoluteText, {right:10}]}>Avaliable Form: {moment(item.date).format('MMMM YY')}</Text>
                                <Text style={[styles.absoluteText, {top:190, left:'auto', right:10}]}><Icon name="map-marker" size={12} /> {item.area}</Text>
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    }
                />
                <View style={StyleSheet.absoluteFill}
                pointerEvents={this.state.activeHouse ? 'auto' : 'none'}>
                    <View style={{flex:2,zIndex:1001, borderWidth:1, borderBottomWidth:0, borderTopWidth:0}} ref={(view) => this.viewHouse = view}>
                        <Animated.Image
                            source={{uri :this.state.activeHouse ? baseurl()+'/img/'+JSON.parse(this.state.activeHouse.image)[0] : null}}
                            style={[{ resizeMode:'cover', top: 0, left: 0, height: null, width:null}, activeHouseImageStyle]}
                        >
                        </Animated.Image>
                        <TouchableWithoutFeedback onPress={() => this.hideDetails()}>
                            <Animated.View style={[styles.detailsAbsBtn, animatedCrossOpacity, {left:10}]}>
                                <Text style={styles.detailsAbsBtnText}><Icon size={12} name='chevron-left' /></Text>
                            </Animated.View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={() => this.hideDetails()}>
                            <Animated.View style={[styles.detailsAbsBtn, animatedCrossOpacity, {right:10}]}>
                                <Text style={styles.detailsAbsBtnText}><Icon size={22} name='heart' /></Text>
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    </View>
                    <Animated.View style={[{flex:2,zIndex:1000, backgroundColor:'#fff', padding:20}, animatedContentStyle]}>
                    {(this.state.activeHouse) &&
                        <ScrollView style={{flex:1}}>
                            <Text style={{borderBottomWidth:1, borderBottomColor:'#ddd', paddingBottom:5}}><Icon name="list-ul" /> Avaliable Date & Area</Text>
                            <View style={{height:30,flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                <Text style={styles.shortDetailsText}><Icon name="calendar" size={12} /> {moment(this.state.activeHouse.date).format('Do MMMM YY')}</Text>
                                <Text style={styles.shortDetailsText}><Icon name="map-marker" size={12} /> {this.state.activeHouse.area}</Text>
                            </View>
                            <Text style={{borderBottomWidth:1, borderBottomColor:'#ddd', paddingBottom:5, marginTop:20}}><Icon name="list-ul" /> Features</Text>
                            <View style={{height:30,flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                <Text style={styles.shortDetailsText}><Icon name="bed" size={12} /> {this.state.activeHouse.room} room</Text>
                                <Text style={styles.shortDetailsText}><Icon name="bath" size={12} /> {this.state.activeHouse.bath} Bathroom</Text>
                                <Text style={styles.rent}>{this.state.activeHouse.square} sq ft</Text>
                            </View>
                            <View style={{height:40,flexDirection:'row', alignItems:'center', justifyContent:'space-between', borderBottomWidth:1, borderBottomColor:'#ddd', marginTop:20}}>
                                <Text><Icon name="map-signs" /> Full Address</Text>
                                <TouchableWithoutFeedback onPress={() => Linking.openURL(this.state.activeHouse.location)}>
                                    <View style={[styles.directionBtn, styles.shadow]}>
                                        <Text style={{color:'#fff'}}><Icon name="map-marker" /> GET DIRECTION</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            <Text style={[styles.shortDetailsText, {width:'100%', marginTop:5, marginBottom:20}]}>{this.state.activeHouse.address}</Text>
                            <Text style={{borderBottomWidth:1, borderBottomColor:'#ddd', paddingBottom:5, marginTop:10}}><Icon name="info" /> Details</Text>
                            <Text style={[styles.shortDetailsText, {width:'100%', marginTop:5, marginBottom:20}]}>{this.state.activeHouse.details}</Text>
                            <Text style={{borderBottomWidth:1, borderBottomColor:'#ddd', paddingBottom:5, marginTop:10}}><Icon name="list-alt" /> Owner Info</Text>
                            <View style={{height:50,flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                <View>
                                    <Text style={styles.shortDetailsText}><Icon name="user" size={12} /> {this.state.activeHouse.users_name}</Text>
                                    <Text style={styles.shortDetailsText}><Icon name="phone" size={12} /> {this.state.activeHouse.users_mobile}</Text>
                                </View>
                                <View style={{flexDirection:'row'}}>
                                    <TouchableWithoutFeedback onPress={() => Linking.openURL('tel:'+this.state.activeHouse.users_mobile)}>
                                        <View style={[styles.callMsgBtn, styles.shadow]}>
                                            <Text style={{color:'#fff'}}><Icon name="phone" size={14} /></Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback onPress={() => Linking.openURL('sms:'+this.state.activeHouse.users_mobile)}>
                                        <View style={[styles.callMsgBtn, styles.shadow]}>
                                            <Text style={{color:'#fff'}}><Icon name="wechat" size={14}  /></Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                                
                            </View>
                            <View style={{height:100}}></View>
                        </ScrollView>
                    }
                    </Animated.View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    shortDetailsText:{
        color:theme().clr,
        fontSize:14,
        fontWeight:'600',
    },
    rent:{
        color:'#a3176e',
        fontSize:14,
        fontWeight:'500'
    },
    absoluteText:{
        position:'absolute',
        paddingHorizontal:10,
        paddingVertical:3,
        borderRadius:20,
        backgroundColor:'rgba(0,0,0,0.5)',
        color:'#fff',
        fontSize:12,
        fontWeight:'bold',
        top:10,
        opacity:.8
    },
    shadow:{
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 5,
    },
    detailsAbsBtn:{
        position:'absolute', 
        top:10,
        height:50, 
        width:50, 
        alignItems:'center', 
        justifyContent:'center',
        backgroundColor:'rgba(0,0,0,.3)',
        borderRadius:5
    },
    detailsAbsBtnText:{
        fontSize:24, 
        fontWeight:'bold', 
        color:'#fff'
    },
    directionBtn:{
        paddingHorizontal:10,
        paddingVertical:3,
        borderRadius:20,
        backgroundColor:'#a3176e'
    },
    callMsgBtn:{
        height:40,
        width:40,
        borderRadius:20,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#a3176e',
        marginLeft:5,
    }
});
