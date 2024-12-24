import React, { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import axios from 'axios';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // const connection = new signalR.HubConnectionBuilder()
    //   .withUrl('https://localhost:7229/chathub')
    //   .withAutomaticReconnect()
    //   .build();

      var connection = new signalR.HubConnectionBuilder()
       .withUrl("https://localhost:7229/chathub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
    }).withAutomaticReconnect()
    .build();

    connection.on('ReceiveMessage', (user, message) => {
      setMessages((prevMessages) => [...prevMessages, { user, message }]);
    });

    connection.start().then(() => {
        console.log("connection start");
      axios.get('https://localhost:7229/api/user') // Replace this with your endpoint to get the user's name
        .then((response) => setUser(response.data))
        .catch((error) => console.error(error));
    });

    return () => {
      connection.stop();
    };
  }, []);

  const sendMessage = () => {
    console.log(message);
    axios.post('https://localhost:7229/api/message', { user, message })
      .then(() => setMessage(''))
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.user}: </strong>
            {msg.message}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
