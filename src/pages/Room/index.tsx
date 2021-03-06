import { ref, set, remove } from 'firebase/database';
import { FormEvent, useState } from 'react'
import { Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import logoImg from '../../assets/images/logo.svg';
import Button from '../../components/Button';
import RoomCode from '../../components/RoomCode';
import { UseAuth } from '../../hooks/UseAuth';
import { database } from '../../services/firebase';

import { v4 as uuid } from 'uuid';

import './style.scss'
import Question from '../../components/Question';
import {useRoom} from "../../hooks/useRoom";

const Room = () => {

    const {user} = UseAuth();

    const [newQuestion, setNewQuestion] = useState('');

    const { id: id_room } = useParams() as any;

    const { title, questions } = useRoom(id_room);

    async function handleSendQuestion(e: FormEvent) {
        e.preventDefault();

        if(newQuestion.trim() === '') {
            return;
        }

        if(!user) {
            throw new Error('You must be logged in')
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar
            },
            isHighLighted: false,
            isAnswered: false
        };

        const roomRef = ref(database, `rooms/${id_room}/questions/${uuid()}`);
        await set(roomRef, question);

        setNewQuestion('');
    }

    const handleLikeQuestion = async (id_question: string, id_like: string | undefined) => {

        if(id_like) {
            const roomRef = ref(database, `rooms/${id_room}/questions/${id_question}/likes/${id_like}`)

            await remove(roomRef);
        } else {

            const roomRef = ref(database, `rooms/${id_room}/questions/${id_question}/likes/${uuid()}`);

            await set(roomRef, {
                id_author: user?.id,
            });
        }
    }
    

    return (
        <div id="page-room" className={'bg-light'}>
            <header>
                <div className="content">
                    <Link to='/'><img src={logoImg} alt="nlw-react" /></Link>
                    <RoomCode code={id_room} />
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala: { title }</h1>
                    { questions.length !== 0 &&
                        <span>{ questions.length } question(s)</span>
                    }
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea
                        onChange={(e) => setNewQuestion(e.target.value)}
                        value={newQuestion}
                        placeholder="O que voc?? quer perguntar?"
                    />

                    <div className="form-footer">
                        {user ? (
                            <span className="user-info">
                                <Image src={user.avatar} roundedCircle width='40' className={'border border-1 border-dark'} />
                                <span>{user.name}</span>
                            </span>
                        ) : (
                            <span>
                                Para enviar uma pergunta,{" "}
                                <button className='login'>fa??a seu login</button>.
                            </span>
                        )}
                        
                        <Button className={'button'} type="submit" disabled={!user}>
                            Enviar pergunta
                        </Button>
                    </div>
                </form>

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
                                    <button
                                        onClick={() => handleLikeQuestion(question.id, question.id_like)}
                                        className={`like-button ${ question.id_like ? 'liked' : '' }`}
                                        type={'button'}
                                        aria-label={'Marcar como gostei'}
                                    >

                                        { question.likeCount > 0 && <span>{question.likeCount}</span> }
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>

                                    </button>
                                ) }
                            </Question>
                        )
                    }) }
                </div>

            </main>
        </div>
    );
}

export default Room