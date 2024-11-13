import React from 'react';
import Style from './Board.module.scss';

import Column from './Column';
import Card from '../ui/Card';

export default function Board() {
    return (
        <div className={`${Style['column-holder']}`}>
            <Column title='Todo'>
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
            </Column>
            <Column title='Doing'></Column>
            <Column title='Done'></Column>
            <Column title='Regression'></Column>
        </div>
    );
}