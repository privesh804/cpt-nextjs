type Tenant = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  data: string | null;
  email: string;
  password: string;
  deleted_at: string | null;
  tenancy_db_name: string;
  domains: Domain[];
};

type Domain = {
  id: string;
  domain: string;
  tenant_id: string;
  created_at: string;
  updated_at: string;
};

type TenantDataResponse = {
  tenants: PaginationResponse & {
    data: Tenant[];
  };
};
