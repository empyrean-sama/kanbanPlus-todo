import React,  { ChangeEvent, useContext, useState } from 'react';
import Button, { EButtonFace } from '../ui/Button';
import Modal,  { ModalHeader, ModalBody, ModalFooter } from '../ui/Modal';
import { navbarContext, INavbarContext } from './Navbar';

import { FaUpload } from "react-icons/fa6";
import { EMessageType, IMessageService, messageServiceContext } from '../Message/MessageService';

import IProject from '../../interface/IProject';
import IBoard from '../../interface/IBoard';

export default function UploadProject() {
    const { showMessage } = useContext(messageServiceContext) as IMessageService;
    const { getBoards, clearBoards, addNewBoard } = useContext(navbarContext) as INavbarContext;
    const [ modalOpen, setModalOpen ] = useState(false);

    function onClick() {
        if(getBoards().length > 0) {
            setModalOpen(true);
        }
        else {
            launchFileSelector();
        }
    }

    function onModalSuccess() {
        setModalOpen(false);
        launchFileSelector();
    }

    function onModalFailure() {
        setModalOpen(false);
    }

    function launchFileSelector() {
        const inputElement = document.createElement("input");
        inputElement.type = "file";
        inputElement.accept = ".json,text/json";
        inputElement.addEventListener("change", loadData);
        inputElement.dispatchEvent(new MouseEvent("click"));
    }

    async function loadData(this: HTMLInputElement, ev: Event) {
       if(this.files && this.files.length > 0) {
            const file = this.files.item(0) as File
            const text = await file.text();
            try{
                const project: IProject = JSON.parse(text) as IProject;
                const boards = project.boards.map((board) => board.name);
                clearBoards();
                boards.forEach((board) => addNewBoard(board));
            }
            catch{
                showMessage('Failed To Load Project', 'Unable to parse the selected project file, looks like corruption.', EMessageType.danger);
            }
        }
    }

    return(
        <>
            <Button className='mr-4' face={EButtonFace.link} onClick={onClick}> 
                <span className="mr-2">Upload</span>
                <FaUpload />
            </Button>
            <Modal isOpen={modalOpen} onSuccess={onModalSuccess} onFailure={onModalFailure}>
                <ModalHeader title='Load a new project'></ModalHeader>
                <ModalBody>
                    <h1>Are You Sure?</h1>
                    <p>You are attempting to load a new project by overwriting the existing one, doing so can cause <span className='has-text-danger'>DATA LOSS</span> if you do not save your work.</p>
                    <p>Are you sure about continuing?</p>
                </ModalBody>
                <ModalFooter />
            </Modal>
        </>
    );
}