import illustrationImg from '../../assets/images/Illustration.svg';
import logoImg from '../../assets/images/logo.svg';
import Button from '../../components/Button';
import { Link } from 'react-router-dom';
import { UseAuth } from '../../hooks/UseAuth';
import { FormEvent, useState } from 'react';
import { ref, set } from 'firebase/database';
import { database } from '../../services/firebase';
import { UseNavigate } from '../../hooks/UseNavigate';

const NewRoom = () => {

    const { user } = UseAuth();
    const [newRoom, setNewRoom] = useState('');

    const navigate = UseNavigate()

    const handleCreateRoom = async(e: FormEvent) => {
        e.preventDefault();

        setNewRoom(newRoom.trim());

        if(newRoom === '') {
            return;
        }

        const roomRef = ref(database, `rooms/${newRoom}`);

        await set(roomRef, {
            title: newRoom,
            id_user: user?.id
        })

        navigate(`/room/${roomRef.key}`);
    }

    return (

        <div id='page-auth' className='row'>
            <aside className='px-5 col-6 text-light d-flex flex-column justify-content-center'>
                <div className='d-flex flex-column justify-content-center'>
                    <img src={ illustrationImg } alt="Ilustração simbolizando perguntas e respostas" />
                    <strong className='mt-1'>Crie salas de Q&amp;A ao-vivo</strong>
                    <p className='mt-1'>Tire as dúvidas da sua audiência em tempo-real</p>
                </div>
            </aside>
            <main className='d-flex justify-content-center align-items-center col-6 bg-light text-dark'>
                <div className='text-center d-flex flex-column criar-sala'>
                    <img src={ logoImg } className='w-50 mx-auto aligh-self-center' alt="nlw-react" />
                    
                    <h2>Criar uma nova sala</h2>

                    <form onSubmit={ handleCreateRoom } className='d-flex flex-column'>
                        <input 
                            onChange={ e => setNewRoom(e.target.value) }
                            value={ newRoom }
                            type="text"
                            placeholder='Nome da sala'
                            className='px-3 bg-light'
                        />
                        <Button type='submit' className='button mt-2'>Criar sala</Button>
                    </form>
                    <small>
                        Quer entrar em uma sala existente? <Link to="/"><a>clique aqui</a></Link>
                    </small>
                </div>
            </main>
        </div>
    )
}

export default NewRoom