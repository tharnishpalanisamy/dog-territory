export interface UserLocation {
  state: string | null;
  district: string | null;
  area_name: string | null;
  pincode: string | null;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: "USER" | "VOLUNTEER" | "VETERINARIAN" | "ADMIN";
  location: UserLocation | null;
  phone_number?: string | null;
  created_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

export interface TokenResponse {
  access_token: string;
}
