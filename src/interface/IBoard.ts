import ICard, { IParsedCard } from "./ICard";

export default interface IBoard {
    name: string,
    cards: Array<ICard>
}

export interface IParsedBoard {
    name: string,
    cards: Array<IParsedCard>
}