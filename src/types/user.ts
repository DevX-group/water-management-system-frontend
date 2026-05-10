export interface Customer {
  id:               string;
  name:             string;
  nic:              string;
  subscriptionNo:   string;
  address:          string;
  phone:            string;
  email?:           string;
  region:           string;
  connectionType:   string;
  registeredDate:   string;
  status:           string;
  isDeleted?:       boolean;
}

export interface CustomerFormData {
  name:               string;
  nic:                string;
  address:            string;
  phone:              string;
  email:              string;
  region:             string;
  connectionType:     string;
  subscriptionNumber: string;
}

export type SortOrder = 'asc' | 'desc';
