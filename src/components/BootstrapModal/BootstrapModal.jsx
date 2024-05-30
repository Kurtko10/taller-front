
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { CustomInput } from "../CusstomInput/CustomInput";
//import { updateProfile } from "../../service/apiCalls";
import { inputValidator } from "../../utils/validator";
import imgModificar from "../../img/modificarPerfil.png"
import "./BootstrapModal.css";

function BootstrapModal({ profileData, token, setUserData }) {
  const [show, setShow] = useState(false);
  const [updatedData, setUpdatedData] = useState(profileData || {});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [isPasswordInputDisabled, setIsPasswordInputDisabled] = useState(true);
  const [passwordData, setPasswordData] = useState({ newPassword: '' });
  const [passwordError, setPasswordError] = useState("");

  const handleClose = () => {
    setShow(false);
    setUpdatedData(profileData || {});
    setFormSubmitted(false);
    setEmailError("");
    setPasswordError("");
  };
  
  const handleShow = () => setShow(true);

  const inputHandler = (e) => {
    const { name, value } = e.target;
  
    if (name === "newPassword") {
      setPasswordData({ ...passwordData, [name]: value });
      setPasswordError(inputValidator(value, "password", "password"));
      setHasChanges(true);
    } else {
      if (value !== profileData[name] && value !== undefined) {
        setUpdatedData({ ...updatedData, [name]: value });
      }
  
      if (name === "email") {
        const errorMessage = inputValidator(value, "email", "email");
        setEmailError(errorMessage);
      }
      setHasChanges(true);
    }
  };

  const handleUpdate = async () => {
    try {
      setFormSubmitted(true);
      const changes = {};
  
      for (const [key, value] of Object.entries(updatedData)) {
        if (value !== profileData[key]) {
          changes[key] = value;
        }
      }

      if (!isPasswordInputDisabled && passwordData.newPassword) {
        changes.newPassword = passwordData.newPassword;
      }
  
      if (Object.keys(changes).length === 0) {
        handleClose();
        return;
      }
  
      if (updatedData.email !== undefined) {
        const emailErrorMessage = inputValidator(updatedData.email, "email", "email");
        if (emailErrorMessage) {
          setEmailError(emailErrorMessage);
          return;
        }
      }

      const updatedUserData = { ...profileData, ...changes };
      setUserData(updatedUserData);
  
      await updateProfile(changes, token);
  
      handleClose();
    } catch (err) {
      alert('Hubo un error al actualizar');
    }
  };

  const togglePasswordInput = () => {
    setIsPasswordInputDisabled(!isPasswordInputDisabled);
    if (isPasswordInputDisabled) {
      setPasswordData({ newPassword: '' });
    }
    setHasChanges(true);
  };

  useEffect(() => {
    if (profileData && updatedData) {
      const hasProfileChanges = Object.keys(updatedData).some(
        key => updatedData[key] !== profileData[key]
      );
      const hasPasswordChanges = !isPasswordInputDisabled && passwordData.newPassword;
      setHasChanges(hasProfileChanges || hasPasswordChanges);
    }
  }, [updatedData, passwordData, isPasswordInputDisabled, profileData]);

  return (
    <>
      {/* <Button variant="primary" onClick={handleShow}>
        Modificar
      </Button> */}
      <div className="image-button" onClick={handleShow}>
            <img src={imgModificar} alt="Modificar" className="image-button-img"/>
            <div className="button-text">Editar</div>
          </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edita tus datos!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CustomInput
            typeProp="name"
            nameProp="firstName"
            placeholderProp={profileData?.firstName}
            valueProp={updatedData?.firstName || profileData?.firstName}
            isDisabled={false}
            handlerProp={inputHandler}
          />
          <CustomInput
            typeProp="lastname"
            nameProp="lastName"
            placeholderProp={profileData?.lastName}
            valueProp={updatedData?.lastName}
            isDisabled={false}
            handlerProp={inputHandler}
          />
          <CustomInput
            typeProp="email"
            nameProp="email"
            placeholderProp={profileData?.email}
            valueProp={updatedData?.email || profileData?.email}
            isDisabled={false}
            handlerProp={inputHandler}
            onBlurHandler={() => {
              const errorMessage = inputValidator(updatedData.email, "email", "email");
              setEmailError(errorMessage);
            }}
            errorMessage={emailError}
          />
          <CustomInput
            typeProp="text"
            nameProp="phone"
            placeholderProp={profileData?.phone || ""}
            valueProp={updatedData?.phone || profileData?.phone || ""}
            isDisabled={false}
            handlerProp={inputHandler}
            errorMessage={
              formSubmitted && updatedData.phone
                ? inputValidator(updatedData.phone, "phone", "phone")
                : ""
            }
          />
          <CustomInput
            typeProp="text"
            nameProp="provincia"
            placeholderProp={profileData?.clients?.provincia || ""}
            valueProp={updatedData?.provincia || ""}
            isDisabled={true}
            handlerProp={inputHandler}
          />
          <CustomInput
            typeProp="text"
            nameProp="clientsId"
            placeholderProp={`Número de cliente: ${profileData?.clients?.id || ""}`}
            valueProp={updatedData?.clientsId || ""}
            isDisabled={true}
            handlerProp={inputHandler}
          />
          <CustomInput
            typeProp="password"
            nameProp="password"
            placeholderProp="Introduce tu nueva contraseña"
            valueProp={passwordData.password}
            isDisabled={isPasswordInputDisabled}
            handlerProp={inputHandler}
            errorText={passwordError}
          />
          <Button variant="secondary" onClick={togglePasswordInput}>
            {isPasswordInputDisabled ? "Cambiar Contraseña" : "Cancelar"}
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleUpdate} disabled={!hasChanges || emailError || passwordError}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default BootstrapModal;

