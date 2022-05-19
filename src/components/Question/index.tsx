import React, {ReactNode} from 'react'
import { Image } from 'react-bootstrap';

import cn from 'classnames';

import './style.scss';

interface IQuestionProps {
    children?: ReactNode;
    content: string;
    author: {
        name: string;
        avatar: string;
    };
    isAnswered?: boolean;
    isHighLighted?: boolean;
}

const Question = (props: IQuestionProps) => {

    const { content, author, children, isAnswered=false, isHighLighted=false } = props;

    return (
        <div className={cn(
            `question p-3 border border-2`,
            { answered: isAnswered },
            { highlighted: isHighLighted && !isAnswered }
        )}>
            <p className={'text-dark'}>{ content }</p>
            <footer className={'d-flex justify-content-between align-items-center mt-2'}>
                <div className="user-info w-100">
                    <Image src={ author.avatar } alt={ author.name } roundedCircle />
                    <div className={'d-flex flex-row w-100 d-flex justify-content-between align-items-center    '}>
                        <span className={'text-dark'}>{ author.name }</span>
                        <div>{ children }</div>

                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Question