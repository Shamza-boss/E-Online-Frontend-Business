'use server';
import { InstitutionDto, InstitutionWithAdminDto } from '../interfaces/types';
import { serverFetch } from '../serverFetch';

export async function getAllInstitutions(): Promise<InstitutionDto[]> {
  return serverFetch<InstitutionDto[]>('/Institution', {
    method: 'GET',
  });
}

export async function getInstitutionById(
  id: string
): Promise<InstitutionDto | null> {
  return serverFetch(`/Institution/${id}`, {
    method: 'GET',
  });
}

export async function deleteInstitution(id: string): Promise<void> {
  return serverFetch(`/Institution/${id}`, {
    method: 'DELETE',
  });
}

export async function deactivateInstitution(id: string): Promise<void> {
  return serverFetch(`/Institution/${id}/deactivate`, {
    method: 'PATCH',
  });
}

export async function activateInstitution(id: string): Promise<void> {
  return serverFetch(`/Institution/${id}/activate`, {
    method: 'PATCH',
  });
}

export async function createInstitution(institution: InstitutionWithAdminDto) {
  return serverFetch('/Institution/full', {
    method: 'POST',
    body: JSON.stringify(institution),
  });
}
