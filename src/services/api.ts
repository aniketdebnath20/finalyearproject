import type {
  AcademicResult,
  Certificate,
  Course,
  Department,
  Exam,
  NotificationItem,
  Staff,
  StaffAttendanceRecord,
  Student,
  StudentAttendanceRecord,
  StudentFeeRecord,
  Subject,
  User
} from '../types';

const API_ROOT = '/api';
const TOKEN_KEY = 'portal_auth_token';

export const createClientId = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;
export const createCertificateId = () => `CERT-APEX-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

export interface PortalData {
  departments: Department[];
  courses: Course[];
  subjects: Subject[];
  students: Student[];
  staff: Staff[];
  studentAttendance: StudentAttendanceRecord[];
  staffAttendance: StaffAttendanceRecord[];
  fees: StudentFeeRecord[];
  results: AcademicResult[];
  exams: Exam[];
  certificates: Certificate[];
  notifications: NotificationItem[];
}

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);
export const setAuthToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearAuthToken = () => localStorage.removeItem(TOKEN_KEY);

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body) headers.set('Content-Type', 'application/json');
  const token = getAuthToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`${API_ROOT}${path}`, { ...options, headers });
  } catch {
    throw new Error('Unable to reach the API. Start the backend and check its MongoDB connection.');
  }

  const body = await response.json().catch(() => null) as { message?: string } | T | null;
  if (!response.ok) {
    const message = body && typeof body === 'object' && 'message' in body ? body.message : undefined;
    throw new Error(message || `API request failed (${response.status}).`);
  }
  return body as T;
}

export async function fetchPortalData(): Promise<PortalData> {
  return apiRequest<PortalData>('/data');
}

export async function authenticate(credentials: {
  role: User['role'];
  name?: string;
  rollNumber?: string;
  identifier?: string;
  password?: string;
}): Promise<{ user: User; token: string }> {
  return apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
}
