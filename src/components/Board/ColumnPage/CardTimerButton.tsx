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
    const [startState, setStartState] = useState(false); 
    const projectAPI = useContext(projectAPIContext) as IProjectAPI;
    const cardComponentAPI = useContext(cardComponentContext) as ICardComponentAPI;

    function handleButtonClick() {
        setStartState((prevState) => {
            if(prevState === false) {
                //Start the timer
                start();
                return true;
            }
            else {
                //Stop the timer and update the timeSpent
                pause();
                projectAPI.modifyCardProperties(cardComponentAPI.getUUID(), (cardData: ICardProperties) => {
                    const totalHoursSpent = hours + cardComponentAPI.getCardProperties().timeSpent.toHours();
                    const daysSpent = Math.trunc(totalHoursSpent / 24);
                    const hoursSpent = totalHoursSpent - (daysSpent * 24);
                    const minutesSpent = minutes + cardComponentAPI.getCardProperties().timeSpent.getMinutes(); //todo: what if the sum exceeds 59?
                    cardData.timeSpent = new KanbanTime(daysSpent, hoursSpent, minutesSpent);
                });
                reset();
                return false;
            }
        });
    }

    const buttonFace = startState ? EButtonFace.danger : EButtonFace.primary;
    const buttonIcon = startState ? <FaStop className={Style['minor-margin-top']} width={16} /> : <FaPlay className={Style['minor-margin-top']} width={16} />

    return (
        <Button 
            face={buttonFace} 
            className={`card-footer-item ${Style['button']}`}
            onClick={handleButtonClick}
            >
                {buttonIcon}
                <span className={Style['time-display']}>
                        {(hours   + cardComponentAPI.getCardProperties().timeSpent.getHours() + (cardComponentAPI.getCardProperties().timeSpent.getDays() * 24)).toString().padStart(2,'0')}:
                        {(minutes + cardComponentAPI.getCardProperties().timeSpent.getMinutes()).toString().padStart(2,'0')}
                </span>
            </Button>
    );
}