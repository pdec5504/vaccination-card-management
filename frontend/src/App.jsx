import React, { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import UserPage from "./pages/UserPage";
import Modal from "./components/common/Modal";
import RegisterUserForm from "./components/RegisterUserForm";
import RegisterVaccinationForm from "./components/RegisterVaccinationForm";
import RegisterVaccineForm from "./components/RegisterVaccineForm";
import {
  fetchUsers,
  fetchVaccines,
  fetchUserCard,
  registerUser,
  registerVaccination,
  deleteUser,
  deleteVaccination,
  registerVaccine,
  fetchUserById,
} from "./services/api";
import "./App.css";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [allVaccines, setAllVaccines] = useState([]);
  const [userCard, setUserCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showRegisterUserModal, setShowRegisterUserModal] = useState(false);
  const [showRegisterVaccinationModal, setShowRegisterVaccinationModal] =
    useState(false);
  const [showRegisterVaccineModal, setShowRegisterVaccineModal] =
    useState(false);
  const [selectedVaccineInfo, setSelectedVaccineInfo] = useState(null);

  useEffect(() => {
    const loadVaccines = async () => {
      try {
        setLoading(true);
        const vaccines = await fetchVaccines();
        setAllVaccines(vaccines || []);
        setError(null);
      } catch (error) {
        console.error("Falha ao carregar vacinas:", error);
        setError(
          "Falha ao carregar lista de vacinas. Verifique se o backend está funcionando."
        );
      }
    };
    loadVaccines();
  }, []);

  useEffect(() => {
    const loadUserData = async () => {
      if (!selectedUserId) {
        setCurrentUser(null);
        setUserCard(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const cardData = await fetchUserCard(selectedUserId);
        if (cardData && cardData.user) {
          setCurrentUser(cardData.user);
          setUserCard(cardData);
        } else {
          const basicUser = await fetchUserById(selectedUserId);
          setCurrentUser(basicUser);
          setUserCard(null);
          if (basicUser) {
            console.warn(
              `Cartão de vacinação para usuário ${selectedUserId} não encontrado, mas usuário existe.`
            );
          } else {
            console.warn(`Usuário com ID ${selectedUserId} não encontrado.`);
            setSelectedUserId(null);
          }
        }
      } catch (error) {
        console.error(
          `Falha ao carregar dados para usuário ${selectedUserId}:`,
          error
        );
        setError(`Falha ao carregar dados do usuário: ${error.message}`);
        setCurrentUser(null);
        setUserCard(null);
        setSelectedUserId(null);
      } finally {
        setLoading(false);
      }
    };

    if (allVaccines.length > 0 || !loading) {
      loadUserData();
    }
  }, [selectedUserId, allVaccines]);

  const handleRegisterUser = async (userData) => {
    try {
      const newUser = await registerUser(userData);
      setShowRegisterUserModal(false);
      alert(`Usuário ${newUser.name} cadastrado com sucesso!`);
      setSelectedUserId(newUser.id);
    } catch (error) {
      alert(`Falha ao cadastrar usuário: ${error.message}`);
    }
  };

  const handleRegisterVaccine = async (vaccineData) => {
    try {
      const newVaccine = await registerVaccine(vaccineData);
      setShowRegisterVaccineModal(false);
      alert(`Vacina ${newVaccine.name} cadastrada com sucesso!`);
      setAllVaccines((prevVaccines) => [...prevVaccines, newVaccine]);
    } catch (error) {
      if (error.message.includes("Duplicated error")) {
        alert(`erroro: Uma vacina com este nome pode já existir.`);
      } else {
        alert(`Falha ao cadastrar vacina: ${error.message}`);
      }
    }
  };

  const handleRegisterVaccination = async (vaccinationData) => {
    try {
      await registerVaccination(vaccinationData);
      setShowRegisterVaccinationModal(false);
      alert("Vacinação registrada com sucesso!");
      const updatedCard = await fetchUserCard(selectedUserId);
      setUserCard(updatedCard);
    } catch (error) {
      alert(`Falha ao registrar vacinação: ${error.message}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      alert("Usuário removido com sucesso.");
      setSelectedUserId(null);
    } catch (error) {
      alert(`Falha ao remover usuário: ${error.message}`);
    }
  };

  const handleDeleteVaccinationRecord = async (vaccinationId) => {
    try {
      await deleteVaccination(vaccinationId);
      alert("Registro de vacinação removido com sucesso.");
      const updatedCard = await fetchUserCard(selectedUserId);
      setUserCard(updatedCard);
    } catch (error) {
      alert(`Falha ao remover registro de vacinação: ${error.message}`);
    }
  };

  const handleShowVaccineInfo = (vaccine) => {
    setSelectedVaccineInfo(vaccine);
  };

  if (loading && !currentUser && !selectedUserId) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Erro: {error}</div>;
  }

  return (
    <div className="App">
      <h1>Gerenciador de Cartão de Vacinação</h1>

      {!selectedUserId ? (
        <HomePage
          onRegisterClick={() => setShowRegisterUserModal(true)}
          onViewUserClick={(userId) => setSelectedUserId(userId)}
          onRegisterVaccineClick={() => setShowRegisterVaccineModal(true)}
        />
      ) : (
        <UserPage
          user={currentUser}
          card={userCard}
          vaccines={allVaccines}
          onBack={() => setSelectedUserId(null)}
          onRegisterVaccinationClick={() =>
            setShowRegisterVaccinationModal(true)
          }
          onDeleteUserClick={handleDeleteUser}
          onDeleteVaccinationRecordClick={handleDeleteVaccinationRecord}
          onVaccineNameClick={handleShowVaccineInfo}
        />
      )}

      <Modal
        isOpen={showRegisterUserModal}
        onClose={() => setShowRegisterUserModal(false)}
        title="Cadastrar Novo Usuário"
      >
        <RegisterUserForm
          onSubmit={handleRegisterUser}
          onCancel={() => setShowRegisterUserModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showRegisterVaccinationModal && currentUser}
        onClose={() => setShowRegisterVaccinationModal(false)}
        title="Cadastrar Nova Vacinação"
      >
        {currentUser && (
          <RegisterVaccinationForm
            user={currentUser}
            allVaccines={allVaccines}
            onSubmit={handleRegisterVaccination}
            onCancel={() => setShowRegisterVaccinationModal(false)}
          />
        )}
      </Modal>

      <Modal
        isOpen={showRegisterVaccineModal}
        onClose={() => setShowRegisterVaccineModal(false)}
        title="Cadastrar Nova Vacina"
      >
        <RegisterVaccineForm
          onSubmit={handleRegisterVaccine}
          onCancel={() => setShowRegisterVaccineModal(false)}
        />
      </Modal>

      <Modal
        isOpen={!!selectedVaccineInfo}
        onClose={() => setSelectedVaccineInfo(null)}
        title={`Detalhes da vacina: ${selectedVaccineInfo?.name}`}
      >
        {selectedVaccineInfo && (
          <div>
            <p>
              <strong>Nome:</strong> {selectedVaccineInfo.name}
            </p>
            <p>
              <strong>Total de doses necessárias:</strong>{" "}
              {selectedVaccineInfo.totalDoses}
            </p>
            <div className="form-actions">
              {" "}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedVaccineInfo(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default App;
