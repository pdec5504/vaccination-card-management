const API_URL = "http://localhost:3000/api";

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorBody = await response
      .json()
      .catch(() => ({ message: "Failed to parse error response" }));
    console.error("API Error Response:", errorBody);
    const errorMessage =
      errorBody?.message || `Error. status: ${response.status}`;
    throw new Error(errorMessage);
  }
  if (response.status === 204) {
    return null;
  }
  return await response.json();
};

const handleError = (error, context) => {
  console.error(`Error ${context}:`, error);
  throw error;
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return await handleResponse(response);
  } catch (error) {
    handleError(error, "registering user");
  }
};

export const fetchUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) {
      throw new Error(`Error. status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const fetchUserById = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`);
    if (response.status === 404) return null;
    return await handleResponse(response);
  } catch (error) {
    handleError(error, `fetching user ${userId}`);
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return await handleResponse(response);
  } catch (error) {
    handleError(error, `updating user ${userId}`);
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "DELETE",
    });
    return await handleResponse(response);
  } catch (error) {
    handleError(error, `deleting user ${userId}`);
  }
};

export const registerVaccine = async (vaccineData) => {
  try {
    const response = await fetch(`${API_URL}/vaccines`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vaccineData),
    });
    return await handleResponse(response);
  } catch (error) {
    handleError(error, "registering vaccine");
  }
};

export const fetchVaccines = async () => {
  try {
    const response = await fetch(`${API_URL}/vaccines`);
    if (!response.ok) {
      throw new Error(`Error. status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching vaccines:", error);
    throw error;
  }
};

export const fetchVaccineById = async (vaccineId) => {
  try {
    const response = await fetch(`${API_URL}/vaccines/${vaccineId}`);
    if (response.status === 404) return null;
    return await handleResponse(response);
  } catch (error) {
    handleError(error, `fetching vaccine ${vaccineId}`);
  }
};

export const updateVaccine = async (vaccineId, vaccineData) => {
  try {
    const response = await fetch(`${API_URL}/vaccines/${vaccineId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vaccineData),
    });
    return await handleResponse(response);
  } catch (error) {
    handleError(error, `updating vaccine ${vaccineId}`);
  }
};

export const deleteVaccine = async (vaccineId) => {
  try {
    const response = await fetch(`${API_URL}/vaccines/${vaccineId}`, {
      method: "DELETE",
    });
    return await handleResponse(response);
  } catch (error) {
    handleError(error, `deleting vaccine ${vaccineId}`);
  }
};

export const registerVaccination = async (vaccinationData) => {
  try {
    const response = await fetch(`${API_URL}/vaccinations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vaccinationData),
    });
    return await handleResponse(response);
  } catch (error) {
    handleError(error, "registering vaccination");
  }
};

export const fetchUserCard = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/card`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Error. status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching card for user ${userId}:`, error);
    throw error;
  }
};

export const deleteVaccination = async (vaccinationId) => {
  try {
    const response = await fetch(`${API_URL}/vaccinations/${vaccinationId}`, {
      method: "DELETE",
    });
    return await handleResponse(response);
  } catch (error) {
    handleError(error, `deleting vaccination ${vaccinationId}`);
  }
};
