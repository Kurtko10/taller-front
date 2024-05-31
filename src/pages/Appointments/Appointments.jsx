import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Modal, Container, Row, Col } from 'react-bootstrap';
import { getAppointmentsByClientId, updateAppointmentById, createAppointment, bringProfile, getUserCars, getUsersByManagerRole } from "../../service/apiCalls"; 
import AppointmentCard from "../../components/AppointmentCard/AppointmentCard";
import { useSelector } from 'react-redux';
import { getUserData } from "../../app/slices/userSlice";
import ButtonCita from "../../components/ButtonCita/ButtonCita";
import SocialIcons from "../../components/SocialIcons/SocialIcons";
import { CustomInput } from "../../components/CusstomInput/CustomInput";
import SearchInput from '../../components/SearchInput/SearchInput';
import DataTable from '../../components/Table/Table';
import CustomPagination from '../../components/Pagination/Pagination';
import './Appointments.css';

const serviceWorkerMap = {
  "1": "mechanic",
  "2": "quick_service",
  "3": "painter",
  "4": "bodyworker"
};

const Appointments = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('future');
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [formData, setFormData] = useState({
    datetime: "",
    service_id: "",
    client_id: "",
    car_id: "",
    worker_id: "",
    observations: ""
  });
  const [cars, setCars] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const userReduxData = useSelector(getUserData);
  const token = userReduxData.token;
  const [clientId, setClientId] = useState(null);
  const [shouldOpenModal, setShouldOpenModal] = useState(false);
  const [role, setRole] = useState(userReduxData.role?.name || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('id');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    if (token) {
      fetchClientData();
      fetchAllWorkers();
    }
  }, [token]);

  useEffect(() => {
    if (role) {
      getAppointments();
    }
  }, [role]);

  useEffect(() => {
    if (location.state?.showModal) {
      setShouldOpenModal(true);
    }
  }, [location]);

  useEffect(() => {
    if (clientId && shouldOpenModal) {
      handleCreateAppointmentClick();
      setShouldOpenModal(false);
    }
  }, [clientId, shouldOpenModal]);

  const fetchClientData = async () => {
    try {
      const profileData = await bringProfile(token);
      const clientId = profileData.data?.id;
      const userRole = profileData.data?.role?.name;

      setRole(userRole);
      setClientId(clientId);
    } catch (error) {
      alert('Error al obtener los datos');
    }
  };

  const fetchAllWorkers = async () => {
    try {
      const response = await getUsersByManagerRole();
      setWorkers(response);
    } catch (error) {
      alert('Error al obtener los trabajadores');
    }
  };

  const getAppointments = async () => {
    try {
      const appointmentsData = await getAppointmentsByClientId(token);
      setAppointments(appointmentsData || []);
    } catch (error) {
      alert('Hubo un error al obtener las citas');
    }
  };

  const fetchUserCars = async (clientId, token) => {
    try {
      const userCars = await getUserCars(token, clientId);
      setCars(userCars.cars || []);
    } catch (error) {
      alert('Error al obtener los datos de los vehículos');
    }
  };

  const handleDelete = async (appointmentId) => {
    try {
      const confirmDelete = window.confirm("¿Seguro que deseas cancelar tu cita?");
      if (!confirmDelete) return;

      await deleteAppointmentById(appointmentId, token);
      getAppointments();
    } catch (error) {
      alert('Hubo un error al intentar eliminar la cita.');
    }
  };

  const handleEdit = async (appointmentId, editData) => {
    try {
      await updateAppointmentById(appointmentId, token, { date: editData.datetime });
      getAppointments();
    } catch (error) {
      alert('Hubo un error al intentar actualizar la cita.');
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCriteriaChange = (e) => {
    setSearchCriteria(e.target.value);
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).padStart(4, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesFilter =
      (filter === 'future' && new Date(appointment.date) > new Date()) ||
      (filter === 'past' && new Date(appointment.date) <= new Date()) ||
      filter === 'all';

    const matchesSearchQuery = (() => {
      switch (searchCriteria) {
        case 'id':
          return appointment.id.toString().includes(searchQuery);
        case 'clientId':
          return appointment.client?.id?.toString().includes(searchQuery);
        case 'clientName':
          return appointment.client?.lastName?.toLowerCase().includes(searchQuery.toLowerCase());
        case 'serviceName':
          return appointment.service?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        default:
          return false;
      }
    })();

    return matchesFilter && matchesSearchQuery;
  });

  const handleCreateAppointmentClick = async () => {
    if (clientId) {
      setFormData((prevState) => ({ ...prevState, client_id: clientId }));
      await fetchUserCars(clientId, token); 
      setShowNewAppointmentModal(true);
    } else {
      alert('ID cliente no encontrado');
    }
  };

  const handleServiceChange = (e) => {
    const selectedService = e.target.value;
    setFormData((prevState) => ({ ...prevState, service_id: selectedService }));

    const workerType = serviceWorkerMap[selectedService];
    if (Array.isArray(workers)) {
      const filtered = workers.filter(worker => worker.workerType === workerType);
      setFilteredWorkers(filtered);
    } else {
      setFilteredWorkers([]); // Asegúrate de manejar el caso donde workers no es una matriz
    }
  };

  const handleCarChange = (e) => {
    const selectedCar = e.target.value;
    setFormData((prevState) => ({ ...prevState, car_id: selectedCar }));
  };

  const handleWorkerChange = (e) => {
    const selectedWorker = e.target.value;
    setFormData((prevState) => ({ ...prevState, worker_id: selectedWorker }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleCreateAppointment = async () => {
    try {
      const { datetime, service_id, client_id, car_id, worker_id, observations } = formData;
      const formattedData = {
        date: datetime,
        service_id: parseInt(service_id),
        user_id_client: parseInt(client_id),
        user_id_worker: parseInt(worker_id),
        car_id: parseInt(car_id),
        observations
      };

      console.log("Datos del formulario enviados:", formattedData);

      await createAppointment(formattedData, token);
      setShowNewAppointmentModal(false);
      getAppointments();
    } catch (error) {
      alert('Hubo un error al intentar crear la cita.');
      console.error("Error al crear la cita:", error.response ? error.response.data : error.message);
    }
  };

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const paginatedAppointments = filteredAppointments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const columns = [
    { field: 'id', headerName: 'ID Cita' },
    { field: 'clientId', headerName: 'ID Cliente' },
    { field: 'clientName', headerName: 'Cliente' },
    { field: 'serviceName', headerName: 'Servicio' },
    { field: 'datetime', headerName: 'Fecha y Hora' },
  ];

  const formattedAppointments = filteredAppointments.map(appointment => {
    return {
      id: appointment.id,
      clientId: appointment.client?.id || '',
      clientName: appointment.client?.lastName || '',
      serviceName: appointment.service?.name || '',
      datetime: formatDateTime(appointment.date),
    };
  });

  return (
    <div className="appointments-container">
      <h1>Citas {role === 'manager' ? 'del artista' : 'del usuario'}</h1>
      <Form.Group controlId="formFilter">
        <Form.Label>Filtrar citas:</Form.Label>
        <Form.Control as="select" value={filter} onChange={handleFilterChange}>
          <option value="future">Futuras</option>
          <option value="past">Pasadas</option>
          <option value="all">Todas</option>
        </Form.Control>
      </Form.Group>
      {role === 'manager' && (
        <>
          <Form.Group controlId="formSearchCriteria">
            <Form.Label>Criterio de Búsqueda:</Form.Label>
            <Form.Control as="select" value={searchCriteria} onChange={handleCriteriaChange}>
              <option value="id">ID Cita</option>
              <option value="clientId">ID Cliente</option>
              <option value="clientName">Cliente</option>
              <option value="serviceName">Servicio</option>
            </Form.Control>
          </Form.Group>
          <SearchInput
            placeholder={`Buscar por ${searchCriteria}`}
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </>
      )}
      {role !== 'manager' && (
        <ButtonCita text="Crear Nueva Cita" onClick={handleCreateAppointmentClick} className="button-cita create-appointment-button" />
      )}
      <SocialIcons urls={["https://whatsapp.com/", "https://tiktok.com/", "https://instagram.com/"]} />
      {role === 'manager' ? (
        <Container className="appointments-list-container">
          {paginatedAppointments.length > 0 ? (
            <>
              <DataTable
                rows={formattedAppointments}
                columns={columns}
                handleUserClick={() => {}}
              />
            </>
          ) : (
            <Row className="justify-content-center">
              <Col md={6} lg={4}>
                <p>No hay citas {filter === 'future' ? 'futuras' : filter === 'past' ? 'pasadas' : ''}.</p>
              </Col>
            </Row>
          )}
        </Container>
      ) : (
        <Container className="appointments-list-container">
          <Row className="justify-content-center">
            {paginatedAppointments.length > 0 ? (
              paginatedAppointments.map(appointment => (
                <Col key={appointment.id} md={6} lg={4}>
                  <AppointmentCard 
                    appointment={appointment} 
                    onDelete={handleDelete} 
                    onEdit={handleEdit} 
                  />
                </Col>
              ))
            ) : (
              <Col md={6} lg={4}>
                <p>No hay citas {filter === 'future' ? 'futuras' : filter === 'past' ? 'pasadas' : ''}.</p>
              </Col>
            )}
          </Row>
        </Container>
      )}

      <Modal show={showNewAppointmentModal} onHide={() => setShowNewAppointmentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nueva Cita</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formClientId">
              <Form.Label>Num. cliente</Form.Label>
              <CustomInput
                typeProp="text"
                nameProp="client_id"
                valueProp={clientId}
                placeholderProp={clientId}
                isDisabled={true}
              />
            </Form.Group>
            <Form.Group controlId="formService">
              <Form.Label>Servicio</Form.Label>
              <Form.Select name="service_id" value={formData.service_id} onChange={handleServiceChange} required>
                <option value="">Selecciona un servicio</option>
                <option value="1">Mecánica General</option>
                <option value="2">Mecánica Rápida</option>
                <option value="3">Chapa y pintura</option>
                <option value="4">Aire acondicionado</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formCar">
              <Form.Label>Vehículo</Form.Label>
              <Form.Select name="car_id" value={formData.car_id} onChange={handleCarChange} required>
                <option value="">Selecciona un vehículo</option>
                {cars.map((car) => (
                  <option key={car.id} value={car.id}>{`${car.carBrand} ${car.model} (${car.licensePlate})`}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formWorker">
              <Form.Label>Trabajador</Form.Label>
              <Form.Select name="worker_id" value={formData.worker_id} onChange={handleWorkerChange} required>
                <option value="">Selecciona un trabajador</option>
                {filteredWorkers.map((worker) => (
                  <option key={worker.id} value={worker.id}>{`${worker.firstName} ${worker.lastName}`}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formObservations">
              <Form.Label>Observaciones</Form.Label>
              <Form.Control
                as="textarea"
                name="observations"
                value={formData.observations}
                onChange={handleInputChange}
                maxLength="255"
                rows={3}
              />
            </Form.Group>
            <Form.Group controlId="formDatetime">
              <Form.Label>Fecha y Hora</Form.Label>
              <Form.Control
                type="datetime-local"
                name="datetime"
                value={formData.datetime}
                onChange={handleInputChange}
                required
                min={new Date().toISOString().slice(0, 16)}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleCreateAppointment}>
              Crear Cita
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <CustomPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Appointments;

