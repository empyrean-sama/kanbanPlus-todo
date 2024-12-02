import React, { createContext, ReactNode, useEffect, useState } from "react";
import clone from "just-clone";
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
    getAllCards(): ICard[],

    /**
     * Replace a card on the board with a new card
     * ? The uuid is taken into account while trying to replace the card
     * ? This method is useful say in the edit page, the edit page can hold a copy to allow closing without saving easier
     * ! The existence of this method may lead to bugs down the line as it is implicitly agreed that two different objects can share the same uuid
     * @param newCard: The new card object to replace the old card object with 
     */
    replaceCard(newCard: ICard): void,

    /**
     * Get the currently selected card
     * ? this method might be useful when say opening the edit card page
     * @returns the currently selected card if any
     */
    getCardsSelected(): ICard[],

    /**
     * Set the selected cards
     * ? this method might be useful when say opening the edit card page
     * @param cards that were selected
     */
    setCardsSelected(cards: ICard[]): void,

    /**
     * Utility method to clear all currently selected cards
     */
    clearCardsSelectSet(): void

    /**
     * Add this card to the select set
     * @param card to be added into the select set
     */
    addCardToSelectSet(card: ICard): void,

    /**
     * Remove a particular card from the select set
     * @param card 
     */
    removeCardFromSelectSet(uuid: string): void

    /**
     * Register a callback to be called when the select set changes
     * @param callback: the new select set is passed into this callback, do whatever needs doing
     */
    onSelectSetChange(callback: (selectSet: ICard[]) => void): void,

    /**
     * The react setCards method exposed; use this to set all cards on this board
     * ! This method is essentially bypassing the whole CardAPI, do not use this if at all possible 
     * @param callback: the react method to set state 
     */
    setCards(callback: React.SetStateAction<ICard[]>): void,
}
export const cardAPIContext = createContext<ICardAPI | undefined>(undefined);

export default function CardAPI({children}: {children: ReactNode}) {
    const [cards, setCards] = useState(getTestTodoCards());
    const [selectedCardsSet, setSelectedCardsSet] = useState<Set<string>>(new Set<string>());

    // Call everybody listening to onSelectSetChange
    const onSelectSetChangeCallbacks:  Array<(selectSet: ICard[]) => void> = [];
    useEffect(() => {
        onSelectSetChangeCallbacks.forEach((callback) => callback(getCardsSelected()));
    }, [selectedCardsSet])
    
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

    function replaceCard(newCard: ICard): void {
        setCards((prevState) => {
            return prevState.map((card) => {
                if(card.uuid === newCard.uuid) {
                    card = clone(newCard);
                }
                return card;
            });
        });
    }

    function getCardsSelected(): ICard[] {
        return cards.filter((card) => selectedCardsSet.has(card.uuid));
    }

    function setCardsSelected(selectSet: ICard[]): void {
        setSelectedCardsSet(new Set<string>(selectSet.map((card) => card.uuid)));
    }

    function clearCardsSelectSet(): void {
        setSelectedCardsSet(new Set<string>());
    }

    function addCardToSelectSet(card: ICard) {
        setSelectedCardsSet((prevState) => new Set<string>([...prevState.values(), card.uuid]));
    }

    function removeCardFromSelectSet(uuid: string) {
        setSelectedCardsSet((prevState) => new Set<string>([...prevState.values()].filter((id) => id !== uuid)));
    }

    function onSelectSetChange(callback: (selectSet: ICard[]) => void) {
        onSelectSetChangeCallbacks.push(callback);
    }

    return(
        <cardAPIContext.Provider value={
                {
                    setCardState, getAllCardIds, getAllCards, replaceCard, setCards,
                    getCardsSelected, setCardsSelected, clearCardsSelectSet, addCardToSelectSet, removeCardFromSelectSet, onSelectSetChange
                }}>
            {children}
        </cardAPIContext.Provider>
    );
}