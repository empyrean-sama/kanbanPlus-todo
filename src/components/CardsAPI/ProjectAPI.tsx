import React, { createContext, ReactNode } from 'react';

export interface IProjectAPIContext {

}
export const projectAPIContext = createContext<IProjectAPIContext | undefined>(undefined);

export default function ProjectAPI({children}: {children: ReactNode}) {
    return(
        <projectAPIContext.Provider value={{}}>
            {children}
        </projectAPIContext.Provider>
    )
}