import React, { useContext } from 'react';
import Style from './Card.module.scss';
import Button, { EButtonFace } from '../../ui/Button';

import { FaLink, FaPlay, FaStop, FaPenToSquare, FaTrashCan, FaBug, FaListCheck  } from "react-icons/fa6";
import { ECardType } from '../../../Enum/ECardType';
import { cardAPIContext, ICardAPI } from '../../CardsAPI/CardAPI';
import { boardComponentContext, IBoardComponentContext } from '../Board';
import ICard from '../../../interface/ICard';

export default function Card(props: ICard) {

    const { addCardToSelectSet } = useContext(cardAPIContext) as ICardAPI;
    const { openEditPage } = useContext(boardComponentContext) as IBoardComponentContext;

    function handleDragStart(ev: React.DragEvent<HTMLDivElement>) {
        const element = ev.target as HTMLDivElement;
        ev.dataTransfer.setData('text/plain', element.id);
    }

    function onEditClicked() {
        addCardToSelectSet(props);
        openEditPage();
    }

    let cardTypeIconComponent: React.ReactNode;
    switch(props.type) {
        case ECardType.task:
            cardTypeIconComponent =  <FaListCheck className={`${Style['icon']} ${Style['success-icon']}`} />;
            break;
        case ECardType.regression:
            cardTypeIconComponent = <FaBug className={`${Style['icon']} ${Style['danger-icon']}`} />;
            break;
        default:
            console.error("encountered a card with id: ", props.uuid, " which is of type: '",props.type,"' a card cannot be of this type");
            break;
    }

    return(
        <div 
            id={props.uuid}
            className={`card ${Style['card']} ${Style[`card-${props.type}`]} is-primary`} 
            draggable="true" 
            onDragStart={(ev) => handleDragStart(ev)} 
        >
            <header className={`${Style['card-header']} card-header`}>
                <p className={`card-header-title ${Style['card-header-title']}`}>
                    <span className={`${Style['card-header-title-left']}`}>
                        {cardTypeIconComponent}
                        {props.title} 
                    </span>
                    <FaTrashCan className={`${Style['icon']} ${Style['danger-icon']}`} />
                </p>
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
                <Button face={EButtonFace.link} className={`card-footer-item ${Style['card-button']} ${Style['links-button']}`}>Links(3)<FaLink width="16" /></Button>
                <Button face={EButtonFace.primary} className={`card-footer-item ${Style['card-button']} ${Style['timer-button']}`}>1min <FaPlay width="16"/></Button>
                <Button onClick={onEditClicked} face={EButtonFace.link} className={`card-footer-item ${Style['card-button']} ${Style['edit-button']}`}>Edit <FaPenToSquare width="16"/></Button>
            </footer>
        </div>
    );
}