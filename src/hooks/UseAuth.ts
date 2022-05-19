import { AuthContext } from '../contexts/AuthContext';
import { useContext } from 'react';

export function UseAuth() {
    return useContext(AuthContext);
}