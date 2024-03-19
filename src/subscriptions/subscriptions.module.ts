import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionEntity } from './entities/subscription.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { SubjectsModule } from 'src/subjects/subjects.module';
import { CodeService } from './code.service';
import { CodeEntity } from './entities/code.entity';
import { PlanModule } from 'src/plan/plan.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionEntity, CodeEntity]),
    UsersModule,
    SubjectsModule,
    PlanModule,
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, CodeService],
})
export class SubscriptionsModule {}
