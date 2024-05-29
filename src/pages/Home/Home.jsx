import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SocialIcons from "../../components/SocialIcons/SocialIcons";
// import ButtonCita from "../../components/ButtonCita/ButtonCita";
// import { ButtonC } from "../../components/ButtonC/ButtonC";
import { Container, Row, Col } from 'react-bootstrap';
import imgBox1 from "../../img/taller1.jpg";
import imgBox2 from "../../img/taller2.jpg";
import imgBox3 from "../../img/taller3.jpeg";
import "./Home.css";

export const Home = () => {
  const navigate = useNavigate();
  const [imageIndex, setImageIndex] = useState(0);
  // const [artistImagesIndex, setArtistImagesIndex] = useState(0);
  const images = [imgBox1, imgBox2, imgBox3];
  // const artistImages = [artistImg1, artistImg2, artistImg3];
  const timeInterval = 5000;

  useEffect(() => {
    const sections = document.querySelectorAll('.section');
    const handleNavClick = (event) => {
      event.preventDefault();
      const targetId = event.target.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    };

    sections.forEach(section => {
      section.addEventListener('click', handleNavClick);
    });

    return () => {
      sections.forEach(section => {
        section.removeEventListener('click', handleNavClick);
      });
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex(prevIndex => (prevIndex + 1) % images.length);
    }, timeInterval);

    return () => clearInterval(interval);
  }, [images.length, timeInterval]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setArtistImagesIndex(prevIndex => (prevIndex + 1) % artistImages.length);
  //   }, timeInterval);

  //   return () => clearInterval(interval);
  // }, [artistImages.length, timeInterval]);

  const handleArtistsClick = () => {
    navigate('/artists');
  };

  return (
    <div className="home-page">
      <SocialIcons urls={["https://whatsapp.com/", "https://tiktok.com/", "https://instagram.com/"]} />
      {/* <ButtonCita text="Crear Nueva Cita" className="button-cita" showModal={true} /> */}
      <div id="home" className="section container-fluid d-flex justify-content-center align-items-center">
        <Container fluid>
          <Row className="mb-4">
            <Col sm={6} className="pr-2">
              <div className="box">
                <h3>Tu taller de confianza en Madrid</h3>
                <p>
                  Somos expertos en mecánica general, servicio rápido y arreglos de chapa y pintura. Disponemos de la más actualizada maquinaria para la diagnosis de averías de tu vehículo ya sea diésel, gasolina, híbrido o eléctrico.
                </p>
                <p>
                  Realizamos todo tipo de reparaciones: Cajas de cambio automáticas, sistemas anticontaminación, sistemas eléctricos y electrónicos, car & audio, ITV, camperización y homologaciones. También somos expertos en la reparación de sistemas de aire acondicionado.
                </p>
                <p>Además, disponemos de una amplia gama de vehículos de km-0</p>
                <p>¡Pásate a conocernos! Te asesoramos sin ningún compromiso.</p>
                <br />
                <h5><a href="https://maps.app.goo.gl/Pc3Sjmkdg99h48yY9" target="_blank" rel="noopener noreferrer">Nuestros estudios de tatuaje están en Vallecas</a></h5>
              </div>
            </Col>
            <Col sm={6} className="pl-2">
              <div className="box">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Imagen ${index + 1}`}
                    className={index === imageIndex ? "show" : "hide"}
                  />
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <div id="instalaciones" className="section container-fluid">
        <h1>El Estudio</h1>
        <p>Contenido del estudio</p>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloribus unde dolore porro repellat maiores accusantium assumenda expedita? Corporis tempore commodi maiores, perferendis placeat soluta provident corrupti deserunt saepe vero repellendus?</p>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed unde perspiciatis id consectetur similique placeat eaque perferendis odio debitis repellat, sapiente labore culpa ducimus aliquid ea velit dolorum maiores ratione.</p>
        <h6>Otra parte</h6>
        <br />
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloribus unde dolore porro repellat maiores accusantium assumenda expedita? Corporis tempore commodi mayores, perferendis placeat soluta provident corrupti deserunt saepe vero repellendus?</p>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed unde perspiciatis id consectetur similique placeat eaque perferendis odio debitis repellat, sapiente labore culpa ducimus aliquid ea velit dolorum maiores ratione.</p>
        <h6>Otra parte</h6>
        <br />
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloribus unde dolore porro repellat maiores accusantium assumenda expedita? Corporis tempore commodi mayores, perferendis placeat soluta provident corrupti deserunt saepe vero repellendus?</p>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed unde perspiciatis id consectetur similique placeat eaque perferendis odio debitis repellat, sapiente labore culpa ducimus aliquid ea velit dolorum maiores ratione.</p>
      </div>

      <div id="services" className="section container-fluid d-flex justify-content-center align-items-center">
        <h1>Servicios</h1>
        <p>Contenido de los servicios</p>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloribus unde dolore porro repellat mayores accusantium assumenda expedita? Corporis tempore commodi mayores, perferendis placeat soluta provident corrupti deserunt saepe vero repellendus?</p>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed unde perspiciatis id consectetur similique placeat eaque perferendis odio debitis repellat, sapiente labore culpa ducimus aliquid ea velit dolorum maiores ratione.</p>
        <h6>Otra parte</h6>
        <br />
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloribus unde dolore porro repellat mayores accusantium assumenda expedita? Corporis tempore commodi mayores, perferendis placeat soluta provident corrupti deserunt saepe vero repellendus?</p>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed unde perspiciatis id consectetur similique placeat eaque perferendis odio debitis repellat, sapiente labore culpa ducimus aliquid ea velit dolorum mayores ratione.</p>
        <h6>Otra parte</h6>
        <br />
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloribus unde dolore porro repellat mayores accusantium assumenda expedita? Corporis tempore commodi mayores, perferendis placeat soluta provident corrupti deserunt saepe vero repellendus?</p>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed unde perspiciatis id consectetur similique placeat eaque perferendis odio debitis repellat, sapiente labore culpa ducimus aliquid ea velit dolorum maiores ratione.</p>
      </div>

      <div id="artists" className="section container-fluid d-flex justify-content-center align-items-center">
        <Container fluid>
          <Row className="mb-4">
            <Col sm={6} className="pr-2">
              <div className="box">
                <h3>Vehículos de ocasión</h3>
                <p>Disponemos de una gama de vehículos de ocasión.</p>
                <p>En nuestras instalaciones podrás encontrar el vehículo que se adapta a tus necesidades: turismo, motocicleta, furgoneta, camper, etc.</p>
                <p>Además importamos vehículos de Europa. ¡Si no lo tenemos, lo buscamos!</p>
                <br />
                <p>¡Síguenos en redes para estar al día de nuestros trabajos!</p>
              </div>
            </Col>
            <Col sm={6} className="pl-2">
              {/* <div className="box">
                {artistImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Imagen ${index + 1}`}
                    className={index === artistImagesIndex ? "show" : "hide"}
                  />
                ))}
              </div> */}
            </Col>
          </Row>
          {/* <ButtonC
            title={"ARTISTAS"}
            className={"regularButtonClass"}
            onClick={handleArtistsClick}
          /> */}
        </Container>
      </div>

      <div id="contact" className="section container-fluid">
        <h1>Contacto</h1>
        <p>Información de contacto</p>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloribus unde dolore porro repellat maiores accusantium assumenda expedita? Corporis tempore commodi mayores, perferendis placeat soluta provident corrupti deserunt saepe vero repellendus?</p>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed unde perspiciatis id consectetur similique placeat eaque perferendis odio debitis repellat, sapiente labore culpa ducimus aliquid ea velit dolorum maiores ratione.</p>
        <h6>Otra parte</h6>
        <br />
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloribus unde dolore porro repellat mayores accusantium assumenda expedita? Corporis tempore commodi mayores, perferendis placeat soluta provident corrupti deserunt saepe vero repellendus?</p>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed unde perspiciatis id consectetur similique placeat eaque perferendis odio debitis repellat, sapiente labore culpa ducimus aliquid ea velit dolorum mayores ratione.</p>
        <h6>Otra parte</h6>
        <br />
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloribus unde dolore porro repellat mayores accusantium assumenda expedita? Corporis tempore commodi mayores, perferendis placeat soluta provident corrupti deserunt saepe vero repellendus?</p>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed unde perspiciatis id consectetur similique placeat eaque perferendis odio debitis repellat, sapiente labore culpa ducimus aliquid ea velit dolorum maiores ratione.</p>
      </div>

      <div id="reviews" className="section container-fluid">
        <h1>Reseñas</h1>
        <p>Reseñas de clientes</p>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloribus unde dolore porro repellat maiores accusantium assumenda expedita? Corporis tempore commodi maiores, perferendis placeat soluta provident corrupti deserunt saepe vero repellendus?</p>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed unde perspiciatis id consectetur similique placeat eaque perferendis odio debitis repellat, sapiente labore culpa ducimus aliquid ea velit dolorum mayores ratione.</p>
        <h6>Otra parte</h6>
        <br />
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloribus unde dolore porro repellat maiores accusantium assumenda expedita? Corporis tempore commodi mayores, perferendis placeat soluta provident corrupti deserunt saepe vero repellendus?</p>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed unde perspiciatis id consectetur similique placeat eaque perferendis odio debitis repellat, sapiente labore culpa ducimus aliquid ea velit dolorum mayores ratione.</p>
      </div>
    </div>
  );
};

export default Home;
