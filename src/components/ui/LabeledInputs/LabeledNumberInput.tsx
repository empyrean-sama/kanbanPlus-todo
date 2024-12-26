import React, { FormEventHandler } from "react";
import Style from './LabeledNumberInput.module.scss';
import LabeledInput, { ILabeledInputProps } from "./LabeledInput";

interface ILabeledNumberInputProps extends ILabeledInputProps {
    value?: string,
    onInput?: FormEventHandler<HTMLInputElement>,
    disabled?: boolean
}

export default function LabeledNumberInput({id, label, value, onInput, disabled}: ILabeledNumberInputProps): React.ReactNode {
    return(
        <LabeledInput id={id} label={label}>
            <input id={id} className={`input ${Style['input']}`} type="number" value={value} onInput={onInput} disabled={disabled} />
        </LabeledInput>
    )
}