import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../js/store/appContext';
import { useNavigate } from 'react-router';
import '../../src/cssFile.css'

const CreateANewPost = () => {
    const { actions } = useContext(Context);
    const [postData, setPostData] = useState({
        message: '',
        image: '',
        author_id: '',
        author: '',
        created_at: new Date().toISOString().slice(0, 19),
        location: '',
        status: ''  // Inicialmente vacío
    });
    const [imageUrl, setImageUrl] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/user-details', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                });

                if (response.ok) {
                    const userData = await response.json();
                    setPostData({
                        ...postData,
                        author_id: userData.id,
                        author: userData.username
                    });
                } else {
                    console.error('Failed to fetch user details');
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPostData({ ...postData, [name]: value });
    }

    const handlePost = async (e) => {
        e.preventDefault();
        const { message, image, author_id, author, created_at, location, status } = postData;
        const response = await actions.postCard(message, image, author_id, author, created_at, location, status);

        if (response && response.message === 'Post created successfully.') {
            navigate('/Home');
        }
    }

    return (
        <div className='create-post-container'>
            <div className='create-post-card'>
                <form onSubmit={handlePost}>
                    <div className='create-post-header'>
                        <div className='author-info'>
                            <div className='author-name'>{postData.author}</div>
                        </div>
                    </div>
                    <div className='create-post-image'>
                        {imageUrl && <img src={imageUrl} alt="Post" />}
                    </div>
                    <div className='create-post-body'>
                        <div className='input-group'>
                            <label htmlFor="message">Message</label>
                            <input
                                type="text"
                                id="message"
                                name="message"
                                value={postData.message}
                                onChange={handleChange}
                                placeholder="Write your message here..."
                            />
                        </div>

                        <div className='input-group'>
                            <label htmlFor="location">Location</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={postData.location}
                                onChange={handleChange}
                                placeholder="Add location..."
                            />
                        </div>

                        <div className='input-group'>
                            <label htmlFor="status">Status</label>
                            <select
                                id="status"
                                name="status"
                                value={postData.status}
                                onChange={handleChange}
                            >
                                <option value="">Select status</option>
                                <option value="drafted">Drafted</option>
                                <option value="deleted">Deleted</option>
                                <option value="published">Published</option>
                            </select>
                        </div>

                        <div className='input-group'>
                            <label htmlFor="imageUrl">Image URL</label>
                            <input
                                type="text"
                                id="imageUrl"
                                name="imageUrl"
                                value={imageUrl}
                                onChange={(e) => {
                                    setImageUrl(e.target.value);
                                    setPostData({ ...postData, image: e.target.value });
                                }}
                                placeholder="Enter image URL"
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Post</button>
                </form>
            </div>
        </div>
    )
}

export default CreateANewPost;