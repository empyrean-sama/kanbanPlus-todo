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
    setCards(callback: React.SetStateAction<ICard[]>): void,

    /**
     * Get the currently selected card
     * ? this method might be useful when say opening the edit card page
     * @returns the currently selected card if any
     */
    getSelectedCards(): ICard[] | undefined,

    /**
     * Set the selected cards
     * ? this method might be useful when say opening the edit card page
     * @param cards that were selected
     */
    setSelectedCards(cards: ICard[]): void,

}
export const cardAPIContext = createContext<ICardAPI | undefined>(undefined);

export default function CardAPI({children}: {children: ReactNode}) {
    const [cards, setCards] = useState(getTestTodoCards());
    const [selectedCards, setSelectedCardsState] = useState<ICard[] | undefined>(undefined);
    
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

    function getSelectedCards(): ICard[] | undefined {
        return selectedCards;
    }

    function setSelectedCards(cards: ICard[]): void {
        setSelectedCardsState(cards);
    }

    return(
        <cardAPIContext.Provider value={{setCardState, getAllCardIds, getAllCards, setCards, getSelectedCards, setSelectedCards}}>
            {children}
        </cardAPIContext.Provider>
    );
}