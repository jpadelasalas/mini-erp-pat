export type User = { id: string; username: string };

export type InventoryItem = {
  itemNum: string;
  name: string;
  description: string;
  category: string;
  quantity: number | string;
  price: number | string;
  date_created?: string;
  updated_at?: string;
};

export type Sale = {
  salesNum: string;
  itemNum: string;
  quantity_sold: number | string;
  total_price: number | string;
  sold_at: string;
  customer_name: string;
};

export type Employee = {
  employeeId: string;
  last_name: string;
  first_name: string;
  position: string;
  email: string;
  status: string;
  joined_at: string;
};

export type DocNo = { docnum: number; prefix: string; length: number };

export type FormErrors<T> = Partial<Record<keyof T, string>>;
