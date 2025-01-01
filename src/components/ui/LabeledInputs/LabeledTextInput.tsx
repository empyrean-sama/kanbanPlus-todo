import React, { FormEventHandler } from "react";
import Style from './LabeledTextInput.module.scss';
import LabeledInput, { ILabeledInputProps } from "./LabeledInput";

interface ILabeledTextInputProps extends ILabeledInputProps {
    value?: string,
    onInput?: React.ChangeEventHandler<HTMLInputElement> ,
    disabled?: boolean
}

export default function LabeledTextInput({id, label, value, onInput, disabled}: ILabeledTextInputProps): React.ReactNode {
    return(
        <LabeledInput id={id} label={label}>
            <input type="text" value={value} onInput={onInput} disabled={disabled} className="input" />
        </LabeledInput>
    )
}