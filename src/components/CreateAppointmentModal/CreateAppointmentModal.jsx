// components/CreateAppointmentModal/CreateAppointmentModal.jsx
import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { CustomInput } from '../CusstomInput/CustomInput';

const CreateAppointmentModal = ({
  show,
  onHide,
  formData,
  handleInputChange,
  handleServiceChange,
  handleCarChange,
  handleWorkerChange,
  handleCreateAppointment,
  cars,
  filteredWorkers,
  clientId
}) => (
  <Modal show={show} onHide={onHide}>
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
);

export default CreateAppointmentModal;
