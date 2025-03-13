import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  reg: string;
  designation: string;
  contact: string;
  status: boolean;
}

interface Role {
  id: string;
  name: string;
}

const initialState: {
  members: TeamMember[];
  selectedMember?: TeamMember;
  loading: boolean;
  roles: Role[];
} = {
  members: [],
  selectedMember: undefined,
  loading: false,
  roles: [],
};

export const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    addMembers: (state, action: PayloadAction<TeamMember[]>) => {
      state.members = action.payload;
      state.loading = false;
    },
    addNewMember: (state, action: PayloadAction<TeamMember>) => {
      state.members = [...state.members, action.payload];
      state.loading = false;
    },
    updateMember: (state, action: PayloadAction<TeamMember>) => {
      const index = state.members.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.members = state.members.map((member) =>
          member.id === action.payload.id ? action.payload : member
        );
      }
      state.loading = false;
    },
    removeMember: (state, action: PayloadAction<string>) => {
      state.members = state.members.filter(
        (item) => item.id !== action.payload
      );
      state.loading = false;
    },
    setSelectedMember: (state, action: PayloadAction<string>) => {
      state.selectedMember = state.members.find(
        (item) => item.id === action.payload
      );
      state.loading = false;
    },
    setMemberLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setRoles: (state, action: PayloadAction<Role[]>) => {
      state.roles = action.payload; // This is correctly typed as Role[].
    },
  },
});

export const {
  addMembers,
  addNewMember,
  updateMember,
  removeMember,
  setSelectedMember,
  setMemberLoading,
  setRoles,
} = membersSlice.actions;
export default membersSlice.reducer;
