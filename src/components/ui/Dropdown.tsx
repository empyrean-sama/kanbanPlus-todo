import React, { HTMLAttributes, PropsWithChildren, ReactNode, useContext, useState, useImperativeHandle, forwardRef, useRef } from "react"
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import Style from './Dropdown.module.scss';

export interface IDropdownProps {

    /**
     * Placeholder will be displayed when no dropdown item is selected
     * ? In most cases a string will suffice, can provide a react node when special formatting is required
     */
    placeholder: string | React.ReactNode

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
     * The dropdown will be disabled if this prop is passed in as true
     */
    disabled?: boolean

    /**
     * If set to true, the dropdown will occupy entire width of the div it is in by setting the property width: 100%
     * ? useful when trying to align widths with other input elements
     */
    spanFullWidth?: boolean

    /**
     * ? spanFullWidth must be set to true for this to take effect,
     * ? will default to whatever spanFullwidth is set to if not set
     * ? can be explicitly set to false if you don't want the dropdown menu to span to 100% width like in date time picker 
     */
    canContentSpanFullWidth?: boolean

    /**
     * Triggered once every time the user selects a new dropdown item
     * @param selectedId: the newly selected dropdown item id
     * @returns nothing
     */
    onSelect?: (newSelectedId: string) => void 

    /**
     * This flag controls if the dropdown is closed automatically once the input looses focus
     * ? The default value is true if undefined or null.
     */
    closeOnLoosingFocus?: boolean
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

export const Dropdown = forwardRef<IDropdownImperativeHandle, PropsWithChildren<IDropdownProps>>(function({placeholder, id, labelId, initialActiveId, spanFullWidth, canContentSpanFullWidth, onSelect, disabled, closeOnLoosingFocus, children}, ref) {

    const [isOpen, setIsOpen] = useState(false);
    const [activeChildId, setActiveChildId] = useState(initialActiveId || "");
    const containerRef = useRef<HTMLDivElement>(null);

    //false is an acceptable value, undefined or null is not
    if(closeOnLoosingFocus === null || closeOnLoosingFocus === undefined) {
        closeOnLoosingFocus = true;
    }
    const handleFocusLost = closeOnLoosingFocus ? function handleFocusLost(ev: React.FocusEvent<HTMLDivElement>) {
        if(!ev.relatedTarget || !containerRef.current?.contains(ev.relatedTarget)) {
            closeDropdown();
        }
    } : undefined;

    if(canContentSpanFullWidth === undefined || canContentSpanFullWidth === null) {
        canContentSpanFullWidth = spanFullWidth;
    }

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
        <div    
            id={id? id: undefined} 
            className={`dropdown ${isOpen ? 'is-active' : ''} ${spanFullWidth ? Style['spanFullWidth'] : ''}`} 
            onBlur={handleFocusLost}
            ref={containerRef}
        >
            <div className={`dropdown-trigger ${spanFullWidth ? Style['spanFullWidth'] : ''}`}>
                <button disabled={disabled} className={`button ${Style['dropdown-button']} ${spanFullWidth ? Style['spanFullWidth'] : ''}`} id={labelId} aria-haspopup="true" onClick={() => setIsOpen((prevState) => !prevState)}>
                    <span className="mr-2">{activeChildId ? activeChildId : placeholder}</span>
                    <ArrowComponent />
                </button>
            </div>
            <div className={`dropdown-menu ${Style['dropdown-menu']} ${spanFullWidth && canContentSpanFullWidth ? Style['spanFullWidth'] : ''}`} role="menu">
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
            <a id={id} tabIndex={0} className={className} onClick={() => {
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
            <div id={id} tabIndex={0} className={className}>
                {children}
            </div>
        );
    }
    
}

export function DropdownDivider() {
    return <hr className="dropdown-divider" />;
}