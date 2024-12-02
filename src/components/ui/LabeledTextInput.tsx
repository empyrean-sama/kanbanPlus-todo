import React from "react";
import Style from './LabeledTextInput.module.scss';

export interface ILabeledTextInputProps {
    label: string,
    disabled?: boolean
    value?: string,
    /** defaults to text */
    type?: 'text' | 'number',
    onInput?(newValue: string): void,
}

export default function LabeledTextInput({label, disabled, value, type, onInput}: ILabeledTextInputProps): React.ReactNode {
    return(
        <label className={Style['label']}>
            <span>{label}: </span>
            <input 
                disabled={disabled} 
                type={type || "text"}
                className={`${Style['input']} input`} 
                value={value} onInput={(ev) => onInput ? onInput((ev.target as HTMLInputElement).value) : undefined} 
            />
        </label>
    )
}