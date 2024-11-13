import React from 'react';
import Style from './Card.module.scss';
import Button, { EButtonFace } from './Button';

import { FaLink, FaPlay, FaStop, FaPenToSquare, FaTrashCan  } from "react-icons/fa6";

export default function Card() {
    return(
        <div className={`card ${Style['card']} is-primary`}>
            <header className="card-header">
                <p className={`card-header-title ${Style['card-header-title']}`}>Card header <FaTrashCan className={Style['delete-icon']} /></p>
            </header>
            <div className={`${Style['card-content']} card-content`}>
                <div className={`${Style['content']} content`}>
                    <div className={Style['tags']}>
                        <span className="tag is-warning">Story Points: 8</span>
                    </div>
                    <div className={`${Style['description-text']}`}>
                        Lorem ipsum leo risus, porta ac consectetur ac, vestibulum at eros. Donec
                        id elit non mi porta gravida at eget metus. Cum sociis natoque penatibus
                        et magnis dis parturient montes, nascetur ridiculus mus. Cras mattis
                        consectetur purus sit amet fermentum.
                    </div>
                </div>
            </div>
            <footer className="card-footer">
                <Button face={EButtonFace.link} className={`card-footer-item ${Style['card-button']}`}>Links(3)<FaLink width="16" /></Button>
                <Button face={EButtonFace.primary} className={`card-footer-item ${Style['card-button']}`}>1min <FaPlay width="16"/></Button>
                <Button face={EButtonFace.link} className={`card-footer-item ${Style['card-button']}`}>Edit <FaPenToSquare width="16"/></Button>
            </footer>
        </div>
    );
}