import React, { useContext } from "react";
import Settings from '../../settings.json';
import { IMessage, messageBoxContext, IMessageBoxContext } from './MessageService';

export default function Message(props: IMessage) {

    const { heading, message, messageType, id, remainingTime } = props;
    const { deleteMessage } =  useContext(messageBoxContext) as IMessageBoxContext;
    const remainingPercentage = (remainingTime * 100) / Settings.notificationDisplayTime;

    return(
        <article className={`notification mb-3 ${messageType}`}>
            <button className="delete" onClick={() => deleteMessage(id)}></button>
            <h2 className="title is-4 mb-0">{heading}</h2>
            <p>{message}</p>
            <progress className="progress is-danger" value={remainingPercentage} max="100"></progress>
        </article>
    );
}