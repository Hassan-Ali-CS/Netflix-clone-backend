import { Controller, Get, Post, Body, Param, Delete, Patch } from "@nestjs/common";
import { SubscriptionService } from "./subscription.service";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
import { UpdateSubscriptionDto } from "./dto/update-subscription.dto";

@Controller("subscriptions")
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.create(createSubscriptionDto);
  }

  @Get()
  findAll() {
    return this.subscriptionService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.subscriptionService.findOne(id);
  }

  @Post(":id/subscribe/:userId")
  subscribeUser(@Param("userId") userId: number, @Param("id") subscriptionId: number) {
    return this.subscriptionService.subscribeUser(userId, subscriptionId);
  }

  @Patch(":id")
  update(@Param("id") id: number, @Body() updateSubscriptionDto: UpdateSubscriptionDto) {
    return this.subscriptionService.update(id, updateSubscriptionDto);
  }

  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.subscriptionService.remove(id);
  }
}
