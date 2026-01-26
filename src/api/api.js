 import axios from "axios";

const BASE_URL = "http://localhost:5000";
// import { tokenManager } from "../tokenManager/tokenmanager";

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
    // headers: tokenManager.getAuthHeader(), 
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

// ==================== CLASSROOM APIs ====================

// ✅ GET - Fetch all classrooms
export const getClassrooms = async () => {
  const res = await fetch(`${BASE_URL}/classrooms`, {
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

// ✅ POST - Add new classroom
export const addClassroom = async (classroomData) => {
  const res = await fetch(`${BASE_URL}/classrooms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(classroomData),
  });

  if (!res.ok) {
    handleUnauthorized(res);
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to add classroom: ${res.status}`);
  }

  return res.json();
};

// ✅ DELETE - Delete classroom by ID
export const deleteClassroom = async (classroomId) => {
  const res = await fetch(`${BASE_URL}/classrooms/${classroomId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    handleUnauthorized(res);
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to delete classroom: ${res.status}`);
  }

  return res.json();
};

// PATCH - Update classroom by ID
export const updateClassroom = async (classroomId, classroomData) => {
  const res = await fetch(`${BASE_URL}/classrooms/${classroomId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(classroomData),
  });

  if (!res.ok) {
    handleUnauthorized(res);
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to update classroom: ${res.status}`);
  }

  return res.json();
};

// ==================== BATCH APIs ====================

// ✅ GET - Fetch all batches
export const getBatches = async () => {
  try {
    const res = await fetch(`${BASE_URL}/batches`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      handleUnauthorized(res);
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch batches: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("[API Error] getBatches:", error.message);
    throw error;
  }
};

// ✅ POST - Add new batch
export const addBatch = async (batchData) => {
  try {
    const res = await fetch(`${BASE_URL}/batches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(batchData),
    });

    if (!res.ok) {
      handleUnauthorized(res);
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to add batch: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("[API Error] addBatch:", error.message);
    throw error;
  }
};

// ✅ PATCH - Update batch by ID
export const updateBatch = async (batchId, batchData) => {
  try {
    const res = await fetch(`${BASE_URL}/batches/${batchId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(batchData),
    });

    if (!res.ok) {
      handleUnauthorized(res);
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to update batch: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("[API Error] updateBatch:", error.message);
    throw error;
  }
};

// ✅ DELETE - Delete batch by ID
export const deleteBatch = async (batchId) => {
  try {
    const res = await fetch(`${BASE_URL}/batches/${batchId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      handleUnauthorized(res);
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to delete batch: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("[API Error] deleteBatch:", error.message);
    throw error;
  }
};

// ==================== SUBJECT APIs ====================

// ✅ GET - Fetch all subjects
export const getSubjects = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/subjects`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })

    if (!res.ok) {
      handleUnauthorized(res)
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData.message || `Failed to fetch subjects: ${res.status}`)
    }

    return res.json()
  } catch (error) {
    console.error("[API Error] getSubjects:", error.message)
    throw error
  }
}

// ✅ POST - Add new subject
export const addSubjectAPI = async (subjectData) => {
  try {
    const res = await fetch(`${BASE_URL}/api/subjects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(subjectData),
    })

    if (!res.ok) {
      handleUnauthorized(res)
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData.message || `Failed to add subject: ${res.status}`)
    }

    return res.json()
  } catch (error) {
    console.error("[API Error] addSubject:", error.message)
    throw error
  }
}

// ✅ PATCH - Update subject by ID
export const updateSubjectAPI = async (subjectId, subjectData) => {
  try {
    const res = await fetch(`${BASE_URL}/api/subjects/${subjectId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(subjectData),
    })

    if (!res.ok) {
      handleUnauthorized(res)
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData.message || `Failed to update subject: ${res.status}`)
    }

    return res.json()
  } catch (error) {
    console.error("[API Error] updateSubject:", error.message)
    throw error
  }
}

// ✅ DELETE - Delete subject by ID
export const deleteSubjectAPI = async (subjectId) => {
  try {
    const res = await fetch(`${BASE_URL}/api/subjects/${subjectId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })

    if (!res.ok) {
      handleUnauthorized(res)
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData.message || `Failed to delete subject: ${res.status}`)
    }

    return res.json()
  } catch (error) {
    console.error("[API Error] deleteSubject:", error.message)
    throw error
  }
}

// ==================== FACULTY APIs ====================

// ✅ GET - Fetch all faculties
export const getFaculties = async () => {
  try {
    const res = await fetch(`${BASE_URL}/faculties`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      handleUnauthorized(res);
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch faculties: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("[API Error] getFaculties:", error.message);
    throw error;
  }
};

// ✅ POST - Add new faculty
export const addFaculty = async (facultyData) => {
  try {
    const res = await fetch(`${BASE_URL}/faculties`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(facultyData),
    });

    if (!res.ok) {
      handleUnauthorized(res);
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to add faculty: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("[API Error] addFaculty:", error.message);
    throw error;
  }
};

// ✅ PATCH - Update faculty by ID
export const updateFaculty = async (facultyId, facultyData) => {
  try {
    const res = await fetch(`${BASE_URL}/faculties/${facultyId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(facultyData),
    });

    if (!res.ok) {
      handleUnauthorized(res);
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to update faculty: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("[API Error] updateFaculty:", error.message);
    throw error;
  }
};

// ✅ DELETE - Delete faculty by ID
export const deleteFaculty = async (facultyId) => {
  try {
    const res = await fetch(`${BASE_URL}/faculties/${facultyId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      handleUnauthorized(res);
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to delete faculty: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("[API Error] deleteFaculty:", error.message);
    throw error;
  }
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

export const getTimetableVisualHTML = async (batchId) => {
  const res = await fetch(`${BASE_URL}/timetable/visual/${batchId}`, {
    method: "GET",
    credentials: "include",
  });

  const html = await res.text();

  if (!res.ok) {
    throw new Error(html || `API Error: ${res.status}`);
  }

  return html; // ✅ HTML string
};


export const getTimetableById = async (timetableId) => {
  const res = await axios.get(
    `http://localhost:5000/timetable/${timetableId}`,
    { withCredentials: true }
  );
  return res.data;
};



export const getTimetablePreviewAPI = async () => {
  const res = await fetch(`${BASE_URL}/timetable`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${res.status}`);
  }

  return res.json();
};

export const bulkUploadClassrooms = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${BASE_URL}/classrooms/bulk-upload`, {
      method: "POST",
      credentials: "include",
      body: formData,
      // Don't set Content-Type header - browser will set it automatically with boundary
    });

    if (!res.ok) {
      handleUnauthorized(res);
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to upload file: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("[API Error] bulkUploadClassrooms:", error.message);
    throw error;
  }
};

export const bulkUploadSubjects = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${BASE_URL}/subjects/bulk-upload`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!res.ok) {
      handleUnauthorized(res);
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to upload file: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("[API Error] bulkUploadSubjects:", error.message);
    throw error;
  }
};


export const logoutAPI = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.post(
    `${BASE_URL}/auth/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true, // agar cookies use ho rahi ho
    }
  );

  return res.data;
};

export const bulkUploadFaculties = async (file) => {
  try {
    console.log("📤 Uploading faculties file:", file.name);
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${BASE_URL}/faculties/bulk-upload`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!res.ok) {
      handleUnauthorized(res);
      const errorData = await res.json().catch(() => ({}));
      console.error("❌ Bulk Upload Faculties Error:", errorData);
      throw new Error(errorData.message || `Failed to upload file: ${res.status}`);
    }

    const data = await res.json();
    console.log("✅ Faculties bulk upload successful:", data);
    return data;
  } catch (error) {
    console.error("❌ [API Error] bulkUploadFaculties:", error.message);
    throw error;
  }
};