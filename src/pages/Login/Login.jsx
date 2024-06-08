
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../app/slices/userSlice";
import { decodeToken } from "react-jwt";
import { loginCall } from "../../service/apiCalls";
import { useNavigate } from "react-router-dom";
import { CustomInput } from "../../components/CusstomInput/CustomInput";
import { ButtonC } from "../../components/ButtonC/ButtonC";
//import Button from "../../components/ButtonCita/ButtonCita";
import SocialIcons from "../../components/SocialIcons/SocialIcons";
import gif from "../../img/giphy.gif"

import "./Login.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();  
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  const [isValidContent, setIsValidContent] = useState({
    email: "",
    password: ""
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false
  });

  const [msg, setMsg] = useState("");

  const inputHandler = (e) => {
    setCredentials((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const inputValidatorHandler = (e) => {
    const errorMessage = inputValidator(e.target.value, e.target.name);
    setIsValidContent((prevState) => ({
      ...prevState,
      [e.target.name]: errorMessage,
    }));
    setTouched((prevState) => ({
      ...prevState,
      [e.target.name]: true,
    }));
  };

  const handleLogin = async () => {
    try {
      const answer = await loginCall(credentials);
      if (answer.data.token) {
        const uDecodificado = decodeToken(answer.data.token);
        dispatch(login({ token: answer.data.token, decodificado: uDecodificado })); 
        setMsg(`${uDecodificado.userName}, bienvenid@ de nuevo.`);

        if (uDecodificado.userRole === "admin") {
          navigate("/admin"); 
        } else if(uDecodificado.userRole === "manager"){
          setTimeout(() => {
            navigate("/profile");
          }, 4000);
        }
        
        else {
          setTimeout(() => {
            navigate("/profile");
          }, 4000);
        }
      }
    } catch (error) {
      
      alert('Error de login');
    }
  };
  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-container loginElementsDesign d-flex justify-content-center align-items-center">
      <h3 className="titleLogin">Ingresa tus credenciales</h3>
      <SocialIcons urls={["https://whatsapp.com/", "https://tiktok.com/", "https://instagram.com/"]} />
      {/* <Button className="button-cita" text="<  Pedir Cita  >" /> */}
      {msg === "" ? (
        <>
          <CustomInput
            typeProp={"email"}
            nameProp={"email"}
            handlerProp={inputHandler}
            placeholderProp={"escribe tu e-mail"}
            onBlur={inputValidatorHandler}
            errorText={touched.email ? isValidContent.email : ""}
          />
          <CustomInput
            typeProp={"password"}
            nameProp={"password"}
            handlerProp={inputHandler}
            placeholderProp={"escribe el password"}
            onBlur={inputValidatorHandler}
            errorText={touched.password ? isValidContent.password : ""}
          />
          <ButtonC
            title={"Login!!"}
            className={"regularButtonClass"}
            onClick={handleLogin}
          />
           <div className="or-separator">o</div> 
          <ButtonC
            title={"Regístrate"}
            className={"smallButtonClass"}
            onClick={handleRegister}
          />
        </>
      ) : (
        <div className="msg-welcome">{msg} <br />
        <img src={gif} alt="GIF" className="gif-style" />
        </div>
        
      )}
    </div>
  );
};

export default Login;