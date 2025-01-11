import IBoard, { IParsedBoard } from "./IBoard";

interface IAbsoluteProjectProperties {
    projectName: string,
    cardsAPIVersion: string,
}

export default interface IProject extends IAbsoluteProjectProperties {
    boards: Array<IBoard>
}

export interface IParsedProject extends IAbsoluteProjectProperties {
    boards: Array<IParsedBoard>
}