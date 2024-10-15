import React, { HTMLAttributes, PropsWithChildren } from 'react';
import Style from './Navbar.module.scss';
import Button, { EButtonType } from './ui/Button';

import { FaDownload, FaUpload } from "react-icons/fa";

export default function Navbar({...navAttributes}: HTMLAttributes<HTMLElement>) {
    return(
        <nav className="navbar is-dark px-2">
            <div className="navbar-brand">
                <h1 className={`${Style["logo-text"]}`}>KanbanPlus-Todo</h1>
            </div>
            <div className='navbar-menu'>
                <div className='navbar-start'>
                    
                </div>
                <div className='navbar-middle'>
                    
                </div>
                <div className='navbar-end'>
                   <Button className='mr-4' type={EButtonType.link}><span className="mr-2">Upload</span><FaUpload /></Button>
                   <Button><span className="mr-2">Download Project</span><FaDownload /></Button>
                </div>
            </div>
        </nav>
    );
}