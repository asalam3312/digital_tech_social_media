import React, { useContext, useEffect } from 'react'
import { Context } from '../js/store/appContext'

const Home = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.getUserDetails();
    }, [actions]);

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
        </div>
    )
}

export default Home
