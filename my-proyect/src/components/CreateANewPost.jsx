import React, { useContext } from 'react'
import { Context } from '../js/store/appContext'

const CreateANewPost = () => {

    const { store, actions } = useContext(Context)

    return (
        <>
            <div className="card" style="width: 18rem;">
                <img src="..." className="card-img-top" alt="..." />
                <div className="card-body">
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                </div>
            </div>
        </>
    )
}

export default CreateANewPost