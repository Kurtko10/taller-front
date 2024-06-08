import React, { useState, useEffect } from 'react';
import DataTable from '../Table/Table';
import { getUserCars, addUserCar, deleteUserCar, addUserCarToSpecificUser } from '../../service/apiCalls';
import { useSelector } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';

const UserCars = ({ userId, token, show, onClose, addToOtherUser }) => {
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
  const currentUser = useSelector((state) => state.user);
  const currentUserId = currentUser.decodificado.userId;

  useEffect(() => {
    if (userId || currentUserId) {
      fetchUserCars();
    }
  }, [userId, currentUserId]);

  const fetchUserCars = async () => {
    try {
      const userCars = await getUserCars(token, userId || currentUserId);
      setCars(userCars.cars || []);
    } catch (error) {

      alert('Error al obtener los datos de los vehículos');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCar((prevCar) => ({
      ...prevCar,
      [name]: value,
      userId: addToOtherUser ? newCar.userId : userId || currentUserId,
    }));
  };

  const handleAddCar = async (e) => {
    e.preventDefault();
    try {
      if (addToOtherUser) {
        const response = await addUserCarToSpecificUser(token, newCar.userId, newCar);
      } else {
        const response = await addUserCar(token, newCar);
      }
      setShowAddCarModal(false);
      fetchUserCars();
    } catch (error) {

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
      setSelectedCar(null);
      setShowCarDetailsModal(false);
      fetchUserCars();
    } catch (error) {

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
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Vehículos del Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {cars.length > 0 ? (
          <DataTable rows={cars} columns={columns} onRowClick={handleRowClick} renderActions={() => null} />
        ) : (
          <p>No tienes vehículos registrados.</p>
        )}
        <Button onClick={() => setShowAddCarModal(true)}>Añadir Vehículo</Button>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </Modal.Footer>

      <Modal show={showAddCarModal} onHide={() => setShowAddCarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Añadir Vehículo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddCar}>
            {addToOtherUser && (
              <Form.Group controlId="formUserId">
                <Form.Label>Usuario</Form.Label>
                <Form.Control
                  as="select"
                  name="userId"
                  value={newCar.userId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione un usuario</option>
                  {cars.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            )}
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
    </Modal>
  );
};

export default UserCars;
