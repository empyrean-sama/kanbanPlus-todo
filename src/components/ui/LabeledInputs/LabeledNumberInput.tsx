import React, { FormEventHandler } from "react";
import Style from './LabeledNumberInput.module.scss';
import LabeledInput, { ILabeledInputProps } from "./LabeledInput";

interface ILabeledNumberInputProps extends ILabeledInputProps {
    value?: string,
    onChange?: React.ChangeEventHandler<HTMLInputElement>,
    disabled?: boolean
}

export default function LabeledNumberInput({id, label, value, onChange, disabled}: ILabeledNumberInputProps): React.ReactNode {
    return(
        <LabeledInput id={id} label={label}>
            <input id={id} className={`input ${Style['input']}`} type="number" value={value} onChange={onChange} disabled={disabled} />
        </LabeledInput>
    )
}