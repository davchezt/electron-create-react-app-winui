import React, { Component } from 'react';
import Electron from 'electron';
import Notifier from 'electron-node-notifier';
import path from 'path';
import {
  View,
  Radio,
  Text,
  TextInput,
  Checkbox,
  Button,
  ProgressCircle
} from 'react-desktop/windows';

const { ipcRenderer, remote } = Electron;
const { shell } = Electron;
const { openExternal } = shell;
const { app } = remote;

const assetsLocation = process.env.NODE_ENV === "development" ?
  path.resolve(path.join(__dirname, "../public/assets")) :
  path.join(app.getAppPath().replace('app.asar', 'app.asar.unpacked/assets'));

class Settings extends Component {
  static countDown = null;

  constructor(props) {
    super(props);
    this.state = {
      showLoading: false,
      showResult: false
    }
  }

  submit = () => {
    this.setState({showLoading: true}, () => {
      this.countDown = setTimeout(() => {
        this.setState({showLoading: false});
        this.runToast('Hello. This is a longer text\nWith "some" newlines.', assetsLocation + '/img/coulson.jpg');
        this.setState({showResult: true}, () => {
          this.countDown = setTimeout(() => {
            this.setState({showResult: false});
          }, 5000)
        })
      }, 3000)
    })
  }

  cancel = () => {
    if (this.countDown !== undefined) clearTimeout(this.countDown);
    this.setState({
      showLoading: false,
      showResult: false
    });
  }

  runToast = (text, image) => {
    Notifier.notify({
      title: 'Harmony',
      message: text,
      time: 10000,
      wait: false,
      icon: image,
      sound: true
    }, function (err, data) {
      if (err) console.log(err);
      if (data) console.log(err);
    });

    Notifier.on('timeout', function () {
      console.log('notifier Timed out!');
    });

    Notifier.on('click', function () {
      console.log('notifier Clicked!');
    });
  }

  render() {
    return(
      <View
        horizontalAlignment="left"
        layout="vertical"
        width="100%"
      >
        {this.state.showResult &&
          <View
            color={this.props.color}
            background
            horizontalAlignment="center"
            verticalAlignment="center"
            //padding="0 10px"
            width="100%"
            height="32px"
          >
            <Text>Success Saved!</Text>
          </View>
        }
        
        <TextInput
          ref="input"
          theme={this.props.theme}
          color={this.props.color}
          // background
          labelColor="#000"
          label={this.props.inputText}
          placeholder={this.props.inputText}
          onChange={(e) => console.log(e.target.value)}
          width="500px"
        />
        <TextInput
          ref="input"
          theme={this.props.theme}
          color={this.props.color}
          // background
          labelColor="#000"
          label={this.props.inputText}
          placeholder={this.props.inputText}
          onChange={(e) => console.log(e.target.value)}
          width="500px"
        />
        <View
          layout="horizontal"
        >
          <TextInput
            ref="input"
            theme={this.props.theme}
            color={this.props.color}
            // background
            labelColor="#000"
            label={this.props.inputText}
            placeholder={this.props.inputText}
            onChange={(e) => console.log(e.target.value)}
            width="225px"
            margin="0 25px 0 0"
          />
          <TextInput
            ref="input"
            theme={this.props.theme}
            color={this.props.color}
            // background
            labelColor="#000"
            label={this.props.inputText}
            placeholder={this.props.inputText}
            onChange={(e) => console.log(e.target.value)}
            width="225px"
          />
        </View>
        <Checkbox
          color={this.props.color}
          theme={this.props.theme}
          label="Check me!"
          onChange={(e) => console.log(e.target.value)}
          defaultValue="I got checked!"
          defaultChecked
        />
        <TextInput
          ref="input"
          theme={this.props.theme}
          color={this.props.color}
          // background
          labelColor="#000"
          label={this.props.inputText}
          placeholder={this.props.inputText}
          onChange={(e) => console.log(e.target.value)}
          width="500px"
        />
        <View horizontalAlignment="center" layout="vertical" theme={this.props.theme}>
          <Radio
            color={this.props.color}
            label="Check me!"
            name="radio1"
            onChange={(e) => console.log(e.target.value)}
            defaultValue="I got checked!"
            defaultChecked
          />
          <Radio
            color={this.props.color}
            label="Check me!"
            name="radio1"
            onChange={(e) => console.log(e.target.value)}
            defaultValue="I got checked!"
          />
        </View>

        <View horizontalAlignment="right" layout="horizontal" theme={this.props.theme} width="100%">
          {this.state.showLoading && <View margin="0 25px 0 0">
            <ProgressCircle
              color={this.props.color}
              size={32}
            />
          </View>}
          <View margin="0 25px 0 0">
            <Button push color={this.props.color} onClick={this.submit}>
              Save
            </Button>
          </View>
          <Button push typce="submit" color="#171717" onClick={this.cancel}>
            Yay!
          </Button>
        </View>
        <Text>Theme: {this.props.theme}</Text>
        <Text>Color: {this.props.color}</Text>

      </View>
    )
  }
}

export default Settings;