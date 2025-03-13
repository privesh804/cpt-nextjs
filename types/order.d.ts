type Order = {
  id: string;
  external_id: string;
  reference_id: string;
  delivery_group_id: string;
  pickup_depot_id: string;
  order_status: OrderStatus;
  customer_name: string;
  email: string | null;
  mobile: string | null;
  notes: string | null;
  address: string;
  address2: string | null;
  entry_code: string | null;
  city: string;
  zip: string;
  country_code: string | null;
};
