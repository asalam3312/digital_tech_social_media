import React, { useContext, useState } from 'react';
import { Context } from '../js/store/appContext';
import { useNavigate } from 'react-router';

const CreateANewPost = () => {
    const { store, actions } = useContext(Context);

    const [postData, setPostData] = useState({
        message: '',
        image: '',
        author_id: '',
        author: '',
        created_at: new Date().toISOString().slice(0, 19),
        location: '',
        status: ''
    });

    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPostData({ ...postData, [name]: value });
    }

    const handlePost = async (e) => {
        console.log(postData)
        e.preventDefault();
        const { message, image, author, created_at, location, status } = postData;
        const response = await actions.postCard(message, image, postData.author_id, author, created_at, location, status);

        if (response && response.message === 'Post created successfully.') {
            navigate('/Home');
        }
    }

    return (
        <>
            <div className='position-absolute top-50 start-50 translate-middle'>
                <form onSubmit={handlePost}>
                    <div className="card" style={{ width: "100%" }}>
                        <div className='d-flex justify-content-between'>
                            <div>
                                <label htmlFor="author" className="form-label">Author</label>
                                <input 
                                type="text"
                                id="author"
                                name="author"
                                className="form-control"
                                value={postData.author}
                                onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="author_id" className="form-label">Author ID</label>
                                <input 
                                type="text"
                                id="author_id"
                                name="author_id"
                                className="form-control"
                                value={postData.author_id}
                                onChange={handleChange} />
                            </div>
                        </div>
                        <img src="https://plus.unsplash.com/premium_photo-1708983589793-56673027592e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGVycmElMjB5JTIwY2FjaG9ycm98ZW58MHx8MHx8fDA%3D" className="card-img-top" alt="..." />
                        <div className="card-body">
                            <div>
                                <div>Message</div>
                                <label htmlFor="message" className="form-label"></label>
                                <input
                                    type="text"
                                    id="message"
                                    name="message"
                                    className="form-control"
                                    value={postData.message} onChange={handleChange} />
                            </div>

                            <div className='d-flex justify-content-between'>
                                <div>
                                    <div>Location</div>
                                    <label htmlFor="location" className="form-label"></label>
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        className="form-control"
                                        value={postData.location} onChange={handleChange} />
                                </div>
                                <div>
                                    <div>Status</div>
                                    <label htmlFor="status" className="form-label"></label>
                                    <input
                                        type="text"
                                        id="status"
                                        name="status"
                                        className="form-control"
                                        value={postData.status} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">POST!</button>
                </form>
            </div>
        </>
    )
}

export default CreateANewPost;

