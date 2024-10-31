declare type ListOptionProps = {
  id: number | string;
  name: string;
  color?: string;
};

declare type OptionProps = {
  id: number;
  name?: string;
  reason?: string;
  active?: string;
  created_at?: string;
};

declare type DropdownProps = {
  cn: string;
  value: string | null;
  options: OptionProps[];
  setValue: React.Dispatch<React.SetStateAction<string | null>>;
};

declare type ModalProps = {
  id?: string;
  open: boolean;
  width?: string;
  children?: React.ReactNode;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

declare type NewServiceModalProps = {
  type?: string;
  open: boolean;
  width?: string;
  children?: React.ReactNode;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

declare type BookingListProps = {
  id: number;
  service_name: string;
  category_code: string;
  address: string;
  team_members: string[];
  color: string;
};

declare type CustomInputProps = {
  type?: string;
  placeholder: string;
  value?: string | number | null;
  setter?: React.Dispatch<React.SetStateAction>;
  className?: string;
  label: string;
  register?: UseFormRegister<FormDataProps>;
  name?: string,
  disabled?: boolean
};

declare type FormDataProps = {
  username: string;
  password: string;
};

declare type BookingProps = {
  booking_id: string;
  schedule_date: string;
  schedule_slot: string;
  customer: string;
  phone: string;
  relationship: string;
  location: string;
  partner: string;
  source: string;
  channel: string;
  map_link: string | null;
  total: string;
  payment_status: string;
  created_by: string | null;
  created_at: string;
  booking_status: {
    name: string;
    color: string;
  };
  categories: {
    code: string;
    color: string;
  }[];
  consultation_team: {
    name: string;
    phone: string;
    position: string;
    is_lead: string;
    status_id: string;
    consultation_team_id: string;
    booking_id: string;
    user_id: string;
    is_accepted: string;
    accepted_at: string;
    started_at: string;
    arrived_at: string;
    consulted_at: string | null;
    completed_at: string | null;
    rejected_at: string | null;
    reject_reason: string;
    created_at: string;
    last_updated: string;
  }[];
};

declare type UserProps = {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  phone: string;
  email: string;
  department: string;
  position: string;
  work_place: string;
  avatar: string | null;
  token: string;
};

declare type GlobalStateProps = {
  user: UserProps | null;
  sidebar: boolean;
  date: Date;
};

declare type ServiceProps = {
  service_id: string;
  code?: string;
  thumbnail?: string;
  service_name: string;
  parent_id?: string;
  category_name?: string;
  category_code?: string;
  duration?: string;
  response_time?: string;
  description?: string;
  cost_price?: string;
  price_with_vat?: string;
  price_without_vat?: string;
  vat_value?: string;
  supplier?: string | null;
  providor?: string;
  sort_order?: string;
  active?: string;
  qty?: number;
  discount: string;
  discount_value: string;
  discount_type: string;
  total: string;
  new_price: string
};

declare type BookingDetailProps = {
  booking_id: string;
  invoice_no: string;
  address_id: string;
  family_member_id: string;
  family_member_details: {
    family_member_id: string;
    customer_id: string;
    mrn: string;
    relationship: string;
    firstname: string;
    lastname: string;
    date_of_birth: string;
    gender: string;
    is_allergy: string;
    allergy_description: string;
    is_medications: string;
    medications_description: string;
    is_medical_condition: string;
    medical_condition_description: string;
    active: string;
    user_id: string;
    created_at: string;
    last_updated: string;
  };
  booking_source_id: string;
  booking_source: string;
  partner_id: string;
  partner: string;
  branch_id: string;
  branch: string;
  schedule_date: string;
  schedule_slot: string;
  delivery_notes: string;
  payment_method: string;
  payment_method_code: string;
  payment_status: string;
  sub_total: string;
  discount_value: string;
  vat_value: string;
  total: string;
  status_id: string;
  status: string;
  customer: {
    id: string;
    firstname: string;
    lastname: string;
    phone: string;
    email: string;
    date_of_birth: string;
    gender: string;
    nationality: string;
    is_allergy: string;
    allergy_description: string;
    is_medication: string;
    medication_description: string;
    is_medical_conition: string;
    medical_condition_description: string;
    customer_source_id: string;
    special_notes: string;
    attachments: {
      attachment_id: string;
      customer_id: string;
      file_name: string;
      file_type: string;
      user_id: string;
      created_at: string;
      last_updated: string;
      user: string;
    }[];
  };
  address: {
    address_type: string | null;
    apartment: string | null;
    building: string | null;
    street: string | null;
    map_link: string | null;
    extra_direction: string | null;
    emirate: string | null;
    area: string | null;
  };
  booking_times: {
    created_at: string;
    assigned_at: string | null;
    consulted_at: string | null;
    completed_at: string | null;
    cancelled_at: string | null;
  };
  services: {
    booking_details_id: string;
    service_id: string;
    service_name: string;
    quantity: string;
    price: string;
    new_price: string;
    discount_type: string;
    discount_value: string;
    discount: string;
    total: string;
  }[];
  team: {
    name: string;
    phone: string;
    position: string;
    is_lead: string;
    status_id: string;
    consultation_team_id: string;
    booking_id: string;
    user_id: string;
    is_accepted: string;
    accepted_at: string;
    started_at: string;
    arrived_at: string;
    consulted_at: string | null;
    completed_at: string | null;
    rejected_at: string | null;
    reject_reason: string;
    created_at: string;
    last_updated: string;
  }[];
  logs: {
    booking_log_id: string;
    status: string;
    name: string | null;
    comments: string;
    created_at: string;
  }[];
  booking_attachments: {
    attachment_id: string;
    booking_id: string;
    file_name: string;
    file_type: string;
    user_id: string;
    created_at: string;
    last_updated: string;
    user: string;
  }[];
  attachments: {
    attachment_id: string;
    booking_id: string;
    file_name: string;
    file_type: string;
    user_id: string;
    created_at: string;
    last_updated: string;
    user: string;
  }[];
  base_url: string;
};

declare type CustomerProps = {
  customer_id: string;
  mrn?: string;
  branch_id: string;
  customer_source_id?: string;
  partner_id: string;
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  image?: string | null;
  password?: string;
  date_of_birth: string;
  gender: string;
  nationality_id?: string;
  is_allergy: string;
  allergy_description: string;
  is_medication: string;
  medication_description: string;
  is_medical_conition: string;
  medical_condition_description: string;
  special_notes: string;
  last_otp?: string;
  last_otp_expiry?: string;
  active: string;
  ip?: string;
  user_id?: string;
  created_at?: string;
  last_updated?: string;
  nationality: string;
};

declare type AddressProps = {
  address_id: string;
  customer_id: string;
  address_type: string;
  area_id: string;
  apartment: string;
  building_no: string;
  street: string;
  map_link: string;
  extra_direction: string;
  lat: string;
  lng: string;
  is_default: string;
  active: string;
  user_id: string;
  created_at: string;
  last_updated: string;
  area: string | null;
  emirate: string | null;
};

declare type FamilyProps = {
  family_member_id: number;
  mrn: number;
  relationship: string;
  firstname: string;
  lastname: string;
  date_of_birth: string;
  gender: string;
  is_allergy: string;
  allergy_description: string | null;
};

declare type AttachmentProps = {
  attachment_id: string;
  customer_id: string;
  file_name: string;
  file_type: string;
  user_id: string;
  created_at: string;
  last_updated: string;
  user: string;
};

declare type SelectedServiceProps = {
  service_id: string;
  qty: number;
  price: string;
};

declare type CategoryListProps = {
  category_id: string;
  category_name: string;
};

declare type ServiceDetailProps = {
  id: string;
  category_id: string;
  company_id: string;
  code: string;
  name: string;
  size: string;
  duration: string;
  response_time: string;
  price_without_vat: string;
  vat_value: string;
  price_with_vat: string;
  color_code: string;
  description: string;
  thumbnail: string;
  cover_image: string | null;
  sort_order: string;
  is_website: string;
  is_app: string;
  rating: string;
  total_reviews: string;
  active: string;
  user_id: string;
  created_at: string;
  last_updated: string;
  parent_id: string;
};

declare type CategoryAllListProps = {
  category_id: string;
  parent_id: string;
  code: string;
  color: string;
  company_name: string;
  business: string;
  category_name: string;
  sub_category: string;
  description: string;
  thumbnail: string;
  cover_image: string;
  sort_order: string;
  active: string;
};

declare type CategoryDetailProps = {
  category_id: string;
  company_id: string;
  business_id: string;
  parent_id: string;
  code: string;
  color: string;
  category_name: string;
  tagline: string;
  duration: string;
  icon: null;
  thumbnail: string;
  cover_image: string;
  description: string;
  sort_order: string;
  active: string;
  user_id: string;
  created_at: string;
  last_updated: string;
  uuid: string;
  secret_key: string;
  area_id: string;
  name: string;
  industry: string;
  registration_number: string;
  phone: string;
  email: string;
  working_hours: string;
  address: string;
  lat: string;
  lng: string;
  logo: string;
  company: string;
};

declare type CompanyListProps = {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  total_branches: string;
  business: string;
  active: string;
  created_at: string;
};

declare type CompanyDetailProps = {
  company_id: string;
  code: string;
  name: string;
  license: string;
  industry: string;
  phone: string;
  email: string;
  working_hours: string;
  area_id: string;
  address: string;
};

declare type BusinessListProps = {
  id: string;
  code: string;
  name: string;
  description: string;
  active: string;
};

declare type BusinessDetailProps = {
  id: string;
  code: string;
  name: string;
  description: string;
  active: string;
};

declare type EmployeeProps = {
  user_id: number;
  staff_id: number;
  full_name: string;
  position: string;
  username: string;
  phone: string;
  email: string;
  image: string | null;
  active: number;
};

declare type UsersByRolesProps = {
  doctors: EmployeeProps[];
  nurses: EmployeeProps[];
  drivers: EmployeeProps[];
};

declare type AreaProps = {
  area_id: string;
  name: string;
  lat: string;
  lng: string;
};

declare type CategoryProps = {
  category_id: string;
  parent_id: string;
  code: string;
  color: string;
  company_name: string;
  business: string;
  category_name: string;
  sub_category: string;
  description: string;
  thumbnail: string | null;
  cover_image: string;
  sort_order: string;
  active: string;
};

declare type SourceProps = {
  source_id: string;
  source: string;
};

declare type ChannelProps = {
  channel_id: string;
  channel: string;
};

declare type ProviderProps = {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  total_branches: string;
  business: string | null;
  active: string;
  created_at: string;
};

declare type BranchProps = {
  branch_id: string;
  name: string;
  company_id: string;
  company: string;
};

declare type StatusProps = {
  status_id: string;
  name: string;
  color: string;
};

declare type DiscountType = {
  type: string;
  value: number;
  total?: number;
  newPrice?: number
};

declare type HistoryType={
booking_id: string;
booking_status: string;
created_at: string;
created_by: string;
customer: string;
family_member_id: string;
schedule_date: string;
schedule_slot: string;
source: string;
total: string;
}