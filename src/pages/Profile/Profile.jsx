import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile, selectUserData } from "../../app/slices/userSlice";
import { getUserData } from "../../app/slices/userSlice";
import { Form, Card, Row, Col, Button } from "react-bootstrap";
import { bringProfile } from "../../service/apiCalls";
import { CustomInput } from "../../components/CusstomInput/CustomInput";
//import ButtonCita from "../../components/ButtonCita/ButtonCita";
import SocialIcons from "../../components/SocialIcons/SocialIcons";
import BootstrapModal from "../../components/BootstrapModal/BootstrapModal";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { inputValidator } from "../../utils/validator";

export const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    lastname: "",
    avatar: ""
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isPasswordInputDisabled, setIsPasswordInputDisabled] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const myPassport = useSelector(getUserData);
  const token = myPassport.token;
  const [userData, setUserData] = useState();
  const [userName, setUserName] = useState("");
  const [updateData, setUpdateData] = useState({});
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({
    newPassword: '',
  });
  const [role, setRole] = useState(myPassport.role?.name || '');

  const inputHandler = (e) => {
    const { name, value } = e.target;
    if (name === 'newPassword') {
      setPasswordData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      setPasswordErrors((prevState) => ({
        ...prevState,
        [name]: inputValidator(value, name),
      }));
    } else {
      setUpdateData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!token) {
          navigate("/"); // Redirigir a la página de inicio si no hay token
          return;
        }
        const myProfileData = await bringProfile(token);
        setUserData(myProfileData.data);
        setProfileData(myProfileData.data);
        console.log(myProfileData);
        setRole(myProfileData.data.role?.name); 
      } catch (error) {
        alert('Error al obtener el perfil');
      }
    };
    fetchProfile();
  }, [token]);

  const handleSaveChanges = async () => {
    try {
      const dataToUpdate = { ...updateData };
      if (!isPasswordInputDisabled) {
        dataToUpdate.newPassword = passwordData.newPassword;
      }
      await dispatch(updateProfile({ updateData: dataToUpdate, token }));
      setUserData(updateData);
      setIsPasswordInputDisabled(true);
    } catch (error) {
      alert('Error al actualizar el usuario');
    }
  };

  const togglePasswordInput = () => {
    setIsPasswordInputDisabled(!isPasswordInputDisabled);
  };

  if (!token) {
    return null;
  }

  return (
    <>
      <div className="justify-content-center text-center profile-container">
        {/* <ButtonCita className="button-cita" text="<  Pedir Cita  >" /> */}
        <SocialIcons urls={["https://whatsapp.com/", "https://tiktok.com/", "https://instagram.com/"]} />
        <Form id="formProfile">
        <div className="avatar-container">
            
          <div className="titleProfile"><img src={userData?.avatar} alt="Avatar" className="avatar-img"/> {userData?.firstName}, aquí está tu perfil</div>
          </div>
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Nombre:</Form.Label>
                <CustomInput
                  typeProp="name"
                  nameProp="firstName"
                  placeholderProp={userData?.firstName}
                  valueProp={userData?.firstName}
                  isDisabled={true}
                  disableValidation={true}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formLastname">
                <Form.Label>Apellidos:</Form.Label>
                <CustomInput
                  typeProp="lastname"
                  nameProp="lastName"
                  placeholderProp={userData?.lastName}
                  valueProp={userData?.lastName}
                  isDisabled={true}
                  disableValidation={false}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email:</Form.Label>
                <CustomInput
                  typeProp="email"
                  nameProp="email"
                  placeholderProp={userData?.email}
                  valueProp={userData?.email}
                  isDisabled={true}
                  handlerProp={inputHandler}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formPhone">
                <Form.Label>Teléfono:</Form.Label>
                <CustomInput
                  typeProp="text"
                  nameProp="phone"
                  placeholderProp={userData?.phone || ""}
                  valueProp={userData?.phone || ""}
                  isDisabled={true}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formProvincia">
                <Form.Label>Provincia:</Form.Label>
                <CustomInput
                  typeProp="text"
                  nameProp="provincia"
                  placeholderProp={userData?.province || ""}
                  valueProp={userData?.province || ""}
                  isDisabled={true}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formClientsId">
                <Form.Label>Num. cliente:</Form.Label>
                <CustomInput
                  typeProp="text"
                  nameProp="clientsId"
                  placeholderProp={`Número de cliente: ${userData?.id || ""}`}
                  valueProp={userData?.id || ""}
                  isDisabled={true}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
        <BootstrapModal
          profileData={userData}
          token={token}
          inputHandler={inputHandler}
          handleSaveChanges={handleSaveChanges}
          setUserData={setUserData}
          updateData={updateData}
          isPasswordInputDisabled={isPasswordInputDisabled}
          passwordErrors={passwordErrors}
          togglePasswordInput={togglePasswordInput}
          passwordData={passwordData}
        />
        {role !== 'admin' && (
          <Button variant="danger" onClick={() => navigate("/appointments")}>Citas</Button>
        )}
      </div>
    </>
  );
};

