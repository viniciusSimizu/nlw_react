import {onValue, ref, remove, set, update} from 'firebase/database';
import { FormEvent, useEffect, useState } from 'react'
import { Image } from 'react-bootstrap';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import { useParams } from 'react-router-dom';

import logoImg from '../../assets/images/logo.svg';
import deleteImg from '../../assets/images/delete.svg';
import checkImg from '../../assets/images/check.svg';
import answerImg from '../../assets/images/answer.svg';
import Button from '../../components/Button';
import RoomCode from '../../components/RoomCode';
import { UseAuth } from '../../hooks/UseAuth';
import { database } from '../../services/firebase';

import { v4 as uuid } from 'uuid';

import './style.scss'
import Question from '../../components/Question';
import button from "../../components/Button";
import {useRoom} from "../../hooks/useRoom";

const AdminRoom = () => {

    const navigate = useNavigate();

    const {user} = UseAuth();

    const { id: id_room } = useParams() as any;

    const { title, questions } = useRoom(id_room);

    const handleDeleteQuestion = async(id_question: string) => {
        if(window.confirm('Tienes certeza?')) {
            const questionRef = ref(database, `rooms/${id_room}/questions/${id_question}`);

            await remove(questionRef);
        }
    }

    const handleCheckQuestionAsAnswered = async(id_question: string) => {

        const questionRef = ref(database, `rooms/${id_room}/questions/${id_question}`);

        await update(questionRef, {
            isAnswered: true,
        });

    }

    const handleHighlightQuestion = async(id_question: string) => {

        const questionRef = ref(database, `rooms/${id_room}/questions/${id_question}`);

        await update(questionRef, {
            isHighLighted: true,
        });

    }

    const handleEndRoom = async() => {
        const questionRef = ref(database, `rooms/${id_room}`);

        await update(questionRef, {
            endedAt: new Date()
        });

        navigate('/');
    }

    return (
        <div id="page-room" className={'bg-light'}>
            <header>
                <div className="content">
                    <Link to='/'><Image src={logoImg} alt="nlw-react" /></Link>

                    <div className={'d-flex flex-row'}>
                        <RoomCode code={id_room} />
                        <Button onClick={ handleEndRoom } isOutlined>Encerrar sala</Button>
                    </div>

                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala: { title }</h1>
                    { questions.length !== 0 &&
                        <span>{ questions.length } question(s)</span>
                    }
                </div>

                <div className={'mt-2'}>
                    { questions.map(question => {
                        return (
                                <Question
                                    key={question.id}
                                    content={ question.content }
                                    author={ question.author }
                                    isAnswered={ question.isAnswered }
                                    isHighLighted={ question.isHighLighted }
                                >

                                    { !question.isAnswered && (
                                        <>
                                            <button onClick={() => {handleCheckQuestionAsAnswered(question.id)}}>
                                                <Image src={ checkImg } alt={'Marcar pergunta como respondida'} />
                                            </button>

                                            <button onClick={() => {handleHighlightQuestion(question.id)}}>
                                            <Image src={ answerImg } alt={'Dar destaque à pergunta'} />
                                            </button>
                                        </>
                                    ) }

                                    <button onClick={() => {handleDeleteQuestion(question.id)}}>
                                        <Image src={ deleteImg } alt={'Remover pergunta'} />
                                    </button>

                                </Question>
                        )
                    }) }
                </div>

            </main>
        </div>
    );
}

export default AdminRoom