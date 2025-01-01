import React, { createContext, ReactNode, useContext, useState } from "react";
import ICard, { ICardProperties } from "../../interface/ICard";
import { IProjectAPI, projectAPIContext } from "./ProjectAPI";
import clone from "just-clone";

export interface IBoardAPI {

    /**
     * Sets the current board in context
     * ! Will cause all the cards on the board to refresh, expensive performance wise 
     * @param boardName: the board name inside the project to switch to
     * @throws an error if the boardName is not available in the project
     */
    setCurrentWorkingBoard(boardName: string): void,

    /**
     * Gets the current working board
     * @returns the current working board
     */
    getCurrentWorkingBoard(): string,

    /**
     * Get the id's of all the cards on the board
     * @returns an array of all the card id's on this board
     */
    getCardIds(): Array<string>,

    /**
     * Get all cards on the board
     * @returns an array containing all the cards
     */
    getCards(): Array<ICard>,

    /**
     * Create and add a new card onto the current board
     * @param cardProperties: optional properties can be set if the card is to be initialized while creation
     * @returns the uuid of the newly created card
     */
    addCard(cardProperties?: ICardProperties): string,

    /**
     * 
     * @param callback 
     */
    setCards(callback: (prevState: Array<ICard>) => Array<ICard>): void

    /**
     * Modify the properties of a card on the board
     * ? This method only checks the current board, the projectAPI might provide an API for project wide work
     * @param uuid: The uuid of the card whose properties need to be updated
     * @param updatePropertiesCallback: The callback provides the old ICardProperties object corresponding to the given uuid, MUST RETURN A NEW OBJECT with the correct properties as the output
     * @throws an error if a card with the given uuid is not found on the board
     */
    modifyCard(uuid: string, newPropertiesCallback: (cardProperties: ICardProperties) => ICardProperties): void,
}
export const boardAPIContext = createContext<IBoardAPI | undefined>(undefined);

export default function BoardAPI({children}: {children: ReactNode}) {
    const [currentBoardId, setCurrentBoardId] = useState('');    
    const projectAPI = useContext(projectAPIContext) as IProjectAPI;

    function setCurrentWorkingBoard(boardName: string): void {
        setCurrentBoardId(boardName);
    }

    function getCurrentWorkingBoard(): string {
        return currentBoardId;
    }

    function getCardIds(): Array<string> {
        return projectAPI.getCards(currentBoardId).map((card) => card.uuid);
    }

    function getCards(): Array<ICard> {
        return projectAPI.getCards(currentBoardId);
    }

    function addCard(cardProperties?: ICardProperties): string {
        return projectAPI.addCard(currentBoardId, cardProperties);
    }

    function modifyCard(uuid: string, updatePropertiesCallback: (cardProperties: ICardProperties) => void | ICardProperties): void {
        const cardToModify: ICard | undefined = projectAPI.getCards(currentBoardId).find((card: ICard) => card.uuid === uuid);
        if(!cardToModify) {
            throw new Error(`Unable to find a card with the given uuid (${uuid}) on the board '${currentBoardId}'`);
        }
        const ret = updatePropertiesCallback(cardToModify);
        projectAPI.modifyCard(uuid, ret || cardToModify, [currentBoardId]);
    }

    function setCards(callback: (prevState: Array<ICard>) => Array<ICard>): void {
        projectAPI.setCards(currentBoardId, callback(getCards()));
    }

    return(
        <boardAPIContext.Provider value={{setCurrentWorkingBoard, getCurrentWorkingBoard, getCardIds, getCards, addCard, setCards, modifyCard}}>
            {children}
        </boardAPIContext.Provider>
    );
}