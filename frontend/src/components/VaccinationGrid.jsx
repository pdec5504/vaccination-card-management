import React from "react";

const DOSE_ROWS_VALUES = [
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

function VaccinationGrid({
  vaccines = [],
  userCard = null,
  onDeleteClick,
  onHeaderClick,
}) {
  if (!userCard || vaccines.length === 0) {
    return <div>Carregando cartão de vacinação...</div>;
  }

  const getVaccinationInfo = (vaccineId, doseNameValue) => {
    if (!userCard || !userCard.card) return null;
    const vaccine = vaccines.find((v) => v.id === vaccineId);
    return userCard.card.find(
      (record) =>
        record.vaccineName === vaccine?.name && record.dose === doseNameValue
    );
  };

  const handleCellClick = (vaccinationInfo) => {
    if (vaccinationInfo && onDeleteClick) {
      if (
        window.confirm(
          `Remover registro de ${vaccinationInfo.vaccineName} (${
            vaccinationInfo.dose
          }) aplicada em ${new Date(
            vaccinationInfo.applicationDate
          ).toLocaleDateString("pt-BR")}?`
        )
      ) {
        onDeleteClick(vaccinationInfo.vaccinationId);
      }
    }
  };

  const handleHeaderClick = (vaccine) => {
    if (onHeaderClick) {
      onHeaderClick(vaccine);
      // alert(`Vaccine: ${vaccine.name}\nTotal Doses: ${vaccine.totalDoses}`);
    }
  };

  return (
    <div className="vaccination-card">
      <h2>Carteira Nacional de Vacinação</h2>
      <table
        border="1"
        style={{
          borderCollapse: "collapse",
          width: "100%",
          textAlign: "center",
        }}
      >
        <thead>
          <tr>
            <th style={{ width: "100px" }}>Vacinas / Doses</th>
            {vaccines.map((vaccine) => (
              <th
                key={vaccine.id}
                // className="vertical"
                style={{
                  cursor: onHeaderClick ? "pointer" : "default",
                  minWidth: "100px",
                  padding: "5px",
                }}
                onClick={() => handleHeaderClick(vaccine)}
                title={`Clique para ver a informações de ${vaccine.name}`}
              >
                {vaccine.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DOSE_ROWS_VALUES.map((doseValue) => (
            <tr key={doseValue}>
              <td style={{ fontWeight: "bold" }}>
                {DOSE_DISPLAY_NAMES[doseValue] || doseValue}
              </td>
              {vaccines.map((vaccine) => {
                const vaccinationInfo = getVaccinationInfo(
                  vaccine.id,
                  doseValue
                );
                const isApplied = !!vaccinationInfo;
                const cellClass = isApplied ? "applied" : "";
                const cellStyle =
                  isApplied && onDeleteClick ? { cursor: "pointer " } : {};

                return (
                  <td
                    key={`${vaccine.id} - ${doseValue}`}
                    className={cellClass}
                    style={cellStyle}
                    onClick={() => handleCellClick(vaccinationInfo)}
                    title={
                      isApplied
                        ? `Clique para gerenciar o registro (Aplicação: ${new Date(
                            vaccinationInfo.applicationDate
                          ).toLocaleDateString("pt-BR")})`
                        : ""
                    }
                  >
                    {isApplied
                      ? new Date(
                          vaccinationInfo.applicationDate
                        ).toLocaleDateString("pt-BR")
                      : ""}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VaccinationGrid;
