//geth --rpc --shh --rpcport "8545" --rpcaddr "192.168.0.14" --rpccorsdomain "*"

import './global';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import Web3 from 'web3';
import {GiftedChat, Actions, Bubble, SystemMessage, Message} from 'react-native-gifted-chat';
import {decodeFromHex, encodeToHex} from './hexutils';
import { KeyboardAvoidingView } from 'react-native';


const defaultRecipientPubKey = "0x046f652f6be3f9e92ed58e8f16df85579216b3f90152966c34551b1a6ac2d298746f19ab7d19b6d68e61d17bd13c8c57379e762e77c3cddcb844c21ad7a5a1fbd7";
const defaultTopic = "0x07678231";

export default class App extends React.Component {
  
  constructor(props) {
    super(props);
   
 

    this.state = { 
      recipientPubKey: defaultRecipientPubKey, 
      asymPubKey: '',
      asymKeyId:'',
      username: 'test-user1',     
      messages: []
    };

    this.renderBubble = this.renderBubble.bind(this);
   
 
    this.renderFooter = this.renderFooter.bind(this);




    this.web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.0.14:8545"));
    this.shh = this.web3.shh;
    this.shh.newKeyPair().then(id => {     
      this.setState({asymKeyId: id});
			return this.shh.getPublicKey(id).then(pubKey =>   {
        this.setState({asymPubKey: pubKey});
        
        this.configureFilter(id);
        console.log(pubKey);

      }).catch(console.log);
		}).catch(console.log);

  }

  renderFooter(props) {
    if (this.state.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {this.state.typingText}
          </Text>
        </View>
      );
    }
    return null;
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          }
        }}
      />
    );
  }






  render() {
    return (     
 
    <GiftedChat
      messages={this.state.messages}
      onSend={this.sendMessage}     

      user={{
        _id: this.state.username, // sent messages should have same user._id
      }}    
    /> 
    )   
  }
  
  sendMessage = (messages = []) => {
    console.log(messages);
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
  

    let postData = {
      ttl: 7,
      topic: defaultTopic,
      powTarget: 2.01,
      powTime: 100,
      payload: encodeToHex(JSON.stringify({
        text: messages[0].text,
        name: this.state.username
      })),
      pubKey : this.state.recipientPubKey,
      sig : this.state.asymKeyId
    };
    this.shh.post(postData);


  }

  configureFilter(asymKeyId) { 
      
      let filter = {
        topics: [defaultTopic],
        privateKeyID: asymKeyId
      };

      this.msgFilter = this.shh.newMessageFilter(filter).then(filterId => {
     
        setInterval(() => {
          this.shh.getFilterMessages(filterId).then(messages => {
            for (let msg of messages) {
             console.log(msg);
              let payload = decodeFromHex(msg.payload);
              console.log(payload);
              let date = new Date();              
              date.setTime(msg.timestamp*1000);

              let message = {
                _id: msg.timestamp,
                text: payload.text,
                createdAt: date,
                user: {
                  _id: msg.recipientPublicKey,
                  name: payload.name,
                  //avatar: 'https://facebook.github.io/react/img/logo_og.png',
                }              
              }

              this.setState({
                messages: [...this.state.messages, message]
              })
              
              console.log(this.state.messages);
  
            }
          });
        }, 1000);
      });



  }
  onPressStart = () => {

    

  }

  componentDidMount() {

    }
  componentWillMount() {
  
  }
}

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
});