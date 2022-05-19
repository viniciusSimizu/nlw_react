import { ButtonHTMLAttributes } from 'react'

import './style.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined?: boolean;
};

const Button = ({ isOutlined=false, ...props }: ButtonProps) => {
    return (
        <button className={`${isOutlined ? 'outlined' : ''}`} { ...props }>{ props.children }</button>
    )
}

export default Button