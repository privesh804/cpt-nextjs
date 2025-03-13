interface GANTT_RESPONSE {
  message: string;
  data: GANTT_DATA[];
}

interface GANTT_DATA {
  id: string;
  name: string;
  start: string;
  end: string;
  progress: number;
  dependencies: any[];
  isDisabled: boolean;
  styles: GANTT_DATA_STYLES;
}

interface GANTT_DATA_STYLES {
  progressColor: string;
  progressSelectedColor: string;
  backgroundColor: string;
}
