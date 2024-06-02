// components/EditAppointmentModal/EditAppointmentModal.jsx
import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const EditAppointmentModal = ({
  show,
  onHide,
  selectedAppointment,
  editData,
  handleEdit,
  handleDelete,
  setEditData,
  formatDateTime
}) => (
  <Modal show={show} onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>Editar Cita - ID: {selectedAppointment?.id}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {selectedAppointment && (
        <Form>
          <Row>
            <Col>
              <Form.Group controlId="formEditClient">
                <Form.Label>Cliente:</Form.Label>
                <p>ID: {selectedAppointment.client.id}</p>
                <p>Nombre: {selectedAppointment.client.name}</p>
                <p>Teléfono: {selectedAppointment.client.phone}</p>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formEditCar">
                <Form.Label>Vehículo:</Form.Label>
                <p>Marca: {selectedAppointment.car.carBrand}</p>
                <p>Modelo: {selectedAppointment.car.model}</p>
                <p>Matrícula: {selectedAppointment.car.licensePlate}</p>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="formEditDatetime">
            <Form.Label>Fecha y Hora</Form.Label>
            <Form.Control
              type="datetime-local"
              name="datetime"
              value={editData.datetime}
              onChange={(e) => setEditData({ ...editData, datetime: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formEditObservations">
            <Form.Label>Observaciones</Form.Label>
            <Form.Control
              as="textarea"
              name="observations"
              value={editData.observations}
              onChange={(e) => setEditData({ ...editData, observations: e.target.value })}
              maxLength="255"
              rows={3}
            />
          </Form.Group>
          <Form.Group controlId="formEditStatus">
            <Form.Label>Estado</Form.Label>
            <Form.Select
              name="status"
              value={editData.status}
              onChange={(e) => setEditData({ ...editData, status: e.target.value })}
            >
              <option value="PENDING">Pendiente</option>
              <option value="IN_PROGRESS">En Progreso</option>
              <option value="COMPLETED">Completado</option>
            </Form.Select>
          </Form.Group>
          <Button variant="primary" onClick={() => handleEdit(selectedAppointment.id, editData)}>
            Guardar Cambios
          </Button>
          <Button variant="danger" onClick={() => handleDelete(selectedAppointment.id)}>
            Eliminar
          </Button>
        </Form>
      )}
    </Modal.Body>
    <Modal.Footer>
      {selectedAppointment && (
        <>
          <p>Trabajador: {selectedAppointment.worker.name} ({selectedAppointment.worker.phone})</p>
        </>
      )}
    </Modal.Footer>
  </Modal>
);

export default EditAppointmentModal;
