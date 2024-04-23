import { Controller, Headers, HttpStatus, Post, Req, Res } from '@nestjs/common';
import type { PaymentMethod, RequestContext } from '@vendure/core';
import {
    InternalServerError,
    LanguageCode,
    Logger,
    Order,
    OrderService,
    PaymentMethodService,
    RequestContextService,
    TransactionalConnection,
} from '@vendure/core';

@Controller('payments')
export class PaymongoController{
    constructor(
        private paymentMethodService: PaymentMethodService,
        private orderService: OrderService,
        private requestContextService: RequestContextService,
        private connection: TransactionalConnection,
    ) {}

    @Post('paymongo')
    async webhook(@Req() req: RequestContext, @Res() res: Response) : Promise<void>{
        
    }
}