import IBoard from "./IBoard";

export default interface IProject {
    projectName: string,
    cardsAPIVersion: string,
    boards: Array<IBoard>
}