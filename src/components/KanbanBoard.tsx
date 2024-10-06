import React, { useContext } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { cardsAPIContext } from "./Card/CardsApiContext";
import CardsAPI from "./Card/CardsApi";
import ECardState from "./Card/ECardState";
import Column from "./Column";

import Style from './KanbanBoard.module.scss';

/**
 * The KanbanBoard containing the dnd context and all the cards shown to the user
 */
export default function() {
    // Gain access to the cardsAPi using the context
    const { cardsAPI }: { cardsAPI: CardsAPI } = useContext(cardsAPIContext);

    /**
     * This handler fires possibly when a card is dragged into a column and let go
     */
    function handleDragEnd(event: DragEndEvent) {
        const cardUuid: string = event.active.id as string;
        const newState: ECardState = event.over.id as ECardState;
        cardsAPI.modifyCardState(cardUuid, newState);
    }

    return(
        <DndContext onDragEnd={handleDragEnd}>
            <div className={Style['column-holder']}>
                <Column id={ECardState.todo}></Column>
                <Column id={ECardState.doing}></Column>
                <Column id={ECardState.done}></Column>
                <Column id={ECardState.regression}></Column>
            </div>
        </DndContext>
    );
}