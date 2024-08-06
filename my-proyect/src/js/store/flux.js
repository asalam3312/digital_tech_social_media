const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      registerStatus: false,
      loginStatus: false,
      postStatus: false,
      posts: []
    },
    actions: {

      register: async (name, surname, username, email, password) => {
        try {
          const data = {
            name: name,
            surname: surname,
            username: username,
            email: email,
            password: password,
          };
          console.log("esta es la data:", data)
          const response = await fetch("http://127.0.0.1:5000/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
          });

          const statusCode = response.status;
          const responseData = await response.json();

          if (statusCode === 201) {
            setStore({ ...getStore(), registerStatus: true });
          }

          return responseData;
        } catch (error) {
          console.error("Error:", error);
        }
      },
      login: async (email, password) => {
        try {
          const response = await fetch("http://127.0.0.1:5000/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
          });

          const statusCode = response.status;
          const responseData = await response.json();

          if (statusCode === 200) {
            // Guardamos el token en el localStorage o en el estado de la aplicación
            localStorage.setItem('access_token', responseData.access_token);
            return responseData;
          } else {
            console.error("Error logging in:", responseData);
            return null;
          }
        } catch (error) {
          console.error("Error:", error);
          return null;
        }
      },
      getUserDetails: async () => {
        try {
          const token = localStorage.getItem('access_token');
          if (!token) {
            throw new Error('No token found');
          }

          const response = await fetch("http://127.0.0.1:5000/user-details", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });

          if (response.ok) {
            const userData = await response.json();

            setStore({ ...getStore(), user: userData });
          } else {
            console.error('Failed to fetch user details');
          }
        } catch (error) {
          console.error("Error:", error);
        }
      },
      postCard: async (message, image, author_id, author, created_at, location, status) => {
        try {
          const response = await fetch('http://127.0.0.1:5000/Post', {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ message, image, author_id, author, created_at, location, status })
          });

          const statusCode = response.status;
          const responseData = await response.json();

          if (statusCode === 201) {
            setStore({ ...getStore(), postStatus: true });
          }
          return responseData;
        } catch (e) {
          console.error("error", "error in:", e);
          return { error: "An error occurred while posting the card." };
        }
      },
      getPosts: async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/posts'); // Ajusta la URL
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setStore({ ...getStore(), posts: data }); // Actualiza el estado con los posts obtenidos
            return data;
        } catch (e) {
            console.error('Error fetching posts:', e);
            return []; // Retorna un array vacío en caso de error
        }
    }
    }
  };
};

  export default getState;