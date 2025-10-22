import React, { useState, useEffect } from "react";
import { fetchUsers } from "../services/api";

function HomePage({
  onRegisterClick,
  onViewUserClick,
  onRegisterVaccineClick,
}) {
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
      } catch (error) {
        setError(
          "Falha ao carregar usuários. Verifique se o backend está funcionando."
        );
        console.error(error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <button className="btn btn-primary" onClick={onRegisterClick}>
          {" "}
          Cadastrar Usuário
        </button>
        <button className="btn btn-secondary" onClick={onRegisterVaccineClick}>
          {" "}
          Cadastrar Vacina
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
              <li
                key={user.id}
                style={{
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                  border: "1px solid var(--btg-border)",
                  borderRadius: "4px",
                }}
              >
                <span style={{ fontWeight: "500" }}>{user.name}</span>
                <button
                  className="btn btn-secondary"
                  onClick={() => onViewUserClick(user.id)}
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
