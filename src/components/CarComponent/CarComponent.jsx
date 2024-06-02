import React, { useState, useEffect } from 'react';
import DataTable from '../Table/Table';
import { getUserCars, addUserCar, deleteUserCar } from '../../service/apiCalls';
import { useSelector } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';

const UserCars = ({ userId, token }) => {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showAddCarModal, setShowAddCarModal] = useState(false);
  const [showCarDetailsModal, setShowCarDetailsModal] = useState(false);
  const [newCar, setNewCar] = useState({
    licensePlate: '',
    carBrand: '',
    model: '',
    year: '',
    userId: '',
  });

  const role = useSelector((state) => state.user.role);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCar((prevCar) => ({
      ...prevCar,
      [name]: value,
    }));
  };

  const handleAddCar = async (e) => {
    e.preventDefault();
    try {
      const response = await addUserCar(token, newCar);
      console.log('Car added successfully:', response);
      setShowAddCarModal(false);
      fetchUserCars(); // Refrescar la lista de coches
    } catch (error) {
      console.error('Error adding car:', error);
      alert('Error al añadir el vehículo');
    }
  };

  const handleRowClick = (car) => {
    setSelectedCar(car);
    setShowCarDetailsModal(true);
  };

  const handleDeleteCar = async () => {
    const confirmDelete = window.confirm('¿Seguro que deseas eliminar este vehículo?');
    if (!confirmDelete) return;

    try {
      await deleteUserCar(token, selectedCar.id);
      console.log('Car deleted successfully');
      setShowCarDetailsModal(false);
      fetchUserCars(); // Refrescar la lista de coches
    } catch (error) {
      console.error('Error deleting car:', error);
      alert('Error al eliminar el vehículo');
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
        <>
          <DataTable rows={cars} columns={columns} onRowClick={handleRowClick} renderActions={() => null} />
          <Button onClick={() => setShowAddCarModal(true)}>Añadir Vehículo</Button>
        </>
      ) : (
        <>
          <p>No tienes vehículos registrados.</p>
          <Button onClick={() => setShowAddCarModal(true)}>Añadir Vehículo</Button>
        </>
      )}
      
      <Modal show={showAddCarModal} onHide={() => setShowAddCarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Añadir Vehículo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddCar}>
            <Form.Group controlId="formLicensePlate">
              <Form.Label>Matrícula</Form.Label>
              <Form.Control
                type="text"
                name="licensePlate"
                value={newCar.licensePlate}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formCarBrand">
              <Form.Label>Marca</Form.Label>
              <Form.Control
                type="text"
                name="carBrand"
                value={newCar.carBrand}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formModel">
              <Form.Label>Modelo</Form.Label>
              <Form.Control
                type="text"
                name="model"
                value={newCar.model}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formYear">
              <Form.Label>Año</Form.Label>
              <Form.Control
                type="number"
                name="year"
                value={newCar.year}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            {(role === 'manager' || role === 'admin') && (
              <Form.Group controlId="formUserId">
                <Form.Label>User ID</Form.Label>
                <Form.Control
                  type="text"
                  name="userId"
                  value={newCar.userId}
                  onChange={handleInputChange}
                />
              </Form.Group>
            )}
            <Button variant="primary" type="submit">
              Guardar
            </Button>
            <Button variant="secondary" onClick={() => setShowAddCarModal(false)}>
              Cancelar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {selectedCar && (
        <Modal show={showCarDetailsModal} onHide={() => setShowCarDetailsModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Detalles del Vehículo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>ID:</strong> {selectedCar.id}</p>
            <p><strong>Matrícula:</strong> {selectedCar.licensePlate}</p>
            <p><strong>Marca:</strong> {selectedCar.carBrand}</p>
            <p><strong>Modelo:</strong> {selectedCar.model}</p>
            <p><strong>Año:</strong> {selectedCar.year}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleDeleteCar}>
              Eliminar
            </Button>
            <Button variant="secondary" onClick={() => setShowCarDetailsModal(false)}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default UserCars;

