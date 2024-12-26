import React, { FormEventHandler } from "react";
import Style from './LabeledTextInput.module.scss';
import LabeledInput, { ILabeledInputProps } from "./LabeledInput";

interface ILabeledTextInputProps extends ILabeledInputProps {
    value?: string,
    onInput?: FormEventHandler<HTMLInputElement>,
    disabled?: boolean
}

export default function LabeledTextInput({id, label, value, onInput, disabled}: ILabeledTextInputProps): React.ReactNode {
    return(
        <LabeledInput id={id} label={label}>
            <input id={id} className={`input ${Style['input']}`} type="text" value={value} onInput={onInput} disabled={disabled} />
        </LabeledInput>
    )
}