import React, { createContext, ReactNode } from "react";

export interface ICardAPI {

}
export const cardAPIContext = createContext<ICardAPI | undefined>(undefined);

export default function CardAPI({children}: {children: ReactNode}) {
    return(
        <cardAPIContext.Provider value={{}}>
            {children}
        </cardAPIContext.Provider>
    );
}