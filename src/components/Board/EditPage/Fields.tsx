import React from "react";
import Style from "./Fields.module.scss";
import LabeledTextInput from "../../ui/LabeledTextInput";
import { DropdownItem } from "../../ui/Dropdown";
import LabeledDropdown from "../../ui/LabeledDropdown";
import DateTimePicker from "../../ui/DateTimePicker";

export default function Fields() {
    return(
        <section className={Style['field-section']}>
            <div className={Style['left-column']}>
                <LabeledTextInput label="Uuid" disabled={true} />
                <LabeledDropdown 
                    label="Type" 
                    id="edit-page-modify-type-field" 
                    placeholder="undefined" 
                    initialActiveId="task" 
                    disabled={false}
                    onSelect = {() => {}}
                >
                    <DropdownItem id="task">task</DropdownItem>
                    <DropdownItem id="regression">regression</DropdownItem>
                </LabeledDropdown>
                <LabeledTextInput label="StoryPoints" />
            </div>
            <div className={Style['right-column']}>
                <DateTimePicker id="pick due date" selectTime={false} spanFullWidth={true}/>
            </div>
        </section>
    )
}