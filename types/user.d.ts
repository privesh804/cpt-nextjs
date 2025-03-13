interface Role {
  roles: string[];
}

interface AuthModel {
  token: string;
  access_token: string;
  api_token: string;
  user: User; // Add user to the AuthModel
}

interface User {
  roles: any;
  user: any;
  id: number;
  name: string;
  email: string;
  roleId: number;
  role: string;
  contact: string;
  status: "ACTIVE" | "INACTIVE";
  designation?: string;
  token?: string;
  password: string;
  userData: any;
  selectedUser: any;
  access_token: string;
  totalItems: number;
  total: any;
}

type TemaDataResponse = {
  users: PaginationResponse & {
    data: User[];
  };
};
