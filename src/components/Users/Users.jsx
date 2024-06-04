import React, { useState, useEffect } from "react";
import {
  getAllUserProfiles,
  getUserById,
  deleteUserById,
  updateUserProfile,
  createNewUserCall
} from "../../service/apiCalls";
import { useSelector } from 'react-redux';
import { getUserData } from "../../app/slices/userSlice";
import { UserDetailsModal } from "../../components/UserModal/UserDetailsModal";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/Table/Table";
import CustomPagination from "../Pagination/Pagination"; 
import SearchInput from "../../components/SearchInput/SearchInput";
import { ButtonC } from "../../components/ButtonC/ButtonC";
import "./Users.css";

const Users = () => {
  const navigate = useNavigate();

  const [userProfiles, setUserProfiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const profilesPerPage = 5;
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const userReduxData = useSelector(getUserData);
  const token = userReduxData.token;
  const [allUserProfiles, setAllUserProfiles] = useState([]);
  const userData = useSelector(state => state.user);
  const role = userData.decodificado.userRole;

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
        setShowModal(true);
      } catch (error) {
        alert('Error al obtener el usuario');
        navigate("/");
      }
    }
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setShowModal(false);
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

  const updateUser = async (updatedUserData) => {
    try {
      const payload = { ...updatedUserData, user_id: updatedUserData.id };
      await updateUserProfile(updatedUserData.id, payload, token);
      const updatedUserProfiles = userProfiles.map(user =>
        user.id === updatedUserData.id ? { ...user, ...updatedUserData } : user
      );
      setUserProfiles(updatedUserProfiles);
      setShowModal(false);
    } catch (error) {
      alert('Error al actualizar el usuario.');
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

  const columns = [
    { field: 'id', headerName: 'ID' },
    { field: 'firstName', headerName: 'Nombre' },
    { field: 'lastName', headerName: 'Apellido' },
    { field: 'email', headerName: 'Correo' },
    { field: 'phone', headerName: 'Teléfono' },
    { field: 'actions', headerName: 'Acciones' }
  ];

  const renderUserActions = (row) => (
    <ButtonC onClick={() => handleUserClick(row.id, false)}>Ficha</ButtonC>
  );

  return (
    <div className="usersView">
      <h1 id="usersTitle">Lista de Usuarios</h1>
      <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar por nombre, apellido o rol" />
      <DataTable rows={currentProfiles} columns={columns} renderActions={renderUserActions} />
      <UserDetailsModal
        show={showModal}
        userData={selectedUser}
        onClose={handleCloseModal}
        isCreating={isCreating}
        deleteUser={deleteUser}
        onUpdate={updateUser}
        onSave={handleSave}
        token={token}
        role={role}
      />
      <CustomPagination
        currentPage={currentPage}
        totalPages={Math.ceil(userProfiles.length / profilesPerPage)}
        onPageChange={handlePageChange}
      />
      <ButtonC
        title={"Nuevo Usuario"}
        className={"regularButtonClass newUser"}
        onClick={() => handleUserClick(null, true)}
      />
    </div>
  );
};

export default Users;

