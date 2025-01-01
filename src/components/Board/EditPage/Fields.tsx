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
import { IProjectAPI, projectAPIContext } from "../../CardsAPI/ProjectAPI";
import { boardAPIContext, IBoardAPI } from "../../CardsAPI/BoardAPI";

export default function Fields() {

    const projectAPI = useContext(projectAPIContext) as IProjectAPI;
    const boardAPI = useContext(boardAPIContext) as IBoardAPI;
    const editPageAPI = useContext(editPageContext) as IEditPageContext;
    const editCard = editPageAPI.getProperties();

    function handleStoryPointsChange(ev: React.FormEvent<HTMLInputElement>) {
        editPageAPI.setProperties((editCard) => {
            const newValue = Number.parseInt((ev.target as HTMLInputElement).value);
            if(newValue) {
                editCard.storyPoints = Number.parseInt((ev.target as HTMLInputElement).value);
            }
            else {
                editCard.storyPoints = 0;
            }
        });
    }

    function handleTypeChange(newSelectedId: string) {
        editPageAPI.setProperties((editCard) => {
            editCard.type = newSelectedId.toLowerCase() as ECardType;
        });
    }

    function handleBoardSelected(newBoard: string) {
        editPageAPI.setProperties((editCard) => {
            editCard.board = newBoard;
        });
    }

    return (
        <section className={Style['field-section']} key={'field-section'}>
            <LabeledGrid>
                <LabeledTextInput id="uuid" disabled value={editPageAPI.getUUID()} />
                <LabeledDropdown  id="board" placeholder="undefined, will never be displayed" initialActiveId={boardAPI.getCurrentWorkingBoard()} onSelect={handleBoardSelected}>
                    {projectAPI.getAllBoardIDsInProject().map((boardId) => <DropdownItem id={boardId} key={`${boardId} key in edit-modify page`}>{boardId}</DropdownItem>)}
                </LabeledDropdown>
                <LabeledDropdown  id="type" placeholder="undefined, will never be displayed" initialActiveId={capitalize(editCard.type)} onSelect={handleTypeChange}>
                    <DropdownItem id="Task">Task</DropdownItem>
                    <DropdownItem id="Regression">Regression</DropdownItem>
                </LabeledDropdown>
                <LabeledNumberInput id="story points" value={editCard.storyPoints.toString()} onChange={handleStoryPointsChange} />
            </LabeledGrid>
            <LabeledGrid>
                <LabeledDateTimePicker id="edit-modify-page-filed-date" selectTime={true} label="filed date" disabled  />
                <LabeledDateTimePicker id="edit-modify-page-due-date" selectTime={true} label="due date" />
            </LabeledGrid>
        </section>
    );
}