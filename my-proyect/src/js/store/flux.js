const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      personas: ["Pedro", "Maria"],
      registerStatus: false,
      loginStatus:false,
    },
    actions: {

      exampleFunction: () => {
        console.log("hola")
        return
      },
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
    }
    }
  };
};

export default getState;