import React, { HTMLInputTypeAttribute, InputHTMLAttributes, LabelHTMLAttributes, PropsWithChildren } from 'react';

export interface ICheckboxProps {
    disabled? : boolean,
    onCheckChanged?: (isChecked: boolean) => void
}
export default function Checkbox(props: PropsWithChildren<ICheckboxProps> & LabelHTMLAttributes<HTMLLabelElement>) {
    
    const {disabled, onCheckChanged, className, children, ...htmlAttributes} = props;
    
    return (
        <label className="checkbox" {...htmlAttributes}  >
            <input type="checkbox" disabled={disabled} onChange={(e) => onCheckChanged ? onCheckChanged(e.target.checked) : undefined} />
            {children}
        </label>
    )
}