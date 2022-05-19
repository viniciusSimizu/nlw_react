import { Route, Routes } from 'react-router-dom';
import { AuthContextProvider } from './contexts/AuthContext';

import Home from './pages/Home';
import NewRoom from './pages/NewRoom';
import Room from './pages/Room';

import './styles/auth.scss';
import AdminRoom from "./pages/AdminRoom";

function App() {

    return (
        <AuthContextProvider>
            <Routes>
                <Route index element={<Home />} />
                <Route path='/room/new' element={<NewRoom />} />
                <Route path='/room/:id' element={<Room />} />

                <Route path='/admin/room/:id' element={<AdminRoom />} />
            </Routes>
        </AuthContextProvider>
    );
}

export default App;
