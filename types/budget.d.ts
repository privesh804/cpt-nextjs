// type Task = {
//   id: string;
//   name: string;
// };

type ExpenseTrackData = {
  days: number;
  budget: string;
};

type ExpenseData = {
  task: Task;
  total_rate: number;
  spent_budget?: number;
  task_id: string;
};

type BudgetDataResponse = {
  message: string;
  data: {
    taskLogs: PaginationResponse & {
      data: ExpenseData[];
    };
  };
};
