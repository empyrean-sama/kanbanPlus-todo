import React, { useContext, useState } from 'react';
import Button, { EButtonFace } from '../ui/Button';
import { DropdownItem, dropdownContext, IDropdownContext } from '../ui/Dropdown';
import { INavbarContext, navbarContext } from './Navbar';

import Style from './CreateBoard.module.scss';
import { FaPlus } from 'react-icons/fa6';

export default function CreateNewBoard() {
    const {activeChildId, setActiveChildId, closeDropdown} = useContext(dropdownContext) as IDropdownContext;
    const {addNewBoard} = useContext(navbarContext) as INavbarContext;
    const [inputValue, setInputValue] = useState('');
    const [inputInDanger, setInputInDanger] = useState(false);

    function handleAddNewBoard() {
        if(inputValue) {
            const success = addNewBoard(inputValue);
            if(!success) {
                setInputInDanger(true);
            }
            else {
                setActiveChildId(inputValue);
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
            <input value={inputValue} onChange={handleInputChanged} className={`input mr-4 ${inputInDanger ? 'is-danger' : ''}`} type="text" placeholder="New Board Name" />
            <Button face={EButtonFace.link} onClick={handleAddNewBoard}><FaPlus /></Button>
        </DropdownItem>
    )
}