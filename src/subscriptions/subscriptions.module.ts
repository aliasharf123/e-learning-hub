import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionEntity } from './entities/subscription.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { SubjectsModule } from 'src/subjects/subjects.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionEntity]),
    UsersModule,
    SubjectsModule,
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
})
export class SubscriptionsModule {}
