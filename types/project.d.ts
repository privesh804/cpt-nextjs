interface ProjectSectionItem {
  id: string;
  order_id: number;
  project_id: string;
  section_id: string;
  section_name: string;
  subsection_name: string;
  item_no: string | null;
  description: string;
  quantity: number | null;
  unit: string | null;
  rate_xcd: number | null;
  amount_xcd: number | null;
  time_related_charges_xcd: string | null;
  fixed_charges_xcd: string | null;
  rate_per_hour_xcd: number | null;
  rate_per_day_xcd: number | null;
  header_type: number;
  created_at: string;
  updated_at: string | null;
}

type ProjectsType = {
  id: string;
  title: string;
  address: string;
  total_budget: number;
  employees: number;
  status: string;
};

type projectUpdateDetails = {
  title: string;
  address: string;
  nature: string;
  employer: string;
  project_name: string;
};
interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}
interface ProjectSection {
  current_page: number;
  data: ProjectSectionItem[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}
interface ProjectPagination {
  page?: number; // Current Page
  size?: number; // Page Size
  searchQuery: string; // Info
}

type ProjectDataResponse = {
  data: {
    project: PaginationResponse & {
      data: ProjectsType[];
    };
  };
};

type ProjectSectionDataResponse = {
  data: {
    project_section_detail: PaginationResponse & {
      data: ProjectSectionItem[];
    };
  };
};

type ProjectSectionResponse = {
  data: {
    project_section: PaginationResponse & {
      data: ProjectSectionItem[];
    };
  };
};
