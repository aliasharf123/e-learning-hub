import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  SubscriptionEntity,
  SubscriptionStatus,
} from './entities/subscription.entity';
import { UsersService } from 'src/users/users.service';
import { SubjectsService } from 'src/subjects/subjects.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private subscriptionRepository: Repository<SubscriptionEntity>,
    private readonly usersService: UsersService,
    private readonly subjectsService: SubjectsService,
  ) {}
  async createSubscription(createSubscriptionDto: CreateSubscriptionDto) {
    const student = await this.usersService.findOne({
      id: createSubscriptionDto.studentId,
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const subject = await this.subjectsService.findOne({
      id: createSubscriptionDto.subjectId,
    });
    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    const existingSubscription = await this.subscriptionRepository.findOne({
      where: {
        student: { id: student.id as number },
        subject: { id: subject.id },
      },
    });

    if (existingSubscription) {
      throw new ConflictException('Subscription already exists');
    }

    const key = this.generateSubscriptionKey();
    // const keyExpiresAt = new Date().getTime() + 1000 * 60 * 60 * 24;
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    const keyExpiresAt = oneMonthFromNow.toISOString();

    const subscription = this.subscriptionRepository.create({
      ...createSubscriptionDto,
      student: { id: student.id as number },
      subject: { id: subject.id },
      key,
      keyExpiresAt,
    });

    return this.subscriptionRepository.save(subscription);
  }

  generateSubscriptionKey() {
    const key = uuidv4();
    return key;
  }

  async activateSubscription(key: SubscriptionEntity['key']) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { key },
    });

    if (!subscription) {
      throw new NotFoundException('key is invalid ');
    }

    if (subscription.status === SubscriptionStatus.ACTIVE) {
      throw new ConflictException('Subscription already active');
    }

    if (subscription.status === SubscriptionStatus.CANCELED) {
      throw new ConflictException('Subscription is canceled');
    }

    subscription.status = SubscriptionStatus.ACTIVE;

    subscription.startDate = new Date();
    subscription.endDate = new Date(
      new Date().setMonth(
        new Date().getMonth() + subscription.durationInMonths,
      ),
    );

    return this.subscriptionRepository.save(subscription);
  }

  async isKeyExpired(key: SubscriptionEntity['key']) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { key },
    });

    if (!subscription) {
      throw new NotFoundException('key is invalid ');
    }

    const currentDate = new Date();
    if (subscription?.keyExpiresAt < currentDate) {
      return false;
    }
    return true;
  }

  findAll() {
    return `This action returns all subscriptions`;
  }

  async findOne(id: number) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: {
        student: true,
        subject: true,
      },
      select: {
        student: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
        subject: {
          id: true,
          name: true,
        },
      },
    });
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }
    return subscription;
  }

  // update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
  //   return `This action updates a #${id} subscription`;
  // }

  async cancelSubscription(id: number) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (subscription.status === SubscriptionStatus.CANCELED) {
      throw new ConflictException('Subscription already canceled');
    }

    subscription.status = SubscriptionStatus.CANCELED;
    subscription.canceledAt = new Date();

    return this.subscriptionRepository.save(subscription);
  }

  async softDeleteSubscription(id: number) {
    await this.subscriptionRepository.softDelete(id);
  }
}
