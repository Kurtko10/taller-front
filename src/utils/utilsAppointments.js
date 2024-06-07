import {
    getAllAppointments,
    deleteAppointmentById,
    updateAppointmentById,
    createAppointment,
    getAllUserProfiles,
    getUserCarById,
    getUsersByManagerRole,
    bringProfile,
    getUserCars,
    getAppointmentById
  } from '../service/apiCalls.js';
  
  export const serviceWorkerMap = {
    '1': 'mechanic', 
    '2': 'quick_service', 
    '3': 'bodyworker',
    '4': 'painter', 
  };
  
  export const fetchUsers = async (token) => {
    try {
      return await getAllUserProfiles(token);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Error al obtener los perfiles de usuario.');
    }
  };
  
  export const fetchAllWorkers = async () => {
    try {
      return await getUsersByManagerRole();
    } catch (error) {
      console.error('Error fetching workers:', error);
      throw new Error('Error al obtener los trabajadores.');
    }
  };
  
  export const fetchCars = async (userId, token) => {
    try {
      const carsData = await getUserCarById(userId, token);
      return carsData.cars;
    } catch (error) {
      console.error('Error fetching cars:', error);
      throw new Error('Error al obtener los vehículos del usuario.');
    }
  };
  
  export const handleDelete = async (appointmentId, token, getAppointments) => {
    try {
      const confirmDelete = window.confirm('¿Seguro que deseas cancelar esta cita?');
      if (!confirmDelete) return;
  
      await deleteAppointmentById(appointmentId, token);
      await getAppointments();
    } catch (error) {
      throw new Error('Hubo un error al intentar eliminar la cita.');
    }
  };
  
  export const handleEdit = async (appointmentId, editData, token, getAppointments, handleCloseModal) => {
    try {
      const dateUTC = new Date(editData.date || editData.datetime);
      if (isNaN(dateUTC.getTime())) {
        throw new Error('Fecha inválida');
      }
      const payload = {
        date: dateUTC.toISOString(),
        status: editData.status,
        observations: editData.observations,
        service_id: editData.service_id,
        user_id_worker: editData.user_id_worker,
        car_id: editData.car_id
      };
  
      console.log('Payload:', payload);
  
      await updateAppointmentById(appointmentId, token, payload);
      await getAppointments();
      if (handleCloseModal) handleCloseModal();
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw new Error(`Hubo un error al intentar actualizar la cita. Detalles del error: ${error.message}`);
    }
  };
  
  export const handleFilterChange = (e, setFilter) => {
    setFilter(e.target.value);
  };
  
  export const handleSearchChange = (e, setSearchQuery) => {
    setSearchQuery(e.target.value);
  };
  
  export const handleCriteriaChange = (e, setSearchCriteria) => {
    setSearchCriteria(e.target.value);
  };
  
  export const handlePageChange = (page, setCurrentPage) => {
    setCurrentPage(page);
  };
  
  export const handleInputChange = (e, setFormData) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  