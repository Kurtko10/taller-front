import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Container, Row, Col, Carousel } from 'react-bootstrap';
import {
  getAppointmentsByClientId,
  getAppointmentsByWorkerId,
  createAppointment,
  bringProfile,
  getUserCars,
  getUsersByManagerRole,
  getAppointmentById,
  getAllUserProfiles 
} from "../../service/apiCalls"; 
import AppointmentCard from "../../components/AppointmentCard/AppointmentCard";
import { useSelector } from 'react-redux';
import { getUserData } from "../../app/slices/userSlice";
import ButtonCita from "../../components/ButtonCita/ButtonCita";
import SocialIcons from "../../components/SocialIcons/SocialIcons";
import SearchInput from '../../components/SearchInput/SearchInput';
import DataTable from '../../components/Table/Table';
import Pagination from '../../components/Pagination/Pagination';
import CreateAppointmentModal from "../../components/CreateAppointmentModal/CreateAppointmentModal";
import EditAppointmentModal from "../../components/EditAppointmentModa/EditAppointmentModal";
import { serviceWorkerMap, handleDelete, handleEdit, handleFilterChange, handleSearchChange, handleCriteriaChange, handlePageChange, handleInputChange } from "../../utils/utilsAppointments";
import NoAppointments from '../../img/noCitas.png'
import './Appointments.css';

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
  const [clients, setClients] = useState([]);
  const userReduxData = useSelector(getUserData);
  const token = userReduxData.token;
  const [clientId, setClientId] = useState(null);
  const [shouldOpenModal, setShouldOpenModal] = useState(false);
  const [role, setRole] = useState(userReduxData.role?.name || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('id');
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    datetime: "",
    status: "",
    observations: ""
  });
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const itemsPerPage = 8;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (token) {
      fetchClientData();
      fetchAllWorkers();
      if (role === 'manager') {
        fetchAllClients();  
      }
    }
  }, [token, role]);

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

  const fetchAllClients = async () => {
    try {
      const response = await getAllUserProfiles(token);
      setClients(response);
    } catch (error) {
      alert('Error al obtener los clientes');
    }
  };

  const getAppointments = async () => {
    if (role === 'manager') {
      try {
        const appointmentsData = await getAppointmentsByWorkerId(token);
        setAppointments(appointmentsData || []);
      } catch (error) {
        alert('Hubo un error al obtener las citas');
      }
    } else {
      try {
        const appointmentsData = await getAppointmentsByClientId(token);
        setAppointments(appointmentsData || []);
        console.log(appointmentsData);
      } catch (error) {
        alert('Hubo un error al obtener las citas');
      }
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
          return appointment.client?.name?.toLowerCase().includes(searchQuery.toLowerCase());
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
      setFilteredWorkers([]);
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

  const handleRowClick = async (appointment) => {
    try {
      const fullAppointment = await getAppointmentById(appointment.id, token);
      setSelectedAppointment(fullAppointment);
      console.log("Un clic en la fila:", fullAppointment);
      
      // Ajuste de la fecha y hora para la zona horaria local
      const appointmentDate = new Date(fullAppointment.date);
      const offset = appointmentDate.getTimezoneOffset();
      appointmentDate.setMinutes(appointmentDate.getMinutes() - offset);
      const localDatetime = appointmentDate.toISOString().slice(0, 16);
  
      setEditData({
        datetime: localDatetime,
        status: fullAppointment.status,
        observations: fullAppointment.observations || ""
      });
      setShowEditModal(true);
    } catch (error) {
      console.error("Error al obtener los detalles de la cita:", error);
      alert('Hubo un error al obtener los detalles de la cita.');
    }
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

  const columns = [
    { field: 'id', headerName: 'ID Cita' },
    { field: 'clientId', headerName: 'ID Cliente' },
    { field: 'clientName', headerName: 'Cliente' },
    { field: 'serviceName', headerName: 'Servicio' },
    { field: 'datetime', headerName: 'Fecha y Hora' },
  ];

  const formattedAppointments = filteredAppointments.map(appointment => {
    if (role === "manager") {
      return {
        id: appointment.id,
        clientId: appointment.client.id,
        clientName: appointment.client.name,
        serviceName: appointment.service.name,
        datetime: formatDateTime(appointment.date),
        status: appointment.status,
        observations: appointment.observations,
        service: appointment.service,
        client: appointment.client,
        car: appointment.car
      }
    } else {
      return {
        id: appointment.id,
        clientId: appointment.client?.id || '',
        clientName: appointment.client?.name || '',
        serviceName: appointment.service?.name || '',
        datetime: formatDateTime(appointment.date),
      };
    }
  });

  return (
    <div className="appointments-container">
      <h1>Citas {role === 'manager' ? 'del artista' : 'del usuario'}</h1>
      <Form.Group controlId="formFilter">
        <Form.Label>Filtrar citas:</Form.Label>
        <Form.Control as="select" value={filter} onChange={(e) => handleFilterChange(e, setFilter)}>
          <option value="future">Futuras</option>
          <option value="past">Pasadas</option>
          <option value="all">Todas</option>
        </Form.Control>
      </Form.Group>
      {role === 'manager' && (
        <>
          <Form.Group controlId="formSearchCriteria">
            <Form.Label>Criterio de Búsqueda:</Form.Label>
            <Form.Control as="select" value={searchCriteria} onChange={(e) => handleCriteriaChange(e, setSearchCriteria)}>
              <option value="id">ID Cita</option>
              <option value="clientId">ID Cliente</option>
              <option value="clientName">Cliente</option>
              <option value="serviceName">Servicio</option>
            </Form.Control>
          </Form.Group>
          <SearchInput
            placeholder={`Buscar por ${searchCriteria}`}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e, setSearchQuery)}
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
                onRowClick={handleRowClick}
              />
            </>
          ) : (
            <Row className="justify-content-center no-citas">
              <Col md={6} lg={8}>
                <p>No hay citas {filter === 'PENDING' ? 'futuras' : filter === 'COMPLETED' ? 'pasadas' : ''}.</p>
              </Col>
            </Row>
          )}
        </Container>
      ) : (
        <>
          {isMobile ? (
            <Container className="appointments-list-container">
              <Carousel interval={null}>
                {filteredAppointments.map((appointment) => (
                  <Carousel.Item key={appointment.id}>
                    <AppointmentCard 
                      appointment={appointment} 
                      onDelete={(id) => handleDelete(id, token, getAppointments)} 
                      onEdit={(id, data) => handleEdit(id, data, token, getAppointments, () => setShowEditModal(false))} 
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            </Container>
          ) : (
            <Container className="appointments-list-container">
              <Row className="justify-content-center">
                {paginatedAppointments.length > 0 ? (
                  paginatedAppointments.map(appointment => (
                    <Col key={appointment.id} md={6} lg={4}>
                      <AppointmentCard 
                        appointment={appointment} 
                        onDelete={(id) => handleDelete(id, token, getAppointments)} 
                        onEdit={(id, data) => handleEdit(id, data, token, getAppointments, () => setShowEditModal(false))} 
                      />
                    </Col>
                  ))
                ) : (
                  <Col md={6} lg={8}>
                    <p>No hay citas {filter === 'PENDING' ? 'futuras' : filter === 'COMPLETED' ? 'pasadas' : ''}.</p>
                  </Col>
                )}
              </Row>
            </Container>
          )}
          {!isMobile && paginatedAppointments.length === 0 && (
            <Container className="no-appointments-container">
              <Row className="justify-content-center">
                <Col md={6} lg={4}>
                  <div className="no-appointments-image">
                    <img src={NoAppointments} alt="No hay citas" />
                    <p>Pide una cita</p>
                  </div>
                </Col>
              </Row>
            </Container>
          )}
        </>
      )}

      <CreateAppointmentModal
        show={showNewAppointmentModal}
        onHide={() => setShowNewAppointmentModal(false)}
        formData={formData}
        handleInputChange={(e) => handleInputChange(e, setFormData)}
        handleServiceChange={handleServiceChange}
        handleCarChange={handleCarChange}
        handleWorkerChange={handleWorkerChange}
        handleCreateAppointment={handleCreateAppointment}
        clients={clients}
        cars={cars}
        filteredWorkers={filteredWorkers}
        handleClientChange={(e) => {
          const clientId = e.target.value;
          setFormData(prev => ({ ...prev, client_id: clientId }));
          fetchUserCars(clientId, token);
        }}
        role={role}
      />

      <EditAppointmentModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        selectedAppointment={selectedAppointment}
        editData={editData}
        handleEdit={(id, data) => handleEdit(id, data, token, getAppointments, () => setShowEditModal(false))}
        handleDelete={(id) => handleDelete(id, token, getAppointments)}
        setEditData={setEditData}
        formatDateTime={formatDateTime}
      />

      {!isMobile && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => handlePageChange(page, setCurrentPage)}
        />
      )}
    </div>
  );
};

export default Appointments;
