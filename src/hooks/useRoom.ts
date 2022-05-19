import {useEffect, useState} from "react";
import {onValue, ref} from "firebase/database";
import {database} from "../services/firebase";
import {UseAuth} from "./UseAuth";

interface Question {
    id: string;
    author: {
        name: string;
        avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighLighted: boolean;
    likeCount: number;
    id_like: string | undefined;
}

interface IRoomQuestion {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighLighted: boolean;
    likes: Record<string, {
        id_author: string;
    }>
}

export const useRoom = (id_room: string) => {

    const { user } = UseAuth();

    const [questions, setQuestions] = useState<Question[]>([]);
    const [title, setTitle] = useState<string | null>('');

    useEffect(() => {

        const roomRef = ref(database, `rooms/${id_room}`);

        const unsubscribeRoomListener = onValue(roomRef, room => {

            const roomVal = room.val();
            const questions: IRoomQuestion = roomVal.questions ?? {};

            const parsedQuestions = Object.entries(questions).map(([ key, value ]) => {
                const { author, content, isAnswered, isHighLighted, likes } = value;

                return {
                    id: key,
                    author,
                    content,
                    isAnswered,
                    isHighLighted,
                    likeCount: Object.values(likes ?? {}).length,
                    // @ts-ignore
                    id_like: Object.entries(likes ?? {}).find(([ key, like ]) => like.id_author === user?.id)?.[0]
                }
            });

            setTitle(room.key);
            setQuestions(parsedQuestions);

        });

        return () => {
            unsubscribeRoomListener();
        }

    }, [id_room, user?.id])

    return { questions, title }
}