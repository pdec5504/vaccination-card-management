import React, { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import UserPage from "./pages/UserPage";
import Modal from "./components/common/Modal";
import RegisterUserForm from "./components/RegisterUserForm";
import RegisterVaccinationForm from "./components/RegisterVaccinationForm";
import {
  fetchUsers,
  fetchVaccines,
  fetchUserCard,
  registerUser,
  registerVaccination,
  deleteUser,
  deleteVaccination,
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
  const [selectedVaccineInfo, setSelectedVaccineInfo] = useState(null);

  useEffect(() => {
    const loadVaccines = async () => {
      try {
        setLoading(true);
        const vaccines = await fetchVaccines();
        setAllVaccines(vaccines || []);
        setError(null);
      } catch (err) {
        console.error("Failed to load vaccines:", err);
        setError("Failed to load vaccine list. Is the backend running?");
      } finally {
      }
    };
    loadVaccines();
  }, []);

  // useEffect(() => {
  //   const loadInitialData = async () => {
  //     try {
  //       setLoading(true);
  //       setError(null);

  //       const users = await fetchUsers();
  //       let targetUserId = null;
  //       if (users && users.length > 0) {
  //         targetUserId = users[0].id;
  //         setCurrentUser(users[0]);
  //       } else {
  //         console.warn("No users found in the database.");
  //       }

  //       const vaccines = await fetchVaccines();
  //       setAllVaccines(vaccines || []);

  //       if (targetUserId) {
  //         const cardData = await fetchUserCard(targetUserId);

  //         if (cardData && cardData.user) {
  //           setCurrentUser(cardData.user);
  //           setUserCard(cardData);
  //         } else {
  //           setUserCard(null);
  //           if (users && users.length > 0 && users[0].id === targetUserId) {
  //             setCurrentUser(users[0]);
  //           } else {
  //             setCurrentUser(null);
  //           }
  //           console.warn(
  //             `Vaccination card for user ${targetUserId} not found.`
  //           );
  //         }
  //       } else {
  //         setCurrentUser(null);
  //         setUserCard(null);
  //       }
  //     } catch (error) {
  //       console.error("Failed to load initial data:", err);
  //       setError("Failed to load data. Check if the backend is running.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadInitialData();
  // }, []);

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
              `Vaccination card for user ${selectedUserId} not found, but user exists.`
            );
          } else {
            console.warn(`User with ID ${selectedUserId} not found.`);
            setSelectedUserId(null);
          }
        }
      } catch (err) {
        console.error(`Failed to load data for user ${selectedUserId}:`, err);
        setError(`Failed to load user data: ${err.message}`);
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
      alert(`User ${newUser.name} registered successfully!`);
      setSelectedUserId(newUser.id);
    } catch (err) {
      alert(`Failed to register user: ${err.message}`);
    }
  };

  const handleRegisterVaccination = async (vaccinationData) => {
    try {
      await registerVaccination(vaccinationData);
      setShowRegisterVaccinationModal(false);
      alert("Vaccination registered successfully!");
      const updatedCard = await fetchUserCard(selectedUserId);
      setUserCard(updatedCard);
    } catch (err) {
      alert(`Failed to register vaccination: ${err.message}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      alert("User deleted successfully.");
      setSelectedUserId(null);
    } catch (err) {
      alert(`Failed to delete user: ${err.message}`);
    }
  };

  const handleDeleteVaccinationRecord = async (vaccinationId) => {
    try {
      await deleteVaccination(vaccinationId);
      alert("Vaccination record deleted successfully.");
      const updatedCard = await fetchUserCard(selectedUserId);
      setUserCard(updatedCard);
    } catch (err) {
      alert(`Failed to delete vaccination record: ${err.message}`);
    }
  };

  const handleShowVaccineInfo = (vaccine) => {
    setSelectedVaccineInfo(vaccine);
  };

  if (loading && !currentUser) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

  return (
    <div className="App">
      <h1>Gerenciador de Cartão de Vacinação</h1>

      {!selectedUserId ? (
        <HomePage
          onRegisterClick={() => setShowRegisterUserModal(true)}
          onViewUserClick={(userId) => setSelectedUserId(userId)}
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
        title="Register New User"
      >
        <RegisterUserForm
          onSubmit={handleRegisterUser}
          onCancel={() => setShowRegisterUserModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showRegisterVaccinationModal && currentUser}
        onClose={() => setShowRegisterVaccinationModal(false)}
        title="Register New Vaccination"
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
        isOpen={!!selectedVaccineInfo}
        onClose={() => setSelectedVaccineInfo(null)}
        title={`Vaccine Details: ${selectedVaccineInfo?.name}`}
      >
        {selectedVaccineInfo && (
          <div>
            <p>
              <strong>Name:</strong> {selectedVaccineInfo.name}
            </p>
            <p>
              <strong>Total Doses Required:</strong>{" "}
              {selectedVaccineInfo.totalDoses}
            </p>
            <button type="button" onClick={() => setSelectedVaccineInfo(null)}>
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default App;
