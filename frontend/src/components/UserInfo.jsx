import React from "react";

const GENDER_TRANSLATION = {
  Male: "Masculino",
  Female: "Feminino",
  Other: "Outro",
  "Not informed": "Não informado",
};

function UserInfo({ user }) {
  if (!user) {
    return <div>Carregando informações do usuário...</div>;
  }

  const translatedGender = GENDER_TRANSLATION[user.gender] || user.gender || "";

  return (
    <div
      className="user-info-container"
      style={{
        border: "1px solid var(--btg-border)",
        padding: "20px",
        marginBottom: "20px",
        borderRadius: "4px",
        backgroundColor: "#fafafa",
      }}
    >
      <h2
        style={{
          marginTop: 0,
          borderBottom: "1px solid var(--btg-border)",
          paddingBottom: "10px",
        }}
      >
        Informações do usuário:
      </h2>
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <div className="form-group" style={{ flex: 2 }}>
          <label>Nome:</label>
          <input type="text" value={user.name || ""} readOnly />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Idade:</label>
          <input type="text" value={user.age || ""} readOnly />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Sexo:</label>
          <input type="text" value={translatedGender} readOnly />
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
