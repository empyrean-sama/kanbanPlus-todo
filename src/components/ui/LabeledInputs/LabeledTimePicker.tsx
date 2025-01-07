import React from "react";
import Style from './LabeledTimePicker.module.scss'

import LabeledInput, { ILabeledInputProps } from "./LabeledInput";
import TimePicker from "../TimePicker";
import KanbanTime from "../class/KanbanTime";

export interface ILabeledTimePickerProps extends ILabeledInputProps {
    selectDays: boolean,
    disabled?: boolean,
    value?: KanbanTime,
    onChange?: (newTime: KanbanTime) => void
}

export default function LabeledTimePicker({id, disabled, label, selectDays, value, onChange}: ILabeledTimePickerProps) {
    return (
        <LabeledInput id={id} label={label}>
            <TimePicker disabled={disabled} id={id} spanFullWidth selectDays={selectDays} value={value} onChange={onChange}></TimePicker>
        </LabeledInput>
    );
}