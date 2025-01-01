import React, { useContext, useState } from 'react';
import Button, { EButtonFace } from '../ui/Button';
import { DropdownItem, dropdownContext, IDropdownContext } from '../ui/Dropdown';

import Style from './CreateBoard.module.scss';
import { FaPlus } from 'react-icons/fa6';
import { IProjectAPI, projectAPIContext } from '../CardsAPI/ProjectAPI';

export default function CreateNewBoard() {
    const projectAPI = useContext(projectAPIContext) as IProjectAPI;

    const [inputValue, setInputValue] = useState('');
    const [inputInDanger, setInputInDanger] = useState(false);

    function handleAddNewBoard() {
        if(inputValue.trim()) {
            const success = projectAPI.addNewBoard(inputValue.trim());
            if(!success) {
                setInputInDanger(true);
            }
            else {
                setInputValue('');
            }
        }
        else {
            setInputInDanger(true);
        }
    }

    function handleInputChanged(e: React.ChangeEvent<HTMLInputElement>) {
        if(inputInDanger) {
            setInputInDanger(false);
        }
        setInputValue(e.target.value)
    }

    return (
        <DropdownItem id="create-board" className={Style['flex']} selectable={false}>
            <input id="create-board-input" value={inputValue} onChange={handleInputChanged} className={`input mr-4 ${inputInDanger ? 'is-danger' : ''}`} type="text" placeholder="New Board Name" />
            <Button id="create-board-button" face={EButtonFace.link} onClick={handleAddNewBoard}><FaPlus /></Button>
        </DropdownItem>
    )
}