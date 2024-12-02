import React, { useContext, useState } from 'react';
import Style from './Nav.module.scss';

import { cardAPIContext, ICardAPI } from '../../CardsAPI/CardAPI';
import { boardComponentContext, IBoardComponentContext } from '../Board';
import { editPageContext, IEditPageContext } from './EditPage';

import ICard from '../../../interface/ICard';
import { ECardType } from '../../../Enum/ECardType';
import { FaXmark } from 'react-icons/fa6';
import { Dropdown, DropdownItem } from '../../ui/Dropdown';
import ECardState from '../../../Enum/ECardState';
import Button, { EButtonFace } from '../../ui/Button';
import StateDropdown from './StateDropdown';

export default function EditCardNav({ saveEnabled }: {saveEnabled: boolean}): React.ReactNode {
    const { getEditCard, setEditCard, handleClose, handleSave } = useContext(editPageContext) as IEditPageContext;
    
    return (
        <header className={`${Style['header']} ${getEditCard().type === ECardType.task ? Style['task-card'] : Style['regression-card']}`}>
            <div className={Style['title-rack']}>
                <input 
                    className={`${Style['input']} input is-size-4`} type="text" 
                    placeholder="Card Title" value={getEditCard().title} onChange={(ev) => setEditCard((card) => card.title = ev.target.value)} 
                />
            </div>
            <div className={Style['state-rack']}>
                <StateDropdown />
                <div className={Style['exit-rack']}>
                    <Button face={EButtonFace.link} onClick={handleSave} disabled={!saveEnabled}>Save</Button>
                    <Button face={EButtonFace.danger} onClick={handleClose}>Close</Button>
                </div>
            </div>
        </header>
    );
}