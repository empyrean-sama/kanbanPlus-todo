import React, { createContext, ReactNode, useContext, useState } from "react";
import ICard from '../../interface/ICard';
import { boardAPIContext, IBoardAPI } from "./BoardAPI";
import ProjectAPI, { IProjectAPI, projectAPIContext } from "./ProjectAPI";
import { IBoardComponentContext } from "../Board/Board";

export interface ISelectSetAPI {
    /**
     * Get the currently selected card
     * ? Considering using the getCardIds method, it is more performant as select set really on stores id's as part of its state  
     * ? This method might be useful when say opening the edit card page
     * @returns the currently selected card if any
     */
    getCards(): Array<ICard>,

    /**
     * Get a list of all cards in the select set
     * @returns an array of all the cards in the select set
     */
    getCardIds(): Array<string>,

    /**
     * Set the selected cards
     * ? this method might be useful when say opening the edit card page
     * @param cards that were selected
     */
    setCards(cards: Array<ICard>): void,

    /**
     * Utility method to clear all currently selected cards
     */
    clear(): void

    /**
     * Add this card to the select set
     * @param card to be added into the select set, can either be the entire card object or just its uuid
     * ? The select set only stores uuid's as its state 
     */
    add(card: ICard | string): void,

    /**
     * Remove a particular card from the select set
     * @param uuid: removes the card with this uuid from the select set 
     */
    remove(uuid: string): void
}
export const selectSetAPIContext = createContext<ISelectSetAPI | undefined>(undefined);

export default function SelectSetAPI({children}: {children: ReactNode}) {
    const [selectSet, setSelectSet] = useState(new Set<string>());   
    const projectAPI = useContext(projectAPIContext) as IProjectAPI;
    const boardAPI = useContext(boardAPIContext) as IBoardAPI;

    function getCards(): Array<ICard> {
        return projectAPI.getCards().filter((card) => selectSet.has(card.uuid));
    }

    function getCardIds(): Array<string> {
        return [...selectSet];
    }

    function setCards(cards: Array<ICard>): void {
        setSelectSet(new Set<string>(cards.map((card) => card.uuid)));
    }

    function clear(): void {
        setSelectSet(new Set<string>());
    }

    function add(card: ICard | string): void {
        let uuid = '';
        if(typeof card === 'string') {
            uuid = card;
        }
        else {
            uuid = card.uuid;
        }
        setSelectSet((prevState) => new Set<string>([...prevState.values(), uuid]));
    }

    function remove(uuid: string) {
        setSelectSet((prevState) => new Set<string>([...prevState.values()].filter((id) => id !== uuid)));
    }

    return(
        <selectSetAPIContext.Provider value={{getCards, getCardIds, setCards, clear, add, remove}}>
            {children}
        </selectSetAPIContext.Provider>
    );
}