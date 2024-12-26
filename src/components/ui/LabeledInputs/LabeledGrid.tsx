import React from "react";
import Style from './LabeledGrid.module.scss';

export interface ILabeledGridProps extends React.HTMLProps<HTMLDivElement> {

}

export default function({children, ...htmlAttributes}: React.PropsWithChildren<ILabeledGridProps>) {
    return(
        <div className={`${Style['labeled-grid']}`} {...htmlAttributes}>
            {children}
        </div>
    );
}