import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { CustomInput } from "../CusstomInput/CustomInput";
import { useSelector } from 'react-redux';
import { getUserData } from "../../app/slices/userSlice";
import * as avatars from '@dicebear/avatars';
import * as style from '@dicebear/avatars-initials-sprites';

export const UserDetailsModal = ({ show, userData, onClose, deleteUser, onSave, onUpdate, isCreating }) => {
  const [formData, setFormData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    roleId: '',
    isActive: true,
    workerType: '',
    province: '',
    avatar: ''
  });

  const userReduxData = useSelector(getUserData);
  const token = userReduxData.token;

  useEffect(() => {
    if (isCreating) {
      setFormData({
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '12345678',
        roleId: '',
        isActive: true,
        workerType: '',
        province: '',
        avatar: generateAvatar()
      });
    } else if (userData) {
      setFormData({
        ...userData,
        roleId: userData.role ? userData.role.id : '',
        workerType: userData.workerType || '',
        province: userData.province || '',
        avatar: userData.avatar || generateAvatar(userData.firstName, userData.lastName)
      });
    }
  }, [isCreating, userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (e) => {
    const newRoleId = e.target.value;
    const newState = {
      ...formData,
      roleId: newRoleId,
      workerType: newRoleId === '2' ? formData.workerType : '',
      province: formData.province 
    };
    setFormData(newState);
  };

  const generateAvatar = (firstName = '', lastName = '') => {
    return avatars.createAvatar(style, {
      seed: `${firstName} ${lastName}`,
      backgroundColor: '#ffffff'
    });
  };

  const handleSave = () => {
    const userData = {
      ...formData,
      roleId: parseInt(formData.roleId),
      workerType: formData.roleId === '2' ? formData.workerType : undefined
    };

    if (!userData.firstName || !userData.lastName || !userData.email || !userData.phone || !userData.password || !userData.roleId || !userData.province) {

      return;
    }

    if (userData.roleId === 2 && !userData.workerType) {

      return;
    }

    onSave(userData);
    onClose();
  };

  const handleSaveChanges = () => {
    onUpdate(formData);
    onClose();
  };

  const roleSpecificFields = (roleId) => {
    if (roleId === '2') { // Manager
      return (
        <Form.Group controlId="formWorkerTypeSelect">
          <Form.Label>Tipo de Trabajador</Form.Label>
          <Form.Control as="select" value={formData.workerType} onChange={handleInputChange} name="workerType">
            <option value="">Seleccione un Tipo de Trabajador</option>
            <option value="mechanic">Mecánico</option>
            <option value="quick_service">Servicio Rápido</option>
            <option value="painter">Pintor</option>
            <option value="bodyworker">Chapa</option>
          </Form.Control>
        </Form.Group>
      );
    }
    return null;
  };

  const getRoleName = (roleId) => {
    switch(roleId) {
      case '1':
        return 'Admin';
      case '2':
        return 'Manager';
      case '3':
        return 'Client';
      default:
        return '';
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{isCreating ? "Crear Nuevo Usuario" : "Editar Usuario"}-{formData.firstName}-{formData.lastName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {!isCreating && (
            <CustomInput
              typeProp="text"
              nameProp="id"
              placeholderProp={`ID usuario: ${formData.id}`}
              value={formData.id}
              handlerProp={handleInputChange}
              isDisabled={true}
            />
          )}
          <CustomInput
            typeProp="text"
            nameProp="firstName"
            placeholderProp="Nombre"
            value={formData.firstName}
            handlerProp={handleInputChange}
          />
          <CustomInput
            typeProp="text"
            nameProp="lastName"
            placeholderProp="Apellido"
            value={formData.lastName}
            handlerProp={handleInputChange}
          />
          <CustomInput
            typeProp="email"
            nameProp="email"
            placeholderProp="Email"
            value={formData.email}
            handlerProp={handleInputChange}
            isDisabled={!isCreating}
          />
          <CustomInput
            typeProp="text"
            nameProp="phone"
            placeholderProp="Teléfono"
            value={formData.phone}
            handlerProp={handleInputChange}
          />
          <CustomInput
            typeProp="text"
            nameProp="avatar"
            placeholderProp="Avatar"
            value={formData.avatar}
            handlerProp={handleInputChange}
            isDisabled={true}
          />
          <CustomInput
            typeProp="text"
            nameProp="province"
            placeholderProp="Provincia"
            value={formData.province}
            handlerProp={handleInputChange}
          />
          {isCreating && (
            <>
              <CustomInput
                typeProp="password"
                nameProp="password"
                placeholderProp="Contraseña"
                value={formData.password}
                handlerProp={handleInputChange}
              />
               <Form.Group controlId="formRoleSelect">
                <Form.Label>Rol</Form.Label>
                <Form.Control as="select" value={formData.roleId} onChange={handleRoleChange}>
                  <option value="">Seleccione un Rol</option>
                  <option value="1">Admin</option>
                  <option value="2">Manager</option>
                  <option value="3">Client</option>
                </Form.Control>
                {roleSpecificFields(formData.roleId)}
              </Form.Group>
            </>
          )}
          {!isCreating && (
            <CustomInput
              typeProp="text"
              nameProp="roleName"
              placeholderProp={`Rol: ${formData.roleId}`}
              value={formData.roleName}
              handlerProp={handleInputChange}
              isDisabled={true}
            />
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={() => deleteUser(formData.id)} disabled={isCreating}>
          Eliminar
        </Button>
        <Button variant="primary" onClick={isCreating ? handleSave : handleSaveChanges}>
          {isCreating ? "Crear" : "Guardar Cambios"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
