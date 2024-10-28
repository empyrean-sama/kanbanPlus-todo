import React, { createContext, HTMLAttributes, useRef, useState } from 'react';
import Style from './Navbar.module.scss';

import { Dropdown, DropdownDivider, IDropdownImperativeHandle } from '../ui/Dropdown';
import CreateNewBoard from './CreateBoard';
import DownloadProject from './DownloadProject';
import UploadProject from './UploadProject';
import BoardDropdownItem from './BoardDropdownItem';

export interface INavbarContext {
    /**
     * Try to add a new empty board to the project
     * @param boardName: the a project wide unique board name, can contain most types of characters
     * @returns true if the board was successfully created
     */
    addNewBoard(boardName: string): boolean

    /**
     * Get all the boards available in this project
     * @returns an array containing all the boards in this project
     */
    getBoards(): Array<string>,

    /**
     * Clear all the boards in this project
     * ? useful in situations like loading in a new project where you quickly need to clear out all the boards and add new ones in
     */
    clearBoards(): void,

    /**
     * Modify an existing board id to a new id
     * @param id The board id to replace
     * @param newId The new board id after replacement
     * @returns true if successful, failure may mean that a board with the replacement id already exists 
     */
    replaceBoard(id: string, newId: string): boolean,

    /**
     * Delete a board
     * @param id of the board to be deleted
     */
    deleteBoard(id: string): void
}
export const navbarContext = createContext<INavbarContext | undefined>(undefined);

export default function Navbar({...navAttributes}: HTMLAttributes<HTMLElement>) {
    const [boardIds, setBoardIds] = useState<Array<string>>([]);
    const boardsDropdownRef = useRef<IDropdownImperativeHandle>(null);

    function addNewBoard(boardName: string): boolean {
        const foundBoardWithSameId: boolean = !!(boardIds.find((value) => value === boardName));
        if(!foundBoardWithSameId) {
            setBoardIds((prevState) => [...prevState, boardName]);
            return true;
        }
        return false;
    }

    function getBoards() : Array<string> {
        return boardIds;
    }

    function clearBoards() {
        setBoardIds([]);
    }

    function replaceBoard(id: string, newId: string): boolean {
        let replacedBoard = false;
        if(!boardIds.find((boardId: string) => boardId === newId)) {
            setBoardIds((prevState) => [...prevState.map((i) => (i === id? newId: i))]);
            if(boardsDropdownRef.current?.getActiveChildId() === id) {
                boardsDropdownRef.current?.setActiveChild(newId);
            }
            replacedBoard = true;
        }
        return replacedBoard;
    }

    function deleteBoard(boardId: string): void {
        setBoardIds((prevState) => prevState.filter((id) => id !== boardId));
        if(boardsDropdownRef.current?.getActiveChildId() === boardId) {
            boardsDropdownRef.current?.clearActiveChild();
        }
    }

    return(
        <navbarContext.Provider value={{addNewBoard, getBoards, clearBoards, replaceBoard, deleteBoard}}>
            <nav className="navbar is-dark px-2">
                <div className="navbar-brand">
                    <h1 className={`${Style["logo-text"]}`}>KanbanPlus-Todo</h1>
                </div>
                <div className='navbar-menu'>
                    <div className='navbar-start'>
                        
                    </div>
                    <div className={`${Style["navbar-middle"]}`}>
                        <Dropdown placeholder='Select A Board To View' ref={boardsDropdownRef}>
                            {boardIds.map((id) => <BoardDropdownItem id={id} key={`board dropdown item ${id}`} />)}
                            <DropdownDivider />
                            <CreateNewBoard />
                        </Dropdown>
                    </div>
                    <div className='navbar-end'>
                        <UploadProject />
                        <DownloadProject />
                    </div>
                </div>
            </nav>
        </navbarContext.Provider>
    );
}