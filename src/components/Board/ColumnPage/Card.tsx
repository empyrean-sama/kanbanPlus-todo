import React, { createContext, useContext, useRef } from 'react';
import Style from './Card.module.scss';
import Button, { EButtonFace } from '../../ui/Button';

import { FaLink, FaPenToSquare, FaTrashCan, FaBug, FaListCheck  } from "react-icons/fa6";
import { ECardType } from '../../../Enum/ECardType';
import { boardComponentContext, IBoardComponentContext } from '../Board';
import ICard, { ICardProperties } from '../../../interface/ICard';
import { ISelectSetAPI, selectSetAPIContext } from '../../CardsAPI/SelectSetAPI';
import CardTimerButton, { ICardTimerButtonImperativeHandler } from './CardTimerButton';

export interface ICardComponentAPI {
    /**
     * Get the uuid of this card
     * @returns the uuid of this card as a string
     */
    getUUID(): string,
    
    /**
     * Get the properties of this card
     * @returns the card properties of this card
     */
    getCardProperties(): ICardProperties
}
export const cardComponentContext = createContext<ICardComponentAPI | undefined>(undefined); 

export default function Card(props: ICard) {

    const selectSetAPI = useContext(selectSetAPIContext) as ISelectSetAPI
    const { openEditPage } = useContext(boardComponentContext) as IBoardComponentContext;
    const timerButtonRef = useRef<ICardTimerButtonImperativeHandler | null>(null);

    function handleDragStart(ev: React.DragEvent<HTMLDivElement>) {
        const element = ev.target as HTMLDivElement;
        ev.dataTransfer.setData('text/plain', element.id);
        timerButtonRef.current?.handleReset();
    }

    function onEditClicked() {
        selectSetAPI.add(props);
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

    function getUUID(): string {
        return props.uuid;
    }

    function getCardProperties(): ICardProperties {
        return props;
    }

    return(
        <cardComponentContext.Provider value={{getUUID, getCardProperties}} >
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
                    <Button face={EButtonFace.link} className={`card-footer-item ${Style['card-button']} ${Style['links-button']}`} disabled>Links(0)<FaLink width="16" /></Button>
                    <CardTimerButton ref={timerButtonRef}/>
                    <Button onClick={onEditClicked} face={EButtonFace.link} className={`card-footer-item ${Style['card-button']} ${Style['edit-button']}`}>Edit <FaPenToSquare width="16"/></Button>
                </footer>
            </div>
        </cardComponentContext.Provider>
    );
}