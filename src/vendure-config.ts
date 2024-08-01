import {
  dummyPaymentHandler,
  DefaultJobQueuePlugin,
  DefaultSearchPlugin,
  VendureConfig,
  LanguageCode,
  OrderPlacedEvent,
} from '@vendure/core'
import { StellatePlugin, defaultPurgeRules } from '@vendure/stellate-plugin';
import { defaultEmailHandlers, EmailPlugin } from '@vendure/email-plugin'
import { AssetServerPlugin } from '@vendure/asset-server-plugin'
import { AdminUiPlugin } from '@vendure/admin-ui-plugin'
import { MultivendorPlugin } from './plugins/multivendor-plugin/multivendor.plugin'
import { paymongoPaymentHandler } from './plugins/paymongo-plugin/paymongo-handler'
import { WebhookPlugin } from '@pinelab/vendure-plugin-webhook';
import { compileUiExtensions } from '@vendure/ui-devkit/compiler'
import 'dotenv/config'
import path from 'path'

const IS_DEV = process.env.APP_ENV === 'dev'

export const config: VendureConfig = {
  //@ts-ignore
  cors: {
    exposeHeaders: ['vendure-auth-token'],
  },
  apiOptions: {
    port: process.env.APP_PORT,
    adminApiPath: 'admin-api',
    shopApiPath: 'shop-api',
    // The following options are useful in development mode,
    // but are best turned off for production for security
    // reasons.
    ...(IS_DEV
      ? {
          adminApiPlayground: {
            settings: { 'request.credentials': 'include' },
          },
          adminApiDebug: true,
          shopApiPlayground: {
            settings: { 'request.credentials': 'include' },
          },
          shopApiDebug: true,
        }
      : {}),
  },
  authOptions: {
    tokenMethod: ['bearer', 'cookie'],
    superadminCredentials: {
      identifier: process.env.SUPERADMIN_USERNAME,
      password: process.env.SUPERADMIN_PASSWORD,
    },
    cookieOptions: {
      secret: process.env.COOKIE_SECRET,
    },
    // This Option will disable the email verification since all users are already verified from our main application.
    requireVerification: false,
  },
  dbConnectionOptions: {    
    // See the README.md "Migrations" section for an explanation of
    // the `synchronize` and `migrations` options.
    // Run the synchoronize only once after that disable as the migrations will restart to the fresh database.
    type: 'better-sqlite3',
    synchronize: false,
    migrations: [path.join(__dirname, './migrations/*.+(js|ts)')],
    logging: true,
    database: path.join(__dirname, '../vendure.sqlite'),

    // type: 'postgres',
    // // See the README.md "Migrations" section for an explanation of
    // // the `synchronize` and `migrations` options.
    // synchronize: true,
    // migrations: [path.join(__dirname, './migrations/*.+(js|ts)')],
    // logging: false,
    // database: process.env.DB_NAME,
    // schema: process.env.DB_SCHEMA,
    // host: process.env.DB_HOST,
    // port: process.env.DB_PORT,
    // username: process.env.DB_USERNAME,
    // password: process.env.DB_PASSWORD
  },
  paymentOptions: {
    paymentMethodHandlers: [dummyPaymentHandler, paymongoPaymentHandler],
  },
  // When adding or altering custom field definitions, the database will
  // need to be updated. See the "Migrations" section in README.md.
  customFields: {
    // Apply Product optional fields
    Product: [
      {
        name: 'infoUrl',
        type: 'string',
        label: [{ languageCode: LanguageCode.en, value: 'Info URL' }],
      },
      {
        name: 'productNotes',
        type: 'string',
        label: [{ languageCode: LanguageCode.en, value: 'Product Notes' }],
        ui: {
          component: 'rich-text-form-input',
        },
      },
      {
        name: 'productDeliveryNotes',
        type: 'string',
        label: [
          { languageCode: LanguageCode.en, value: 'Product Delivery Notes' },
        ],
        ui: {
          component: 'rich-text-form-input',
        },
      },
      {
        name: 'advanceOrderOnly',
        type: 'boolean',
        label: [{ languageCode: LanguageCode.en, value: 'Advance Order Only' }],
      },
    ],
    // Apply Order Notes as an optional fields
    Order: [
      {
        name: 'orderNotes',
        type: 'string',
        label: [
          {
            languageCode: LanguageCode.en,
            value: 'Order Notes',
          },
        ],
      },
      {
        name: 'orderScheduleCollection',
        type: 'datetime',
        label: [
          {
            languageCode: LanguageCode.en,
            value: 'Order Schedule',
          },
        ],
      },
    ],
  },
  plugins: [
    WebhookPlugin.init({
      /**
       * Optional: 'delay' waits and deduplicates events for 3000ms.
       * If 4 events were fired for the same channel within 3 seconds,
       * only 1 webhook call will be sent
       */
      delay: 3000,
      events: [OrderPlacedEvent],
      /**
       * Optional: A requestTransformer allows you to send custom headers
       * and a custom body with your webhook call.
       * If no transformers are specified
       */
      requestTransformers: [],
    }),
    AssetServerPlugin.init({
      route: 'assets',
      assetUploadDir: path.join(__dirname, '../static/assets'),
      // For local dev, the correct value for assetUrlPrefix should
      // be guessed correctly, but for production it will usually need
      // to be set manually to match your production url.
      assetUrlPrefix: IS_DEV ? undefined : 'http://localhost:3000/assets/',
    }),
    DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
    DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
    EmailPlugin.init({
      devMode: true,
      outputPath: path.join(__dirname, '../static/email/test-emails'),
      route: 'mailbox',
      handlers: defaultEmailHandlers,
      templatePath: path.join(__dirname, '../static/email/templates'),
      globalTemplateVars: {
        // The following variables will change depending on your storefront implementation.
        // Here we are assuming a storefront running at http://localhost:8080.
        fromAddress: '"example" <noreply@example.com>',
        verifyEmailAddressUrl: 'http://localhost:8080/verify',
        passwordResetUrl: 'http://localhost:8080/password-reset',
        changeEmailAddressUrl:
          'http://localhost:8080/verify-email-address-change',
      },
    }),
    MultivendorPlugin.init({
      platformFeePercent: 10,
      platformFeeSKU: 'FEE',
    }),
    AdminUiPlugin.init({
      route: 'admin',
      port: 3000,
      //Change the api host based on the dns being used
      adminUiConfig: {
        apiHost: process.env.FULL_VENDURE_HOST || 'http://localhost:3000',
        // Comment out the apiPort when you do not use the custom dns or localhost
        //   apiPort: 443,
        adminApiPath: 'admin-api',
        hideVendureBranding: true,
        hideVersion: true,
      },
      app: compileUiExtensions({
        outputPath: path.join(__dirname, '__admin-ui'),
        // Add the WebhookPlugin's UI to the admin
        extensions: [WebhookPlugin.ui],
      }),
    }),
    StellatePlugin.init({
      // The Stellate service name, i.e. `<serviceName>.stellate.sh`
      serviceName: 'scribble-cubes',
      // The API token for the Stellate Purging API. See the "pre-requisites" section above.
      apiToken: process.env.STELLATE_PURGE_API_TOKEN,
      devMode: !IS_DEV || process.env.STELLATE_DEBUG_MODE ? true : false,
      debugLogging: process.env.STELLATE_DEBUG_MODE ? true : false,
      purgeRules: [
        ...defaultPurgeRules,
        // custom purge rules can be added here
      ],
    }),
  ],
}
