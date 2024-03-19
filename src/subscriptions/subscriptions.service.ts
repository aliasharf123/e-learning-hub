import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionEntity } from './entities/subscription.entity';
import { UsersService } from 'src/users/users.service';
import { CodeService } from './code.service';
import { PlanService } from 'src/plan/plan.service';
import { ActivateSubscriptionDto } from './dto/activate-subscription.dto';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { DeactivateSubscriptionDto } from './dto/dectivate-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private subscriptionRepository: Repository<SubscriptionEntity>,
    private readonly usersService: UsersService,
    private readonly planService: PlanService,
    private readonly codeService: CodeService,
  ) {}

  async generateCode(planID: number) {
    const plan = await this.planService.findOne(planID);

    return this.codeService.create(plan);
  }

  async activate(
    activateSubscriptionDto: ActivateSubscriptionDto,
    planID: number,
  ) {
    const user = await this.usersService.findOne({
      id: activateSubscriptionDto.userID,
    });
    if (!user) {
      throw new ConflictException('User not found');
    }
    const plan = await this.codeService.activate(
      activateSubscriptionDto.key,
      planID,
    );

    return this.subscriptionRepository.save({
      student: user as UserEntity,
      plan,
    });
  }
  async deactivate(deactivateSubscriptionDto: DeactivateSubscriptionDto) {
    return this.codeService.deactivate(deactivateSubscriptionDto.key);
  }
  async remove(id: string) {
    const deletedSubscription =
      await this.subscriptionRepository.softDelete(id);

    if (deletedSubscription.affected === 0) {
      throw new NotFoundException('Subscription not found');
    }
    return deletedSubscription;
  }
  async findOne(id: number) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
    });
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }
    return subscription;
  }
  async findAll() {
    return this.subscriptionRepository.find({
      relations: {
        student: true,
        plan: true,
      },
    });
  }
}
