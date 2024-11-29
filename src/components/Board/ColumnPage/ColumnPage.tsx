import React, { useContext } from 'react';
import Style from './ColumnPage.module.scss'; 
import { cardAPIContext, ICardAPI } from '../../CardsAPI/CardAPI';
import ECardState from '../../../Enum/ECardState';
import Card from './Card';
import Column from './Column';

export default function ColumnPage() {
    const { getAllCards } = useContext(cardAPIContext) as ICardAPI;
    const cards = getAllCards();

    return (
        <div className={`${Style['column-holder']}`}>
            <Column id={`column-${ECardState.todo}`} title='Todo' associatedState={ECardState.todo}>
                {cards.filter((card) => card.state === ECardState.todo).map((card) => <Card key={card.uuid} {...card} />) }    
            </Column>
            <Column id={`column-${ECardState.doing}`} title='Doing' associatedState={ECardState.doing}>
                {cards.filter((card) => card.state === ECardState.doing).map((card) => <Card key={card.uuid} {...card} />) }
            </Column>
            <Column id={`column-${ECardState.done}`} title='Done' associatedState={ECardState.done}>
                {cards.filter((card) => card.state === ECardState.done).map((card) => <Card key={card.uuid} {...card} />) }
            </Column>
            <Column id={`column-${ECardState.regression}`} title='Regression' associatedState={ECardState.regression}>
                {cards.filter((card) => card.state === ECardState.regression).map((card) => <Card key={card.uuid} {...card} />) }
            </Column>
        </div>
    );
}