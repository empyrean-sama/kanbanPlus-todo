import React, { useContext } from "react";
import Style from "./Fields.module.scss";
import { DropdownItem } from "../../ui/Dropdown";
import capitalize from "just-capitalize";

import LabeledGrid from "../../ui/LabeledInputs/LabeledGrid";
import LabeledTextInput from "../../ui/LabeledInputs/LabeledTextInput";
import LabeledNumberInput from "../../ui/LabeledInputs/LabeledNumberInput";
import LabeledDropdown from "../../ui/LabeledInputs/LabeledDropdown";
import LabeledDateTimePicker from "../../ui/LabeledInputs/LabeledDateTimePicker";
import { editPageContext, IEditPageContext } from "./EditPage";

import { ECardType } from "../../../Enum/ECardType";

export default function Fields() {

    const editPageAPI = useContext(editPageContext) as IEditPageContext ;
    const editCard = editPageAPI.getEditCard();

    function handleStoryPointsInput(ev: React.FormEvent<HTMLInputElement>) {
        editPageAPI.setEditCard((editCard) => {
            editCard.storyPoints = Number.parseInt((ev.target as HTMLInputElement).value)
        });
    }

    function handleTypeChange(newSelectedId: string) {
        editPageAPI.setEditCard((editCard) => {
            editCard.type = newSelectedId.toLowerCase() as ECardType;
        })
    }

    return(
        <section className={Style['field-section']}>
            <LabeledGrid>
                <LabeledTextInput id="uuid" disabled value={editCard.uuid} />
                <LabeledDropdown  id="board" placeholder="undefined">
                    
                </LabeledDropdown>
                <LabeledDropdown  id="type" placeholder="undefined" initialActiveId={capitalize(editCard.type)} onSelect={handleTypeChange}>
                    <DropdownItem id="Task">Task</DropdownItem>
                    <DropdownItem id="Regression">Regression</DropdownItem>
                </LabeledDropdown>
                <LabeledNumberInput id="story points" value={editCard.storyPoints.toString()} onInput={handleStoryPointsInput} />
            </LabeledGrid>
            <LabeledGrid>
                <LabeledDateTimePicker id="filed date" selectTime disabled/>
                <LabeledDateTimePicker id="due date" selectTime/>
                <LabeledNumberInput id="estimated time" />
                <LabeledNumberInput id="time spent" disabled />
            </LabeledGrid>        
        </section>
    )
}