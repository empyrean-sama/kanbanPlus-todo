import React, { HTMLAttributes, PropsWithChildren } from 'react';
import Style from './Column.module.scss';
import Card from '../ui/Card';

export interface IColumnProps extends HTMLAttributes<HTMLDivElement> {
    title: string
}

export default function Column({title, className, children, ...htmlAttributes}: PropsWithChildren<IColumnProps>) { 

    const customClassName = className || "";
   
    return(
        <div
            className={`column ${Style['column']} ${customClassName}`}
            {...htmlAttributes}
        >
            <div className={`${Style['title']} is-size-4 `}>{title}</div>
            <div className={`${Style['cards']}`}>
                {children}
            </div>
        </div>
    )
}