import React, { useState, useEffect } from "react";
import { fetchUsers, fetchVaccines } from "../services/api";

function HomePage({
  onRegisterClick,
  onViewUserClick,
  onRegisterVaccineClick,
  onEditVaccineClick,
  onDeleteVaccineClick,
}) {
  const [users, setUsers] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingVaccines, setLoadingVaccines] = useState(true);
  const [errorUsers, setErrorUsers] = useState(null);
  const [errorVaccines, setErrorVaccines] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoadingUsers(true);
        const fetchedUsers = await fetchUsers();
        setUsers(fetchedUsers || []);
        setErrorUsers(null);
      } catch (error) {
        setErrorUsers(
          "Falha ao carregar usuários. Verifique se o backend está funcionando."
        );
        console.error(error);
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };
    loadUsers();
  }, []);

  useEffect(() => {
    const loadVaccines = async () => {
      try {
        setLoadingVaccines(true);
        const fetchedVaccines = await fetchVaccines();
        setVaccines(fetchedVaccines || []);
        setErrorVaccines(null);
      } catch (error) {
        setErrorVaccines(
          "Falha ao carregar vacinas. Verifique se o backend está funcionando."
        );
        console.error(error);
        setVaccines([]);
      } finally {
        setLoadingVaccines(false);
      }
    };
    loadVaccines();
  }, [onRegisterVaccineClick, onEditVaccineClick, onDeleteVaccineClick]);

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <button className="btn btn-primary" onClick={onRegisterClick}>
          Cadastrar Usuário
        </button>
        <button className="btn btn-secondary" onClick={onRegisterVaccineClick}>
          Cadastrar Vacina
        </button>
      </div>
      <h2>Usuários</h2>
      {loadingUsers && <p>Carregando usuários...</p>}
      {errorUsers && <p style={{ color: "red" }}>{errorUsers}</p>}
      {!loadingUsers &&
        !errorUsers &&
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
      <h2 style={{ marginTop: "30px" }}>Vacinas Cadastradas</h2>
      {loadingVaccines && <p>Carregando vacinas...</p>}
      {errorVaccines && <p style={{ color: "red" }}>{errorVaccines}</p>}
      {!loadingVaccines &&
        !errorVaccines &&
        (vaccines.length === 0 ? (
          <p>
            Sem vacinas cadastradas. Clique em "Cadastrar Vacina" para adicionar
            uma.
          </p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {vaccines.map((vaccine) => (
              <li
                key={vaccine.id}
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
                <div>
                  <span style={{ fontWeight: "500" }}>{vaccine.name}</span>
                  <small style={{ marginLeft: "10px", color: "#666" }}>
                    ({vaccine.totalDoses} doses)
                  </small>
                </div>
                <div>
                  <button
                    className="btn btn-secondary"
                    onClick={() => onEditVaccineClick(vaccine)}
                    style={{ marginRight: "5px" }}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => onDeleteVaccineClick(vaccine.id)}
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ))}
    </div>
  );
}

export default HomePage;
