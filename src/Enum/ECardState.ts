enum ECardState {
    todo = 'todo',
    doing = 'doing',
    done = 'done',
    regression = 'regression'
}

export default ECardState;

/**
 * Utility function to convert a given string into the enum ECardState
 * ? the string's case is not take into account while using this function, 'Todo' is the same as 'todo' is the same as 'TODO'
 * @param str: the string to parse and decide on the ECardState
 * @returns the ECardState corresponding to the given string
 * @throws an error if given string does not match any ECardState
 */
export function strToECardState(str: string): ECardState {
    switch(true) {
        case /todo/i.test(str):
            return ECardState.todo;
        case /doing/i.test(str):
            return ECardState.doing;
        case /done/i.test(str):
            return ECardState.done;
        case /regression/i.test(str):
            return ECardState.regression;
        default:
            throw new Error('Given string cannot be converted into the enum ECardState')
    }
}