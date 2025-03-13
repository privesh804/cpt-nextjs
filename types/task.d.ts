interface Task {
  budget_allocated: string;
  created_at: string;
  created_by: string;
  deleted_at: null;
  end_date: string;
  id: string;
  logs: TaskLogs[];
  name: string;
  progress: number;
  project_id: string;
  project_section_id?: null | string;
  project_section_item_id: null | string;
  start_date: string;
  status: string;
  updated_at: string;
  user: TaskUser;
}

interface CreateTaskData {
  projectId: string;
  taskData: Task;
}

interface TaskLogs {
  task_id: string;
  no_worker: number;
  rate: string;
  total_rate: string;
  rate_type: string;
  allow_hours: string;
  total_hours: string;
  status: string;
  reason: null;
}

interface TaskListLogs {
  id: string;
  project_id: string;
  task_id: string;
  no_worker: number;
  rate: string;
  total_rate: string;
  rate_type: string;
  allow_hours: number;
  total_hours: number;
  status: string;
  reason: null | string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  deleted_at: null | null;
  shift_start: string;
  shift_end: string;
}

interface TaskUser {
  id: string;
  name: string;
  email: string;
}

interface TaskLogHistory {
  id: string;
  project_id: string;
  task_id: string;
  task_log_id: string;
  data: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
  created_user: {
    id: string;
    name: string;
    email: string;
  };
}

type TaskManagementDataResponse = {
  message: string;
  data: {
    task: PaginationResponse & {
      data: Task[];
    };
  };
};
type KeywordType = {
  id: string;
  keyword: string;
};

type TaskKeywordDataResponse = {
  message: string;
  data: {
    keywords: PaginationResponse & {
      data: Task[];
    };
  };
};

type PaginationParams = {
  pageIndex: number;
  pageSize: number;
  searchQuery: string;
};

type PaginationParamsWithProjectId = {
  projectId: string;
  pageIndex: number;
  pageSize: number;
  searchQuery: string;

  
};
 type IdParams  = PaginationParamsWithProjectId & {
  taskId: string;
  logId: string
 }