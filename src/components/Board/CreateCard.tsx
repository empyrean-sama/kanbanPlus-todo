import React, { useContext } from "react";
import Style from './CreateCard.module.scss';

import Button, { EButtonFace } from "../ui/Button";
import { FaPlus } from "react-icons/fa6";
import { boardAPIContext, IBoardAPI } from "../CardsAPI/BoardAPI";
import { ISelectSetAPI, selectSetAPIContext } from "../CardsAPI/SelectSetAPI";
import { boardComponentContext, IBoardComponentContext } from "./Board";

export default function CreateCard() {

    const boardAPI = useContext(boardAPIContext) as IBoardAPI;
    const selectSetAPI = useContext(selectSetAPIContext) as ISelectSetAPI;
    const boardComponentAPI = useContext(boardComponentContext) as IBoardComponentContext;

    function handleClick() {
        const newCardId = boardAPI.addCard();
        selectSetAPI.add(newCardId);
        boardComponentAPI.openEditPage();
    }

    function handleDisable(): boolean {
        const currentBoard = boardAPI.getCurrentWorkingBoard();
        return !currentBoard;
    }

    return (
        <Button className={Style['create-card']} face={EButtonFace.link} onClick={handleClick} disabled={handleDisable()}>
            <span>New Card</span>
            <FaPlus />
        </Button>
    );
}