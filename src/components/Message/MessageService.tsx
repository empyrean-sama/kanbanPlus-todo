import React, { createContext, PropsWithChildren, useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import Message from './Message';
import Settings from '../../settings.json';

import Style from './MessageService.module.scss';

export enum EMessageType {
    information = "is-info",
    warning = "is-warning",
    danger = "is-danger"
}

export interface IMessageService {
    /**
     * Show a message to the user
     * @param heading: Heading
     * @param message: The message to show the user
     * @param messageType: The type of this message, the default value is information
     * @returns nothing
     */
    showMessage(heading: string, message: string, messageType?: EMessageType): void
}
export const messageServiceContext = createContext<IMessageService | undefined>({showMessage(heading, message, messageType) {
    console.error(`message contents: heading: ${heading}, message: ${message}, messageType: ${messageType}, this is a call to the dummy showMessage, must never call this`);
},});

export interface IMessage {
    id: string,
    heading: string,
    message: string,
    messageType: EMessageType,
    remainingTime: number
}

export interface IMessageBoxContext {
    /**
     * Try to delete the message if it still exists when this function is called
     * @param id: message id to be deleted
     */
    deleteMessage(id: string): void;
}
export const messageBoxContext = createContext<IMessageBoxContext | undefined>(undefined);

export default function MessageService({children}: PropsWithChildren) {
    const [messageQueue, setMessageQueue] = useState<Array<IMessage>>([]);

    //useEffect starts the timer and keeps it running updating the message queue
    useEffect(() => {
        function tick() {
            setMessageQueue((prevState) => [...prevState
                .map((msg: IMessage) => { return { ...msg, remainingTime: msg.remainingTime - Settings.messageServiceTickInterval }})
                .filter((message) => message.remainingTime > 0)
            ]);
        }
        const id = setInterval(tick, Settings.messageServiceTickInterval);
        return () => clearInterval(id);
    }, []);

    function showMessage(heading: string, message: string, messageType?: EMessageType) {
        setMessageQueue(
            (prevState) => {
                if(prevState.length >= Settings.maximumMessagesDisplayed) {
                    prevState.pop();
                }
                return [
                    {
                        id: uuidv4(),
                        heading, 
                        message, 
                        messageType: messageType ? messageType : EMessageType.information, 
                        remainingTime: Settings.notificationDisplayTime
                    }
                    , ...prevState
                ];
            }
        );
    }

    function deleteMessage(id: string): void {
        setMessageQueue((prevState) => prevState.filter((entry) => entry.id !== id));
    }

    return(
        <messageServiceContext.Provider value={{showMessage}}>
            {children}
            <messageBoxContext.Provider value={{deleteMessage}}>
                <div className={Style['message-box']}>
                    {messageQueue.map((message) =>  <Message {...message} key={message.id} />)}
                </div>
            </messageBoxContext.Provider>
        </messageServiceContext.Provider>
    );
}