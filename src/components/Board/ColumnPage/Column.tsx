import React, { HTMLAttributes, PropsWithChildren, useContext, useEffect } from 'react';
import Style from './Column.module.scss';

import { boardComponentContext, IBoardComponentContext } from '../Board';
import ECardState from '../../../Enum/ECardState';
import { boardAPIContext, IBoardAPI } from '../../CardsAPI/BoardAPI';
import ICard, { ITimeEntry } from '../../../interface/ICard';

export interface IColumnProps extends HTMLAttributes<HTMLDivElement> {
    title: string,
    associatedState: ECardState
}

/**
 * The column on the board holding all cards at play,
 * ! Setting drop related attributes like drop, dragOver and etc.. will not have any effect
 * ? Only 4 of these exist as of version 1.0
 * @returns a Column react component
 */
export default function Column({title, associatedState, className, children, ...htmlAttributes}: PropsWithChildren<IColumnProps>) {
    const customClassName = className || "";
    const boardAPI = useContext(boardAPIContext) as IBoardAPI; 
    const boardContextAPI = useContext(boardComponentContext) as IBoardComponentContext;
    
    function handleDrop(ev: React.DragEvent<HTMLDivElement>) {
        ev.preventDefault();
        const dropId: string = ev.dataTransfer.getData("text/plain");
        boardContextAPI.moveCard(dropId, associatedState, ev.clientY);
    }

    function handleDragOver(ev: React.DragEvent<HTMLDivElement>) {
        ev.preventDefault();
    }

    const cardsOnColumn =  boardAPI.getCards().filter((card: ICard) => card.state.toLowerCase() === title.toLowerCase());
    const calculateTimeSpent = (timeSpentEntries: ITimeEntry[]) => timeSpentEntries.reduce((sum, entry) => sum += entry.duration.toHours(), 0);
    const remainingTime = cardsOnColumn.reduce((sum, card) => (card.estimatedTime.toHours() - calculateTimeSpent(card.timeSpentEntries)) + sum, 0);

    return(
        <div
            className={`column ${Style['column']} ${customClassName}`}
            {...htmlAttributes}
            onDrop={(ev) => handleDrop(ev)}
            onDragOver={(ev) => handleDragOver(ev)}
        >
            <div className={`${Style['title']} is-size-4 `}>{title} ({remainingTime}hrs)</div>
            <div className={`${Style['cards']}`}>
                {children}
            </div>
        </div>
    )
}