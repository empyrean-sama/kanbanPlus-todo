import React, { useContext, useEffect, useRef } from "react";
import Style from './StateDropdown.module.scss';
import capitalize from "just-capitalize";

import ECardState, { strToECardState } from "../../../Enum/ECardState";
import { Dropdown, DropdownItem } from "../../ui/Dropdown";
import { editPageContext, IEditPageContext } from "./EditPage";
import { ECardType } from "../../../Enum/ECardType";

export default function StateDropdown() {

    const { getEditCard, setEditCard } = useContext(editPageContext) as IEditPageContext

    return(
        <span className={`${Style['span']}`}>
            <label className={`${Style['label']}`} htmlFor="state-dropdown-editPage">State: </label>
            <Dropdown 
                placeholder='undefined' 
                labelId="state-dropdown-editPage" 
                initialActiveId={capitalize(getEditCard().state)} onSelect={(selectedId) => setEditCard((card) => card.state = strToECardState(selectedId))}
            >
                {
                    (getEditCard().type === ECardType.regression) ? 
                        <DropdownItem id={capitalize(ECardState.regression)}>Regression</DropdownItem> : 
                        <DropdownItem id={capitalize(ECardState.todo)}>Todo</DropdownItem>
                }
                <DropdownItem id={capitalize(ECardState.doing)}>Doing</DropdownItem>
                <DropdownItem id={capitalize(ECardState.done)}>Done</DropdownItem>
            </Dropdown>
        </span>
    )
}