'use server';

import { UserDto } from '../interfaces/types';
import { serverFetch } from '../serverFetch';

export async function createUser(user: UserDto) {
  return serverFetch<UserDto[]>(`/user`, {
    method: 'POST',
    body: user,
  });
}

export async function deleteUser(userId: string) {
  return serverFetch<void>(`/user/${userId}`, {
    method: 'DELETE',
  });
}

export async function getAllStudents() {
  return serverFetch<UserDto[]>(`/user/students`);
}

export async function getAllUsers() {
  return serverFetch<UserDto[]>(`/user`);
}

export async function updateUser(user: UserDto) {
  return serverFetch(`/user/${user.userId}`, {
    method: 'PUT',
    body: user,
  });
}
