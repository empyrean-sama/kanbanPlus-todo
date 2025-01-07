import ECardState from '../Enum/ECardState';
import { ECardType } from '../Enum/ECardType';
import { KanbanDateTime } from '../components/ui/DateTimePicker';
import KanbanTime from '../components/ui/class/KanbanTime';

export interface ITimeEntry {
    /** Entry is expected to be something like 12 DEC 2024 8:30am to 12 Dec 2024 9:30am */
    durationString: string,

    /** The duration time is in HOURS */
    durationTime: number
}

interface IUuid {
    uuid: string,
}

export interface ICardProperties {
    type: ECardType,
    title: string,
    description: string,
    state: ECardState,
    createdDate: KanbanDateTime,
    dueDate: KanbanDateTime,
    storyPoints: number,
    estimatedTime: KanbanTime,
    timeSpentEntries: Array<ITimeEntry>
}

export default interface ICard extends IUuid, ICardProperties {}

export function getDefaultCardProperties(): ICardProperties {
    return {
        type: ECardType.task,
        title: "Untitled Card",
        description: "This card has no description",
        state: ECardState.todo,
        createdDate: KanbanDateTime.now(),
        dueDate: new KanbanDateTime(),
        storyPoints: 0,
        estimatedTime: new KanbanTime(),
        timeSpentEntries: []
    };
}