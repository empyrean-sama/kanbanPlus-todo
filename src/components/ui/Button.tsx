import React, { ButtonHTMLAttributes, PropsWithChildren } from 'react';

export enum EButtonFace {
    primary = 'is-primary',
    link = 'is-link',
    info = "is-info",
    success = "is-success",
    warning = "is-warning",
    danger = "is-danger",
    
    white = "is-white",
    black = "is-black",
    text = "is-text",
    ghost = "is-ghost",
    light = "is-light",
    dark = "is-dark",

    none = "is-none"
}

export enum EButtonSize {
    small = 'is-small',
    normal = 'is-normal',
    medium = 'is-medium',
    large = 'is-large'
}

export interface IButtonProps {
    face? : EButtonFace, 
    size? : EButtonSize, 
    isFullwidth? : boolean, 
    isOutlined? : boolean, 
    isInverted? : boolean, 
    isRounded? : boolean, 
    isStatic? : boolean
}

export default function Button(props: PropsWithChildren<IButtonProps> & ButtonHTMLAttributes<HTMLButtonElement>) {
    const {face, size, isFullwidth, isOutlined, isInverted, isRounded, isStatic, children, ...buttonAttributes} = props;
    const buttonFace = face || EButtonFace.primary;
    const buttonSize = size || EButtonSize.normal;
    const buttonWidth    = (isFullwidth)? "is-fullwidth" : "";
    const buttonOutlined = (isOutlined) ? "is-outlined"  : "";
    const buttonInverted = (isInverted) ? "is-inverted"  : "";
    const buttonRounded  = (isRounded)  ? "is-rounded"   : "";
    const buttonStatic   = (isStatic)   ? "is-static"    : "";
    const customClassNameString = (buttonAttributes.className) ? buttonAttributes.className : "";
    delete buttonAttributes.className;

    return (
        <button 
            className={`button ${buttonFace} ${buttonSize} ${buttonWidth} ${buttonOutlined} ${buttonInverted} ${buttonRounded} ${buttonStatic} ${customClassNameString}`}
            {...buttonAttributes}
        >
            {children}
        </button>
    );
}