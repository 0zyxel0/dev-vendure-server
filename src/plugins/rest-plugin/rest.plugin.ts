import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { OrderController } from './api/orders.controller';

@VendurePlugin({
  imports: [PluginCommonModule],
  controllers: [OrderController],
})
export class RestPlugin {}