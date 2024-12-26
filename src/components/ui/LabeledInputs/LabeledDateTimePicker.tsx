import React from "react";
import Style from './LabeledDateTimePicker.module.scss';
import LabeledInput, { ILabeledInputProps } from "./LabeledInput";
import DateTimePicker from "../DateTimePicker";

export interface ILabeledDateTimePickerProps extends ILabeledInputProps {
    selectTime: boolean,
    disabled?: boolean
}

export default function LabeledDateTimePicker({id, label, selectTime, disabled}: ILabeledDateTimePickerProps ) {
    return (
        <LabeledInput id={id} label={label}>
            <DateTimePicker id={id} spanFullWidth selectTime={selectTime} disabled={disabled}></DateTimePicker>
        </LabeledInput>
    );
}