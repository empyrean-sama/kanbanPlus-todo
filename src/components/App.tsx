import React from "react";
import CardsApiContext from "./Card/CardsApiContext";
import KanbanBoard from "./KanbanBoard";

/**
 * This is the main app function of this project
 */
export default function() {
    return(
        <CardsApiContext>
            <KanbanBoard />
        </CardsApiContext>
    );
}