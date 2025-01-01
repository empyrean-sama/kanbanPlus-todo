import React from "react";
import Style from './LabeledDateTimePicker.module.scss';
import LabeledInput, { ILabeledInputProps } from "./LabeledInput";
import DateTimePicker, { KanbanDateTime } from "../DateTimePicker";

export interface ILabeledDateTimePickerProps extends ILabeledInputProps {
    selectTime: boolean,
    disabled?: boolean,
    value?: KanbanDateTime,
    onChange?: (newDate: KanbanDateTime) => void
}

export default function LabeledDateTimePicker({id, value, onChange, label, selectTime, disabled}: ILabeledDateTimePickerProps ) {
    return (
        <LabeledInput id={id} label={label}>
            <DateTimePicker 
                id={id} 
                spanFullWidth 
                selectTime={selectTime} 
                disabled={disabled}
                value={value}
                onChange={onChange}
            ></DateTimePicker>
        </LabeledInput>
    );
}