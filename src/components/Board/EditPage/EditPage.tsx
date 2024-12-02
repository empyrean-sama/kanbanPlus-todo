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
     * Get the title on the card currently being edited
     * @throws an error if there is no card to get the title
     * @returns the title as string
     */
    getTitle(): string,

    /**
     * Set the title of the card being edited
     * @param title: the new title of this card
     * @throws an error if no card is being edited
     */
    setTitle(title: string): void,

    /**
     * Get the type on the card currently being edited
     * @throws an error if there is no card to get the type from
     * @returns the type as an enum
     */
    getType(): ECardType,

    /**
     * Set the type of the card being edited
     * @param type: the new type of this card
     * @throws an error if no card is being edited
     */
    setType(type: ECardType): void,

    /**
     * Get the state of the card being edited
     * @returns the state as the ECardState enum
     * @throws an error if no card is being edited
     */
    getState(): ECardState,

    /**
     * Set the state of the card being edited
     * @param state to be set on the card being edited
     * @throws an error if no card is being edited
     */
    setState(state: ECardState): void,

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

    function getTitle(): string {
        if(card) {
            return card.title;
        }
        throw new Error('Error in edit page component, trying to get the title of null (there is no card set as being edited)');
    }

    function setTitle(title: string) {
        setCard((prevState: ICard | null) => {
            if(!prevState) {
                throw new Error('Error in edit page component, trying to set the title of a non existent card');
            }
            setSaveEnabled(true);  
            return {
                ...prevState,
                title
            };
        });
    }

    function getType(): ECardType {
        if(card) {
            return card.type;
        }
        throw new Error('Error in edit page component, trying to get the ECardType of null (there is no card set as being edited)')
    }

    function setType(type: ECardType) {
        setCard((prevState: ICard | null) => {
            if(!prevState) {
                throw new Error('Error in edit page component, trying to set the type of a non existent card');
            }
            return {
                ...prevState,
                type
            };
        });
    }

    function getState(): ECardState {
        if(card) {
            return card.state;
        }
        throw new Error('Error in edit page component, trying to get the state of null (there is no card set as being edited)')
    }

    function setState(state: ECardState) {
        setCard((prevState: ICard | null) => {
            if(!prevState) {
                throw new Error('Error in edit page component, trying to set the state of a non existent card');
            }
            setSaveEnabled(true);
            return {
                ...prevState,
                state
            };
        });
    }

    return (
        <editPageContext.Provider value={{getTitle, setTitle, setType, getType, getState, setState, handleSave, handleClose}}>
            <div className={Style['fixed-full-page']}>
                <Nav saveEnabled={saveEnabled} />
            </div>
        </editPageContext.Provider>
    );
}