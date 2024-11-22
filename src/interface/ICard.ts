import ECardState from '../Enum/ECardState';
import { v4 as uuidV4 } from 'uuid'

export default interface ICard {
    uuid: string,
    title: string,
    description: string,
    state: ECardState,
    createdDate: Date,
    storyPoints: number
}

export function getTestTodoCards(): ICard[] {
    return [
        {
            uuid: 'test card 1',
            title: 'card 1',
            description: 'this is the description for an example of card 1',
            state: ECardState.todo,
            createdDate: new Date(),
            storyPoints: 2,
        },
        {
            uuid: 'test card 2',
            title: 'card 2',
            description: 'this is the description for an example of card 2',
            state: ECardState.todo,
            createdDate: new Date(),
            storyPoints: 4,
        },
        {
            uuid: 'test card 3',
            title: 'card 3',
            description: 'this is the description for an example of card 3',
            state: ECardState.todo,
            createdDate: new Date(),
            storyPoints: 8
        },
        {
            uuid: 'test card 4',
            title: 'card 4',
            description: 'this is the description for an example of card 4',
            state: ECardState.doing,
            createdDate: new Date(),
            storyPoints: 4,
        },
        {
            uuid: 'test card 5',
            title: 'card 5',
            description: 'this is the description for an example of card 5',
            state: ECardState.doing,
            createdDate: new Date(),
            storyPoints: 8
        },
        {
            uuid: 'test card 6',
            title: 'card 6',
            description: 'this is the description for an example of card 6',
            state: ECardState.doing,
            createdDate: new Date(),
            storyPoints: 8
        },
    ]
}