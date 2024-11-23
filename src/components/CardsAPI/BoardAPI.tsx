import React, { createContext, ReactNode, useState } from "react";

export interface IBoardAPI {
    /**
     * Try to add a new empty board to the project
     * @param boardName: A project wide unique board name, can contain most types of characters, cannot start or end with a ' ' though
     * @returns true if the board was successfully created
     */
    addNewBoard(boardName: string): boolean,

    /**
     * Get all the board Id's available in this project
     * @returns an array containing all the board Id's in this project
     */
    getBoardIds(): Array<string>,

    /**
     * Clear all the boards in this project
     * ? useful in situations like loading in a new project where you quickly need to clear out all the boards and add new ones in
     */
    clearBoards(): void,

    /**
     * Delete a board
     * @param id of the board to be deleted
     */
    deleteBoard(id: string): void

    /**
     * Register a function to run after a board is deleted
     * @param: callback to be called once a board was deleted
     */
    onDeleteBoard(callback: (boardIdDeleted: string) => void): void

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
}
export const boardAPIContext = createContext<IBoardAPI | undefined>(undefined);

export default function BoardAPI({children}: {children: ReactNode}) {
    const [boardIds, setBoardIds] = useState<Array<string>>([]);
    const onDeleteBoardCallbacks:  Array<(boardIdDeleted: string) => void> = [];
    const onReplaceBoardCallbacks: Array<(oldBoardId: string, newBoardId: string) => void> = [];

    function addNewBoard(boardName: string): boolean {
        const foundBoardWithSameId: boolean = !!(boardIds.find((value) => value === boardName));
        if(!foundBoardWithSameId) {
            setBoardIds((prevState) => [...prevState, boardName]);
            return true;
        }
        return false;
    }

    function getBoardIds() : Array<string> {
        return boardIds;
    }

    function clearBoards(): void {
        setBoardIds([]);
    }

    function onDeleteBoard(callback: (boardIdDeleted: string) => void) {
        onDeleteBoardCallbacks.push(callback);
    }

    function deleteBoard(boardId: string): void {
        setBoardIds((prevState) => prevState.filter((id) => id !== boardId));
        onDeleteBoardCallbacks.forEach((callback) => callback(boardId));
    }

    function modifyBoardId(id: string, newId: string): boolean {
        const foundBoardWithSameId = boardIds.find((boardId: string) => boardId === newId)
        if(!foundBoardWithSameId) {
            setBoardIds((prevState) => [...prevState.map((i) => (i === id? newId: i))]);
            onReplaceBoardCallbacks.forEach((callback) => callback(id, newId));
        }
        return !foundBoardWithSameId;
    }

    function onModifyBoardId(callback: (id: string, newId: string) => void) {
        onReplaceBoardCallbacks.push(callback);
    }

    return(
        <boardAPIContext.Provider value={
            {
                addNewBoard, 
                getBoardIds, 
                clearBoards, 
                deleteBoard, 
                onDeleteBoard, 
                modifyBoardId, 
                onModifyBoardId
            }
        }>
            {children}
        </boardAPIContext.Provider>
    );
}