import React, { HTMLProps } from "react";

export default function Textarea(props: HTMLProps<HTMLTextAreaElement>) {
    return (
        <textarea className={`textarea ${props.className}`} {...props} />
    );
}