import React, { useContext, useEffect, useRef } from "react";
import Style from './LabeledDropdown.module.scss';

import { Dropdown } from "./Dropdown";

export interface ILabeledDropdownProps {
    label: string,
    id: string,
    placeholder: string,
    initialActiveId?: string,
    /** defaults to true */
    spanFullWidth?: boolean,
    disabled?: boolean
    onSelect?: (newSelectedId: string) => void
}

export default function LabeledDropdown({label, id, placeholder, initialActiveId, spanFullWidth, disabled, onSelect, children}: React.PropsWithChildren<ILabeledDropdownProps>) {
    
    if(spanFullWidth === undefined || spanFullWidth === null) {
        spanFullWidth = true;
    }

    return(
        <span className={`${Style['span']}`}>
            <label className={`${Style['label']}`} htmlFor={id}>{label}: </label>
            <Dropdown placeholder={placeholder} labelId={id} initialActiveId={initialActiveId} disabled={disabled} spanFullWidth={spanFullWidth} onSelect={onSelect}>
                {children}
            </Dropdown>
        </span>
    )
}