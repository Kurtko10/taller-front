import React, { useState, useEffect } from 'react';
import DataTable from '../Table/Table';
import { getUserCars } from '../../service/apiCalls';

const UserCars = ({ userId, token }) => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    console.log('UserCars mounted with userId:', userId);
    if (userId && token) {
      fetchUserCars();
    }
  }, [userId, token]);

  const fetchUserCars = async () => {
    console.log('Fetching cars for user:', userId);
    try {
      const userCars = await getUserCars(token, userId);
      console.log('Fetched cars:', userCars);
      setCars(userCars.cars || []);
    } catch (error) {
      console.error('Error fetching cars:', error);
      alert('Error al obtener los datos de los vehículos');
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID' },
    { field: 'licensePlate', headerName: 'Matrícula' },
    { field: 'carBrand', headerName: 'Marca' },
    { field: 'model', headerName: 'Modelo' },
    { field: 'year', headerName: 'Año' },
  ];

  return (
    <div className="user-cars-container">
      <h1>Mis Vehículos</h1>
      {cars.length > 0 ? (
        <DataTable rows={cars} columns={columns} renderActions={() => null} />
      ) : (
        <p>No tienes vehículos registrados.</p>
      )}
    </div>
  );
};

export default UserCars;

