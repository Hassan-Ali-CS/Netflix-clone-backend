import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/user/roles.enum'; // Adjust the import path to your roles.enum.ts file

// This decorator will set the roles metadata for the route handler
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
