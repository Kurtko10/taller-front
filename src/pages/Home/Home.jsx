import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SocialIcons from "../../components/SocialIcons/SocialIcons";
import ButtonCita from "../../components/ButtonCita/ButtonCita";
import OfferBanner from "../../components/OfferBanner/OfferBanner";
import ReviewCard from "../../components/ReviewCard/ReviewCard";
import { Container, Row, Col } from 'react-bootstrap';
import imgBox1 from "../../img/taller1.jpg";
import imgBox2 from "../../img/taller2.jpg";
import imgBox3 from "../../img/taller3.jpeg";
import serviceImg1 from "../../img/cajacambio.jpeg";
import serviceImg2 from "../../img/motores.jpeg";
import serviceImg3 from "../../img/diagnosis.jpeg";
import ocasion1 from "../../img/ocasion1.jpeg";
import ocasion2 from "../../img/ventaCoches.jpeg";
import ocasion3 from "../../img/ocasion3.jpeg";
import "./Home.css";

export const Home = () => {
  const navigate = useNavigate();
  const [imageIndex, setImageIndex] = useState(0);
  const [ocasionImagesIndex, setOcasionImagesIndex] = useState(0);
  const images = [imgBox1, imgBox2, imgBox3];
  const ocasionImages = [ocasion1, ocasion2, ocasion3];
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

  useEffect(() => {
    const interval = setInterval(() => {
      setOcasionImagesIndex(prevIndex => (prevIndex + 1) % ocasionImages.length);
    }, timeInterval);

    return () => clearInterval(interval);
  }, [ocasionImages.length, timeInterval]);


  return (
    <div className="home-page">
      {/* <OfferBanner /> */}
      <SocialIcons urls={["https://whatsapp.com/", "https://tiktok.com/", "https://instagram.com/"]} />
      <ButtonCita text="Crear Nueva Cita" className="button-cita" showModal={true} />
      <div id="home" className="section container-fluid d-flex justify-content-center align-items-center">
        <Container fluid>
          <Row className="mb-4">
            <Col sm={6} className="pr-2">
              <div className="box">
                <h3>Tu taller de confianza en Madrid</h3>
                <h6>¿Qué somos?</h6>
                <p>... lo que no somos es un taller multimarca convencional.</p>
                <p>
                La intervención en un vehículo es solo una parte del camino, su comienzo es una recepción activa en la que nuestro equipo se va a preocupar de ti y de tu vehículo. Y el final es una entrega en la que todos los detalles están muy cuidados para que quieras repetir y formes parte de la familia 
                </p>
                <p>
                  Realizamos todo tipo de reparaciones: Cajas de cambio automáticas, sistemas anticontaminación, sistemas eléctricos y electrónicos, car & audio, ITV, camperización y homologaciones. También somos expertos en la reparación de sistemas de aire acondicionado.
                </p>
                <p>Además, disponemos de una amplia gama de vehículos de km-0</p>
                <p>Servicio especializado con el mejor precio. Revisiones punto por punto para el mejor mantenimieto de tu vehículo. ¡Presupuesto sin compromiso!</p>
                <p>¡Pásate a conocernos!</p>
                <br />
                <h5><a href="https://maps.app.goo.gl/Pc3Sjmkdg99h48yY9" target="_blank" rel="noopener noreferrer">Nuestro taller está en Vallecas</a></h5>
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
     
      <div id="services" className="section container-fluid">
  <h1>Servicios</h1>
  <p>¿Estás a punto de irte de vacaciones y se te ha averiado el coche? ¿o, simplemente, te has olvidado de pasarle la revisión o de cargar el gas del aire acondicionado?</p>
  <p>En nuestras instalaciones podrás realizar cualquier mantenimiento, reparación o modificación de tu vehículo con los mejores profesionales del sector.</p>
  <h3>¡Pide cita sin compromiso!</h3>

  <div className="row mt-4">
    <div className="col-md-4 col-sm-12 mb-4">
      <div className="card h-100">
        <img className="card-img-top" src={serviceImg1} alt="Servicio 1" />
        <div className="card-body">
          <h5 className="card-title">REPARACIÓN CAJAS DE CAMBIO</h5>
          <p className="card-text">Mantenimiento, reparación y reconstrucción de cajas de cambio manuales y electrónicas. Contamos con personal cualificado para solucionar cualquier tipo de avería.</p>
        </div>
      </div>
    </div>
    <div className="col-md-4 col-sm-12 mb-4">
      <div className="card h-100">
        <img className="card-img-top" src={serviceImg2} alt="Servicio 2" />
        <div className="card-body">
          <h5 className="card-title">REPARACIÓN MOTORES</h5>
          <p className="card-text">Especialistas en reparación de motores. Trabajamos la mayoría de las marcas del mercado y somos la alternativa al servicio oficial.</p>
        </div>
      </div>
    </div>
    <div className="col-md-4 col-sm-12 mb-4">
      <div className="card h-100">
        <img className="card-img-top" src={serviceImg3} alt="Servicio 3" />
        <div className="card-body">
          <h5 className="card-title">DIAGNOSIS ELECTRÓNICA</h5>
          <p className="card-text">Nuestro personal cualificado ajustará y analizará los parámetros necesarios de tu vehículo para detectar cualquier tipo de avería.</p>
        </div>
      </div>
    </div>
  </div>
</div>


<div id="ocasion" className="section container-fluid d-flex justify-content-center align-items-center">
        <Container fluid>
          <Row className="mb-4">
            <Col sm={6} className="pr-2">
              <div className="box">
                <h3>Vehículos de ocasión</h3>
                <p>Disponemos de una gama de vehículos de ocasión.</p>
                <p>En nuestras instalaciones podrás encontrar el vehículo que se adapta a tus necesidades: turismo, motocicleta, furgoneta, camper, etc.</p>
                <p>Además importamos vehículos de Europa. ¡Si no lo tenemos, lo buscamos!</p>
                <p>Si quieres vender tu vehiculo, pagamos más que la competencia</p>
                <p>¡Síguenos en redes para estar al día!</p>
              </div>
            </Col>
            <Col sm={6} className="pl-2">
              <div className="box">
                {ocasionImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Imagen ${index + 1}`}
                    className={index === ocasionImagesIndex ? "show" : "hide"}
                  />
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <div id="contact" className="section container-fluid">
  <Row className="justify-content-center">
    <Col md={12} className="d-flex justify-content-center">
      <div className="card contact-card">
        <div className="card-body">
          <h5 className="card-title">Información de Contacto</h5>
          <p className="card-text"><strong>Teléfono:</strong> +34 123 456 789</p>
          <p className="card-text"><strong>Dirección:</strong> Calle Ejemplo, 123, Madrid</p>
          <p className="card-text"><strong>Email:</strong> contacto@ejemplo.com</p>
          <p className="card-text"><strong>Horario:</strong> Lunes a Viernes, 9:00 - 18:00</p>
        </div>
      </div>
    </Col>
    <Col md={12} className="d-flex justify-content-center">
      <div className="card map-card">
        <div className="card-body">
          <h5 className="card-title">Nuestra Ubicación</h5>
          <iframe
            title="Google Maps"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3169.3644284832046!2d-122.08424968469234!3d37.42206537982208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb5aa5ab9a2fd%3A0xe5c55e6bb56b0f9b!2sGoogleplex!5e0!3m2!1ses!2sus!4v1612833057645!5m2!1ses!2sus"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </Col>
  </Row>
</div>



<div id="reviews" className="section container-fluid">
        <h1>Reseñas</h1>
        <h3>Las opiniones de nuestros clientes</h3>
        <br />
        <Row className="justify-content-center">
          <Col md={4}>
            <ReviewCard 
              reviewer="John Doe" 
              rating={5} 
              review="Excelente servicio, muy profesional y amable." 
            />
          </Col>
          <Col md={4}>
            <ReviewCard 
              reviewer="Jane Smith" 
              rating={4} 
              review="Muy buen trabajo, y el mejor precio."
            />
          </Col>
          <Col md={4}>
            <ReviewCard 
              reviewer="Carlos Ruiz" 
              rating={5} 
              review="El mejor taller al que he ido, ¡muy recomendable!"
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Home;
