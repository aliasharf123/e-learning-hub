import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { ActivateSubscriptionDto } from './dto/activate-subscription.dto';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionsService.createSubscription(createSubscriptionDto);
  }

  @Get()
  findAll() {
    return this.subscriptionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscriptionsService.findOne(+id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  // ) {
  //   return this.subscriptionsService.update(+id, updateSubscriptionDto);
  // }

  @Post('activate')
  activateSubscription(
    @Body() activateSubscriptionDto: ActivateSubscriptionDto,
  ) {
    return this.subscriptionsService.activateSubscription(
      activateSubscriptionDto.key,
    );
  }

  @Post('cancel')
  cancelSubscription(@Param('id') id: string) {
    return this.subscriptionsService.cancelSubscription(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionsService.softDeleteSubscription(+id);
  }
}
