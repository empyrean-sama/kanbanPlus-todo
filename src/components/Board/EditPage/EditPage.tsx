import React, { createContext, useContext, useState } from "react";
import Style from './EditPage.module.scss';
import clone from 'just-clone';
import { cardAPIContext, ICardAPI } from "../../CardsAPI/CardAPI";

import Nav from "./Nav";
import ICard from "../../../interface/ICard";
import { ECardType } from "../../../Enum/ECardType";
import { boardComponentContext, IBoardComponentContext } from "../Board";
import ECardState from "../../../Enum/ECardState";

export interface IEditPageContext {

    /**
     * Get the card being edited
     */
    getEditCard(): ICard,

    /**
     * Set value on the card being edited
     * ? the callback provides an object which is expected to be modified
     * @param callback: the callback provides the current state of the card being edited, I can make changes to it 
     */
    setEditCard(callback: (editCard: ICard) => void): void,

    /**
     * Close down the edit page without saving any changes made
     */
    handleClose(): void,

    /**
     * Save changes made into the CardAPI
     */
    handleSave(): void,
}
export const editPageContext = createContext<IEditPageContext | undefined>(undefined);

export default function EditCard() {
    const { getCardsSelected, clearCardsSelectSet, replaceCard  } = useContext(cardAPIContext) as ICardAPI;
    const { closeEditPage } = useContext(boardComponentContext) as IBoardComponentContext;
    
    const [ card, setCard ] = useState<ICard>(clone(getCardsSelected()[0]));
    const [ saveEnabled, setSaveEnabled ] = useState(false);

    function handleClose() {
        clearCardsSelectSet();
        closeEditPage();
    }

    function handleSave() {
        setSaveEnabled(false);
        replaceCard(card);
    }

    function getEditCard(): ICard {
        return card;
    }

    function setEditCard(callback: (cardState: ICard) => void) {
        const cardCopy = clone(card);
        callback(cardCopy);
        setCard(cardCopy);
        setSaveEnabled(true);
    }
    
    return (
        <editPageContext.Provider value={{getEditCard, setEditCard, handleSave, handleClose}}>
            <div className={Style['fixed-full-page']}>
                <Nav saveEnabled={saveEnabled} />
            </div>
        </editPageContext.Provider>
    );
}