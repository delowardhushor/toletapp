import React, { Component } from 'react';
import { View, StatusBar, TextInput, Animated } from 'react-native';

export default class FloatingLabelInput extends Component {
  state = {
    isFocused: false,
  };

  componentWillMount() {
    this._animatedIsFocused = new Animated.Value(this.props.value === '' ? 0 : 1);
    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
  }

  focusNextField = () => {
    console.log("sdfsddsds")
    this.inputs['input'].focus();
  }

  handleFocus = () => this.setState({ isFocused: true });
  handleBlur = () => this.setState({ isFocused: false });

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: (this.state.isFocused || this.props.value !== '') ? 1 : 0,
      duration: 200,
      useNativeDriver: true
    }).start();
  }

  render() {
    const { label, ...props } = this.props;
    const labelStyle = {
      position: 'absolute',
      left: 4,
      transform: [{translateY:this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [16, 0],
      })}],
      // fontSize: this._animatedIsFocused.interpolate({
      //   inputRange: [0, 1],
      //   outputRange: [16, 14],
      // }),
      // color: this._animatedIsFocused.interpolate({
      //   inputRange: [0, 1],
      //   outputRange: ['#aaa', '#aaa'],
      // }),
    };
    return (
      <View style={{ paddingTop: 8, width:'100%', marginTop:10 }}>
        <Animated.Text style={[labelStyle, {fontWeight:'100', fontSize:14, color:'grey'}]}>
          {label}
        </Animated.Text>
        <TextInput
          {...props}
          style={{ height: 36,paddingBottom:4 ,fontSize: 18, color: '#000', borderBottomWidth: 1, borderBottomColor: this.state.isFocused ? '#a3176e' : '#ddd' }}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          blurOnSubmit
          ref={ input => {
            this.inputs['input'] = input;
          }}
        />
      </View>
    );
  }
}