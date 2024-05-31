import React, { useState, useEffect } from "react";
import { getUsersByManagerRole } from "../../service/apiCalls"; // Supongamos que esta llamada existe
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Card, Col, Row, Form } from "react-bootstrap";
import { WorkerDetailsModal } from "../../components/WorkerDetailsModal/WorkerDetailsModal"; // Supongamos que este componente existe
import { UserCard } from "../../components/UsersCard/UsersCard";
import "./Workers.css";

export const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const userData = useSelector(state => state.user);
  const role = userData.decodificado.userRole;
  const navigate = useNavigate();

  useEffect(() => {
    getUsersByManagerRole()
      .then((response) => {
        const fetchedWorkers = response;
        setWorkers(fetchedWorkers);
        console.log(fetchedWorkers);
        setFilteredWorkers(fetchedWorkers); // Inicialmente, mostrar todos los trabajadores
      })
      .catch((error) => {
        alert('Hubo un error al recuperar los trabajadores');
      });
  }, []);

  const handleWorkerClick = async (workerId) => {
    const selected = workers.find(worker => worker.id === workerId);
    if (selected) {
      setSelectedWorker(selected);
      setShowModal(true);
    } else {
      alert('Trabajador no encontrado.');
    }
  };

  const handleCloseModal = () => {
    setSelectedWorker(null);
    setShowModal(false);
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    if (e.target.value === "") {
      setFilteredWorkers(workers); // Mostrar todos los trabajadores si no se selecciona un tipo
    } else {
      const filtered = workers.filter(worker => worker.workerType === e.target.value);
      setFilteredWorkers(filtered);
    }
  };

  return (
    <div className="worker-list">
      <h1 className="titleWorker">Lista de Trabajadores</h1>
      <Form.Select id="selectWorker" onChange={handleTypeChange} value={selectedType}>
        <option value="">Todos los tipos</option>
        <option value="mechanic">Mecánico</option>
        <option value="quick_service">Servicio Rápido</option>
        <option value="painter">Pintor</option>
        <option value="bodyworker">Chapista</option>
      </Form.Select>
      <Row xs={1} md={3} className="g-3">
        {filteredWorkers.map((worker) => (
          <Col key={worker.id}>
            <Card className="worker-card">
              <UserCard
                user={{
                  firstName: worker.firstName,
                  lastName: worker.lastName,
                  email: worker.email,
                  phone: worker.phone,
                  role: worker.role,
                  workerType: worker.workerType,
                  avatar: worker.avatar,
                }}
                handleClick={() => handleWorkerClick(worker.id)}
              />
            </Card>
          </Col>
        ))}
      </Row>
      {selectedWorker && (
        <WorkerDetailsModal
          show={showModal}
          workerData={selectedWorker}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};
