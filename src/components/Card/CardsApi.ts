import ICardData from "./ICardData";
import ECardState from "./ECardState";
import ECardType from "./ECardType";

import { v4 as uuidv4 } from 'uuid';

/**
 * API to interact with CARD'S
 * todo: This API for the most part never throws exceptions or notifies the user when things are going wrong.. think if something needs to be done.. (syncing back and front end is not an issue atleast in 1.0.0) 
 * ? version: 1.0.0
 */
export default class CardsAPI {
    
    /** 
     * The current CardData inside the backlog
     * ! This must manually be kept in sync  
     */
    public cardsData: Array<ICardData> = null;
    
    /**
     * The react provided function to set cardsData
     * ! This must also be manually kept in sync
     */
    public setCardsData: React.Dispatch<React.SetStateAction<ICardData[]>> = null;

    /**
     * API to add a new card
     * @param data: data to initialize the card with
     */
    public addCard(data: ICardData): void {
        this.setCardsData((previousState) => [...previousState, data]);
    }
    
    /**
     * Utility API to add a new task card using system defaults except the title and description
     * @param title: the title of this card
     * @param description: the description associated with this card
     */
    public addTaskCard(title: string, description: string): void {
        this.addCard({
            uuid: uuidv4(),
            state: ECardState.todo,
            type: ECardType.task,
            filedOnDate: new Date(),
            title,
            description,
            storyPoints: 0,
        });
    }
    
    /**
     * Utility API to add a new regression card using system defaults except the title and description
     * @param title: the title of this card 
     * @param description: the description of this card
     */
    public addRegressionCard(title: string, description: string): void {
        this.addCard({
            uuid: uuidv4(),
            state: ECardState.todo,
            type: ECardType.regression,
            filedOnDate: new Date(),
            title,
            description,
            storyPoints: 0,
        });
    }

    /**
     * API to get all cards in the backlog
     * @returns an array of objects where each object implements ICardData
     */
    public getAllCards(): Array<ICardData> {
        return this.cardsData;
    }

    /**
     * API to delete all the cards inside the backlog
     */
    public deleteAllCards(): void {
        this.setCardsData([]);
    }

    /**
     * API to delete a card
     * @param uuid: the uuid string of an existing card to delete
     * @returns true if successfully deleted, otherwise there might either be an issue or the card may simply not exist
     */
    public deleteCard(uuid: string): void {
        this.setCardsData([...this.cardsData.filter((cardData) => cardData.uuid !== uuid)]);
    }

    /**
     * API to modify an existing card
     * ? there should be NO ISSUES about shallow copying when using this API
     * @param uuid: the uuid string of the card to be modified
     * @param data: the new data of the card.. 
     */
    public modifyCard(uuid: string, data: ICardData): void {
        this.setCardsData(this.cardsData.map((cardData) => {
            let returnData = cardData;
            if(cardData.uuid === uuid) {
                returnData = data;
            }
            return returnData;
        }));
    }
    /**
     * Utility API to modify the title of an existing card
     * @param uuid: the uuid string of a card to be modified
     * @param title: the new title to be replaced with
     */
    public modifyCardTitle(uuid: string, title: string): void {
        this.setCardsData(this.cardsData.map((cardData) => {
            if(cardData.uuid === uuid) {
                cardData.title = title;
            }
            return cardData;
        }));
    }
    /**
     * Utility API to modify the description of an existing card
     * @param uuid: the uuid string of a card to be modified
     * @param description: the new description of the card after modification
     */
    public modifyCardDescription(uuid: string, description: string): void {
        this.setCardsData(this.cardsData.map((cardData) => {
            if(cardData.uuid === uuid) {
                cardData.description = description;
            }
            return cardData;
        }));
    }
    /**
     * Utility API to modify the state of an existing card
     * @param uuid: the uuid string of a card to be modified
     * @param newState: the new state of this card
     */
    public modifyCardState(uuid: string, newState: ECardState): void {
        this.setCardsData(this.cardsData.map((cardData) => {
            if(cardData.uuid === uuid) {
                cardData.state = newState;
            }
            return cardData;
        }));
    }
    /**
     * API to get the data of an already existing card
     * @param uuid: the uuid of an existing card whose data is required
     * @returns an object implementing ICardData if the card is found otherwise undefined
     */
    public getCardData(uuid: string): ICardData | undefined {
        return this.cardsData.find((cardData) => cardData.uuid === uuid);
    }
    /**
     * Utility API to get the title of an already existing card
     * @param uuid: the uuid of an existing card whose title is required
     * @returns the title if found otherwise undefined
     */
    public getCardTitle(uuid: string): string | undefined {
        return this.getCardData(uuid)?.title || undefined;
    }
    /**
     * Utility API to get the description of an already existing card
     * @param uuid: the uuid of an existing card whose description is required
     * @returns the description if found otherwise undefined
     */
    public getCardDescription(uuid: string): string | undefined {
        return this.getCardData(uuid)?.description || undefined;
    }
    /**
     * Utility API to get the state of an already existing card
     * @param uuid: the uuid of an existing card whose state is required
     * @returns the state if found otherwise undefined
     */
    public getCardState(uuid: string): ECardState | undefined {
        return this.getCardData(uuid)?.state || undefined;
    }
}
export const cardsApiObj = new CardsAPI();