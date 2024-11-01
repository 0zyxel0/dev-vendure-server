import { Controller, Post, Body, Get } from '@nestjs/common';
import {
    Ctx,
    PluginCommonModule,
    VendurePlugin,
    ID,
    Order,
    RequestContext,
    TransactionalConnection,
    OrderService,
    OrderLine
} from '@vendure/core';

// Request DTOs
class OrderQueryDto {
    orderId!: ID;
}

class OrderCodeQueryDto {
    orderCode!: string;
}

// Response DTOs
interface OrderCustomerDto {
    customerId: ID;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

interface OrderAddressDto {
    fullName: string;
    company: string;
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
}

interface OrderItemDto {
    productId: ID;
    variantId: ID;
    sku: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    linePrice: number;
}

interface TaxSummaryDto {
    description: string;
    taxRate: number;
    taxBase: number;
    taxTotal: number;
}

interface OrderResponseDto {
    orderId: ID;
    orderCode: string;
    orderState: string;
    createdAt: string;
    updatedAt: string;
    orderPlacedAt: string | null;
    customer: OrderCustomerDto;
    shippingAddress: OrderAddressDto;
    billingAddress: OrderAddressDto;
    currencyCode: string;
    subTotal: number;
    totalWithTax: number;
    totalShippingCost: number;
    items: OrderItemDto[];
    taxSummary: TaxSummaryDto[];
}

@Controller('orders')
export class OrderController {
    constructor(
        private orderService: OrderService,
        private connection: TransactionalConnection
    ) {}

    private transformAddress(address: any): OrderAddressDto {
        return {
            fullName: address?.fullName || '',
            company: address?.company || '',
            street: address?.streetLine1 || '',
            city: address?.city || '',
            province: address?.province || '',
            postalCode: address?.postalCode || '',
            country: address?.country || '',
            phoneNumber: address?.phoneNumber || '',
        };
    }

    private transformOrderItems(lines: OrderLine[]): OrderItemDto[] {
        return lines.map(line => ({
            productId: line.productVariant.productId,
            variantId: line.productVariant.id,
            sku: line.productVariant.sku,
            productName: line.productVariant.name,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            linePrice: line.linePrice,
        }));
    }

    private transformTaxSummary(order: Order): TaxSummaryDto[] {
        const taxSummary: TaxSummaryDto[] = [];
        
        // Add product taxes
        if (order.taxSummary) {
            taxSummary.push(...order.taxSummary.map(tax => ({
                description: tax.description,
                taxRate: tax.taxRate,
                taxBase: tax.taxBase,
                taxTotal: tax.taxTotal,
            })));
        }

        // Add shipping tax if exists
        if (order.shippingWithTax > order.shipping) {
            taxSummary.push({
                description: 'shipping tax',
                taxRate: ((order.shippingWithTax - order.shipping) / order.shipping) * 100,
                taxBase: order.shipping,
                taxTotal: order.shippingWithTax - order.shipping,
            });
        }

        return taxSummary;
    }

    private transformOrder(order: Order): OrderResponseDto {
        // Default customer data in case customer is undefined
        const defaultCustomer: OrderCustomerDto = {
            customerId: '' as ID,
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
        };

        const customer: OrderCustomerDto = order.customer ? {
            customerId: order.customer.id,
            firstName: order.customer.firstName,
            lastName: order.customer.lastName,
            email: order.customer.emailAddress,
            phone: order.customer.phoneNumber || '',
        } : defaultCustomer;

        return {
            orderId: order.id,
            orderCode: order.code,
            orderState: order.state,
            createdAt: order.createdAt.toISOString(),
            updatedAt: order.updatedAt.toISOString(),
            orderPlacedAt: order.orderPlacedAt?.toISOString() || null,
            customer,
            shippingAddress: this.transformAddress(order.shippingAddress),
            billingAddress: this.transformAddress(order.billingAddress),
            currencyCode: order.currencyCode,
            subTotal: order.subTotal,
            totalWithTax: order.totalWithTax,
            totalShippingCost: order.shipping,
            items: this.transformOrderItems(order.lines),
            taxSummary: this.transformTaxSummary(order),
        };
    }

    @Post('by-id')
    async getOrderById(
        @Body() body: OrderQueryDto,
        @Ctx() ctx: RequestContext
    ): Promise<OrderResponseDto | undefined> {
        const order = await this.orderService.findOne(ctx, body.orderId);
        return order ? this.transformOrder(order) : undefined;
    }

    @Post('by-code')
    async getOrderByCodeId(
        @Body() body: OrderCodeQueryDto,
        @Ctx() ctx: RequestContext
    ): Promise<OrderResponseDto | undefined> {
        const order = await this.orderService.findOneByCode(ctx, body.orderCode);
        return order ? this.transformOrder(order) : undefined;
    }
}