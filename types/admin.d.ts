type Admin = {
  id: string;
  name: string;
  email: string;
  status: boolean;
  role: "user" | "admin";
  contact: number;
};

type AdminData = {
  data: Admin[];
};
