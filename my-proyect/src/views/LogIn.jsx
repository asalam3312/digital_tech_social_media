import React, { useContext, useState } from 'react';
import { Context } from '../js/store/appContext';
import { useNavigate } from 'react-router';
import '../../src/cssFile.css'; // Asegúrate de que este archivo incluya los estilos necesarios

const LogIn = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = formData;
        const response = await actions.login(email, password);

        if (response && response.access_token) {
            navigate('/Home');
        } else {
            console.error("Login failed");
            // Puedes mostrar un mensaje de error al usuario aquí
        }
    };

    return (
        <div className='login-container'>
            <div className='login-card'>
                <h2 className='login-title'>Log In</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="email" className="input-label">Email address</label>
                        <input 
                            type="email" 
                            className="input-field" 
                            id="email" 
                            name="email"
                            aria-describedby="emailHelp" 
                            value={formData.email} 
                            onChange={handleChange} 
                            placeholder="Enter your email"
                        />
                        <small id="emailHelp" className="form-text">We'll never share your email with anyone else.</small>
                    </div>
                    <div className="input-group">
                        <label htmlFor="password" className="input-label">Password</label>
                        <input 
                            type="password" 
                            className="input-field" 
                            id="password" 
                            name="password"
                            value={formData.password} 
                            onChange={handleChange} 
                            placeholder="Enter your password"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Log In</button>
                </form>
            </div>
        </div>
    );
};

export default LogIn;
