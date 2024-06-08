import axios from "axios";


const API_URL = "http://localhost:3010"

//------------------AUTH-------
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
      return {
        success: false,
        message: error.response.data.message || 'Error en el registro del usuario',
        status: error.response.status,
      };
    } else if (error.request) {
      return {
        success: false,
        message: 'No se recibió respuesta del servidor',
      };
    } else {

      return {
        success: false,
        message: 'Error en la configuración de la solicitud',
      };
    }
  }
};


//------------ USUARIOS--------
// Obtener todos los perfiles de usuarios
export const getAllUserProfiles = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.get(`${API_URL}/api/users`, config);
  return res.data;
};

// Crear nuevo usuario
export const createNewUserCall = async (userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.post(`${API_URL}/api/users`, userData, config);
  return res.data;
};

// Ver usuario con Role Manager
export const getUsersByManagerRole = async () => {
  try {
    const res = await axios.get(`${API_URL}/api/users/role/managers`);
    return Array.isArray(res.data) ? res.data : []; 
  } catch (error) {

    throw error; 
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

// Eliminar usuario por ID
export const deleteUserById = async (userId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.delete(`${API_URL}/api/users/${userId}`, config);
  return res.data;
};

// Actualizar perfil de usuario
export const updateUserProfile = async (userId, userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.put(`${API_URL}/api/users/${userId}`, userData, config);
  return res.data;
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
// Obtener usuario por ID
export const getUserById = async (userId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.get(`${API_URL}/api/users/${userId}`, config);
  return res.data;
};


//--------------CITAS------------
// Ver cita de un usuario (pendiente de adaptar para admin y manager tambien)
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

// Ver cita de un usuario 
export const getAppointmentsByWorkerId = async (token) => {
  try {
     
      const config = {
          headers: {
              Authorization: `Bearer ${token}`
          }
      };
      const res = await axios.get(`${API_URL}/api/appointments/worker/`, config);    
      return res.data;
  } catch (error) {
      throw error;
  }
};

// Ver cita por Id
export const getAppointmentById = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}/api/appointments/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {

    throw error;
  }
};


// Editar cita 
export const updateAppointmentById = async (id, token, appointmentData) => {
  try {
    const response = await axios.put(`${API_URL}/api/appointments/${id}`, appointmentData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {

    throw error;
  }
};

// Crear cita
export const createAppointment = async (appointmentData, token) => {
  try {
    const response = await axios.post(`${API_URL}/api/appointments`, appointmentData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
//Eliminar cita
export const deleteAppointmentById = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/api/appointments/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Obtener todas las citas(ADMIN)
export const getAllAppointments = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/appointments`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {

    throw error;
  }
};

//--------------------VEHICULOS-------
// Ver vehículos
export const getUserCars = async (token, userId) => {

  try {
    const response = await axios.get(`${API_URL}/api/cars/userCars`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {

    throw error;
  }
};

// Ver vehículos poruserId
export const getUserCarById = async (userId, token) => {
  try {
    const response = await axios.get(`${API_URL}/api/cars/userCars/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Añadir vehículo
export const addUserCar = async (token, carData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.post(`${API_URL}/api/cars/userCars`, carData, config);

  return res.data;
};

// Añadir vehículo a un usuario específico
export const addUserCarToSpecificUser = async (token, userId, carData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.post(`${API_URL}/api/cars/${userId}`, carData, config);
  return res.data;
};

// Eliminar vehículo
export const deleteUserCar = async (token, carId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.delete(`${API_URL}/api/cars/userCars/${carId}`, config);
  return res.data;
};

