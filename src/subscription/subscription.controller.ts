import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards } from "@nestjs/common";
import { SubscriptionService } from "./subscription.service";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
import { UpdateSubscriptionDto } from "./dto/update-subscription.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth/jwt-auth.guard";

@Controller("subscriptions")
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Post(":id/subscribe/:userId")
  subscribeUser(@Param("userId") userId: number, @Param("id") subscriptionId: number) {
    return this.subscriptionService.subscribeUser(userId, subscriptionId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(@Param("id") id: number, @Body() updateSubscriptionDto: UpdateSubscriptionDto) {
    return this.subscriptionService.update(id, updateSubscriptionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.subscriptionService.remove(id);
  }
}
