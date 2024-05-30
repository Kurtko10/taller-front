
export const inputValidator = (inputValue, field, inputName) => {
  if (inputValue === "") {
    return "campo obligatorio";
  }
  if (
    (field === "name" || field === "lastName" || field === "provincia") &&
    typeof inputValue === "string"
  ) {
    return ""; 
  }
  if (field === "phone" && typeof inputValue === "string" && inputValue.length === 8) {
    return "introduce un teléfono válido";
  }
  if (inputName === "password" && (inputValue.length < 6 || inputValue.length > 12)) {
    return "la contraseña debe tener de 6 a 12 caracteres";
  }
  if (inputName === "email" && (!inputValue.includes("@") || !inputValue.includes("."))) {
    return "introduce un email válido";
  }
  return ""; 
};
