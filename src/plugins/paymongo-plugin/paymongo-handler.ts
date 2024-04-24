import {
  CancelPaymentResult,
  CancelPaymentErrorResult,
  PaymentMethodHandler,
  VendureConfig,
  CreatePaymentResult,
  SettlePaymentResult,
  CreatePaymentFn,
  PaymentService,
  SettlePaymentErrorResult,
  LanguageCode,
} from '@vendure/core'
// import Paymongo, { SecretKey } from '@paymongo/core';
// const paymongo = new Paymongo(process.env.PAYMONGO_SECRET_KEY as SecretKey);
// @ts-ignore
import { v4 as uuidv4 } from 'uuid'
// import { sdk } from 'payment-provider-sdk';

/**
 * This is a handler which integrates Vendure with an imaginary
 * payment provider, who provide a Node SDK which we use to
 * interact with their APIs.
 */
export const paymongoPaymentHandler = new PaymentMethodHandler({
  code: 'paymongo',
  description: [
    {
      languageCode: LanguageCode.en,
      value: 'Paymongo Provider',
    },
  ],
  args: {
    apiKey: { type: 'string' },
  },

  /** This is called when the `addPaymentToOrder` mutation is executed */
  createPayment: async (
    ctx,
    order,
    amount,
    args,
    metadata,
  ): Promise<CreatePaymentResult> => {
    try {
        console.log("Request")
        console.log(ctx);
        console.log("Order")
        console.log(order);
        console.log("Amount")
        console.log(amount);
        console.log("Args")
        console.log(args);
        console.log("Metadata")
        console.log(metadata);

      // const result = await sdk.charges.create({
      //     amount,
      //     apiKey: args.apiKey,
      //     source: metadata.token,
      // });
      // Create a Test Values
      const result = {
        id: uuidv4(),
        cardInfo: '4343434343434345',
        publidId: uuidv4(),
      }

      return {
        amount: order.total,
        // state: 'Authorized' as const,
        state: 'Settled' as const,
        transactionId: result.id.toString(),
        metadata: {
          cardInfo: result.cardInfo,
          // Any metadata in the `public` field
          // will be available in the Shop API,
          // All other metadata is private and
          // only available in the Admin API.
          public: {
            // @ts-ignore
            referenceCode: result.publicId,
          },
        },
      }
    } catch (err) {
      return {
        amount: order.total,
        state: 'Declined' as const,
        metadata: {
          // @ts-ignore
          errorMessage: err.message,
        },
      }
    }
  },

  /** This is called when the `settlePayment` mutation is executed */
  settlePayment: async (
    ctx,
    order,
    payment,
    args,
  ): Promise<SettlePaymentResult | SettlePaymentErrorResult> => {
    try {
      // const result = await sdk.charges.capture({
      //     apiKey: args.apiKey,
      //     id: payment.transactionId,
      // });
      const result = {
        id: uuidv4(),
        apiKey: 'something',
      }

      return { success: true }
    } catch (err) {
      return {
        success: false,
        // @ts-ignore
        errorMessage: err.message,
      }
    }
  },

  /** This is called when a payment is cancelled. */
  cancelPayment: async (
    ctx,
    order,
    payment,
    args,
  ): Promise<CancelPaymentResult | CancelPaymentErrorResult> => {
    try {
      // const result = await sdk.charges.cancel({
      //     apiKey: args.apiKey,
      //     id: payment.transactionId,
      // });
      const result = {
        id: uuidv4(),
        apiKey: 'something',
      }

      return { success: true }
    } catch (err) {
      return {
        success: false,
        // @ts-ignore
        errorMessage: err.message,
      }
    }
  },
})
