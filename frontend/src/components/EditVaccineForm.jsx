import React, { useState, useEffect } from "react";

function EditVaccineForm({ vaccine, onSubmit, onCancel }) {
  const [name, setName] = useState("");
  const [totalDoses, setTotalDoses] = useState("1");

  useEffect(() => {
    if (vaccine) {
      setName(vaccine.name || "");
      setTotalDoses(vaccine.totalDoses ? String(vaccine.totalDoses) : "1");
    }
  }, [vaccine]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name) {
      alert("O nome da vacina é obrigatório.");
      return;
    }
    const doses = parseInt(totalDoses, 10);
    if (isNaN(doses) || doses < 1) {
      alert("O número de doses deve ser um número positivo.");
      return;
    }
    onSubmit(vaccine.id, { name, totalDoses: doses });
  };

  if (!vaccine) return null;

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="edit-vaccineName">Nome da Vacina:</label>
        <input
          type="text"
          id="edit-vaccineName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="edit-totalDoses">Total de Doses:</label>
        <input
          type="number"
          id="edit-totalDoses"
          value={totalDoses}
          onChange={(e) => setTotalDoses(e.target.value)}
          min="1"
          required
        />
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

export default EditVaccineForm;
