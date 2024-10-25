import React from 'react';
import MessageService from './Message/MessageService';

import Navbar from './Navbar/Navbar';

export default function App() {
    return (
        <MessageService>
            <Navbar />
        </MessageService>
    );
}