import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-desktop/windows';

import logo from './logo.svg';

class Dashboard extends Component {
  render() {
    return(
      <View
        color={this.props.color}
        background
        padding="20px"
        horizontalAlignment="center"
        verticalAlignment="center"
        width="100%"
        height="200px"
      >
        <Text color={this.props.theme === 'dark' ? 'white' : '#333'}>Electron</Text>
        <img src={logo} className="App-logo" alt="logo" />
        <Text color={this.props.theme === 'dark' ? 'white' : '#333'}>Desktop</Text>
      </View>
    )
  }
}

export default Dashboard;