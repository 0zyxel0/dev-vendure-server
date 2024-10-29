import { Controller, Post, Body, Get } from '@nestjs/common';
import {
    Ctx,
    PluginCommonModule,
    VendurePlugin,
    ID,
    Order,
    RequestContext,
    TransactionalConnection,
    OrderService
} from '@vendure/core';

// DTOs with proper types
class OrderQueryDto {
    orderId!: ID;  // Using ! to indicate required property
}

class OrderCodeQueryDto {
    orderCode!: string;  // Using lowercase 'string' type instead of String
}

@Controller('orders')
export class OrderController {
    constructor(
        private orderService: OrderService,
        private connection: TransactionalConnection
    ) {}

    // @Get()
    // findAll(@Ctx() ctx: RequestContext) {
    //     return this.orderService.findAll(ctx);
    // }

    @Post('by-id')  // Added unique path
    async getOrderById(
        @Body() body: OrderQueryDto,
        @Ctx() ctx: RequestContext
    ): Promise<Order | undefined> {
        console.log(ctx);
        return this.orderService.findOne(ctx, body.orderId);
    }

    @Post('by-code')  // Added unique path
    async getOrderByCodeId(
        @Body() body: OrderCodeQueryDto,
        @Ctx() ctx: RequestContext
    ): Promise<Order | undefined> {
        console.log(ctx);
        return this.orderService.findOneByCode(ctx, body.orderCode);
    }
}