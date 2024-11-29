import React, { useContext } from "react";
import Style from './EditPage.module.scss';
import { cardAPIContext, ICardAPI } from "../../CardsAPI/CardAPI";

import Nav from "./Nav";

export default function EditCard() {
    const { getCardsSelected } = useContext(cardAPIContext) as ICardAPI
    const editableCard = getCardsSelected()[0];
    
    return (
        <div className={Style['full-page-modal']}>
            <Nav {...editableCard}/>
        </div>
    );
}