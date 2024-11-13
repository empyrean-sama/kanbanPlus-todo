import React from 'react';
import Style from './App.module.scss';
import MessageService from './Message/MessageService';

import Navbar from './Navbar/Navbar';
import Board from './Board/Board';

export default function App() {
    return (
        <MessageService>
            <div className={`${Style['full-height-flex-column']}`}>
                <Navbar />
                <Board />
            </div>
        </MessageService>
    );
}