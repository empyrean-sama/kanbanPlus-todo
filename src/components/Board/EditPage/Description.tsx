import React, { useContext } from "react";
import Style from './Description.module.scss';
import Textarea from "../../ui/Textarea";
import { editPageContext, IEditPageContext, IEditCardProperties } from "./EditPage";

export default function Description() {
    const editPageAPI = useContext(editPageContext) as IEditPageContext;
    const editCard = editPageAPI.getProperties();

    function handleChange(ev: React.ChangeEvent<HTMLTextAreaElement>) {
        editPageAPI.setProperties((card: IEditCardProperties) => {
            card.description = ev.target.value;
        });
    } 

    return (
        <div className={Style["description-container"]}>
            <h2 className="is-size-5">Description</h2>
            <Textarea value={editCard.description} onChange={handleChange} placeholder="Edit the description of this card" />
        </div>
    );
}