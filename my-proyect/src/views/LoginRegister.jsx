import React, { useState, useContext } from 'react';
import { Context } from '../js/store/appContext.js';
import { useNavigate } from 'react-router';
import '../../src/cssFile.css'; // Asegúrate de que este archivo incluya los estilos necesarios

const LoginRegister = () => {
    const { actions } = useContext(Context);
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        username: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRegister = async () => {
        const { name, surname, username, email, password } = formData;
        const response = await actions.register(name, surname, username, email, password);

        if (response && response.message === 'User created successfully.') {
            navigate('/Home');
        }
    };

    return (
        <div className='login-register-container'>
            <div className='login-register-card'>
                <h2 className='login-register-title'>Register</h2>
                <form>
                    <div className="input-group">
                        <label htmlFor="name" className="input-label">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="input-field"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="surname" className="input-label">Surname:</label>
                        <input
                            type="text"
                            id="surname"
                            name="surname"
                            className="input-field"
                            value={formData.surname}
                            onChange={handleChange}
                            placeholder="Enter your surname"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="username" className="input-label">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="input-field"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Choose a username"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email" className="input-label">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="input-field"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                        />
                        <small id="emailHelp" className="form-text">We'll never share your email with anyone else.</small>
                    </div>
                    <div className="input-group">
                        <label htmlFor="password" className="input-label">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="input-field"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Choose a password"
                        />
                    </div>
                    <button type="button" className="btn btn-primary" onClick={handleRegister}>Register</button>
                </form>
            </div>
        </div>
    );
};

export default LoginRegister;
