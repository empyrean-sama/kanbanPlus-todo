import React from "react";
import Style from "./Fields.module.scss";
import { DropdownItem } from "../../ui/Dropdown";

import LabeledGrid from "../../ui/LabeledInputs/LabeledGrid";
import LabeledTextInput from "../../ui/LabeledInputs/LabeledTextInput";
import LabeledNumberInput from "../../ui/LabeledInputs/LabeledNumberInput";
import LabeledDropdown from "../../ui/LabeledInputs/LabeledDropdown";
import LabeledDateTimePicker from "../../ui/LabeledInputs/LabeledDateTimePicker";

export default function Fields() {

    return(
        <section className={Style['field-section']}>
            <LabeledGrid>
                <LabeledTextInput id="uuid" disabled />
                <LabeledDropdown id="type" placeholder="undefined" initialActiveId="task" onSelect = {() => {}}>
                    <DropdownItem id="task">task</DropdownItem>
                    <DropdownItem id="regression">regression</DropdownItem>
                </LabeledDropdown>
                <LabeledNumberInput id="story points" />
            </LabeledGrid>
            <LabeledGrid>
                <LabeledDateTimePicker id="filed date" selectTime disabled/>
                <LabeledDateTimePicker id="due date" selectTime/>
                <LabeledNumberInput id="Time Spent" disabled />
            </LabeledGrid>        
        </section>
    )
}