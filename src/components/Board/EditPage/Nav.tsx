import React, { useContext, useState } from 'react';
import Style from './Nav.module.scss';

import { boardComponentContext, IBoardComponentContext } from '../Board';
import { cardAPIContext, ICardAPI } from '../../CardsAPI/CardAPI';

import ICard from '../../../interface/ICard';
import { ECardType } from '../../../Enum/ECardType';
import { FaXmark } from 'react-icons/fa6';

export default function EditCardNav(props: ICard): React.ReactNode {

    const { clearCardsSelectSet, getCardsSelected, onSelectSetChange } = useContext(cardAPIContext) as ICardAPI;
    const { closeEditPage } = useContext(boardComponentContext) as IBoardComponentContext

    const [title, setTitle] = useState('undefined');

    onSelectSetChange((selectSet: ICard[]) => {
        const firstCard: ICard | undefined = selectSet[0];
        if(firstCard) {
            setTitle(firstCard.title);
        }
        else {
            setTitle('undefined');
        }
    })

    function handleClose() {
        clearCardsSelectSet();
        closeEditPage();
    }

    return (
        <header className={`${Style['header']} ${props.type === ECardType.task ? Style['task-card'] : Style['regression-card']}`}>
            <input 
                className={`${Style['input']} input is-size-4`} type="text" 
                placeholder="Card Title" value={title} onChange={(ev) => setTitle(ev.target.value)} 
            />
        </header>
    );
}