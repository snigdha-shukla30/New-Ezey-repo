import axios from "axios";
const BASE_URL = "http://localhost:5000";

// Helper function to handle unauthorized responses
const handleUnauthorized = (res) => {
  if (res.status === 401) {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  }
};

export const loginAPI = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Login failed: ${res.status}`);
  }
  
  const data = await res.json();
  
  localStorage.setItem('isAuthenticated', 'true');
  
  if (data.user) {
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  
  return data;
};

export const signupAPI = async (payload) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return res.json();
};

export const forgotPasswordAPI = async (payload) => {
  const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return res.json();
};

export const emailVerificationAPI = async (token) => {
  const res = await fetch(`${BASE_URL}/auth/verify-email?token=${token}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.json();
};

export const dashboardSummaryAPI = async () => {
  const res = await fetch(`${BASE_URL}/dashboard/summary`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    handleUnauthorized(res);
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${res.status}`);
  }

  return res.json();
};

export const generateTimetable = async (batchId) => {
  console.log("🚀 generateTimetable called with:", batchId);
  const response = await axios.post(
    `${BASE_URL}/timetable/generate`,
    { batchId },
    {
      withCredentials: true, // 🔥 IMPORTANT
    }
  );
  console.log("✅ API response received:", response);
  return response.data;
};

export const getTimetableById = async (timetableId) => {
  const res = await axios.get(
    `http://localhost:5000/timetable/${timetableId}`,
    { withCredentials: true }
  );
  return res.data;
};
