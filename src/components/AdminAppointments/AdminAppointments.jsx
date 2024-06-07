import React, { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import {
  getAllAppointments,
  createAppointment,
} from '../../service/apiCalls';
import {
  fetchUsers,
  fetchAllWorkers,
  fetchCars,
  handleDelete,
  handleEdit,
  handleFilterChange,
  handleSearchChange,
  handleCriteriaChange,
  handlePageChange,
  handleInputChange,
  serviceWorkerMap
} from '../../utils/utilsAppointments';
import SearchInput from '../../components/SearchInput/SearchInput';
import DataTable from '../../components/Table/Table';
import { useSelector } from 'react-redux';
import { getUserData } from '../../app/slices/userSlice';
import CustomPagination from '../../components/Pagination/Pagination';
import './AdminAppointments.css';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('future');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('id');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    status: "",
    observations: "",
    service_id: "",
    user_id_worker: "",
    user_id_client: "",
    car_id: ""
  });
  const [users, setUsers] = useState([]);
  const [cars, setCars] = useState([]);
  const [allWorkers, setAllWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const userReduxData = useSelector(getUserData);
  const token = userReduxData.token;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await getAppointments();
        const usersData = await fetchUsers(token);
        setUsers(usersData);
        const workersData = await fetchAllWorkers();
        setAllWorkers(workersData);
        setFilteredWorkers(workersData);
      } catch (error) {
        alert('Error al obtener datos iniciales.');
      }
    };

    fetchInitialData();
  }, [token]);

  const getAppointments = async () => {
    try {
      const appointmentsData = await getAllAppointments(token);
      setAppointments(appointmentsData);
    } catch (error) {
      alert('Error al obtener las citas.');
    }
  };

  const handleOpenModal = async (appointment, isCreating = false) => {
    if (!isCreating) {
      const selectedAppointment = appointments.find(appt => appt.id === appointment.id);
      if (selectedAppointment) {
        const appointmentDate = new Date(selectedAppointment.date);
        const localDatetime = appointmentDate.toISOString().slice(0, 16);

        setSelectedAppointment({
          ...selectedAppointment,
          date: localDatetime,
          status: selectedAppointment.status,
          observations: selectedAppointment.observations,
          service_id: selectedAppointment.service.id,
          user_id_worker: selectedAppointment.worker.id,
          user_id_client: selectedAppointment.client.id,
          car_id: selectedAppointment.car ? selectedAppointment.car.id : ""
        });

        setFormData({
          date: localDatetime,
          status: selectedAppointment.status,
          observations: selectedAppointment.observations,
          service_id: selectedAppointment.service.id,
          user_id_worker: selectedAppointment.worker.id,
          user_id_client: selectedAppointment.client.id,
          car_id: selectedAppointment.car ? selectedAppointment.car.id : ""
        });

        const fetchedCars = await fetchCars(selectedAppointment.client.id, token);
        setCars(fetchedCars);
      }
    } else {
      setSelectedAppointment(null);
      resetFormData();
    }

    const usersData = await fetchUsers(token);
    setUsers(usersData);
    setFilteredWorkers(allWorkers);

    setShowModal(true);
    setShowNewAppointmentModal(isCreating);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
    resetFormData();
  };

  const resetFormData = () => {
    setFormData({
      date: "",
      status: "",
      observations: "",
      service_id: "",
      user_id_worker: "",
      user_id_client: "",
      car_id: ""
    });
  };

  const handleCreateAppointment = async () => {
    try {
      await createAppointment(formData, token);
      handleCloseModal();
      getAppointments();
    } catch (error) {
      alert("Error al crear la cita");
    }
  };

  const handleServiceChange = (e) => {
    const selectedService = e.target.value;
    setFormData(prev => ({ ...prev, service_id: selectedService }));

    const workerType = serviceWorkerMap[selectedService];
    const filtered = allWorkers.filter(worker => worker.workerType === workerType);
    setFilteredWorkers(filtered);
  };

  const handleUserChange = async (e) => {
    const userId = e.target.value;
    setFormData(prev => ({ ...prev, user_id_client: userId }));
    const fetchedCars = await fetchCars(userId, token);
    setCars(fetchedCars);
  };

  const columns = [
    { field: 'id', headerName: 'ID Cita' },
    { field: 'clientId', headerName: 'ID Cliente' },
    { field: 'clientName', headerName: 'Cliente' },
    { field: 'workerName', headerName: 'Trabajador' },
    { field: 'serviceName', headerName: 'Servicio' },
    { field: 'date', headerName: 'Fecha y Hora' },
    { field: 'carId', headerName: 'ID Coche' },
    { field: 'carLicensePlate', headerName: 'Matrícula' },
    { field: 'actions', headerName: 'Acciones' }
  ];

  const formattedAppointments = appointments.map(appointment => ({
    id: appointment.id,
    clientId: appointment.client.id,
    clientName: appointment.client.name,
    workerName: appointment.worker.name,
    serviceName: appointment.service.name,
    date: new Date(appointment.date).toLocaleString([], {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }),
    carId: appointment.car ? appointment.car.id : 'N/A',
    carLicensePlate: appointment.car ? appointment.car.licensePlate : 'N/A',
    details: 'Detalles'
  }));

  const filteredAppointments = formattedAppointments.filter(appointment => {
    const matchesFilter =
      (filter === 'future' && new Date(appointment.date) > new Date()) ||
      (filter === 'past' && new Date(appointment.date) <= new Date()) ||
      filter === 'all';

    const matchesSearchQuery = (() => {
      switch (searchCriteria) {
        case 'id':
          return appointment.id.toString().includes(searchQuery);
        case 'clientId':
          return appointment.clientId.toString().includes(searchQuery);
        case 'clientName':
          return appointment.clientName.toLowerCase().includes(searchQuery.toLowerCase());
        case 'workerName':
          return appointment.workerName.toLowerCase().includes(searchQuery.toLowerCase());
        case 'serviceName':
          return appointment.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
        case 'carId':
          return appointment.carId.toString().includes(searchQuery);
        case 'carLicensePlate':
          return appointment.carLicensePlate.toLowerCase().includes(searchQuery.toLowerCase());
        default:
          return false;
      }
    })();

    return matchesFilter && matchesSearchQuery;
  });

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const paginatedAppointments = filteredAppointments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="admin-appointments-container">
      <div className="admin-appointments-content">
        <h1>Administrar Citas</h1>
        <Form.Group controlId="formFilter">
          <Form.Label>Filtrar citas:</Form.Label>
          <Form.Control as="select" value={filter} onChange={(e) => handleFilterChange(e, setFilter)}>
            <option value="future">Futuras</option>
            <option value="past">Pasadas</option>
            <option value="all">Todas</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formSearchCriteria">
          <Form.Label>Criterio de Búsqueda:</Form.Label>
          <Form.Control as="select" value={searchCriteria} onChange={(e) => handleCriteriaChange(e, setSearchCriteria)}>
            <option value="id">ID Cita</option>
            <option value="clientId">ID Cliente</option>
            <option value="clientName">Cliente</option>
            <option value="workerName">Trabajador</option>
            <option value="serviceName">Servicio</option>
            <option value="carId">ID Coche</option>
            <option value="carLicensePlate">Matrícula</option>
          </Form.Control>
        </Form.Group>
        <SearchInput
          placeholder={`Buscar por ${searchCriteria}`}
          value={searchQuery}
          onChange={(e) => handleSearchChange(e, setSearchQuery)}
        />
        <DataTable
          rows={paginatedAppointments}
          columns={columns}
          handleUserClick={(row) => handleOpenModal(row, false)}
          renderActions={(row) => (
            <div className="action-buttons">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleOpenModal(row, false)}
              >
                Editar
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(row.id, token, getAppointments)}
              >
                Borrar
              </Button>
            </div>
          )}
        />
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => handlePageChange(page, setCurrentPage)}
        />
        <Button variant="success" className="mt-3" onClick={() => handleOpenModal(null, true)}>
          Crear Nueva Cita
        </Button>
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{showNewAppointmentModal ? "Crear Nueva Cita" : "Detalles de la Cita"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formClientId">
                <Form.Label>Cliente</Form.Label>
                <Form.Control
                  as="select"
                  name="user_id_client"
                  value={formData.user_id_client}
                  onChange={handleUserChange}
                  required
                >
                  <option value="">Seleccione un cliente</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.firstName} {user.lastName}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formCarId">
                <Form.Label>Coche</Form.Label>
                <Form.Control
                  as="select"
                  name="car_id"
                  value={formData.car_id}
                  onChange={(e) => handleInputChange(e, setFormData)}
                  required
                >
                  <option value="">Seleccione un coche</option>
                  {cars.map(car => (
                    <option key={car.id} value={car.id}>{car.licensePlate}-{car.carBrand}-{car.model}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formServiceId">
                <Form.Label>Servicio</Form.Label>
                <Form.Control
                  as="select"
                  name="service_id"
                  value={formData.service_id}
                  onChange={handleServiceChange}
                  required
                >
                  <option value="">Seleccione un servicio</option>
                  <option value="1">Mecánica General</option>
                  <option value="2">Mecánica Rápida</option>
                  <option value="3">Chapa y pintura</option>
                  <option value="4">Aire acondicionado</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formWorkerId">
                <Form.Label>Trabajador</Form.Label>
                <Form.Control
                  as="select"
                  name="user_id_worker"
                  value={formData.user_id_worker}
                  onChange={(e) => handleInputChange(e, setFormData)}
                  required
                >
                  <option value="">Seleccione un trabajador</option>
                  {filteredWorkers.map(worker => (
                    <option key={worker.id} value={worker.id}>{worker.firstName} {worker.lastName}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formDatetime">
                <Form.Label>Fecha y Hora</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange(e, setFormData)}
                  required
                  min={new Date().toISOString().slice(0, 16)}
                />
              </Form.Group>
              <Form.Group controlId="formStatus">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  type="text"
                  name="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange(e, setFormData)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formObservations">
                <Form.Label>Observaciones</Form.Label>
                <Form.Control
                  type="text"
                  name="observations"
                  value={formData.observations}
                  onChange={(e) => handleInputChange(e, setFormData)}
                />
              </Form.Group>
              {showNewAppointmentModal ? (
                <Button variant="primary" onClick={handleCreateAppointment}>
                  Crear Cita
                </Button>
              ) : (
                <Button variant="primary" onClick={() => handleEdit(selectedAppointment.id, formData, token, getAppointments, handleCloseModal)}>
                  Guardar Cambios
                </Button>
              )}
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default AdminAppointments;
