import React from 'react';
import Style from './LabeledInput.module.scss';

export interface ILabeledInputProps {
    id: string,
    label?: string
}

export default function LabeledInput({id, label, children}: React.PropsWithChildren<ILabeledInputProps>) {
    
    return (
        <>
            <label className={`${Style['label']}`} htmlFor={id}>{label ? label : id}:</label>
            {children}
        </>
    );
}