import React, { useState, useEffect } from "react";

function EditUserForm({ user, onSubmit, onCancel }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Not informed");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setAge(
        user.age !== null && user.age !== undefined ? String(user.age) : ""
      );
      setGender(user.gender || "Not informed");
    }
  }, [user]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name) {
      alert("O nome é obrigatório.");
      return;
    }
    const userData = {
      name,
      age: age ? parseInt(age, 10) : undefined,
      gender,
    };
    onSubmit(user.id, userData);
  };

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="edit-name">Nome:</label>
        <input
          type="text"
          id="edit-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="edit-age">Idade:</label>
        <input
          type="number"
          id="edit-age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          min="0"
        />
      </div>
      <div className="form-group">
        <label htmlFor="edit-gender">Sexo:</label>
        <select
          id="edit-gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="Not informed">Não informado</option>
          <option value="Male">Masculino</option>
          <option value="Female">Feminino</option>
          <option value="Other">Outro</option>
        </select>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Salvar Alterações
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default EditUserForm;
