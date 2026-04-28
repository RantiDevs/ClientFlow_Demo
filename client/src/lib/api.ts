const BASE_URL = "/api";

function getToken(): string | null {
  return localStorage.getItem("clientflow_token");
}

function setToken(token: string): void {
  localStorage.setItem("clientflow_token", token);
}

function clearToken(): void {
  localStorage.removeItem("clientflow_token");
  localStorage.removeItem("clientflow_user");
}

function setUser(user: object): void {
  localStorage.setItem("clientflow_user", JSON.stringify(user));
}

function getStoredUser(): Record<string, unknown> | null {
  const u = localStorage.getItem("clientflow_user");
  return u ? JSON.parse(u) : null;
}

export class ApiError extends Error {
  status: number;
  data: Record<string, unknown>;
  constructor(message: string, status: number, data: Record<string, unknown> = {}) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  isFormData = false
): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!isFormData) headers["Content-Type"] = "application/json";

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (res.status === 401 && token && !path.startsWith("/auth/")) {
    clearToken();
    window.location.reload();
    return data as T;
  }

  if (!res.ok) {
    throw new ApiError(data.error || `Request failed with status ${res.status}`, res.status, data);
  }
  return data as T;
}

const get = <T>(path: string) => request<T>("GET", path);
const post = <T>(path: string, body?: unknown) => request<T>("POST", path, body);
const put = <T>(path: string, body?: unknown) => request<T>("PUT", path, body);
const del = <T>(path: string) => request<T>("DELETE", path);
const postForm = <T>(path: string, form: FormData) => request<T>("POST", path, form, true);

export type UserRole = "investor" | "tenant" | "admin" | "verdafarms";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface RegisterResponse {
  message: string;
  email: string;
  devCode?: string;
}

export interface VerifyResponse {
  message: string;
  devCode?: string;
}

export const auth = {
  login: (email: string, password: string) =>
    post<AuthResponse>("/auth/login", { email, password }),

  register: (data: { name: string; email: string; password: string; role?: string; phone?: string }) =>
    post<RegisterResponse>("/auth/register", data),

  verifyEmail: (email: string, code: string) =>
    post<AuthResponse>("/auth/verify-email", { email, code }),

  resendVerification: (email: string) =>
    post<VerifyResponse>("/auth/resend-verification", { email }),

  forgotPassword: (email: string) =>
    post<{ message: string; devCode?: string; name?: string }>("/auth/forgot-password", { email }),

  verifyResetCode: (email: string, code: string) =>
    post<{ valid: boolean }>("/auth/verify-reset-code", { email, code }),

  resetPassword: (email: string, code: string, newPassword: string) =>
    post<{ message: string }>("/auth/reset-password", { email, code, newPassword }),

  me: () => get<AuthUser>("/auth/me"),

  storeSession: (data: AuthResponse) => {
    setToken(data.token);
    setUser(data.user);
  },

  clearSession: () => clearToken(),
  getStoredUser,
  getToken,
  isAuthenticated: () => !!getToken(),
};

// ─── Properties ──────────────────────────────────────────────────────────────

export const properties = {
  list: (params?: { search?: string; status?: string; type?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return get<unknown[]>(`/properties${q ? "?" + q : ""}`);
  },
  get: (id: number | string) => get<unknown>(`/properties/${id}`),
  create: (data: unknown) => post<unknown>("/properties", data),
  update: (id: number | string, data: unknown) => put<unknown>(`/properties/${id}`, data),
  delete: (id: number | string) => del<unknown>(`/properties/${id}`),
  listUnits: (id: number | string) => get<unknown[]>(`/properties/${id}/units`),
  createUnit: (id: number | string, data: unknown) => post<unknown>(`/properties/${id}/units`, data),
  updateUnit: (propId: number | string, unitId: number | string, data: unknown) =>
    put<unknown>(`/properties/${propId}/units/${unitId}`, data),
  deleteUnit: (propId: number | string, unitId: number | string) =>
    del<unknown>(`/properties/${propId}/units/${unitId}`),
};

// ─── Transactions ─────────────────────────────────────────────────────────────

export const transactions = {
  list: (params?: { type?: string; status?: string; limit?: number; offset?: number }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return get<{ transactions: unknown[]; total: number }>(`/transactions${q ? "?" + q : ""}`);
  },
  financials: () => get<unknown[]>("/transactions/financials"),
  get: (id: number | string) => get<unknown>(`/transactions/${id}`),
  create: (data: unknown) => post<unknown>("/transactions", data),
  transfer: (data: { amount: number; recipient_name: string; note?: string }) =>
    post<unknown>("/transactions/transfer", data),
  update: (id: number | string, data: unknown) => put<unknown>(`/transactions/${id}`, data),
};

// ─── Maintenance ──────────────────────────────────────────────────────────────

export const maintenance = {
  list: (params?: { status?: string; priority?: string; search?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return get<unknown[]>(`/maintenance${q ? "?" + q : ""}`);
  },
  get: (id: number | string) => get<unknown>(`/maintenance/${id}`),
  create: (data: unknown) => post<unknown>("/maintenance", data),
  update: (id: number | string, data: unknown) => put<unknown>(`/maintenance/${id}`, data),
  delete: (id: number | string) => del<unknown>(`/maintenance/${id}`),
};

// ─── Messages ─────────────────────────────────────────────────────────────────

export const messages = {
  list: () => get<unknown[]>("/messages"),
  conversations: () => get<unknown[]>("/messages/conversations"),
  thread: (userId: number | string) => get<unknown[]>(`/messages/thread/${userId}`),
  send: (data: { recipient_id: number; content: string; subject?: string }) =>
    post<unknown>("/messages", data),
  markRead: (id: number | string) => put<unknown>(`/messages/${id}/read`, {}),
  markAllRead: () => put<unknown>("/messages/read-all", {}),
  delete: (id: number | string) => del<unknown>(`/messages/${id}`),
};

// ─── Documents ────────────────────────────────────────────────────────────────

export const documents = {
  list: (params?: { category?: string; type?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return get<unknown[]>(`/documents${q ? "?" + q : ""}`);
  },
  upload: (file: File, metadata: { name?: string; category?: string }) => {
    const form = new FormData();
    form.append("file", file);
    if (metadata.name) form.append("name", metadata.name);
    if (metadata.category) form.append("category", metadata.category);
    return postForm<unknown>("/documents/upload", form);
  },
  create: (data: unknown) => post<unknown>("/documents", data),
  download: async (id: number | string, filename?: string) => {
    const token = getToken();
    const res = await fetch(`${BASE_URL}/documents/${id}/download`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error("Download failed");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || `document-${id}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },
  delete: (id: number | string) => del<unknown>(`/documents/${id}`),
};

// ─── Investors ────────────────────────────────────────────────────────────────

export const investors = {
  list: (params?: { search?: string; status?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return get<unknown[]>(`/investors${q ? "?" + q : ""}`);
  },
  me: () => get<unknown>("/investors/me"),
  portfolio: () => get<unknown[]>("/investors/me/portfolio"),
  get: (id: number | string) => get<unknown>(`/investors/${id}`),
  create: (data: unknown) => post<unknown>("/investors", data),
  update: (id: number | string, data: unknown) => put<unknown>(`/investors/${id}`, data),
  assignProperty: (id: number | string, data: { property_id: number; investment_amount?: number }) =>
    post<unknown>(`/investors/${id}/assign-property`, data),
};

// ─── Tenants ──────────────────────────────────────────────────────────────────

export const tenants = {
  list: (params?: { search?: string; status?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return get<unknown[]>(`/tenants${q ? "?" + q : ""}`);
  },
  me: () => get<unknown>("/tenants/me"),
  get: (id: number | string) => get<unknown>(`/tenants/${id}`),
  create: (data: unknown) => post<unknown>("/tenants", data),
  update: (id: number | string, data: unknown) => put<unknown>(`/tenants/${id}`, data),
  submitQuestionnaire: (responses: unknown) =>
    post<unknown>("/tenants/me/questionnaire", { responses }),
  payRent: () => post<unknown>("/tenants/me/pay-rent", {}),
};

// ─── Verda Farms ─────────────────────────────────────────────────────────────

export const verdafarms = {
  dashboard: () => get<unknown>("/verdafarms/dashboard"),
  plots: () => get<unknown[]>("/verdafarms/plots"),
  getPlot: (id: number | string) => get<unknown>(`/verdafarms/plots/${id}`),
  createPlot: (data: unknown) => post<unknown>("/verdafarms/plots", data),
  updatePlot: (id: number | string, data: unknown) => put<unknown>(`/verdafarms/plots/${id}`, data),
  reports: () => get<unknown[]>("/verdafarms/reports"),
  documents: () => get<unknown[]>("/verdafarms/documents"),
  crops: () => get<unknown[]>("/verdafarms/crops"),
  yieldData: () => get<unknown[]>("/verdafarms/yield-data"),
  submitFeedback: (data: { subject?: string; message: string; rating?: number }) =>
    post<unknown>("/verdafarms/feedback", data),
};

// ─── Admin ────────────────────────────────────────────────────────────────────

export const admin = {
  stats: () => get<unknown>("/admin/stats"),
  users: (params?: { role?: string; search?: string; status?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return get<unknown[]>(`/admin/users${q ? "?" + q : ""}`);
  },
  updateUserStatus: (id: number | string, status: string) =>
    put<unknown>(`/admin/users/${id}/status`, { status }),
  activity: () => get<unknown[]>("/admin/activity"),
};

// ─── Settings ─────────────────────────────────────────────────────────────────

export const settings = {
  get: () => get<unknown>("/settings"),
  updateProfile: (data: { name: string; phone?: string; avatar?: string }) =>
    put<unknown>("/settings/profile", data),
  updatePassword: (data: { current_password: string; new_password: string }) =>
    put<unknown>("/settings/password", data),
  updateNotifications: (data: unknown) =>
    put<unknown>("/settings/notifications", data),
};

export default { auth, properties, transactions, maintenance, messages, documents, investors, tenants, verdafarms, admin, settings };
