import React, { useState, useEffect } from "react";
import { getAllUserProfiles, getUserById, deleteUserById, updateUserProfile, createNewUserCall, addUserCarToSpecificUser } from "../../service/apiCalls";
import { useSelector } from 'react-redux';
import { getUserData } from "../../app/slices/userSlice";
import { UserDetailsModal } from "../../components/UserModal/UserDetailsModal";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/Table/Table";
import CustomPagination from "../Pagination/Pagination"; 
import SearchInput from "../../components/SearchInput/SearchInput";
import { Modal, Button, Form } from 'react-bootstrap';
import addUserIcon from "../../img/añadirUser.png";
import addCarIcon from "../../img/addVehiculo.jpeg";
import "./Users.css";

const Users = () => {
  const navigate = useNavigate();
  const [userProfiles, setUserProfiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [initialUserData, setInitialUserData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const profilesPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [showCarsModal, setShowCarsModal] = useState(false);
  const [showAddCarModal, setShowAddCarModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const userReduxData = useSelector(getUserData);
  const token = userReduxData.token;
  const [allUserProfiles, setAllUserProfiles] = useState([]);
  const userData = useSelector(state => state.user);
  const role = userData.decodificado.userRole;
  const [newCar, setNewCar] = useState({
    licensePlate: '',
    carBrand: '',
    model: '',
    year: '',
    userId: '',
  });

  useEffect(() => {
    if (userData.decodificado.userRole !== "admin" && userData.decodificado.userRole !== "manager") {
      navigate("/");
    }
  }, [userData.decodificado.userRole, navigate]);

  useEffect(() => {
    getAllUserProfiles(token)
      .then((profiles) => {
        setUserProfiles(profiles);
        setAllUserProfiles(profiles);
      })
      .catch((error) => {
        alert('Error al obtener los perfiles.');
      });
  }, [token]);

  const handleUserClick = async (userId, isCreating = false) => {
    setIsCreating(isCreating);
    if (isCreating) {
      setSelectedUser(null);
      setShowModal(true);
    } else {
      try {
        const userData = await getUserById(userId, token);
        setSelectedUser(userData);
        setInitialUserData(userData);
        setShowModal(true);
      } catch (error) {
        alert('Error al obtener el usuario');
        navigate("/");
      }
    }
  };

  const handleAddCarClick = () => {
    setShowAddCarModal(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  const handleCloseCarsModal = () => {
    setShowCarsModal(false);
  };

  const handleCloseAddCarModal = () => {
    setShowAddCarModal(false);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filterUserProfiles = (profile) => {
    const { firstName, lastName, role } = profile;
    const roleString = role.name.toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    return (
      firstName.toLowerCase().includes(searchLower) ||
      lastName.toLowerCase().includes(searchLower) ||
      roleString.includes(searchLower)
    );
  };

  const deleteUser = async (id) => {
    try {
      await deleteUserById(id, token);
      const updatedProfiles = await getAllUserProfiles(token);
      setUserProfiles(updatedProfiles);
      setAllUserProfiles(updatedProfiles);
      handleCloseModal();
    } catch (error) {
      alert('Hubo un error al intentar eliminar el usuario.');
    }
  };

  const createUser = async (userData) => {
    try {
      await createNewUserCall(userData, token);
      const updatedProfiles = await getAllUserProfiles(token);
      setUserProfiles(updatedProfiles);
      setAllUserProfiles(updatedProfiles);
      setShowModal(false);
      setIsCreating(false);
    } catch (error) {
      alert('Error al crear usuario');
    }
  };

  const getUpdatedFields = (initialData, updatedData) => {
    const updatedFields = {};
    for (const key in updatedData) {
      if (updatedData[key] !== initialData[key]) {
        updatedFields[key] = updatedData[key];
      }
    }
    return updatedFields;
  };

  const updateUser = async (updatedUserData) => {
    try {
      const updatedFields = getUpdatedFields(initialUserData, updatedUserData);
      if (Object.keys(updatedFields).length === 0) {
        alert("No hay cambios para guardar.");
        return;
      }

      const cleanedFields = {};
      for (const key in updatedFields) {
        if (key === 'workerType' && (updatedFields[key] === '' || updatedUserData.roleId !== 2)) {
          continue;
        }
        cleanedFields[key] = updatedFields[key];
      }
  
      console.log("Datos enviados al backend para actualizar:", cleanedFields);
      await updateUserProfile(updatedUserData.id, cleanedFields, token);
      const updatedUserProfiles = userProfiles.map(user =>
        user.id === updatedUserData.id ? { ...user, ...updatedUserData } : user
      );
      setUserProfiles(updatedUserProfiles);
      setShowModal(false);
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      alert('Error al actualizar el usuario.');
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
      await addUserCarToSpecificUser(token, newCar.userId, newCar);
      setShowAddCarModal(false);
    } catch (error) {
      console.error('Error adding car:', error);
      alert('Error al añadir el vehículo');
    }
  };

  useEffect(() => {
    const filteredProfiles = allUserProfiles.filter(filterUserProfiles);
    setCurrentPage(1);
    setUserProfiles(filteredProfiles);
  }, [searchTerm, allUserProfiles]);

  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = userProfiles.slice(indexOfFirstProfile, indexOfLastProfile);

  const handleSave = (userData) => {
    if (isCreating) {
      createUser(userData);
    } else {
      updateUser(userData);
    }
  };

  const handleRowClick = async (row) => {
    try {
      const userData = await getUserById(row.id, token);
      setSelectedUser(userData);
      setInitialUserData(userData);
      setShowModal(true);
    } catch (error) {
      console.error("Error al obtener los detalles del usuario:", error);
      alert('Hubo un error al obtener los detalles del usuario.');
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID' },
    { field: 'firstName', headerName: 'Nombre' },
    { field: 'lastName', headerName: 'Apellido' },
    { field: 'email', headerName: 'Correo' },
    { field: 'phone', headerName: 'Teléfono' },
  ];

  return (
    <div className="usersView">
      <h1 id="usersTitle">Lista de Usuarios</h1>
      <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar por nombre, apellido o rol" />
      <DataTable rows={currentProfiles} columns={columns} onRowClick={handleRowClick} />
      <UserDetailsModal
        show={showModal}
        userData={selectedUser}
        onClose={handleCloseModal}
        isCreating={isCreating}
        deleteUser={deleteUser}
        onUpdate={updateUser}
        onSave={handleSave}
      />
      <CustomPagination
        currentPage={currentPage}
        totalPages={Math.ceil(userProfiles.length / profilesPerPage)}
        onPageChange={handlePageChange}
      />
      <div className="button-container">
        <div className="image-button" onClick={() => handleUserClick(null, true)}>
          <img src={addUserIcon} alt="Nuevo Usuario" className="image-button-img" />
          <div className="button-text">Nuevo Usuario</div>
        </div>
        <div className="image-button" onClick={handleAddCarClick}>
          <img src={addCarIcon} alt="Añadir Vehículo" className="image-button-img" />
          <div className="button-text">Añadir Vehículo</div>
        </div>
      </div>

      <Modal show={showAddCarModal} onHide={handleCloseAddCarModal}>
        <Modal.Header closeButton>
          <Modal.Title>Añadir Vehículo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddCar}>
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
                {allUserProfiles.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
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
            <Button variant="secondary" onClick={handleCloseAddCarModal}>
              Cancelar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Users;

