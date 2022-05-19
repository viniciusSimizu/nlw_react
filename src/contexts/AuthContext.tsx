import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { createContext, ReactNode, useEffect, useState } from "react"
import { auth } from "../services/firebase"

export interface IUserDTO {
    id: string
    name: string
    avatar: string
}
interface IAuthContext {
    user: IUserDTO | undefined
    signInWithGoogle: any
}

export const AuthContext = createContext({} as IAuthContext)

interface IAuthContextProviderProps {
    children: ReactNode
}

export function AuthContextProvider(props: IAuthContextProviderProps) {

    const [user, setUser] = useState<IUserDTO | undefined>(undefined);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if(user) {

                const { displayName, photoURL, uid } = user;

                if(!displayName || !photoURL) {
                    throw new Error('Missing information from Google Account.');
                }

                setUser({
                    id: uid,
                    name: displayName,
                    avatar: photoURL
                })

            }
        })

        return () => {
            unsubscribe();
        }
    }, [])
    

    async function signInWithGoogle(): Promise<any> {
        const provider = new GoogleAuthProvider();

        await signInWithPopup(auth, provider)
            .then(response => {
                if(response.user) {
                    const { displayName, photoURL, uid } = response.user;

                    if(!displayName || !photoURL) {
                        throw new Error('Missing information from Google Account.');
                    }

                    setUser({
                        id: uid,
                        name: displayName,
                        avatar: photoURL
                    })
                }
            })
    }

    return (
        <AuthContext.Provider value={{ user, signInWithGoogle }}>
            { props.children }
        </AuthContext.Provider>
    );
}