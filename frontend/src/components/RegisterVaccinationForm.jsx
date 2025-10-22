import React, { useState } from "react";

const DOSE_OPTIONS = [
  "1st Dose",
  "2nd Dose",
  "3rd Dose",
  "Single Dose",
  "Reinforcement Dose",
];

function RegisterVaccinationForm({
  user,
  allVaccines = [],
  onSubmit,
  onCancel,
}) {
  const [selectedVaccineId, setSelectedVaccineId] = useState(
    allVaccines[0]?.id || ""
  );
  const [selectedDose, setSelectedDose] = useState(DOSE_OPTIONS[0]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedVaccineId || !selectedDose) {
      alert("Please select a vaccine and dose.");
      return;
    }
    onSubmit({
      userId: user.id,
      vaccineId: selectedVaccineId,
      dose: selectedDose,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        Usuário: <strong>{user?.name}</strong>
      </div>
      <div>
        <label htmlFor="vaccine">Vacina:</label>
        <select
          id="vaccine"
          value={selectedVaccineId}
          onChange={(e) => setSelectedVaccineId(e.target.value)}
          required
        >
          <option value="" disabled>
            -- Selecione a vacina --
          </option>
          {allVaccines.map((vaccine) => (
            <option key={vaccine.id} value={vaccine.id}>
              {vaccine.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="dose">Dose:</label>
        <select
          id="dose"
          value={selectedDose}
          onChange={(e) => setSelectedDose(e.target.value)}
          required
        >
          {DOSE_OPTIONS.map((dose) => (
            <option key={dose} value={dose}>
              {dose}
            </option>
          ))}
        </select>
      </div>
      {/* Date */}
      <div>
        <button type="submit">Cadatrar vacinação</button>
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default RegisterVaccinationForm;
