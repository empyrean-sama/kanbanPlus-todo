import React, { useContext, useState } from "react";
import Style from './CardTimerButton.module.scss';

import Button, { EButtonFace } from '../../ui/Button';
import { FaPlay, FaStop } from "react-icons/fa6";
import { useStopwatch } from "react-timer-hook";
import { IProjectAPI, projectAPIContext } from "../../CardsAPI/ProjectAPI";
import { cardComponentContext, ICardComponentAPI } from "./Card";
import { ICardProperties } from "../../../interface/ICard";
import KanbanTime from "../../ui/class/KanbanTime";

export default function CardTimerButton() {
    const {
        totalSeconds,
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        start,
        pause,
        reset,
    } = useStopwatch({ autoStart: false });
    const projectAPI = useContext(projectAPIContext) as IProjectAPI;
    const cardComponentAPI = useContext(cardComponentContext) as ICardComponentAPI;

    function handleReset() {
       reset(new Date(0), false);
       projectAPI.modifyCardProperties(cardComponentAPI.getUUID(), (cardData: ICardProperties) => {
            cardData.timeSpent.add(new KanbanTime(days,hours, minutes));
        });
    }

    const buttonFace = isRunning ? EButtonFace.danger : EButtonFace.primary;
    const buttonIcon = isRunning ? <FaStop className={Style['minor-margin-top']} width={16} /> : <FaPlay className={Style['minor-margin-top']} width={16} />

    const stopWatchNow = new KanbanTime(days, hours, minutes);
    stopWatchNow.add(cardComponentAPI.getCardProperties().timeSpent);

    return (
        <Button 
            face={buttonFace} 
            className={`card-footer-item ${Style['button']}`}
            onClick={() => isRunning ? handleReset() : start()}
            >
                {buttonIcon}
                <span className={Style['time-display']}>
                    {((stopWatchNow.getDays() * 24) + stopWatchNow.getHours()).toString().padStart(2,'0')}:{stopWatchNow.getMinutes().toString().padStart(2,'0')}
                </span>
            </Button>
    );
}