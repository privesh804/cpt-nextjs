type TeamMember = {
  id: string;
  reg: string;
  name: string;
  designation: string;
  email: string;
  contact: string;
  status: boolean;
  role: "user" | "admin";
};

type TeamMemberData = {
  data: TeamMember[];
};
