import React from 'react';
import Style from './Card.module.scss';
import Button, { EButtonFace } from './Button';

import { FaLink, FaPlay, FaStop, FaPenToSquare, FaTrashCan  } from "react-icons/fa6";
export interface ICardProps {
    id: string,
    title: string,
    description: string,
    storyPoints: number
}

export default function Card(props: ICardProps) {

    function handleDragStart(ev: React.DragEvent<HTMLDivElement>) {
        const element = ev.target as HTMLDivElement;
        ev.dataTransfer.setData('text/plain', element.id);
    }

    return(
        <div 
            id={props.id}
            className={`card ${Style['card']} is-primary`} 
            draggable="true" 
            onDragStart={(ev) => handleDragStart(ev)} 
        >
            <header className="card-header">
                <p className={`card-header-title ${Style['card-header-title']}`}>{props.title} <FaTrashCan className={Style['delete-icon']} /></p>
            </header>
            <div className={`${Style['card-content']} card-content`}>
                <div className={`${Style['content']} content`}>
                    <div className={Style['tags']}>
                        <span className="tag is-warning">Story Points: {props.storyPoints}</span>
                    </div>
                    <div className={`${Style['description-text']}`}>
                        {props.description}
                    </div>
                </div>
            </div>
            <footer className="card-footer">
                <Button face={EButtonFace.link} className={`card-footer-item ${Style['card-button']}`}>Links(3)<FaLink width="16" /></Button>
                <Button face={EButtonFace.primary} className={`card-footer-item ${Style['card-button']}`}>1min <FaPlay width="16"/></Button>
                <Button face={EButtonFace.link} className={`card-footer-item ${Style['card-button']}`}>Edit <FaPenToSquare width="16"/></Button>
            </footer>
        </div>
    );
}