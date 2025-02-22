import React, { createContext, HTMLAttributes, useContext, useRef, useState } from 'react';
import Style from './Navbar.module.scss';

import { Dropdown, DropdownDivider, IDropdownImperativeHandle } from '../ui/Dropdown';
import CreateNewBoard from './CreateBoard';
import DownloadProject from './DownloadProject';
import UploadProject from './UploadProject';
import BoardDropdownItem from './BoardDropdownItem';
import { boardAPIContext, IBoardAPI } from '../CardsAPI/BoardAPI';
import { IProjectAPI, projectAPIContext } from '../CardsAPI/ProjectAPI';

export interface INavbarContext {
    /**
     * Clear the active child on the dropdown
     */
    clearDropdownActiveChild(): void
}
export const navbarContext = createContext<INavbarContext | undefined>(undefined);

export default function Navbar({...navAttributes}: HTMLAttributes<HTMLElement>) {
    const boardsDropdownRef = useRef<IDropdownImperativeHandle>(null);
    
    const projectAPI = useContext(projectAPIContext) as IProjectAPI;
    const boardAPI = useContext(boardAPIContext) as IBoardAPI;

    projectAPI.onModifyBoardId((oldId: string, newId: string) => {
        if(boardsDropdownRef.current?.getActiveChildId() === oldId) {
            boardsDropdownRef.current?.setActiveChild(newId);
        }
    })

    projectAPI.onDeleteBoard((boardIdDeleted: string) => {
        if(boardsDropdownRef.current?.getActiveChildId() === boardIdDeleted) {
            boardsDropdownRef.current?.clearActiveChild();
        }
    })

    function clearDropdownActiveChild() {
        boardsDropdownRef.current?.clearActiveChild();
    }

    function handleNewBoardSelected(newSelection: string) {
        boardAPI.setCurrentWorkingBoard(newSelection);
    }

    return(
        <navbarContext.Provider value={{ clearDropdownActiveChild }}>
            <nav className="navbar is-dark px-2">
                <div className="navbar-brand">
                    <h1 className={`${Style["logo-text"]}`}>KanbanPlus-Todo</h1>
                </div>
                <div className='navbar-menu'>
                    <div className='navbar-start'>
                        
                    </div>
                    <div className={`${Style["navbar-middle"]}`}>
                        <Dropdown placeholder='Select A Board To View' closeOnLoosingFocus={false} ref={boardsDropdownRef} id="board-selection-dropdown" onSelect={handleNewBoardSelected}>
                            {projectAPI.getAllBoardIDsInProject().map((id) => <BoardDropdownItem id={id} key={`board dropdown item ${id}`} />)}
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