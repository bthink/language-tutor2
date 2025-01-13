import React, { useState } from 'react';
import './App.css';

const apiKey = 'YOUR_OPENAI_API_KEY'; // Replace with your OpenAI API key

function App() {
    const [userInput, setUserInput] = useState('');
    const [messages, setMessages] = useState([]);

    const sendMessage = async () => {
        if (!userInput) return;

        const newMessages = [...messages, { role: 'user', content: userInput }];
        setMessages(newMessages);

        setUserInput('');

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4",
                    messages: newMessages
                })
            });

            const data = await response.json();
            const botMessage = data.choices[0].message.content;

            setMessages([...newMessages, { role: 'assistant', content: botMessage }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages([...newMessages, { role: 'assistant', content: 'Error: Could not reach ChatGPT.' }]);
        }
    };

    return (
        <div className="chat-container">
            <h1>ChatGPT Web App</h1>
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.role}>{msg.role}: {msg.content}</div>
                ))}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}

export default App;
