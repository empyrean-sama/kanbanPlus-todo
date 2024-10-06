import ECardState from "./ECardState";
import ECardType from "./ECardType";

/**
 * This is the minimum amount of data required to show a card on the board
 */
export default interface ICardData {
    uuid: string,
    state: ECardState
    type: ECardType
    filedOnDate: Date,
    deadline?: Date,
    title: string,
    description: string,
    storyPoints: number,
    estimatedTime?: string // Units are to be included in this string 
}