import type { DefaultUser } from 'next-auth';

declare module 'next-auth' {
 interface User { 
   id: string
   name: string
   email: string
 }

 interface Session { 
   user: User
 }
}