import React, { HTMLAttributes, PropsWithChildren, ReactNode, useContext, useState, useImperativeHandle, forwardRef } from "react"
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import Style from './Dropdown.module.scss';

export interface IDropdownProps {
    placeholder: string
    id?: string,
    initialActiveId?: string
}

export interface IDropdownContext {
    activeChildId: string,
    setActiveChildId: React.Dispatch<React.SetStateAction<string>>
    closeDropdown: () => void
}
export const dropdownContext = React.createContext<IDropdownContext | undefined>(undefined);

export interface IDropdownImperativeHandle {
    clearActiveChild(): void;
    setActiveChild(childId: string): void;
    getActiveChildId(): string
}

export const Dropdown = forwardRef<IDropdownImperativeHandle, PropsWithChildren<IDropdownProps>>(function({placeholder, id, initialActiveId, children}, ref) {

    const [isOpen, setIsOpen] = useState(false);
    const [activeChildId, setActiveChildId] = useState(initialActiveId || "");

    useImperativeHandle(ref, () => {
        return {
            clearActiveChild() {
                setActiveChildId("");
            },
            setActiveChild(childId: string) {
                setActiveChildId(childId);
            },
            getActiveChildId(): string {
                return activeChildId;
            },
        }
    }, [activeChildId]);

    function closeDropdown() {
        setIsOpen(false);
    }

    const ArrowComponent = isOpen ? FaAngleUp : FaAngleDown;

    return(
        <div className={`dropdown ${isOpen ? 'is-active' : ''}`} id={id? id: undefined}>
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
});

export function DropdownItem({id, selectable, children, className}: {id: string, selectable?: boolean, children?: ReactNode, className?: string | undefined}) {

    const {activeChildId, setActiveChildId, closeDropdown} = useContext(dropdownContext) as IDropdownContext;
    className = `dropdown-item ${(id === activeChildId)? "is-active" : ""} ${className? className : ""}`;

    if(selectable === undefined) {
        selectable = true;
    }
    if(selectable) {
        return(
            <a id={id} className={className} onClick={() => {
                setActiveChildId(id);
                closeDropdown();
            }}>
                {children}
            </a>
        )
    }
    else  {
        return (
            <div id={id} className={className}>
                {children}
            </div>
        );
    }
    
}

export function DropdownDivider() {
    return <hr className="dropdown-divider" />;
}