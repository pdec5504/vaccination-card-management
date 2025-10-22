import React, { useState } from "react";

function RegisterUserForm({ onSubmit, onCancel }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Not informed");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name) {
      alert("O nome é obrigatório.");
      return;
    }
    onSubmit({ name, age: age ? parseInt(age, 10) : undefined, gender });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Nome:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="age">Idade:</label>
        <input
          type="number"
          id="age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          min="0"
        />
      </div>
      <div>
        <label htmlFor="gender">Sexo:</label>
        <select
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="Not informed">Não informado</option>
          <option value="Male">Masculino</option>
          <option value="Female">Feminino</option>
          <option value="Other">Outro</option>
        </select>
      </div>
      <div>
        <button type="submit">Cadastrar</button>
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default RegisterUserForm;
