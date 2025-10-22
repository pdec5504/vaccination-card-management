import react from "react";

function UserInfo({ user }) {
  if (!user) {
    return <div>Loading user information...</div>;
  }

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
            value={user.gender || ""}
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
