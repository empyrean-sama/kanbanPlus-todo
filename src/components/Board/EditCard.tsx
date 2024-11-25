import React, { useContext } from "react";

import Style from './EditCard.module.scss';
import Button, { EButtonFace } from "../ui/Button";
import { boardComponentContext, IBoardComponentContext } from "./Board";

export default function EditCard() {
    const { closeCardEdit } = useContext(boardComponentContext) as IBoardComponentContext
    return (
        <div className={Style['full-page-modal']}>
            <Button onClick={() => closeCardEdit()} face={EButtonFace.danger}>Close</Button>
        </div>
    );
}