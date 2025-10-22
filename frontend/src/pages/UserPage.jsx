import React from "react";
import UserInfo from "../components/UserInfo";
import VaccinationGrid from "../components/VaccinationGrid";

function UserPage({
  user,
  card,
  vaccines,
  onBack,
  onRegisterVaccinationClick,
  onDeletePersonClick,
  onDeleteVaccinationRecordClick,
  onVaccineNameClick,
}) {
  return (
    <div>
      <button onClick={onBack} style={{ marginBottom: "20px" }}>
        &larr; Voltar para a tela anterior
      </button>

      <UserInfo user={user} />

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={onRegisterVaccinationClick}
          style={{ marginRight: "10px" }}
        >
          Cadastrar Vacinação
        </button>
        <button
          onClick={() => {
            if (
              window.confirm(`Are you sure you want to delete ${user?.name}?`)
            ) {
              onDeletePersonClick(user.id);
            }
          }}
          style={{ backgroundColor: "#dc3545", color: "white" }}
        >
          Remover Usuário
        </button>
      </div>

      <VaccinationGrid
        vaccines={vaccines}
        userCard={card}
        onDeleteClick={onDeleteVaccinationRecordClick}
        onHeaderClick={onVaccineNameClick}
      />
    </div>
  );
}

export default UserPage;
