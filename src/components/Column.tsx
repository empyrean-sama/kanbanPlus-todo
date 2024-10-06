import React, { useContext } from "react";
import { useDroppable } from "@dnd-kit/core";
import { cardsAPIContext } from "./Card/CardsApiContext";
import CardsAPI from './Card/CardsApi';

import ECardState from "./Card/ECardState";
import Card from "./Card/Card";

import Style from './Column.module.scss';

/**
 * The Column is the visual representation of a card's state
 * ? The number of columns is fixed to three in version 1.0.0
 */
export default function({id}: {id: string}) {
    const {isOver, setNodeRef} = useDroppable({id});
    
    // Gain access to the cardsAPi using the context
    const { cardsAPI }: { cardsAPI: CardsAPI } = useContext(cardsAPIContext);

    return(
        <div className={Style['column']} ref={setNodeRef}>
            {id}
            {...(cardsAPI.getAllCards().filter((cardData) => cardData.state === id).map((cardData) => <Card id={cardData.uuid} key={cardData.uuid}>{cardData.title}</Card>))}
        </div>
    );
}