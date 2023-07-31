import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [timer, setTimer] = useState(null);
  const [ senderStatus, setSenderStatus ] = useState('connection initiated')
  const [ receiverStatus, setReceiverStatus ] = useState('connection initiated')
  const listContainer = useRef(null)
  const [ sender, setSender ] = useState(null)
  const [ sentCount, setSentCount ] = useState(0)

  useEffect(() => {
    const sender = io('ws://localhost:3000/chat', { reconnectionAttempts:5, retries:5, transports: ["websocket"] })
    sender.on('connecting', () => setSenderStatus('Sender connecting') )
    sender.on('connect', () => setSenderStatus('Sender connected') )
    sender.on('connect_failed', () => setSenderStatus('Sender connection failed') )
    
    sender.on('reconnecting', () => setSenderStatus('Sender reconnecting') )
    sender.on('reconnect', () => setSenderStatus('Sender reconnected') )
    sender.on('reconnect_failed', () => setSenderStatus('Sender reconnection failed') )

    sender.on('disconnect', () => setSenderStatus('Sender disconnected'))
    sender.on('error', (error) => setSenderStatus('Sender received error from server', error))
    setSender(sender)

    // Connect to the Socket.IO server running on the backend consumer
    const receiver = io('ws://localhost:3001/chat', { reconnectionAttempts:5, retries:5, transports: ["websocket"] })
    .on('connecting', () => setReceiverStatus('Receiver connecting') )
    .on('connect', () => setReceiverStatus('Receiver connected') )
    .on('connect_failed', () => setReceiverStatus('Receiver connection failed') )
    
    .on('reconnecting', () => setReceiverStatus('Receiver reconnecting') )
    .on('reconnect', () => setReceiverStatus('Receiver reconnected') )
    .on('reconnect_failed', () => setReceiverStatus('Receiver reconnection failed') )

    .on('disconnect', () => setReceiverStatus('Receiver disconnected'))
    .on('error', (error) => setReceiverStatus('Receiver received error from server', error))

    // Add event listeners for incoming messages
    receiver.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      listContainer.current.scrollTop = listContainer.current.scrollHeight;
    });

    // Clean up the Socket.IO connection when the component unmounts
    return () => {
      sender.disconnect();
      receiver.disconnect();
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
    // Emit the message to the backend producer via Socket.IO 
    sender.volatile.emit('message', message);
    setSentCount(current => current+1 )
  }

  const dummyText = '<br>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.<br>'

  const generateNewMessage = () => {
    const message = new Date().toISOString() + dummyText + new Date().toISOString()
    sendMessage(message)
  }


  const autoGenerateAndSend = () => {
    if( timer ){
      clearInterval(timer)
      setTimer(null)
      return 
    }
    setTimer( setInterval(generateNewMessage, 50) ); // 1000/20 (20 messages per second)
  }

  return (
    <div className='main-container'>
      <div>
        <ul className='message-list' ref={listContainer}>
          {messages.map((msg, index) => (
            <li key={index}>{msg.message}</li>
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
        <button onClick={autoGenerateAndSend}>{ timer ? 'Stop Sending' : `Auto Generate`}</button>
        <p>
          Sender : { senderStatus } &nbsp;&nbsp;&nbsp; { sentCount + ' sent' }
          <br/>
          Receiver : { receiverStatus } &nbsp;&nbsp;&nbsp; { messages.length + ' received' }
        </p>
      </div>
    </div>
  );
};

export default App;

