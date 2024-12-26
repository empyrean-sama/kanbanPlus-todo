import React, { useContext, useEffect, useRef } from "react";
import Style from './LabeledDropdown.module.scss';

import { Dropdown } from "../Dropdown";
import LabeledInput, { ILabeledInputProps } from "./LabeledInput";

export interface ILabeledDropdownProps extends ILabeledInputProps {
    placeholder: string,
    initialActiveId?: string,
    
    /** defaults to true */
    spanFullWidth?: boolean,
    
    disabled?: boolean
    onSelect?: (newSelectedId: string) => void
}

export default function LabeledDropdown({id, label, placeholder, initialActiveId, spanFullWidth, disabled, onSelect, children}: React.PropsWithChildren<ILabeledDropdownProps>) {
    
    if(spanFullWidth === undefined || spanFullWidth === null) {
        spanFullWidth = true;
    }

    return (
        <LabeledInput id={id} label={label}>
            <Dropdown placeholder={placeholder} labelId={id} initialActiveId={initialActiveId} disabled={disabled} spanFullWidth={spanFullWidth} onSelect={onSelect}>
                {children}
            </Dropdown>
        </LabeledInput>
    )
}