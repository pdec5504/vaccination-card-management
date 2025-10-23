import React, { useState, useEffect, useCallback } from "react";
import HomePage from "./pages/HomePage";
import UserPage from "./pages/UserPage";
import Modal from "./components/common/Modal";
import RegisterUserForm from "./components/RegisterUserForm";
import EditUserForm from "./components/EditUserForm";
import RegisterVaccinationForm from "./components/RegisterVaccinationForm";
import RegisterVaccineForm from "./components/RegisterVaccineForm";
import EditVaccineForm from "./components/EditVaccineForm";
import {
  fetchUsers,
  fetchVaccines,
  fetchUserCard,
  registerUser,
  updateUser,
  registerVaccination,
  deleteUser,
  deleteVaccination,
  registerVaccine,
  updateVaccine,
  deleteVaccine,
  fetchUserById,
} from "./services/api";
import "./App.css";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [allVaccines, setAllVaccines] = useState([]);
  const [userCard, setUserCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingVaccines, setLoadingVaccines] = useState(false);
  const [error, setError] = useState(null);

  const [showRegisterUserModal, setShowRegisterUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showRegisterVaccinationModal, setShowRegisterVaccinationModal] =
    useState(false);
  const [showRegisterVaccineModal, setShowRegisterVaccineModal] =
    useState(false);
  const [showEditVaccineModal, setShowEditVaccineModal] = useState(false);
  const [editingVaccine, setEditingVaccine] = useState(null);
  const [selectedVaccineInfo, setSelectedVaccineInfo] = useState(null);

  const loadVaccines = useCallback(async () => {
    setLoadingVaccines(true);
    try {
      const vaccines = await fetchVaccines();
      setAllVaccines(vaccines || []);
      setError(null);
    } catch (err) {
      console.error("Falha ao carregar vacinas:", err);
      setError(
        "Falha ao carregar lista de vacinas. Verifique a conexão com o backend."
      );
      setAllVaccines([]);
    } finally {
      setLoadingVaccines(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVaccines();
  }, [loadVaccines]);

  useEffect(() => {
    const loadUserData = async () => {
      if (!selectedUserId) {
        setCurrentUser(null);
        setUserCard(null);
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
          console.warn(
            `Usuário ou cartão com ID ${selectedUserId} não encontrado.`
          );
          setCurrentUser(null);
          setUserCard(null);
          setSelectedUserId(null);
          setError(
            `Não foi possível carregar os dados do usuário ID ${selectedUserId}.`
          );
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

    if (!loadingVaccines) {
      loadUserData();
    }
  }, [selectedUserId, loadingVaccines]);

  const handleRegisterUser = async (userData) => {
    setLoadingUsers(true);
    try {
      const newUser = await registerUser(userData);
      setShowRegisterUserModal(false);
      alert(`Usuário ${newUser.name} cadastrado com sucesso!`);
      setSelectedUserId(newUser.id);
    } catch (error) {
      alert(`Falha ao cadastrar usuário: ${error.message}`);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleEditUserClick = (userToEdit) => {
    setEditingUser(userToEdit);
    setShowEditUserModal(true);
  };

  const handleUpdateUser = async (userId, userData) => {
    setLoading(true);
    try {
      const updatedUser = await updateUser(userId, userData);
      setShowEditUserModal(false);
      setEditingUser(null);
      alert(`Usuário ${updatedUser.name} atualizado com sucesso!`);
      if (currentUser && currentUser.id === userId) {
        setCurrentUser(updatedUser);
        if (userCard) {
          setUserCard((prev) => ({ ...prev, user: updatedUser }));
        }
      }
    } catch (error) {
      alert(`Falha ao atualizar usuário: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    setLoading(true);
    try {
      await deleteUser(userId);
      alert("Usuário removido com sucesso.");
      setSelectedUserId(null);
    } catch (error) {
      alert(`Falha ao remover usuário: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterVaccine = async (vaccineData) => {
    setLoadingVaccines(true);
    try {
      const newVaccine = await registerVaccine(vaccineData);
      setShowRegisterVaccineModal(false);
      alert(`Vacina ${newVaccine.name} cadastrada com sucesso!`);

      loadVaccines();
    } catch (error) {
      if (error.message.includes("Duplicated error")) {
        alert(`Erro: Uma vacina com este nome pode já existir.`);
      } else {
        alert(`Falha ao cadastrar vacina: ${error.message}`);
      }
    } finally {
      setLoadingVaccines(false);
    }
  };

  const handleEditVaccineClick = (vaccineToEdit) => {
    setEditingVaccine(vaccineToEdit);
    setShowEditVaccineModal(true);
  };

  const handleUpdateVaccine = async (vaccineId, vaccineData) => {
    setLoadingVaccines(true);
    try {
      const updatedVaccine = await updateVaccine(vaccineId, vaccineData);
      setShowEditVaccineModal(false);
      setEditingVaccine(null);
      alert(`Vacina ${updatedVaccine.name} atualizada com sucesso!`);
      loadVaccines();
    } catch (error) {
      alert(`Falha ao atualizar vacina: ${error.message}`);
    } finally {
      setLoadingVaccines(false);
    }
  };

  const handleDeleteVaccineClick = (vaccineId) => {
    const vaccineToDelete = allVaccines.find((v) => v.id === vaccineId);
    if (
      vaccineToDelete &&
      window.confirm(
        `Tem certeza que deseja remover a vacina ${vaccineToDelete.name}? Todos os registros de aplicação desta vacina também serão removidos.`
      )
    ) {
      handleDeleteVaccine(vaccineId);
    }
  };

  const handleDeleteVaccine = async (vaccineId) => {
    setLoadingVaccines(true);
    setLoading(true);
    try {
      await deleteVaccine(vaccineId);
      alert("Vacina removida com sucesso.");
      await loadVaccines();

      if (selectedUserId) {
        const updatedCard = await fetchUserCard(selectedUserId);
        if (updatedCard && updatedCard.user) {
          setUserCard(updatedCard);
          setCurrentUser(updatedCard.user);
        } else {
          console.warn(
            `Usuário ${selectedUserId} não encontrado após exclusão de vacina.`
          );
          setSelectedUserId(null);
          setCurrentUser(null);
          setUserCard(null);
        }
      }
    } catch (error) {
      alert(`Falha ao remover vacina: ${error.message}`);
    } finally {
      setLoadingVaccines(false);
      setLoading(false);
    }
  };

  const handleRegisterVaccination = async (vaccinationData) => {
    setLoading(true);
    try {
      await registerVaccination(vaccinationData);
      setShowRegisterVaccinationModal(false);
      alert("Vacinação registrada com sucesso!");
      const updatedCard = await fetchUserCard(selectedUserId);
      if (updatedCard && updatedCard.user) {
        setUserCard(updatedCard);
        setCurrentUser(updatedCard.user);
      } else {
        console.error(
          "Não foi possível recarregar o cartão do usuário após registrar vacinação."
        );
        setError("Erro ao atualizar o cartão de vacinação.");
      }
    } catch (error) {
      alert(`Falha ao registrar vacinação: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVaccinationRecord = async (vaccinationId) => {
    setLoading(true);
    try {
      await deleteVaccination(vaccinationId);
      alert("Registro de vacinação removido com sucesso.");
      const updatedCard = await fetchUserCard(selectedUserId);
      if (updatedCard && updatedCard.user) {
        setUserCard(updatedCard);
        setCurrentUser(updatedCard.user);
      } else {
        console.error(
          "Não foi possível recarregar o cartão do usuário após deletar registro."
        );
        setError("Erro ao atualizar o cartão de vacinação.");
      }
    } catch (error) {
      alert(`Falha ao remover registro de vacinação: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleShowVaccineInfo = (vaccine) => {
    const currentVaccineData =
      allVaccines.find((v) => v.id === vaccine.id) || vaccine;
    setSelectedVaccineInfo(currentVaccineData);
  };

  if (loading && !selectedUserId && allVaccines.length === 0 && !error) {
    return <div>Carregando...</div>;
  }

  if (error && !selectedUserId) {
    return <div style={{ color: "red", padding: "20px" }}>Erro: {error}</div>;
  }

  return (
    <div className="App">
      <h1>Gerenciador de Cartão de Vacinação</h1>

      {!selectedUserId ? (
        <HomePage
          onRegisterClick={() => setShowRegisterUserModal(true)}
          onViewUserClick={(userId) => setSelectedUserId(userId)}
          onRegisterVaccineClick={() => setShowRegisterVaccineModal(true)}
          onEditVaccineClick={handleEditVaccineClick}
          onDeleteVaccineClick={handleDeleteVaccineClick}
          loadingUsers={loadingUsers}
          loadingVaccines={loadingVaccines}
        />
      ) : loading && (!currentUser || !userCard) ? (
        <div>Carregando dados do usuário...</div>
      ) : error ? (
        <div style={{ color: "red" }}>
          <p>Erro ao carregar dados do usuário: {error}</p>
          <button
            className="btn btn-secondary"
            onClick={() => setSelectedUserId(null)}
          >
            Voltar
          </button>
        </div>
      ) : currentUser ? (
        <UserPage
          user={currentUser}
          card={userCard}
          vaccines={allVaccines}
          onBack={() => setSelectedUserId(null)}
          onRegisterVaccinationClick={() =>
            setShowRegisterVaccinationModal(true)
          }
          onEditUserClick={handleEditUserClick} // Passa o handler de edição
          onDeleteUserClick={handleDeleteUser}
          onDeleteVaccinationRecordClick={handleDeleteVaccinationRecord}
          onVaccineNameClick={handleShowVaccineInfo}
        />
      ) : (
        <div>
          Usuário não encontrado.{" "}
          <button
            className="btn btn-secondary"
            onClick={() => setSelectedUserId(null)}
          >
            Voltar
          </button>
        </div>
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
        isOpen={showEditUserModal}
        onClose={() => {
          setShowEditUserModal(false);
          setEditingUser(null);
        }}
        title={`Editar Usuário: ${editingUser?.name}`}
      >
        <EditUserForm
          user={editingUser}
          onSubmit={handleUpdateUser}
          onCancel={() => {
            setShowEditUserModal(false);
            setEditingUser(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={showRegisterVaccinationModal && currentUser != null}
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
        isOpen={showEditVaccineModal}
        onClose={() => {
          setShowEditVaccineModal(false);
          setEditingVaccine(null);
        }}
        title={`Editar Vacina: ${editingVaccine?.name}`}
      >
        <EditVaccineForm
          vaccine={editingVaccine}
          onSubmit={handleUpdateVaccine}
          onCancel={() => {
            setShowEditVaccineModal(false);
            setEditingVaccine(null);
          }}
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
