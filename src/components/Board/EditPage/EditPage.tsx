import React, { createContext, useContext, useState } from "react";
import Style from './EditPage.module.scss';
import clone from 'just-clone';

import Nav from "./Nav";
import ICard, { ICardProperties } from "../../../interface/ICard";
import { boardComponentContext, IBoardComponentContext } from "../Board";
import Fields from "./Fields";
import { boardAPIContext, IBoardAPI } from "../../CardsAPI/BoardAPI";
import { ISelectSetAPI, selectSetAPIContext } from "../../CardsAPI/SelectSetAPI";
import { IProjectAPI, projectAPIContext } from "../../CardsAPI/ProjectAPI";

export interface IEditPageContext {

    /**
     * Get the uuid of the card being edited 
     */
    getUUID(): string

    /**
     * Get the card being edited
     */
    getProperties(): IEditCardProperties,

    /**
     * Set value on the card being edited
     * ? the callback provides an object which is expected to be modified
     * @param callback: the callback provides the current state of the card being edited, I can make changes to it 
     */
    setProperties(callback: (properties: IEditCardProperties) => void): void,

    /**
     * Close down the edit page without saving any changes made
     */
    handleClose(): void,

    /**
     * Save changes made into the project
     */
    handleSave(): void,
}
export const editPageContext = createContext<IEditPageContext | undefined>(undefined);

interface IEditCardProperties extends ICardProperties {
    board: string
};

export default function EditCard() {
    const boardAPI = useContext(boardAPIContext) as IBoardAPI;
    const projectAPI = useContext(projectAPIContext) as IProjectAPI;
    const selectSet = useContext(selectSetAPIContext) as ISelectSetAPI;
    const { closeEditPage } = useContext(boardComponentContext) as IBoardComponentContext;
    
    const [ uuid, setUUID ] = useState(selectSet.getCards()[0].uuid);
    const [ cardProperties, setCardProperties ] = useState<IEditCardProperties>({...(selectSet.getCards()[0]), board: boardAPI.getCurrentWorkingBoard()}); //clone(selectSet.getCards()[0])
    const [ saveEnabled, setSaveEnabled ] = useState(false);

    function getUUID(): string {
        return uuid;
    }

    function handleClose() {
        selectSet.clear();
        closeEditPage();
    }

    function handleSave() {
        setSaveEnabled(false);
        projectAPI.modifyCard(uuid, cardProperties);
        projectAPI.moveCard(uuid, cardProperties.board);
    }

    function getProperties(): IEditCardProperties {
        return cardProperties;
    }

    function setProperties(callback: (properties: IEditCardProperties) => void): void {
        const clonedCardProperties = clone(cardProperties);
        callback(clonedCardProperties);
        setCardProperties(clonedCardProperties);
        setSaveEnabled(true);
    }

    return (
        <editPageContext.Provider value={{getUUID, getProperties, setProperties, handleSave, handleClose}}>
            <div className={Style['fixed-full-page']}>
                <Nav saveEnabled={saveEnabled} />
                <Fields key={'fields'} />
            </div>
        </editPageContext.Provider>
    );
}