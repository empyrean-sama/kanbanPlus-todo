import React, { createContext, ReactNode, useState } from "react";
import ICard, { getTestTodoCards } from '../../interface/ICard';
import ECardState from "../../Enum/ECardState";
export interface ICardAPI {
    /**
     * Set the state of a card on this board, will not throw if the cards was not found
     * @param cardId: the unique id of the card to set the state of
     * @param state: the state this card is to be set to
     */
    setCardState(cardId: string, state: ECardState): void;

    /**
     * Get the id's of all the cards on the board
     * @returns an array of all the card id's on this board
     */
    getAllCardIds(): {id: string}[],

    /**
     * Get all cards on the board
     * @returns an array containing all the cards
     */
    getAllCards(): ICard[]

    /**
     * The react setCards method exposed; use this to set all cards on this board
     * ! This method is essentially bypassing the whole CardAPI, do not use this if at all possible 
     * @param callback: the react method to set state 
     */
    setCards(callback: React.SetStateAction<ICard[]>): void
}
export const cardAPIContext = createContext<ICardAPI | undefined>(undefined);

export default function CardAPI({children}: {children: ReactNode}) {
    const [cards, setCards] = useState(getTestTodoCards());
    
    function setCardState(id: string, state: ECardState): void {
        setCards((prevState) => prevState.map((card) => {
            if(card.uuid === id) {
                card.state = state;
            }
            return card;
        }));
    }

    function getAllCardIds(): {id: string}[] {
        return cards.map((card) => { return {id: card.uuid} });
    }

    function getAllCards(): ICard[] {
        return cards;
    }

    return(
        <cardAPIContext.Provider value={{setCardState, getAllCardIds, getAllCards, setCards}}>
            {children}
        </cardAPIContext.Provider>
    );
}