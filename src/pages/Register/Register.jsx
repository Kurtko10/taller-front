import { useNavigate } from "react-router-dom";
import { CustomInput } from "../../components/CusstomInput/CustomInput";
import { ButtonC } from "../../components/ButtonC/ButtonC";
import { useEffect, useState } from "react";
import { registerNewUserCall } from "../../service/apiCalls";
import { inputValidator } from "../../utils/validator";
import SocialIcons from "../../components/SocialIcons/SocialIcons";
import "./Register.css";

export const Register = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    province: "",
    isActive: true,
  });

  const [isValidContent, setIsValidContent] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    province: "",
    email: "",
    password: "",
    confirmPassword: "" 
  });

  const [msg, setMsg] = useState("");

  const inputHandler = (e) => {
    setCredentials((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

    if (e.target.name === "confirmPassword") {
      validatePasswordConfirmation(e.target.value);
    } else {
      setIsValidContent((prevState) => ({
        ...prevState,
        confirmPassword: "", 
      }));
    }
  };

  const validatePasswordConfirmation = (confirmPassword) => {
    if (confirmPassword !== credentials.password) {
      setIsValidContent((prevState) => ({
        ...prevState,
        confirmPassword: "Las contraseñas no coinciden",
      }));
    } else {
      setIsValidContent((prevState) => ({
        ...prevState,
        confirmPassword: "", 
      }));
    }
  };

  const inputValidatorHandler = (e) => {
    const { name, value } = e.target;
    const validationError = inputValidator(value, name);
    setIsValidContent((prevState) => ({
      ...prevState,
      [name]: validationError,
    }));
  };

  useEffect(() => {
    if (msg !== "") {
      const timeout = setTimeout(() => {
        setCredentials({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          province: "",
          isActive: true,
        });
        setIsValidContent({
          firstName: "",
          lastName: "",
          phone: "",
          province: "",
          email: "",
          password: "",
          confirmPassword: ""
        });
        setMsg("");
      }, 4000);

      return () => clearTimeout(timeout);
    }
  }, [msg]);

  const registerMe = async () => {
    const { firstName, lastName, phone, province, email, password } = credentials;
  
    const isValid = {
      firstName: inputValidator(firstName, "name", "firstName"), 
      lastName: inputValidator(lastName, "name", "lastName"), 
      phone: inputValidator(phone, "phone", "phone"), 
      province: inputValidator(province, "province", "province"), 
      email: inputValidator(email, "email", "email"), 
      password: inputValidator(password, "password", "password"),
      confirmPassword: credentials.password === credentials.confirmPassword ? "" : "Las contraseñas no coinciden"
    };
  
    setIsValidContent(isValid);
  
    const allValid = Object.values(isValid).every((val) => val === "");
  
    if (allValid) {
      try {
        console.log('Datos enviados:', credentials); // Verificar los datos enviados
        const answer = await registerNewUserCall(credentials);
        if (answer.success) {
          setMsg("¡Gracias por registrarte!");
          setTimeout(() => {
            setMsg("");
            navigate("/login");
          }, 3000);
        } else {
          setMsg(answer.message || "Error al registrar el usuario");
        }
      } catch (error) {
        console.error("Error en el registro:", error);
        setMsg("Error al registrar el usuario");
      }
    } else {
      alert('Algún campo no está bien introducido');
    }
  };
  
  return (
    <div className="register-container registerElementsDesign d-flex justify-content-center align-items-center">
      <h3 className="titleRegister">Ingresa tus datos</h3>
      <SocialIcons urls={["https://whatsapp.com/", "https://tiktok.com/", "https://instagram.com/"]} />
      {msg === "" ? (
        <>
          <CustomInput
            typeProp="text"
            nameProp="firstName"
            handlerProp={inputHandler}
            placeholderProp="Escribe tu nombre"
            onBlur={inputValidatorHandler}
            errorText={isValidContent.firstName}
          />
          <CustomInput
            typeProp="text"
            nameProp="lastName"
            handlerProp={inputHandler}
            placeholderProp="Escribe tu apellido"
            onBlur={inputValidatorHandler}
            errorText={isValidContent.lastName}
          />
          <CustomInput
            typeProp="text"
            nameProp="phone"
            handlerProp={inputHandler}
            placeholderProp="Escribe tu teléfono"
            onBlur={inputValidatorHandler}
            errorText={isValidContent.phone}
          />
          <CustomInput
            typeProp="text"
            nameProp="province"
            handlerProp={inputHandler}
            placeholderProp="Escribe tu provincia"
            onBlur={inputValidatorHandler}
            errorText={isValidContent.province}
          />
          <CustomInput
            typeProp="email"
            nameProp="email"
            handlerProp={inputHandler}
            placeholderProp="Escribe tu correo electrónico"
            onBlur={inputValidatorHandler}
            errorText={isValidContent.email}
          />
          <CustomInput
            typeProp="password"
            nameProp="password"
            handlerProp={inputHandler}
            placeholderProp="Escribe la contraseña"
            onBlur={inputValidatorHandler}
            errorText={isValidContent.password}
          />
          <CustomInput
            typeProp="password"
            nameProp="confirmPassword"
            handlerProp={inputHandler}
            placeholderProp="Confirma la contraseña"
            onBlur={inputValidatorHandler}
            errorText={isValidContent.confirmPassword}
          />

          <ButtonC
            title="Registrarse"
            className="regularButtonClass"
            onClick={registerMe}
          />
        </>
      ) : (
        <div className="msg-register">{msg}</div>
      )}
    </div>
  );
};
