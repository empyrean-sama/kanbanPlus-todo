import ICard from "./ICard";

export default interface IBoard {
    name: string,
    cards: Array<ICard>
}