import React, { useState } from "react";
import Style from './TimePicker.module.scss';
import KanbanTime from "./class/KanbanTime";

import { Dropdown, DropdownItem } from "./Dropdown";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import Button, { EButtonFace } from "./Button";
import { clamp, cloneDeep } from "lodash";

export interface ITimePickerProps {
    id: string,
    selectDays: boolean,
    value?: KanbanTime,
    onChange?: (newKanbanTime: KanbanTime) => void,
    spanFullWidth?: boolean,
}

export default function TimePicker({id, selectDays, value, onChange, spanFullWidth}: ITimePickerProps) {
    
    const [time, setTime] = useState(value || new KanbanTime());
    function handleChange(callback: (newTime: KanbanTime) => void) {
        const newTime = cloneDeep(value || time);
        callback(newTime);
        if(onChange) {
            onChange(newTime);
        }
        setTime(newTime);
    };

    return (
        <Dropdown placeholder={value?.serializeTime(selectDays) || time.serializeTime(selectDays)} id={id} spanFullWidth={spanFullWidth} canContentSpanFullWidth={false}>
            <DropdownItem id={`${id}-time-selector-item`} selectable={false}>
                <div className={Style['row-center']}>
                    { selectDays ? 
                        <> 
                            <DisplayField 
                                value={(value?.getDays() || time.getDays()).toString()} 
                                handleIncrease={() => handleChange((time) => time.setDays((time.getDays() + 1 > KanbanTime.MAX_DAYS) ? 0 : time.getDays() + 1))} 
                                handleDecrease={() => handleChange((time) => time.setDays((time.getDays() - 1 < 0) ? KanbanTime.MAX_DAYS : time.getDays() - 1))} 
                                handleChange={(newDay) => handleChange((time) => time.setDays(clamp(newDay, 0, KanbanTime.MAX_DAYS)))}
                            /> 
                            : 
                        </>  
                    : undefined }
                    <DisplayField 
                        value={(value?.getHours() || time.getHours()).toString()} 
                        handleIncrease={() => handleChange((time) => time.setHours((time.getHours() + 1 > KanbanTime.MAX_HOURS) ? 0 : time.getHours() + 1))} 
                        handleDecrease={() => handleChange((time) => time.setHours((time.getHours() - 1 < 0) ? KanbanTime.MAX_HOURS : time.getHours() - 1))} 
                        handleChange={(newHour) => handleChange((time) => time.setHours(clamp(newHour, 0, KanbanTime.MAX_HOURS)))}
                    /> 
                    :
                    <DisplayField 
                        value={(value?.getMinutes() || time.getMinutes()).toString()} 
                        handleIncrease={() => handleChange((time) => time.setMinutes((time.getMinutes() + 1 > KanbanTime.MAX_MINUTES) ? 0 : time.getMinutes() + 1))} 
                        handleDecrease={() => handleChange((time) => time.setMinutes((time.getMinutes() - 1 < 0) ? KanbanTime.MAX_MINUTES : time.getMinutes() - 1))} 
                        handleChange={(newMinute) => handleChange((time) => time.setMinutes(clamp(newMinute, 0, KanbanTime.MAX_MINUTES)))}
                    />
                </div>
            </DropdownItem>
        </Dropdown>
    );
}

function DisplayField({value, handleIncrease, handleDecrease, handleChange}: {value: string, handleIncrease: () => void, handleDecrease: () => void, handleChange: (newValue: number) => void}) {

    function handleInputChange(ev: React.ChangeEvent<HTMLInputElement>) {
        const newValue = Number.parseInt(ev.target.value) || 0;
        handleChange(newValue);
    }

    return (
        <div className={Style['column-center']}>
            <Button face={EButtonFace.none} onClick={handleIncrease} className={Style['display-field-button']}><FaAngleUp /></Button>
                <input type="text" className={`${Style["display-field-input"]} input`} value={value} onChange={handleInputChange} />
            <Button face={EButtonFace.none} onClick={handleDecrease} className={Style['display-field-button']}><FaAngleDown /></Button>
        </div>
    );
}