import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../js/store/appContext';
import { useNavigate } from 'react-router';

const Home = () => {
    const { store, actions } = useContext(Context);
    const [isUserDetailsFetched, setIsUserDetailsFetched] = useState(false);

    useEffect(() => {
        if (!isUserDetailsFetched) {
            actions.getUserDetails();
            setIsUserDetailsFetched(true);
        }
    }, [isUserDetailsFetched, actions]);

    const navigate = useNavigate();

    const handlePostIt = () => {
        navigate('/PostIt');
    };

    return (
        <div>
            <h1>Home</h1>
            {store.user ? (
                <div>
                    <h5>User: {store.user.name}!</h5>
                    <p>Email: {store.user.email}</p>
                    <p>Username: {store.user.username}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
            <button onClick={handlePostIt}>Post?</button>
        </div>
    );
};

export default Home;

