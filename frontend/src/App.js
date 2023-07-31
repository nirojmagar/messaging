import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [timer, setTimer] = useState(null);
  const sender = io('ws://localhost:3000/chat', { transports: ["websocket"] })

  useEffect(() => {
    // Connect to the Socket.IO server running on the backend consumer
    const socket = io('ws://localhost:3001/chat', { transports: ["websocket"] });

    // Add event listeners for incoming messages
    socket.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Clean up the Socket.IO connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    if (inputValue.trim() === '' ) return;
    sendMessage(inputValue.trim())
  };

  const getNewPriority = () => Math.floor(Math.random() * 11)

  const sendMessage = (newMessage) => {
    const message = { 
      message: newMessage, 
      timestamp: Date.now(),
      priority: getNewPriority()
    };
    console.log(message)
    // Emit the message to the backend producer via Socket.IO 
    sender.emit('message', message);
  }

  const dummyText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

  const generateNewMessage = () => {
    let i = 0;
    do {
      i++;
      const message = new Date().toISOString() + dummyText + new Date().toISOString()
      sendMessage(message)
    } while( i <= 20 )
  }

  const autoGenerateAndSend = () => {
    if( timer ) return clearInterval(timer)
    setTimer( setInterval(generateNewMessage, 1000) );
  }

  return (
    <div>
      <div>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg.text}</li>
          ))}
        </ul>
      </div>
      <div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send Message</button>
        <button onClick={autoGenerateAndSend}>AutoGenerate And Send</button>
      </div>
    </div>
  );
};

export default App;

