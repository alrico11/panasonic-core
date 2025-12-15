export class CreateCustomerDto {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
}
