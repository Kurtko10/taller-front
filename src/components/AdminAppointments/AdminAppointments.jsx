import React, { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { getAllAppointments, deleteAppointmentById, updateAppointmentById, createAppointment } from '../../service/apiCalls';
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
    user_id_client: "",
    user_id_worker: "",
    car_id: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const userReduxData = useSelector(getUserData);
  const token = userReduxData.token;

  useEffect(() => {
    getAppointments();
  }, []);

  const getAppointments = async () => {
    try {
      const appointmentsData = await getAllAppointments(token);
      setAppointments(appointmentsData);
    } catch (error) {
      alert('Error al obtener las citas.');
    }
  };

  const handleDelete = async (appointmentId) => {
    try {
      const confirmDelete = window.confirm('¿Seguro que deseas cancelar esta cita?');
      if (!confirmDelete) return;

      await deleteAppointmentById(appointmentId, token);
      getAppointments();
    } catch (error) {
      alert('Hubo un error al intentar eliminar la cita.');
    }
  };

  const handleEdit = async (appointmentId, editData) => {
    try {
      const dateUTC = new Date(editData.date).toISOString();
      await updateAppointmentById(appointmentId, token, {
        date: dateUTC,
        status: editData.status,
        observations: editData.observations,
        service_id: editData.service_id,
        user_id_client: editData.user_id_client,
        user_id_worker: editData.user_id_worker,
        car_id: editData.car_id
      });
      getAppointments();
      setShowModal(false);
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

  const handleOpenModal = (appointment, isCreating = false) => {
    if (!isCreating) {
      const selectedAppointment = appointments.find(appt => appt.id === appointment.id);
      if (selectedAppointment) {
        const appointmentDate = new Date(selectedAppointment.date);
        const localDatetime = new Date(appointmentDate.getTime() - appointmentDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

        setSelectedAppointment({
          ...selectedAppointment,
          date: localDatetime,
          status: selectedAppointment.status,
          observations: selectedAppointment.observations,
          service_id: selectedAppointment.service.id,
          user_id_client: selectedAppointment.client.id,
          user_id_worker: selectedAppointment.worker.id,
          car_id: selectedAppointment.car.id
        });

        setFormData({
          date: localDatetime,
          status: selectedAppointment.status,
          observations: selectedAppointment.observations,
          service_id: selectedAppointment.service.id,
          user_id_client: selectedAppointment.client.id,
          user_id_worker: selectedAppointment.worker.id,
          car_id: selectedAppointment.car.id
        });
      }
    } else {
      setSelectedAppointment({
        date: "",
        status: "",
        observations: "",
        service_id: "",
        user_id_client: "",
        user_id_worker: "",
        car_id: ""
      });
      setFormData({
        date: "",
        status: "",
        observations: "",
        service_id: "",
        user_id_client: "",
        user_id_worker: "",
        car_id: ""
      });
    }
    setShowModal(true);
    setShowNewAppointmentModal(isCreating);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'user_id_client' || name === 'user_id_worker' || name === 'car_id' ? Number(value) : value }));
  };

  const handleCreateAppointment = async () => {
    try {
      await createAppointment(formData, token);
      setShowNewAppointmentModal(false);
      getAppointments();
    } catch (error) {
      alert("Error al crear la cita");
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID Cita' },
    { field: 'clientId', headerName: 'ID Cliente' },
    { field: 'clientName', headerName: 'Cliente' },
    { field: 'workerName', headerName: 'Trabajador' },
    { field: 'serviceName', headerName: 'Servicio' },
    { field: 'date', headerName: 'Fecha y Hora' },
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
        default:
          return false;
      }
    })();

    return matchesFilter && matchesSearchQuery;
  });

  // Paginación
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const paginatedAppointments = filteredAppointments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="admin-appointments-container">
      <div className="admin-appointments-content">
        <h1>Administrar Citas</h1>
        <Form.Group controlId="formFilter">
          <Form.Label>Filtrar citas:</Form.Label>
          <Form.Control as="select" value={filter} onChange={handleFilterChange}>
            <option value="future">Futuras</option>
            <option value="past">Pasadas</option>
            <option value="all">Todas</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formSearchCriteria">
          <Form.Label>Criterio de Búsqueda:</Form.Label>
          <Form.Control as="select" value={searchCriteria} onChange={handleCriteriaChange}>
            <option value="id">ID Cita</option>
            <option value="clientId">ID Cliente</option>
            <option value="clientName">Cliente</option>
            <option value="workerName">Trabajador</option>
            <option value="serviceName">Servicio</option>
          </Form.Control>
        </Form.Group>
        <SearchInput
          placeholder={`Buscar por ${searchCriteria}`}
          value={searchQuery}
          onChange={handleSearchChange}
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
                onClick={() => handleDelete(row.id)}
              >
                Borrar
              </Button>
            </div>
          )}
        />
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        <Button variant="success" className="mt-3" onClick={() => handleOpenModal(null, true)}>
          Crear Nueva Cita
        </Button>
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{showNewAppointmentModal ? "Crear Nueva Cita" : "Detalles de la Cita"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedAppointment && (
              <Form>
                {showNewAppointmentModal && (
                  <Form.Group controlId="formClientId">
                    <Form.Label>ID Cliente</Form.Label>
                    <Form.Control
                      type="text"
                      name="user_id_client"
                      value={formData.user_id_client}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                )}
                <Form.Group controlId="formDatetime">
                  <Form.Label>Fecha y Hora</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formObservations">
                  <Form.Label>Observaciones</Form.Label>
                  <Form.Control
                    type="text"
                    name="observations"
                    value={formData.observations}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formServiceId">
                  <Form.Label>ID Servicio</Form.Label>
                  <Form.Control
                    type="text"
                    name="service_id"
                    value={formData.service_id}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formWorkerId">
                  <Form.Label>ID Trabajador</Form.Label>
                  <Form.Control
                    type="text"
                    name="user_id_worker"
                    value={formData.user_id_worker}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formCarId">
                  <Form.Label>ID Coche</Form.Label>
                  <Form.Control
                    type="text"
                    name="car_id"
                    value={formData.car_id}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                {showNewAppointmentModal ? (
                  <Button variant="primary" onClick={handleCreateAppointment}>
                    Crear Cita
                  </Button>
                ) : (
                  <Button variant="primary" onClick={() => handleEdit(selectedAppointment.id, formData)}>
                    Guardar Cambios
                  </Button>
                )}
              </Form>
            )}
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default AdminAppointments;
