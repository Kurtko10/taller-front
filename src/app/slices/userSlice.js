import { createSlice } from "@reduxjs/toolkit";

// creamos nuestro pasillo para el usuario (slice de user)
export const userSlice = createSlice({
    name: "user", // nombre del pasillo
    initialState: { // estado inicial del pasillo
        token: "",
        decodificado: {
            role: "",
            name: "",
            email: "",
            id: ""
        },
        vecesLogeado: 10
    },

    // distintas acciones que puedo realizar en este pasillo (todas reciben un state y un action y devuelven un nuevo estado)
    reducers: {
        login: (state, action) => {

            return {
                ...state,
                ...action.payload,
                vecesLogeado: state.vecesLogeado + 1
            }
        },

        logout: (state, action) => {

            return {
                token: "",
                decodificado: {
                    name: "",
                    email: "",
                    id: ""
                },
                vecesLogeado: state.vecesLogeado
            
            }
        },

        resetCount: (state, action) => {
        
            return {
                ...state,
                vecesLogeado: 0
            }
        },
        setUserData: (state, action) => {
            state.userData = action.payload;
          }
    }
});

// exportamos las acciones a las que accederemos a través del useDispatch para escribir en el almacén
export const {login, logout, resetCount, setUserData} = userSlice.actions

export const fetchUserProfile = (token) => async (dispatch) => {
    try {
      const profileData = await bringProfile(token);
      dispatch(setUserData(profileData.data));
    } catch (error) {
     
    }
  };


// definimos y exportamos los métodos que nos permitirán venir al almacén a leer información
export const getUserData = (state) => state.user

export const selectUserData = (state) => state.user.userData;
export const getLoggedAmount = (state) => state.user.vecesLogeado

// método que nos dice si el usuario logeado es admin o no para uso en rutas de admins
export const amIAdmin =(state) => state.user.decodificado.userRole === "admin"
export default userSlice.reducer;
