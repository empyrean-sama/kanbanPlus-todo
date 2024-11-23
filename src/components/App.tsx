import React from 'react';
import Style from './App.module.scss';
import MessageService from './Message/MessageService';

import Navbar from './Navbar/Navbar';
import Board from './Board/Board';
import CardAPI from './CardsAPI/CardAPI';
import BoardAPI from './CardsAPI/BoardAPI';
import ProjectAPI from './CardsAPI/ProjectAPI';

export default function App() {
    return (
        <MessageService>
            <CardAPI>
                <BoardAPI>
                    <ProjectAPI>
                        <div className={`${Style['full-height-flex-column']}`}>
                            <Navbar />
                            <Board />
                        </div>
                    </ProjectAPI>
                </BoardAPI>
            </CardAPI>
        </MessageService>
    );
}