import React, { ComponentProps, HTMLAttributes, PropsWithChildren, ReactNode } from 'react';

export enum EButtonType {
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
    dark = "is-dark"
}

export enum EButtonSize {
    small = 'is-small',
    normal = 'is-normal',
    medium = 'is-medium',
    large = 'is-large'
}

export default function Button({type, size, isFullwidth, isOutlined, isInverted, isRounded, isStatic, children, ...buttonAttributes}: {
    type?: EButtonType, size?: EButtonSize, isFullwidth?: boolean, isOutlined?: boolean, isInverted?: boolean, isRounded?: boolean, isStatic?: boolean, children?: ReactNode } & HTMLAttributes<HTMLButtonElement>
) {
    const buttonType = type || EButtonType.primary;
    const buttonSize = size || EButtonSize.normal;
    const buttonWidth = (isFullwidth)? "is-fullwidth" : "";
    const buttonOutlined = (isOutlined)? "is-outlined" : "";
    const buttonInverted = (isInverted)? "is-inverted" : "";
    const buttonRounded = (isRounded)? "is-rounded" : "";
    const buttonStatic = (isStatic)? "is-static" : "";
    const customClassNameString = (buttonAttributes.className) ? buttonAttributes.className : "";

    return (
        <button 
            className={`button ${buttonType} ${buttonSize} ${buttonWidth} ${buttonOutlined} ${buttonInverted} ${buttonRounded} ${buttonStatic} ${customClassNameString}`}
            {...buttonAttributes}
        >
            {children}
        </button>
    );
}