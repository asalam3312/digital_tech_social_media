
// import React, { useContext, useEffect } from 'react';
// import { Context } from '../js/store/appContext';
// import '../../src/cssFile.css'
// import { useNavigate } from 'react-router';

// const Home = () => {
//   const { store, actions } = useContext(Context);

//   // const navigate = useNavigate()

//   // const handlePostCard=()=>{

//   // }
//   useEffect(() => {
//     actions.getPosts();
//   }, [actions]);

//   useEffect(() => {
//     console.log('Posts:', store.posts); 
//   }, [store.posts]);

//   return (
//     <div className="home-container">
//       <div className="home-header">
//         <h1>Home</h1>
//       </div>
//       {store.posts.length > 0 ? (
//         <ul className="home-posts-list">
//           {store.posts.map((post) => (
//             <li key={post.id} className="home-post">
//               <div className="home-post-header">
//                 <h2>{post.author}</h2>
//               </div>
//               {post.image && <img src={post.image} alt="Post" className="home-post-image" />}
//               <div className="home-post-content">
//                 <h3>{post.message}</h3>
//                 <p className="home-location">Location: {post.location}</p>
//                 <p className="home-date">{post.created_at}</p>
//               </div>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No posts available.</p>
//       )}
//     </div>
//   );
// };

// export default Home;

import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Context } from '../js/store/appContext';
import { Link } from 'react-router-dom';
import '../../src/cssFile.css';

const Home = () => {
  const { store, actions } = useContext(Context);
  const [loading, setLoading] = useState(true); 
  const [postsLoaded, setPostsLoaded] = useState(false); 

  useEffect(() => {
    // Solo llama a getPosts si los posts aún no han sido cargados
    if (!postsLoaded) {
      const fetchPosts = async () => {
        await actions.getPosts();
        setLoading(false);
        setPostsLoaded(true); 
      };

      fetchPosts();
    } else {
      setLoading(false);
    }
  }, [actions, postsLoaded]);

  // invertir lista de los post
  const postsList = useMemo(() => store.posts.slice().reverse(), [store.posts]);

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Home</h1>
        <Link to="/PostIt" className="btn btn-create-post">Create New Post</Link>
      </div>
      {loading ? (
        <p>Loading posts...</p>
      ) : postsList.length > 0 ? (
        <ul className="home-posts-list">
          {postsList.map((post) => (
            <li key={post.id} className="home-post">
              <div className="home-post-header">
                <h2>{post.author}</h2>
              </div>
              {post.image && <img src={post.image} alt="Post" className="home-post-image" />}
              <div className="home-post-content">
                <h3>{post.message}</h3>
                <p className="home-location">Location: {post.location}</p>
                <p className="home-date">{post.created_at}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};

export default Home;



