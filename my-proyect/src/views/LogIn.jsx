import React, { useContext, useState } from 'react'
import { Context } from '../js/store/appContext'
import { useNavigate } from 'react-router'

const LogIn = () => {
    const { actions } = useContext(Context)
    const navigate = useNavigate()
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

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
        <form onSubmit={handleLogin}>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input 
                    type="email" 
                    className="form-control" 
                    id="email" 
                    name="email"
                    aria-describedby="emailHelp" 
                    value={formData.email} 
                    onChange={handleChange} />
                <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input 
                    type="password" 
                    className="form-control" 
                    id="password" 
                    name="password"
                    value={formData.password} 
                    onChange={handleChange} />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    )
}

export default LogIn
