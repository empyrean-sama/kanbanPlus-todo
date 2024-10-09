import React, { Children, createContext, PropsWithChildren, useContext, useState } from "react";

export interface IDropdownProps {
    title: string
}

const dropdownChildContext = createContext(undefined);
interface IDropdownChildContext {
    activeChildId: string,
    setActiveChildId: React.Dispatch<React.SetStateAction<string>>
    clearDropdownActive: () => void
}

export default function({title, children}: PropsWithChildren<IDropdownProps>) {

    const [isActive, setIsActive] = useState(false);
    const dropdownClassName = 'dropdown' + (isActive? ' is-active' : '');
    const dropdownArrowIconClassName = isActive ? "fas fa-angle-up" : "fas fa-angle-down";

    const [activeChildId, setActiveChildId] = useState("");

    const clearDropdownActive = () => setIsActive(false);
    const toggleDropdownActive = () => setIsActive(!isActive);


    return(
        <div className={dropdownClassName}>
            <div className="dropdown-trigger" onClick={toggleDropdownActive}>
                <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                <span>{title}</span>
                <span className="icon is-small">
                    <i className={dropdownArrowIconClassName} aria-hidden="true"></i>
                </span>
                </button>
            </div>
            <div className="dropdown-menu" id="dropdown-menu" role="menu">
                <div className="dropdown-content">
                    <dropdownChildContext.Provider value={{activeChildId, setActiveChildId, clearDropdownActive}}>
                       {children}
                    </dropdownChildContext.Provider>
                </div>
            </div>
        </div>
    );
}

export interface IDropdownItem {
    id: string,
    canBeActive?: boolean
    className?: string
}

export function DropdownItem({id, canBeActive, className, children}: PropsWithChildren<IDropdownItem>) {

    // canBeActive need not be set by the user all the time, however it must always default to true
    if(canBeActive === undefined) {
        canBeActive = true;
    }

    // string + undefined can lead to all sorts of trouble
    className = className || "";

    const dropdownChildContextAPI: IDropdownChildContext = useContext(dropdownChildContext);
    const dropdownItemClassName = `dropdown-item ${className}` + (dropdownChildContextAPI.activeChildId === id? ' is-active' : '');

    function handleOnClick() {
        if(canBeActive) {
            dropdownChildContextAPI.setActiveChildId(id);
            dropdownChildContextAPI.clearDropdownActive();
        }
    }

    return (
        <a  className={dropdownItemClassName} onClick={handleOnClick}>{children}</a>
    );
}