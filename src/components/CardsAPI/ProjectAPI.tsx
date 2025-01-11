import React, { createContext, ReactNode, useState } from 'react';
import IProject, { IParsedProject } from '../../interface/IProject';
import { getCardsAPIVersion } from '../../utilities/cardsAPIUtils';
import { cloneDeep } from 'lodash';
import IBoard from '../../interface/IBoard';
import ICard, { getDefaultCardProperties, ICardProperties, IParsedDateTime, IParsedTime } from '../../interface/ICard';
import { v4 as uuidV4 } from 'uuid'
import { KanbanDateTime } from '../ui/DateTimePicker';
import KanbanTime from '../ui/class/KanbanTime';

export interface IProjectAPI {
    /** 
    * Load a project from memory 
    * @param project: the project json string which can be parsed into a IProject object
    * @throws an error if the string cannot be parsed
    */
    loadProject(project: string): void, 

    /** 
    * Gets the entire project as an object that can be converted to json if required 
    * @param name: the name of this project, if undefined will always try to use the name already set inside memory or will go with an undefined name as a last ditch
    * @returns an IProject object that can be passed into JSON.Stringify to serialize into a string
    */
    serializeProject(name?: string): IProject,

    /**
     * Utility method to get the id's of all the boards present in this project
     * @returns an array containing the id's of all the boards in this project
     */
    getAllBoardIDsInProject(): Array<string>

    /**
     * Try to add a new empty board to the project
     * @param boardName: A project wide unique board name, can contain most types of characters, cannot start or end with a ' ' though
     * @returns true if the board was successfully created
     */
    addNewBoard(boardName: string): boolean,

    /**
     * Modify an existing board id to a new id
     * @param id The board id to replace
     * @param newId The new board id after replacement
     * @returns true if successful, failure may mean that a board with the replacement id already exists 
     */
    modifyBoardId(id: string, newId: string): boolean,

    /**
     * Register a function to run when a board id is replaced
     * @param callback: the function called when a board id is modified
     */
    onModifyBoardId(callback: (oldId: string, newId: string) => void): void 

    /**
     * Clear all the boards in this project
     * ? useful in situations like loading in a new project where you quickly need to clear out all the boards and add new ones in
     */
    clearBoards(): void,

    /**
     * Delete a board
     * @param id of the board to be deleted
     */
    deleteBoard(id: string): void,

    /**
     * Register a function to run after a board is deleted
     * @param: callback to be called once a board was deleted
     */
    onDeleteBoard(callback: (boardIdDeleted: string) => void): void

    /**
     * Utility method to get all cards inside the project
     * @param boardName is an optional parameter, if the passed in parameter can be coerced to FALSE, will get ALL the CARDS in the ENTIRE PROJECT
     * @returns a list of cards as an array
     */
    getCards(boardName?: string): Array<ICard>,

    /**
     * Add a card to any board in the entire project using this API call
     * @param boardName: the name of the board on which the card is to be added
     * @param cardProperties: optional properties, if set will add them onto the card in the place of default values defined in ICard
     * @returns the uuid of the newly created and added card
     */
    addCard(boardName: string, cardProperties?: ICardProperties): string,

    /**
     * Move the card in question into the board specified by boardId
     * @param uuid: the uuid of the card to be moved
     * @param newBoardId: the id of the board to which the card must be moved
     * @throws an error if either a card with the uuid or a board with the given newBoardId cannot be found 
     */
    moveCard(uuid: string, newBoardId: string): void,

    /**
     * Set the cards for a given board
     * @param boardName: the board whose cards are to be set
     * @param cards: an array of cards that are to be set
     * @throws an error if a board with boardName cannot be found 
     */
    setCards(boardName: string, cards: Array<ICard>): void,

    /**
     * Modifies an exiting card in the project
     * todo: the boardNames optional parameter is currently not doing anything, see if some optimization can be done using it
     * @param uuid: the uuid of the card to be modified
     * @param cardData: the new data of the card
     * @param boardNames: this is an optional prop, will narrow search to only a specific board if this prop is provided
     */
    modifyCard(uuid: string, cardData: ICardProperties, boardNames?: Array<string>): void,
}
export const projectAPIContext = createContext<IProjectAPI | undefined>(undefined);

export default function ProjectAPI({children}: {children: ReactNode}) {
    const [project, setProject] = useState<IProject>({projectName: 'undefined', cardsAPIVersion: getCardsAPIVersion(), boards: []})
    const onDeleteBoardCallbacks:  Array<(boardIdDeleted: string) => void> = [];
    const onReplaceBoardCallbacks: Array<(oldBoardId: string, newBoardId: string) => void> = [];
    
    function loadProject(projectString: string) {
        const project: IParsedProject = JSON.parse(projectString) as IParsedProject;
        for(const board of project.boards) {
            for(let j=0; j<board.cards.length; j++) {
                const createdDate: IParsedDateTime = board.cards[j].createdDate as IParsedDateTime;
                const dueDate: IParsedDateTime = board.cards[j].dueDate as IParsedDateTime;
                const estimatedTime: IParsedTime = board.cards[j].estimatedTime as IParsedTime;
                board.cards[j].createdDate   = new KanbanDateTime(createdDate._day, createdDate._month, createdDate._year, createdDate._hour, createdDate._minute, createdDate._isAm);
                board.cards[j].dueDate       = new KanbanDateTime(dueDate._day, dueDate._month, dueDate._year, dueDate._hour, dueDate._minute, dueDate._isAm);
                board.cards[j].estimatedTime = new KanbanTime(estimatedTime._days, estimatedTime._hours, estimatedTime._minutes);
            }
        }
        setProject(project as IProject);
    }

    function serializeProject(name?: string): IProject {
        const projectName = name || project.projectName || "undefined name";
        return {
            projectName,
            cardsAPIVersion: getCardsAPIVersion(),
            boards: cloneDeep(project.boards)
        }
    }

    function getAllBoardIDsInProject(): Array<string> {
        return project.boards.map((board) => board.name);
    }

    function addNewBoard(boardName: string): boolean {
        const foundBoardWithSameId: boolean = !!(getAllBoardIDsInProject().find((value) => value === boardName));
        if(!foundBoardWithSameId) {
            setProject((prevState) => {
                const newState: IProject = cloneDeep(prevState);
                newState.boards.push({
                    name: boardName,
                    cards: []
                });
                return newState;
            });
            return true;
        }
        return false;
    }

    function modifyBoardId(id: string, newId: string): boolean {
        const foundBoardWithSameId = project.boards.find((board: IBoard) => board.name === newId)
        if(!foundBoardWithSameId) {
            setProject((prevState) => {
                const newState = cloneDeep(prevState);
                newState.boards = newState.boards.map((board: IBoard) => {
                    if(board.name === id) {
                        board.name = newId;
                    }
                    return board;
                });
                return newState;
            });
            onReplaceBoardCallbacks.forEach((callback) => callback(id, newId));
        }
        return !foundBoardWithSameId;
    }

    function onModifyBoardId(callback: (id: string, newId: string) => void) {
        onReplaceBoardCallbacks.push(callback);
    }

    function clearBoards(): void {
        setProject((prevState) => {
            const newState = cloneDeep(prevState);
            newState.boards = [];
            return newState;
        })
    }

    function deleteBoard(boardId: string): void {
        setProject((prevState) => {
            const newState = cloneDeep(prevState);
            newState.boards.filter((board: IBoard) => board.name !== boardId);
            return newState;
        });
        onDeleteBoardCallbacks.forEach(callback => callback(boardId));
    }

    function onDeleteBoard(callback: (boardIdDeleted: string) => void) {
        onDeleteBoardCallbacks.push(callback);
    }

    function getCards(boardName?: string): Array<ICard> {
        const cards: Array<ICard> = [];
        project.boards.forEach((board: IBoard) => {
            if(boardName && boardName === board.name) {
                cards.push(...board.cards);
            }
            else if(!boardName) {
                cards.push(...board.cards);
            }
        })
        return cards;
    }

    function addCard(boardName: string, cardProperties?: ICardProperties): string {
        const uuid = uuidV4();
        const properties = cardProperties || getDefaultCardProperties();
        const card: ICard = {
            uuid,
            ...properties
        }
        setProject((prevState) => {
            const newState = cloneDeep(prevState);
            const board = newState.boards.find((board: IBoard) => board.name === boardName) as IBoard;
            board.cards.push(card);
            return newState;
        });
        return uuid;
    }

    function moveCard(uuid: string, newBoardId: string): void {
        setProject((prevState) => {
            const newState = cloneDeep(prevState);
            let card: ICard | null = null;
            for(let i=0; i< newState.boards.length; i++) {
                let cardIndex = newState.boards[i].cards.findIndex((card) => card.uuid === uuid);
                if(cardIndex !== -1) {
                    if(newState.boards[i].name === newBoardId) {
                        //? card already on the correct board case
                        return newState;
                    }
                    card = newState.boards[i].cards.splice(cardIndex, 1)[0];
                    break;
                }
            }
            if(!card) {
                throw new Error(`No card found with the given uuid: '${uuid}' in the entire project`);
            }
            const board = newState.boards.find((board) => board.name === newBoardId);
            if(!board) {
                throw new Error(`No board found in the project with the name: ${newBoardId}`);
            }
            board.cards = [card, ...board.cards];
            return newState;
        });
    }

    function setCards(boardName: string, cards: Array<ICard>): void {
        setProject((prevState) => {
            const newState = cloneDeep(prevState);
            const board = newState.boards.find((board) => board.name === boardName);
            if(!board) {
                throw new Error('Did not find a board with the name ' + boardName + ' while calling the function setCards');
            }
            board.cards = cards;
            return newState;
        });
    }

    function modifyCard(uuid: string, cardData: ICardProperties, boardNames?: Array<string>) {
        setProject((prevState) => {
            const newState = cloneDeep(prevState);
            for(let i=0; i < newState.boards.length; i++) {
                for(let j=0; j < newState.boards[i].cards.length; j++) {
                    if(newState.boards[i].cards[j].uuid === uuid) {
                        newState.boards[i].cards[j] = {
                            ...cardData,
                            uuid
                        }
                    }
                }
            }
            return newState;
        });
    }

    return(
        <projectAPIContext.Provider value={
            {
                loadProject, serializeProject,
                getAllBoardIDsInProject, addNewBoard, modifyBoardId, clearBoards, deleteBoard, onModifyBoardId, onDeleteBoard,
                getCards, addCard, moveCard, setCards, modifyCard
            }
        }>
            {children}
        </projectAPIContext.Provider>
    )
}