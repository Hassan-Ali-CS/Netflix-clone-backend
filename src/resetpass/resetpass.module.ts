import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetpassService } from './resetpass.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, TypeOrmModule],
  providers: [ResetpassService],
  exports: [ResetpassService],
})
export class ResetpassModule {}
