import react from "react";

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
        border: "1px solid #ccc",
        padding: "10px",
        marginBottom: "20px",
      }}
    >
      <h2>Informações do usuário:</h2>
      <div style={{ display: "flex", gap: "20px" }}>
        <label>
          Nome:
          <input
            type="text"
            value={user.name || ""}
            readOnly
            style={{ marginLeft: "5px" }}
          />
        </label>
        <label>
          Idade:
          <input
            type="text"
            value={user.age || ""}
            readOnly
            style={{ marginLeft: "5px", width: "50px" }}
          />
        </label>
        <label>
          Sexo:
          <input
            type="text"
            value={translatedGender}
            readOnly
            style={{ marginLeft: "5px" }}
          />
        </label>
      </div>
      {/* More information button */}
    </div>
  );
}

export default UserInfo;
