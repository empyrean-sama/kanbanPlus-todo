import React, { useContext, useState } from 'react';

import Button from '../ui/Button';
import Modal, {ModalHeader, ModalBody, ModalFooter} from '../ui/Modal';
import Checkbox from '../ui/Checkbox';

import { INavbarContext, navbarContext } from './Navbar';
import { getCardsAPIVersion } from '../../utilities/cardsAPIUtils';
import Settings from '../../settings.json';
import download from '../../utilities/download';
import { FaDownload } from "react-icons/fa6";
import { IMessageService, messageServiceContext, EMessageType } from '../Message/MessageService';

import IProject from '../../interface/IProject';
import IBoard from '../../interface/IBoard';

export default function DownloadProject() {
    
    const { getBoards } = useContext(navbarContext) as INavbarContext;
    const { showMessage } = useContext(messageServiceContext) as IMessageService;
    
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [selectedBoards, setSelectedBoards] = useState<Array<string>>([]);
    
    function onClick() {
        const allBoards = getBoards();
        if(allBoards.length > 0) {
            setIsOpen(true);
        }
        else {
            showMessage("No Boards", "Atleast one board must exist before attempting to export the project", EMessageType.danger);
        }
    }

    function onSuccess() {
        // Create a project file and populate it with all boards
        const projectFile: IProject = {
            projectName: inputValue,
            cardsAPIVersion: getCardsAPIVersion(),
            boards: []
        };
        selectedBoards.forEach((boardId) => {
            const board: IBoard = {
                name: boardId
            };
            projectFile.boards.push(board);
        });

        download(`${inputValue}.json`, JSON.stringify(projectFile));
        setIsOpen(false);
    }

    function onFailure() {
        setIsOpen(false);
    }

    function handleBoardOnCheckChanged(checked: boolean, boardId: string) {
        if(checked) {
            setSelectedBoards([...selectedBoards, boardId]);
        }
        else {
            setSelectedBoards(selectedBoards.filter((id) => id !== boardId))
        }
    }
    
    return(
        <>
            <Button onClick={onClick}>
                <span className="mr-2">Download Project</span><FaDownload />
            </Button>
            <Modal isOpen={isOpen} onSuccess={onSuccess} onFailure={onFailure}>
                <ModalHeader title='Download Project'></ModalHeader>
                <ModalBody>
                    <h1>Project Name</h1>
                    <input type="text" className='input' placeholder='Enter project name' value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>

                    <h2>Include Boards</h2>
                    <div className='checkboxes'>
                        {getBoards().map((boardId) => <Checkbox key={boardId} onCheckChanged={(checked) => handleBoardOnCheckChanged(checked, boardId)}> {boardId} </Checkbox>)}
                    </div>

                    <h3>Details</h3>
                    <p>Cards API Version: <b><span className='has-text-primary'>{Settings.cardsMajorVersionNumber}</span>.{Settings.cardsMinorVersionNumber}.{Settings.cardsFixesVersionNumber}</b> <br></br> This project will not be compatible on clients with a different <b className='has-text-primary'>Major</b> version number.</p>
                    
                </ModalBody>
                <ModalFooter isSuccessDisabled={inputValue.trim().length === 0 || selectedBoards.length === 0}/>
            </Modal>
        </>
    );
}