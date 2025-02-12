import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';

@Injectable()
@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async seedAdminUser(): Promise<void> {
    const adminExists = await this.adminRepository.findOne({ where: { email: 'admin@netflix.com' } });

    if (!adminExists) {
      const admin = new Admin();
      admin.email = 'admin@netflix.com';
      admin.password = 'admin123';
      await admin.hashPassword(); // Hash the password
      await this.adminRepository.save(admin);
      console.log('Admin user seeded successfully');
    } else {
      console.log('Admin user already exists. No seeding required.');
    }
  }
}

