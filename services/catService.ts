import axios from 'axios';
import { Cat, CatCreatePayload, CatUpdatePayload } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const catApiClient = axios.create({
  baseURL: `${API_BASE_URL}/cats`,
});

export const getAllCats = async (): Promise<Cat[]> => {
  const response = await catApiClient.get<Cat[]>('/');
  return response.data;
};

export const getCatById = async (id: number): Promise<Cat> => {
  const response = await catApiClient.get<Cat>(`/${id}`);
  return response.data;
};

export const createCat = async (catData: CatCreatePayload): Promise<Cat> => {
  const response = await catApiClient.post<Cat>('/', catData);
  return response.data;
};

export const updateCatSalary = async (id: number, salaryUpdate: CatUpdatePayload): Promise<Cat> => {
  // Backend expects { salary: new_salary_value }
  const response = await catApiClient.patch<Cat>(`/${id}/salary`, salaryUpdate);
  return response.data;
};

export const deleteCat = async (id: number): Promise<void> => {
  await catApiClient.delete(`/${id}`);
}; 