import illustrationImg from "../../assets/images/Illustration.svg";
import logoImg from '../../assets/images/logo.svg';
import googleIconImg from '../../assets/images/google-icon.svg';
import Button from '../../components/Button';
import { UseAuth } from '../../hooks/UseAuth';
import { UseNavigate } from '../../hooks/UseNavigate';
import { FormEvent, useState } from 'react';
import { get, ref } from 'firebase/database';
import { database } from '../../services/firebase';
import {Link} from "react-router-dom";
import {Image} from "react-bootstrap";

const Home = () => {

    const navigate = UseNavigate();
    const { user, signInWithGoogle } = UseAuth();
    const [roomCode, setRoomCode] = useState('');

    async function handle() {
        if(!user) {
            await signInWithGoogle();
        }
        navigate('/room/new');
    }

    async function handleJoinRoom(e: FormEvent) {
        e.preventDefault();

        if(roomCode.trim() === '') {
            return;
        }

        const roomRef = await ref(database, `rooms/${roomCode}`)

        const rooms = await get(roomRef);

        if(!rooms.exists()) {
            alert('Room does not exist')
            return;
        }

        if(rooms.val().endedAt) {
            alert('Room already closed');
            return;
        }

        navigate(`/room/${roomCode}`);
    }

    return (

        <div id='page-auth' className='row'>
            <aside className='px-5 col-6 text-light d-flex flex-column justify-content-center'>
                <div className='d-flex flex-column justify-content-center'>
                    <Image src={ illustrationImg } alt="Ilustração simbolizando perguntas e respostas" />
                    <strong className='mt-1'>Crie salas de Q&amp;A ao-vivo</strong>
                    <p className='mt-1'>Tire as dúvidas da sua audiência em tempo-real</p>
                </div>
            </aside>
            <main className='d-flex justify-content-center align-items-center col-6 bg-light text-dark'>
                <div className='text-center d-flex flex-column'>
                    <img src={ logoImg } className='w-50 mx-auto aligh-self-center' alt="nlw-react" />
                    <button onClick={handle} className='create-room py-3 px-6 text-light mt-6 bg-danger d-flex justify-content-center align-items-center'>
                        <img src={ googleIconImg } alt="Logo do Google" />
                        <span><a className='text-light'>Crie sua sala com o Google</a></span>
                    </button>

                    <div className='my-4 d-flex align-items-center text-dark separator'>Ou entre em uma sala</div>
                    
                    <form onSubmit={ handleJoinRoom } className='d-flex flex-column'>
                        <input 
                            onChange={ e => setRoomCode(e.target.value) }
                            type="text"
                            placeholder='Digite o código da sala'
                            className='px-3 bg-light'
                        />
                        <Button type='submit' className='button mt-2'>Entrar na sala</Button>
                    </form>
                </div>
            </main>
        </div>
    )
}

export default Home