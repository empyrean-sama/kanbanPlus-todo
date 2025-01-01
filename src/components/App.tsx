import React from 'react';
import Style from './App.module.scss';
import MessageService from './Message/MessageService';

import Navbar from './Navbar/Navbar';
import Board from './Board/Board';

import ProjectAPI from './CardsAPI/ProjectAPI';
import BoardAPI from './CardsAPI/BoardAPI';
import SelectSetAPI from './CardsAPI/SelectSetAPI';

export default function App() {
    return (
        <MessageService>
            <ProjectAPI>
                <BoardAPI>
                    <SelectSetAPI>
                        <div className={`${Style['full-height-flex-column']}`}>
                            <Navbar />
                            <Board />
                        </div>
                    </SelectSetAPI>
                </BoardAPI>
            </ProjectAPI>
        </MessageService>
    );
}