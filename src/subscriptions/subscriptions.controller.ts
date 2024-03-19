import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { ActivateSubscriptionDto } from './dto/activate-subscription.dto';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { DeactivateSubscriptionDto } from './dto/dectivate-subscription.dto';

@ApiTags('subscriptions')
@Controller('plan/:planID/subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  /**
   * generate a code for a subscription
   * @param createSubscriptionDto - The data for generating the subscription.
   * @param planID - The ID of the plan to which the subscription belongs.
   * @returns the generated code
   */
  @Post('generateCode')
  @ApiParam({ name: 'planID', type: 'number', required: true })
  @ApiOperation({ summary: 'generate a code for a subscription' })
  generateCode(@Param('planID') planID: number) {
    return this.subscriptionsService.generateCode(planID);
  }

  /**
   * Activates a subscription.
   * @param activateSubscriptionDto - The DTO containing the information needed to activate the subscription.
   * @param planID - The ID of the plan to which the subscription belongs.
   * @returns The created subscription.
   */
  @Post('activateCode')
  @ApiBody({ type: ActivateSubscriptionDto })
  @ApiOperation({ summary: 'Activates a subscription' })
  activate(
    @Body() activateSubscriptionDto: ActivateSubscriptionDto,
    @Param('planID') planID: number,
  ) {
    return this.subscriptionsService.activate(activateSubscriptionDto, planID);
  }

  /**
   * Deactivates a subscription.
   * @param activateSubscriptionDto - The DTO containing the information needed to deactivate the subscription.
   * @returns The result of the deactivation process.
   */
  @Post('deactivateCode')
  @ApiBody({ type: DeactivateSubscriptionDto })
  @ApiOperation({ summary: 'Deactivates a subscription' })
  deactivate(@Body() deactivateSubscriptionDto: DeactivateSubscriptionDto) {
    return this.subscriptionsService.deactivate(deactivateSubscriptionDto);
  }

  /**
   * Removes a subscription by its ID.
   * @param id - The ID of the subscription to remove.
   * @returns A Promise that resolves to the removed subscription.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionsService.remove(id);
  }
  /**
   * Retrieves all subscriptions.
   * @returns An array of subscriptions.
   */
  @ApiOperation({ summary: 'Retrieves all subscriptions.' })
  @Get()
  findAll() {
    return this.subscriptionsService.findAll();
  }

  /**
   * Retrieves a subscription by its ID.
   *
   * @param id - The ID of the subscription.
   * @returns The subscription with the specified ID.
   */
  @ApiOperation({ summary: 'Retrieves a subscription by its ID.' })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.subscriptionsService.findOne(id);
  }

  // /**
  //  * Performs an online payment for a subscription by stripe.
  //  * @param data - The payment data.
  //  * @returns The created subscription data.
  //  */
  // @ApiOperation({
  //   summary: 'Performs an online payment for a subscription by stripe.',
  // })
  // @Post('payment')
  // onlinePayment(@Body() data: any) {
  //   return this.subscriptionsService.onlinePayment(data);
  // }
}
