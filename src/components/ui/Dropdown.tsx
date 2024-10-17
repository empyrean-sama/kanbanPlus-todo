import React, { HTMLAttributes, PropsWithChildren, ReactNode, useContext, useState } from "react"
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import Style from './Dropdown.module.scss';

interface IDropdownContext {
    activeChildId: string,
    setActiveChildId: React.Dispatch<React.SetStateAction<string>>
    closeDropdown: () => void
}
const dropdownContext = React.createContext<IDropdownContext | undefined>(undefined);

export function Dropdown({placeholder, children}: {placeholder: string, children?: ReactNode}) {

    const [isOpen, setIsOpen] = useState(false);
    const [activeChildId, setActiveChildId] = useState("");

    function closeDropdown() {
        setIsOpen(false);
    }

    const ArrowComponent = isOpen ? FaAngleUp : FaAngleDown;

    return(
        <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
            <div className="dropdown-trigger">
                <button className={`button ${Style['dropdown-button']}`} aria-haspopup="true" onClick={() => setIsOpen((prevState) => !prevState)}>
                    <span className="mr-2">{activeChildId ? activeChildId : placeholder}</span>
                    <ArrowComponent />
                </button>
            </div>
            <div className={`dropdown-menu ${Style['dropdown-menu']}`} role="menu">
                <div className="dropdown-content">
                    <dropdownContext.Provider value={{activeChildId, setActiveChildId, closeDropdown}}>
                        {children}
                    </dropdownContext.Provider>
                </div>
            </div>
        </div>
    );
}

export function DropdownItem({id, selectable, children, className}: {id: string, selectable?: boolean, children?: ReactNode, className?: string | undefined}) {

    const {activeChildId, setActiveChildId, closeDropdown} = useContext(dropdownContext) as IDropdownContext;
    className = `dropdown-item ${(id === activeChildId)? "is-active" : ""} ${className? className : ""}`;

    if(selectable === undefined) {
        selectable = true;
    }
    if(selectable) {
        return(
            <a className={className} onClick={() => {
                setActiveChildId(id);
                closeDropdown();
            }}>
                {children}
            </a>
        )
    }
    else  {
        return (
            <div className={className}>
                {children}
            </div>
        );
    }
    
}

export function DropdownDivider() {
    return <hr className="dropdown-divider" />;
}