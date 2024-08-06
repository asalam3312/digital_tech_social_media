import React, { useState, useContext } from 'react';
import { Context } from '../js/store/appContext.js';
import { useNavigate } from 'react-router';

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
        <div className=''>
            <h2>Register</h2>
            <div className='d-flex justify-content-center'>
                <form>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="form-control"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="surname" className="form-label">Surname:</label>
                        <input
                            type="text"
                            id="surname"
                            name="surname"
                            className="form-control"
                            value={formData.surname}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="form-control"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control"
                            aria-describedby="emailHelp"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Contraseña:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                </form>
                <button className="btn btn-primary" onClick={handleRegister}>Register</button>
            </div>
        </div>
    );
};

export default LoginRegister;
