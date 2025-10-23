import React from "react";
import UserInfo from "../components/UserInfo";
import VaccinationGrid from "../components/VaccinationGrid";

function UserPage({
  user,
  card,
  vaccines,
  onBack,
  onRegisterVaccinationClick,
  onDeleteUserClick,
  onDeleteVaccinationRecordClick,
  onVaccineNameClick,
  onEditUserClick,
}) {
  return (
    <div>
      <button
        className="btn btn-secondary"
        onClick={onBack}
        style={{ marginBottom: "20px" }}
      >
        &larr; Voltar para Lista de Usuários
      </button>

      <UserInfo user={user} />

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button
          className="btn btn-primary"
          onClick={onRegisterVaccinationClick}
        >
          Cadastrar Vacinação
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => onEditUserClick(user)}
        >
          Editar Informações
        </button>
        <button
          className="btn btn-danger"
          onClick={() => {
            if (
              window.confirm(
                `Tem certeza que deseja remover ${user?.name}? Esta ação não pode ser desfeita e removerá também o cartão de vacinação associado.`
              )
            ) {
              onDeleteUserClick(user.id);
            }
          }}
          style={{ marginLeft: "auto" }}
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
