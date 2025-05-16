export interface Cat {
  id: number;
  name: string;
  years_of_experience: number;
  breed: string;
  salary: number;
  mission_id?: number | null;
}

export type CatCreatePayload = Omit<Cat, 'id' | 'mission_id'>;

export interface CatUpdatePayload {
  salary?: number;
}

export interface ApiErrorResponse {
  detail?: string | { msg: string; type: string }[];
} 