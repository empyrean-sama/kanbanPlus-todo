import React, { PropsWithChildren } from "react";
import { useDraggable } from '@dnd-kit/core';
import Style from './Card.module.scss';

export interface ICardProps {
    id: string
}

export default function({id, children}: PropsWithChildren<ICardProps>) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({id});
    const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;
    
    return (
        <div className={Style['card']} style={style} ref={setNodeRef} {...listeners} {...attributes}></div>
    )
}