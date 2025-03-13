type PaginationResponse = {
  current_page: 1;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: null | string;
    label: string;
    active: boolean;
  }[];
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: null | string;
  to: number;
  total: number;
};
