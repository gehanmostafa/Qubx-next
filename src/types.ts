
export type TLoginData = {
  identifier: string;
  password: string;
};
export interface ICountry {
  id: number;
  country_name: string;
  country_code: string;
  phone_code: string;
};

export interface User {
  id: number;
  branch: string;
  last_login: string | null;
  is_superuser: boolean;
  created_at: string;
  fullname: string;
  mobile: string;
  email: string;
  is_staff: boolean;
  is_active: boolean;
  groups: number[];
  user_permissions: number[];
}