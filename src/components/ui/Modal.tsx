import React, { createContext, HTMLAttributes, PropsWithChildren, useContext } from 'react';
import Button, { EButtonFace } from './Button';

export interface IModalProps {
    isOpen: boolean;
    onSuccess?: (args: ModalEventArgs) => void,
    onFailure?: (args: ModalEventArgs) => void
}

export class ModalEventArgs {}
interface IModalContext extends IModalProps{};

const modalContext = createContext<IModalContext | undefined>(undefined);

export default function Modal({ isOpen, onSuccess, onFailure, children }: PropsWithChildren<IModalProps>) {

    let modalBackground: React.JSX.Element | undefined;
    if(onFailure) {
        modalBackground = <div className="modal-background" onClick={() => onFailure(new ModalEventArgs())}></div>
    }
    else {
        modalBackground = <div className="modal-background"></div>
    }

    return(
        <modalContext.Provider value={{onSuccess, onFailure, isOpen}}>
            <div className={`modal ${isOpen?'is-active':''}`}>
                {modalBackground}
                <div className="modal-card">
                    {children}
                </div>
            </div>
        </modalContext.Provider>
    );
}

export interface IModalHeaderProps {
    /**
     * Leave this as undefined if title is defined as a part of the children passed in
     */
    title?: string | undefined
}
export function ModalHeader({title, children}: PropsWithChildren<IModalHeaderProps>) {
    return (
        <header className="modal-card-head">
            {title ? <h1 className="modal-card-title">{title}</h1> : undefined}
            {children}
        </header>
    );
}

export interface IModalFooterProps {
    /** Disables the DEFAULT success button if dawn */
    isSuccessDisabled? : boolean, 

    /** Disables the DEFAULT failure button if drawn */
    isFailureDisabled? : boolean 
}

/**
 * This component is used to create the footer of a modal
 * ? This component must always have as its parent a Modal component
 * @param props : will not draw the default Accept and Cancel buttons if any children are present
 * @returns a ModalFooter react component
 */
export function ModalFooter(props: PropsWithChildren<IModalFooterProps> & HTMLAttributes<HTMLElement>) {
    const {onSuccess, onFailure} = useContext(modalContext) as IModalContext
    const {isSuccessDisabled, isFailureDisabled, children, ...htmlAttributes} = props;
    if(!children && !onSuccess && !onFailure) {
        console.error('Error in modal footer, either onSuccess, onFailure or custom children must be defined to close the modal, currently this modal cannot be closed by any end user');
    }

    const className = "modal-card-foot " + (htmlAttributes.className ? htmlAttributes.className : "");
    delete htmlAttributes.className;

    if(!children) {
        return(
            <footer className={className} {...htmlAttributes}>
                <div className="buttons">
                    {onSuccess ? <Button face={EButtonFace.primary} disabled={!!isSuccessDisabled} onClick={() => onSuccess(new ModalEventArgs())}>Accept</Button> : undefined }
                    {onFailure ? <Button face={EButtonFace.danger}  disabled={!!isFailureDisabled}  onClick={() => onFailure(new ModalEventArgs())}>Cancel</Button> : undefined }
                </div>
            </footer>
        )
    }
    else {
        return (
            <footer className={className} {...htmlAttributes}>
                {children}
            </footer>
        );
    }
}

export function ModalBody({children, ...htmlAttributes}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
    const className = "modal-card-body " + (htmlAttributes.className ? htmlAttributes.className : "")
    delete htmlAttributes.className;

    return (
        <section className={className} {...htmlAttributes}>
            <div className="content">
                {children}
            </div>
        </section>
    );
}