import React, { useState, useEffect } from "react";
import { fetchUsers } from "../services/api";

function HomePage({ onRegisterClick, onViewUserClick }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await fetchUsers();
        setUsers(fetchedUsers || []);
        setError(null);
      } catch (err) {
        setError("Failed to load users. Is the backend running?");
        console.error(err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  return (
    <div>
      {/* <h1>Gerenciador de Cartão de Vacinação</h1> */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={onRegisterClick} style={{ marginRight: "10px" }}>
          Cadastrar Usuário
        </button>
      </div>

      <h2>Usuários</h2>
      {loading && <p>Carregando usuários...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading &&
        !error &&
        (users.length === 0 ? (
          <p>
            Sem usuários cadastrados. Clique em "Cadastrar Usuário" para
            começar.
          </p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {users.map((user) => (
              <li key={user.id} style={{ marginBottom: "10px" }}>
                <span>{user.name}</span>
                <button
                  onClick={() => onViewUserClick(user.id)}
                  style={{ marginLeft: "10px" }}
                >
                  Exibir Cartão
                </button>
              </li>
            ))}
          </ul>
        ))}
    </div>
  );
}

export default HomePage;
