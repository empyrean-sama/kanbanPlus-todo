import React, { createContext, useContext } from 'react';
import Style from './Board.module.scss';

import Column from './Column';
import Card from './Card';

import ECardState from '../../Enum/ECardState';
import { cardAPIContext, ICardAPI } from '../CardsAPI/CardAPI';

export interface IBoardComponentContext {
    /**
     * This utility method will set the card's state and also position of the card in the new column
     * @param cardId: the unique id of the card whose state should be changed
     * @param state: the new state of the card
     * @param clientY: where was the card dropped? (get this value from the dom event ev.clientY)
     */
    moveCard(cardId: string, state: ECardState, clientY: number): void;
}
export const boardComponentContext = createContext<IBoardComponentContext | undefined>(undefined);

export default function Board() {

    const { getAllCards, setCardState, setCards } = useContext(cardAPIContext) as ICardAPI;
    const cards = getAllCards();

    function moveCard(id: string, state: ECardState, dropY: number): void {
        const columnCards: HTMLDivElement[] = [...(document.getElementById(`column-${state}`) as HTMLDivElement).children[1].children] as HTMLDivElement[];
        if(columnCards.length === 0) {
            return setCardState(id, state);
        }

        const columnCardCenters = columnCards.map((card, index) => {
            const boundingRect = card.getBoundingClientRect();
            const centerY = boundingRect.top + ((boundingRect.bottom - boundingRect.top) / 2);
            return {id: card.id, centerY};
        });

        let i = 0;
        let idUnderConsideration: string = columnCardCenters[i].id;
        let afterFlag = false;
        while(i < columnCardCenters.length && columnCardCenters[i].centerY < dropY) {
            idUnderConsideration = columnCardCenters[i].id;
            i++;
            afterFlag = true;
        }

        if(idUnderConsideration !== id)
        {
            //! Move only if absolutely necessary, recompute will constitute buggy behavior
            setCards((prevState) => {
                // Start calculating the new state
                let newState = [...prevState];
    
                // Cache and remove the card to be moved
                const indexToRemove = newState.findIndex((card) => card.uuid === id);
                const cardToMove = newState.splice(indexToRemove, 1)[0];
                cardToMove.state = state;
    
                if(afterFlag) {
                    // Calculate the index to insert after
                    const indexToInsertAfter = newState.findIndex((card) => card.uuid === idUnderConsideration);
                    newState = [
                        ...newState.slice(0, indexToInsertAfter + 1),
                        cardToMove,
                        ...newState.slice(indexToInsertAfter + 1)
                    ]
                }
                else {
                    // Calculate the index to insert before
                    const indexToInsertBefore = newState.findIndex((card) => card.uuid === idUnderConsideration);
                    newState = [
                        ...newState.slice(0, indexToInsertBefore),
                        cardToMove,
                        ...newState.slice(indexToInsertBefore)
                    ]
                }
                return newState;
            });
        }        
    }

    return (
        <boardComponentContext.Provider value={{moveCard}}>
            <div className={`${Style['column-holder']}`}>
                <Column id={`column-${ECardState.todo}`} title='Todo' associatedState={ECardState.todo}>
                    {cards.filter((card) => card.state === ECardState.todo).map((card) => <Card key={card.uuid} id={card.uuid} type={card.type} title={card.title} description={card.description} storyPoints={card.storyPoints} />) }    
                </Column>
                <Column id={`column-${ECardState.doing}`} title='Doing' associatedState={ECardState.doing}>
                    {cards.filter((card) => card.state === ECardState.doing).map((card) => <Card key={card.uuid} id={card.uuid} type={card.type} title={card.title} description={card.description} storyPoints={card.storyPoints} />) }
                </Column>
                <Column id={`column-${ECardState.done}`} title='Done' associatedState={ECardState.done}>
                    {cards.filter((card) => card.state === ECardState.done).map((card) => <Card key={card.uuid} id={card.uuid} type={card.type} title={card.title} description={card.description} storyPoints={card.storyPoints} />) }
                </Column>
                <Column id={`column-${ECardState.regression}`} title='Regression' associatedState={ECardState.regression}>
                    {cards.filter((card) => card.state === ECardState.regression).map((card) => <Card key={card.uuid} id={card.uuid} type={card.type} title={card.title} description={card.description} storyPoints={card.storyPoints} />) }
                </Column>
            </div>
        </boardComponentContext.Provider>
    );
}