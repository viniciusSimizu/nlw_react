import React from 'react'

import copyImg from '../../assets/images/copy.svg';

import './style.scss'
import {Image} from "react-bootstrap";

interface IRoomCodeProps {
    code: string
}

const RoomCode = (props: IRoomCodeProps) => {

    function copyRoomCodeToClipboard() {
        navigator.clipboard.writeText(props.code)
    }

    return (
        <button onClick={copyRoomCodeToClipboard} className={'room-code'}>
            <div>
                <Image src={copyImg} alt="Copy room code" />
            </div>
            <span className={'text-dark'}><strong className={'mx-2'}>Sala: </strong>{props.code}</span>
        </button>
    );
}

export default RoomCode