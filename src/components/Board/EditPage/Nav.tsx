import React, { useContext, useState } from 'react';
import Style from './Nav.module.scss';
import { editPageContext, IEditPageContext } from './EditPage';

import { ECardType } from '../../../Enum/ECardType';
import { Dropdown, DropdownItem } from '../../ui/Dropdown';
import ECardState, { strToECardState } from '../../../Enum/ECardState';
import Button, { EButtonFace } from '../../ui/Button';
import LabeledDropdown from '../../ui/LabeledInputs/LabeledDropdown';
import capitalize from 'just-capitalize';
import LabeledGrid from '../../ui/LabeledInputs/LabeledGrid';

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
                <LabeledGrid>
                    <LabeledDropdown 
                        label="State"
                        id="state-dropdown-editPage" 
                        placeholder='undefined' 
                        initialActiveId={capitalize(getEditCard().state)} 
                        onSelect={(selectedId) => setEditCard((card) => card.state = strToECardState(selectedId))}
                        spanFullWidth={false}
                    >
                        {
                            (getEditCard().type === ECardType.regression) ? 
                                <DropdownItem id={capitalize(ECardState.regression)}>Regression</DropdownItem> : 
                                <DropdownItem id={capitalize(ECardState.todo)}>Todo</DropdownItem>
                        }
                        <DropdownItem id={capitalize(ECardState.doing)}>Doing</DropdownItem>
                        <DropdownItem id={capitalize(ECardState.done)}>Done</DropdownItem>
                    </LabeledDropdown>
                </LabeledGrid>
                <div className={Style['exit-rack']}>
                    <Button face={EButtonFace.link} onClick={handleSave} disabled={!saveEnabled}>Save</Button>
                    <Button face={EButtonFace.danger} onClick={handleClose}>Close</Button>
                </div>
            </div>
        </header>
    );
}