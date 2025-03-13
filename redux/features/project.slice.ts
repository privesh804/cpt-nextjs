import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProjectState {
  projectId: string | null;
}

export interface RootState {
  project: ProjectState;
}

const initialState: ProjectState = {
  projectId: null,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProjectId: (state, action: PayloadAction<string | null>) => {
      state.projectId = action.payload;
    },
  },
});

export const { setProjectId } = projectSlice.actions;
export default projectSlice.reducer;
