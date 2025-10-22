import React, { useState, useEffect } from "react";
import UserInfo from "./components/UserInfo";
import VaccinationGrid from "./components/VaccinationGrid";
import { fetchUsers, fetchVaccines, fetchUserCard } from "./services/api";
import "./App.css";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [allVaccines, setAllVaccines] = useState([]);
  const [userCard, setUserCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        const users = await fetchUsers();
        let targetUserId = null;
        if (users && users.length > 0) {
          targetUserId = users[0].id;
          setCurrentUser(users[0]);
        } else {
          console.warn("No users found in the database.");
        }

        const vaccines = await fetchVaccines();
        setAllVaccines(vaccines || []);

        if (targetUserId) {
          const cardData = await fetchUserCard(targetUserId);

          if (cardData && cardData.user) {
            setCurrentUser(cardData.user);
            setUserCard(cardData);
          } else {
            setUserCard(null);
            if (users && users.length > 0 && users[0].id === targetUserId) {
              setCurrentUser(users[0]);
            } else {
              setCurrentUser(null);
            }
            console.warn(
              `Vaccination card for user ${targetUserId} not found.`
            );
          }
        } else {
          setCurrentUser(null);
          setUserCard(null);
        }
      } catch (error) {
        console.error("Failed to load initial data:", err);
        setError("Failed to load data. Check if the backend is running.");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  if (loading) {
    return <div>Loading application data...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

  return (
    <div className="App">
      <h1>Vaccination Card Management</h1>
      <UserInfo user={currentUser} />
      <VaccinationGrid vaccines={allVaccines} userCard={userCard} />
    </div>
  );
}

export default App;
