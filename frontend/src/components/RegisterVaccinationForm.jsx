import React, { useState } from "react";

const DOSE_OPTIONS_VALUES = [
  "1st Dose",
  "2nd Dose",
  "3rd Dose",
  "Reinforcement Dose",
  "Single Dose",
];

const DOSE_DISPLAY_NAMES = {
  "1st Dose": "1ª Dose",
  "2nd Dose": "2ª Dose",
  "3rd Dose": "3ª Dose",
  "Reinforcement Dose": "Reforço",
  "Single Dose": "Dose Única",
};

function RegisterVaccinationForm({
  user,
  allVaccines = [],
  onSubmit,
  onCancel,
}) {
  const [selectedVaccineId, setSelectedVaccineId] = useState(
    allVaccines[0]?.id || ""
  );
  const [selectedDose, setSelectedDose] = useState(DOSE_OPTIONS_VALUES[0]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedVaccineId || !selectedDose) {
      alert("Por favor, selecione uma vacina e a dose.");
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
      <div className="form-group">
        <label>Usuário:</label>
        <input
          type="text"
          value={user?.name || ""}
          readOnly
          disabled
          style={{ backgroundColor: "#eee" }}
        />
      </div>
      <div className="form-group">
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
      <div className="form-group">
        <label htmlFor="dose">Dose:</label>
        <select
          id="dose"
          value={selectedDose}
          onChange={(e) => setSelectedDose(e.target.value)}
          required
        >
          {DOSE_OPTIONS_VALUES.map((doseValue) => (
            <option key={doseValue} value={doseValue}>
              {DOSE_DISPLAY_NAMES[doseValue] || doseValue}
            </option>
          ))}
        </select>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Cadastrar Vacinação
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default RegisterVaccinationForm;
