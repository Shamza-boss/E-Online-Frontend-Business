import { UserRole } from '../../Enums/UserRole';
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    institutionId: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      firstName: string;
      lastName: string;
      role: UserRole;
      institutionId: string;
    };
    accessToken: string;
  }
}
