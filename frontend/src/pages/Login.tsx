import React from 'react';
import './Login.css';

interface LoginProps {
    onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    return (
        <div className="login-container">
            <h1>Login</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onLogin();
                }}
            >
                <div className="form-group">
                    <label htmlFor="username">Usuário</label>
                    <input type="text" id="username" name="username" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Senha</label>
                    <input type="password" id="password" name="password" />
                </div>
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
};

export default Login;
