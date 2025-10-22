import React from "react";

const DOSE_ROWS = [
  "1st Dose",
  "2nd Dose",
  "3rd Dose",
  "Reinforcement Dose",
  "Single Dose",
];

function VaccinationGrid({ vaccines = [], userCard = null }) {
  if (!userCard || vaccines.length === 0) {
    return <div>Loading vaccination card...</div>;
  }

  const getVaccinationInfo = (vaccineId, doseName) => {
    if (!userCard || !userCard.card) return null;
    return userCard.card.find(
      (record) =>
        record.vaccineName === vaccines.find((v) => v.id === vaccineId)?.name &&
        record.dose === doseName
    );
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
                style={{
                  minWidth: "100px",
                  padding: "5px",
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                }}
              >
                {vaccine.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DOSE_ROWS.map((doseName) => (
            <tr key={doseName}>
              <td style={{ fontWeight: "bold" }}>{doseName}</td>
              {vaccines.map((vaccine) => {
                const vaccinationInfo = getVaccinationInfo(
                  vaccine.id,
                  doseName
                );
                const isApplied = !!vaccinationInfo;
                const cellStyle = isApplied
                  ? { backgroundColor: "#d3d3d3" }
                  : {};

                return (
                  <td key={`${vaccine.id} - ${doseName}`} style={cellStyle}>
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
