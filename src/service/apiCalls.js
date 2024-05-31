import axios from "axios";


const API_URL = "http://localhost:3010"

// Login de usuario
export const loginCall = async (credentials) => {
    const res = await axios.post(`${API_URL}/api/auth/login`, credentials);
    
    return res;

};
// Registro
export const registerNewUserCall = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/register`, credentials);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error de respuesta:', error.response.data);
      return {
        success: false,
        message: error.response.data.message || 'Error en el registro del usuario',
        status: error.response.status,
      };
    } else if (error.request) {
      console.error('Error de solicitud:', error.request);
      return {
        success: false,
        message: 'No se recibió respuesta del servidor',
      };
    } else {
      console.error('Error:', error.message);
      return {
        success: false,
        message: 'Error en la configuración de la solicitud',
      };
    }
  }
};
// Ver perfil de usuario
export const bringProfile = async (token) => {
  const config = {
      headers: {
          Authorization: `Bearer ${token}`
      }
  }
  const res = await axios.get(`${API_URL}/api/users/profile/profile`, config);

  return res;
  
};

// Editar perfil

export const updateProfile = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const res = await axios.put(`${API_URL}/api/users/profile/profile`, data, config)
  return res
};

// Ver cita de un usuario 

export const getAppointmentsByClientId = async (token) => {
  try {
     
      const config = {
          headers: {
              Authorization: `Bearer ${token}`
          }
      };
      const res = await axios.get(`${API_URL}/api/appointments/client/`, config);    
      return res.data;
  } catch (error) {
      throw error;
  }
};
