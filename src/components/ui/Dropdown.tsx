import React, { HTMLAttributes, PropsWithChildren, ReactNode, useContext, useState, useImperativeHandle, forwardRef } from "react"
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import Style from './Dropdown.module.scss';

export interface IDropdownProps {

    /**
     * Placeholder string will be displayed when no dropdown item is selected
     */
    placeholder: string

    /**
     * The id attribute to be set on this Dropdown component
     */
    id?: string,

    /**
     * This prop is useful if dropdown component must be opened when a html label is clicked, the labelId string must match the htmlFor string provided on the label element
     */
    labelId?: string,

    /**
     * Initially selected active child Id
     * ? Not specifying this will display placeholder and not select an item in the dropdown
     */
    initialActiveId?: string,

    /**
     * Triggered once every time the user selects a new dropdown item
     * @param selectedId: the newly selected dropdown item id
     * @returns nothing
     */
    onSelect?: (newSelectedId: string) => void 
}

export interface IDropdownContext {
    activeChildId: string,
    setActiveChildId: React.Dispatch<React.SetStateAction<string>>,
    closeDropdown: () => void,
    onSelect?: (newSelectedId: string) => void
}
export const dropdownContext = React.createContext<IDropdownContext | undefined>(undefined);

export interface IDropdownImperativeHandle {
    clearActiveChild(): void;
    setActiveChild(childId: string): void;
    getActiveChildId(): string
}

export const Dropdown = forwardRef<IDropdownImperativeHandle, PropsWithChildren<IDropdownProps>>(function({placeholder, id, labelId, initialActiveId, onSelect, children}, ref) {

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
                <button className={`button ${Style['dropdown-button']}`} id={labelId} aria-haspopup="true" onClick={() => setIsOpen((prevState) => !prevState)}>
                    <span className="mr-2">{activeChildId ? activeChildId : placeholder}</span>
                    <ArrowComponent />
                </button>
            </div>
            <div className={`dropdown-menu ${Style['dropdown-menu']}`} role="menu">
                <div className="dropdown-content">
                    <dropdownContext.Provider value={{activeChildId, setActiveChildId, closeDropdown, onSelect}}>
                        {children}
                    </dropdownContext.Provider>
                </div>
            </div>
        </div>
    );
});

export function DropdownItem({id, selectable, children, className}: {id: string, selectable?: boolean, children?: ReactNode, className?: string | undefined}) {

    const {activeChildId, setActiveChildId, closeDropdown, onSelect} = useContext(dropdownContext) as IDropdownContext;
    className = `dropdown-item ${(id === activeChildId)? "is-active" : ""} ${className? className : ""}`;

    if(selectable === undefined) {
        selectable = true;
    }
    if(selectable) {
        return(
            <a id={id} className={className} onClick={() => {
                setActiveChildId(id);
                closeDropdown();
                if(onSelect && activeChildId !== id) {
                    onSelect(id);
                } 
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