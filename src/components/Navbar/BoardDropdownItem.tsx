import React, { useContext, useState } from 'react';
import { DropdownItem } from '../ui/Dropdown';

import { INavbarContext, navbarContext } from './Navbar';

import { FaPenToSquare } from "react-icons/fa6";
import { FaEraser } from "react-icons/fa6";
import { FaTrashCan } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa6";

import Style from './BoardDropdownItem.module.scss';

export default function BoardDropdownItem({id}: {id: string}) {

    const { replaceBoard } = useContext(navbarContext) as INavbarContext;
    const [isEditable, setIsEditable] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [inputInError, setInputInError] = useState(false);

    function onEditClicked(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.stopPropagation();
        setInputValue(id);
        setIsEditable(true);
    }

    function onDeleteClicked(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.stopPropagation();
    }

    function onCommitClicked(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.stopPropagation();
        const success = replaceBoard(id, inputValue);
        if(success) {
            setIsEditable(false);
            setInputInError(false);
        }
        else {
            setInputInError(true);
        }
    }

    function onInputClick(e: React.MouseEvent<HTMLInputElement, MouseEvent>) {
        e.stopPropagation();
    }

    function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.stopPropagation();
        setInputValue(e.target.value);
        if(inputInError) {
            setInputInError(false);
        }
    }

    let idElement: string | React.ReactNode | undefined = undefined;
    let editButton: React.ReactNode | undefined;
    let actionButton: React.ReactNode | undefined;

    if(isEditable) {
        idElement = <input className={`input ${inputInError? 'is-danger' : ''}`} type='text' value={inputValue} onChange={onInputChange} onClick={onInputClick} />
        editButton = <button onClick={onEditClicked} className='mr-2'><FaEraser className={`${Style['icon']} ${Style['erase-icon']}`}/></button>
        actionButton = <button onClick={onCommitClicked}><FaCheck className={`${Style['icon']} ${Style['commit-icon']}`}/></button>
    }
    else {
        idElement = id;
        editButton = <button onClick={onEditClicked} className='mr-2'><FaPenToSquare className={`${Style['icon']} ${Style['edit-icon']}`}/></button>
        actionButton = <button onClick={onDeleteClicked}><FaTrashCan className={`${Style['icon']} ${Style['delete-icon']}`}/></button>
    }

    return (
        <DropdownItem id={id} className={`${Style['space-out']}`}>
            {idElement}
            <div className={`${Style['flex']}`}>
                {editButton}
                {actionButton}
            </div>
        </DropdownItem>
    );
}