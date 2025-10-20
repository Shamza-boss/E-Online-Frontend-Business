'use server';

import { UserDto } from '../interfaces/types';
import { serverFetch } from '../serverFetch';

export async function createUser(user: UserDto) {
  return serverFetch<UserDto[]>(`/users`, {
    method: 'POST',
    body: user,
  });
}

export async function deleteUser(userId: string) {
  return serverFetch<void>(`/users/${userId}`, {
    method: 'DELETE',
  });
}

export async function getAllStudents() {
  return serverFetch<UserDto[]>(`/users/students`);
}

export async function getAllUsers() {
  return serverFetch<UserDto[]>(`/users`);
}

export async function updateUser(user: UserDto) {
  return serverFetch(`/users/${user.userId}`, {
    method: 'PUT',
    body: user,
  });
}
