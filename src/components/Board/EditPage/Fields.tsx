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
import { KanbanDateTime } from "../../ui/DateTimePicker";
import LabeledTimePicker from "../../ui/LabeledInputs/LabeledTimePicker";

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

    function handleDueDateSelected(newDateTime: KanbanDateTime): void {
        editPageAPI.setProperties((editCard) => {
            editCard.dueDate = newDateTime;
        });
    }

    return (
        <section className={Style['field-section']} key={'field-section'}>
            <LabeledGrid>
                <LabeledTextInput id="uuid-edit-page" label="uuid" disabled value={editPageAPI.getUUID()} />
                <LabeledDropdown  id="board-edit-page" label="board" placeholder="undefined, will never be displayed" initialActiveId={boardAPI.getCurrentWorkingBoard()} onSelect={handleBoardSelected}>
                    {projectAPI.getAllBoardIDsInProject().map((boardId) => <DropdownItem id={boardId} key={`${boardId} key in edit-modify page`}>{boardId}</DropdownItem>)}
                </LabeledDropdown>
                <LabeledDropdown  id="type-edit-page" label="type" placeholder="undefined, will never be displayed" initialActiveId={capitalize(editCard.type)} onSelect={handleTypeChange}>
                    <DropdownItem id="Task">Task</DropdownItem>
                    <DropdownItem id="Regression">Regression</DropdownItem>
                </LabeledDropdown>
                <LabeledNumberInput id="story-points-edit-page" label="story points" value={editCard.storyPoints.toString()} onChange={handleStoryPointsChange} />
            </LabeledGrid>
            <LabeledGrid>
                <LabeledDateTimePicker id="filed-date-edit-page" selectTime={true} label="filed date" value={editCard.createdDate} disabled  />
                <LabeledDateTimePicker id="due-date-edit-page" selectTime={true} label="due date" value={editCard.dueDate} onChange={handleDueDateSelected} />
                <LabeledTimePicker id="estimated-time-edit-page" label="estimated time" selectDays={true} value={editCard.estimatedTime} onChange={(newTime) => editPageAPI.setProperties((editCard) => editCard.estimatedTime = newTime)} />
                <LabeledTimePicker id="time-elapsed-edit-page" label="elapsed time" selectDays={true} value={editCard.timeSpent} disabled />
            </LabeledGrid>
        </section>
    );
}