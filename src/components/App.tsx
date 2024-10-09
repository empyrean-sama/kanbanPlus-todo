import React from "react";
import CardsApiContext from "./Card/CardsApiContext";
import KanbanBoard from "./KanbanBoard";
import Navbar from "./Navbar/Navbar";

/**
 * This is the main app function of this project
 */
export default function() {
    return(
        <CardsApiContext>
            <Navbar />
            <KanbanBoard />
        </CardsApiContext>
    );
}