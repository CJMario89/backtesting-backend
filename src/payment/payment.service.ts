import { PrismaService } from 'src/prisma/prisma-service';

import { Injectable } from '@nestjs/common';
import { UserFromJwt } from 'src/auth/auth.type';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}
  private readonly auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_PRIVATE_KEY}`,
  ).toString('base64');

  async createProduct() {
    console.log('Creating product');

    const result = await fetch(`${process.env.PAYPAL_URL}/catalogs/products`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${this.auth}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        name: 'Backtest Premium',
        description:
          'Expand our backtesting platform by increasing backtesting candles and new indicators. Better strategy testing, improved decision-making.',
        type: 'SERVICE',
        category: 'SOFTWARE',
        image_url: 'https://example.com/image.png',
        home_url: 'https://example.com',
      }),
    });
    const data = await result.json();
    console.log(data);
    return data;
  }

  async createPlan() {
    console.log('Creating plan');

    const result = await fetch(`${process.env.PAYPAL_URL}/billing/plans`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${this.auth}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        product_id: process.env.PAYPAL_PRODUCT_ID,
        name: 'Backtest Premium',
        description: 'Backtest Premium',
        billing_cycles: [
          {
            frequency: { interval_unit: 'MONTH', interval_count: 1 },
            tenure_type: 'REGULAR',
            sequence: 1,
            total_cycles: 0,
            pricing_scheme: {
              fixed_price: { value: '5', currency_code: 'USD' },
            },
          },
        ],
        payment_preferences: {
          auto_bill_outstanding: true,
          setup_fee: { value: '0', currency_code: 'USD' },
          setup_fee_failure_action: 'CONTINUE',
          payment_failure_threshold: 3,
        },
        taxes: {
          percentage: '0',
          inclusive: false,
        },
      }),
    });
    const data = await result.json();
    console.log(data);
    return data;
  }

  async createSubscriptions({ user }: { user: UserFromJwt }) {
    console.log('Creating subscription');

    const result = await fetch(
      `${process.env.PAYPAL_URL}/billing/subscriptions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${this.auth}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          plan_id: process.env.PAYPAL_PLAN_ID,
          start_time: new Date(Date.now() + 100000).toISOString(),
          subscriber: {
            name: { given_name: 'John', surname: 'Doe' },
            email_address: 'customer@example.com',
          },
          application_context: {
            shipping_preference: 'NO_SHIPPING',
            brand_name: 'backtest',
            locale: 'en-US',
            user_action: 'SUBSCRIBE_NOW',
            payment_method: {
              payer_selected: 'PAYPAL',
              payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED',
            },
            return_url: `${process.env.BACKEND_URL}/payment/create/subscriptions/callback`,
            cancel_url: `${process.env.BACKEND_URL}/payment/create/subscriptions/cancel`,
          },
        }),
      },
    );
    const data = await result.json();

    const subscription = await this.prisma.user_subscription.create({
      data: {
        user_id: user.id,
        subscription_id: data.id,
        plan_id: process.env.PAYPAL_PLAN_ID,
        is_paid: false,
        payment_link: data.links[0].href,
      },
    });
    return subscription.payment_link;
  }

  async getSubscriptionLinks({ user }: { user: UserFromJwt }) {
    console.log('Getting subscription links');

    const subscription = await this.prisma.user_subscription.findUnique({
      where: { user_id: user.id, is_paid: false },
    });
    if (!subscription) {
      return await this.createSubscriptions({ user });
    } else {
      return subscription.payment_link;
    }
  }

  async saveSubscription({
    user_id,
    subscriptionId,
    token,
    ba_token,
  }: {
    user_id: string;
    subscriptionId: string;
    token: string;
    ba_token: string;
  }) {
    console.log('Saving subscription');

    const data = await this.getSubscriptionDetail({ subscriptionId });

    await this.prisma.user_subscription.update({
      where: { subscription_id: subscriptionId },
      data: {
        user_id,
        subscription_id: data.id,
        plan_id: data.plan_id,
        is_paid: true,
        is_active: true,
        start_time: new Date(data.start_time).toISOString(),
        end_time: new Date(data.billing_info.next_billing_time).toISOString(),
        next_billing_time: new Date(
          data.billing_info.next_billing_time,
        ).toISOString(),
        currency_code: data.billing_info.last_payment.amount.currency_code,
        currency_value: data.billing_info.last_payment.amount.value,
        token,
        ba_token,
      },
    });
    //   user_id           String
    // subscription_id   String
    // plan_id           String
    // isActive          Boolean
    // start_time        DateTime
    // end_time          DateTime
    // next_billing_time DateTime
    // currency_code     String
    // currency_value    String
    // token             String
    // ba_token          String
  }

  async getSubscriptionDetail({ subscriptionId }: { subscriptionId: string }) {
    console.log('Getting subscription detail');

    const result = await fetch(
      `${process.env.PAYPAL_URL}/billing/subscriptions/${subscriptionId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Basic ${this.auth}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    );
    const data = await result.json();

    return data;
  }

  // const detail = {
  //   status: 'ACTIVE',
  //   status_update_time: '2024-08-21T13:41:22Z',
  //   id: 'I-V36V5PMR7VYA',
  //   plan_id: 'P-65602115V86210521M3AB3MQ',
  //   start_time: '2024-08-21T13:42:39Z',
  //   quantity: '1',
  //   shipping_amount: { currency_code: 'USD', value: '0.0' },
  //   subscriber: {
  //     email_address: 'sb-pmifs29964230@personal.example.com',
  //     payer_id: 'W5X4QC7DQDGAU',
  //     name: { given_name: 'John', surname: 'Doe' },
  //     shipping_address: { address: [Object] }
  //   },
  //   billing_info: {
  //     outstanding_balance: { currency_code: 'USD', value: '0.0' },
  //     cycle_executions: [ [Object] ],
  //     last_payment: { amount: [Object], time: '2024-08-21T13:41:21Z' },
  //     next_billing_time: '2024-09-21T10:00:00Z',
  //     final_payment_time: '2025-07-21T10:00:00Z',
  //     failed_payments_count: 0
  //   },
  //   create_time: '2024-08-21T13:41:21Z',
  //   update_time: '2024-08-21T13:41:22Z',
  //   plan_overridden: false,
  //   links: [
  //     {
  //       href: 'https://api.sandbox.paypal.com/v1/billing/subscriptions/I-V36V5PMR7VYA/cancel',
  //       rel: 'cancel',
  //       method: 'POST'
  //     },
  //     {
  //       href: 'https://api.sandbox.paypal.com/v1/billing/subscriptions/I-V36V5PMR7VYA',
  //       rel: 'edit',
  //       method: 'PATCH'
  //     },
  //     {
  //       href: 'https://api.sandbox.paypal.com/v1/billing/subscriptions/I-V36V5PMR7VYA',
  //       rel: 'self',
  //       method: 'GET'
  //     },
  //     {
  //       href: 'https://api.sandbox.paypal.com/v1/billing/subscriptions/I-V36V5PMR7VYA/suspend',
  //       rel: 'suspend',
  //       method: 'POST'
  //     },
  //     {
  //       href: 'https://api.sandbox.paypal.com/v1/billing/subscriptions/I-V36V5PMR7VYA/capture',
  //       rel: 'capture',
  //       method: 'POST'
  //     }
  //   ]
  // }
}
