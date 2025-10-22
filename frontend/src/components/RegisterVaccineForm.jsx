import React, { useState } from "react";

function RegisterVaccineForm({ onSubmit, onCancel }) {
  const [name, setName] = useState("");
  const [totalDoses, setTotalDoses] = useState("1");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name) {
      alert("O nome da vacina é obrigatório.");
      return;
    }
    const doses = parseInt(totalDoses, 10);
    if (isNaN(doses) || doses < 1) {
      alert("O número de doses deve ser maior que 0.");
      return;
    }
    onSubmit({ name, totalDoses: doses });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="vaccineName">Nome da Vacina:</label>
        <input
          type="text"
          id="vaccineName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="totalDoses">Total de Doses:</label>
        <input
          type="number"
          id="totalDoses"
          value={totalDoses}
          onChange={(e) => setTotalDoses(e.target.value)}
          min="1"
          required
        />
      </div>
      <div>
        <button type="submit">Cadastrar Vacina</button>
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default RegisterVaccineForm;
