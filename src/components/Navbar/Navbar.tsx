import React, { createContext, HTMLAttributes, useState } from 'react';
import Style from './Navbar.module.scss';
import Button, { EButtonType } from '../ui/Button';

import { FaDownload, FaUpload } from "react-icons/fa";
import { Dropdown, DropdownDivider, DropdownItem } from '../ui/Dropdown';
import CreateNewBoard from './CreateBoard';

export interface INavbarContext {
    addNewBoard: (boardName: string) => boolean
}
export const navbarContext = createContext<INavbarContext | undefined>(undefined);

export default function Navbar({...navAttributes}: HTMLAttributes<HTMLElement>) {
    const [boardIds, setBoardIds] = useState<Array<string>>([]);

    /**
     * Utility function to help create a new board
     * @param boardName name of the new board to be created
     * @returns true if the board was successfully created
     */
    function addNewBoard(boardName: string): boolean {
        const foundBoardWithSameId: boolean = !!(boardIds.find((value) => value === boardName));
        if(!foundBoardWithSameId) {
            setBoardIds([...boardIds, boardName]);
            return true;
        }
        return false;
    }

    return(
        <navbarContext.Provider value={{addNewBoard}}>
            <nav className="navbar is-dark px-2">
                <div className="navbar-brand">
                    <h1 className={`${Style["logo-text"]}`}>KanbanPlus-Todo</h1>
                </div>
                <div className='navbar-menu'>
                    <div className='navbar-start'>
                        
                    </div>
                    <div className='navbar-middle'>
                        <Dropdown placeholder='Select A Board To View'>
                            {boardIds.map((id) => <DropdownItem id={id} key={`board dropdown item ${id}`}>{id}</DropdownItem>)}
                            <DropdownDivider />
                            <CreateNewBoard />
                        </Dropdown>
                    </div>
                    <div className='navbar-end'>
                    <Button className='mr-4' type={EButtonType.link}><span className="mr-2">Upload</span><FaUpload /></Button>
                    <Button><span className="mr-2">Download Project</span><FaDownload /></Button>
                    </div>
                </div>
            </nav>
        </navbarContext.Provider>
    );
}