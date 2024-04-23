import { Inject, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ConfigArg } from '@vendure/common/lib/generated-types';
import {
    Customer,
    Injector,
    Logger,
    Order,
    Payment,
    PaymentMethodService,
    RequestContext,
    TransactionalConnection,
    UserInputError,
} from '@vendure/core';