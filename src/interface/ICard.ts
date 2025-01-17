import ECardState from '../Enum/ECardState';
import { ECardType } from '../Enum/ECardType';
import { KanbanDateTime } from '../components/ui/DateTimePicker';
import KanbanTime from '../components/ui/class/KanbanTime';

//? The Parsed keyword corresponds to the object got from JSON.Parse, this is mainly only seen when loading a project from disk as in the upload button on the nav
export interface IParsedDateTime {
    _day: number,
    _month: number,
    _year: number,
    _hour: number,
    _minute: number,
    _isAm: boolean
}

export interface IParsedTime {
    _days: number,
    _hours: number,
    _minutes: number
}

export interface ITimeEntry {
    when: KanbanDateTime,
    duration: KanbanTime
}

interface IUuid {
    uuid: string,
}

export interface ICardAbsoluteProperties {
    type: ECardType,
    title: string,
    description: string,
    state: ECardState,
    storyPoints: number,
    timeSpentEntries: Array<ITimeEntry>
}

export interface ICardTimeProperties {
    createdDate: KanbanDateTime,
    dueDate: KanbanDateTime,
    estimatedTime: KanbanTime,
}
export interface ICardProperties extends ICardAbsoluteProperties, ICardTimeProperties {}

export interface IParsedCardTimeProperties {
    createdDate: IParsedDateTime | KanbanDateTime,
    dueDate: IParsedDateTime | KanbanDateTime,
    estimatedTime: IParsedTime | KanbanTime,
}

export default interface ICard extends IUuid, ICardProperties {}
export interface IParsedCard extends IUuid, ICardAbsoluteProperties, IParsedCardTimeProperties {}

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