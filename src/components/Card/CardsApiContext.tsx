import React, { PropsWithChildren, useEffect, useState } from 'react';
import { cardsApiObj } from './CardsApi';
import ICardData from './ICardData';

// Create the CardsAPI context
export const cardsAPIContext = React.createContext(null);

/**
 * This component provides the cardsAPI context to all its children
 */
export default function({children}: PropsWithChildren) {
    
    // Setup the CardsApi on every render
    const [cardsData, setCardsData] = useState(new Array<ICardData>())
    cardsApiObj.cardsData = cardsData;
    cardsApiObj.setCardsData = (function(data: ICardData[]) {setCardsData(data)}).bind(this);

    // Add cards on startup for debugging purposes
    useEffect(() => {
        cardsApiObj.addTaskCard("han empire", "the han empire being the most noble and power this side of the world also failed");
        cardsApiObj.addTaskCard('roman empire', "the empire of roman, surpassed in majesty only by the gods ultimately failed");
        cardsApiObj.addRegressionCard('julius Kaiser', 'this guy is not a canonical emperor, remove him I say');
    }, [])
    
    return(
        <cardsAPIContext.Provider value={ { cardsAPI: cardsApiObj, cardsData, setCardsData} }>
            {children}
        </cardsAPIContext.Provider>
    );
}