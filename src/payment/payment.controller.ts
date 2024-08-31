import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { PaymentService } from './payment.service';
import { AuthGuardLocal } from 'src/auth/auth.guard';
import { RequestWithJwt } from 'src/auth/auth.type';

@Controller('/payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('/create/product')
  async createProduct(@Req() req: Request, @Res() res: Response) {
    const result = await this.paymentService.createProduct();
    return res.json(result);
  }

  @Get('/create/plan')
  async createPlan(@Req() req: Request, @Res() res: Response) {
    const result = await this.paymentService.createPlan();
    return res.json(result);
  }

  @UseGuards(AuthGuardLocal)
  @Get('/create/subscriptions')
  async createSubscriptions(@Req() req: RequestWithJwt, @Res() res: Response) {
    const result = await this.paymentService.getSubscriptionLinks({
      user: req.user,
    });
    return res.json(result);
  }

  @Get('/create/subscriptions/callback')
  async onSuccessPayment(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    console.log(req.query);
    const subscriptionId = req.query.subscription_id as string;
    const token = req.query.token;
    const ba_token = req.query.ba_token;
    console.log(subscriptionId, token, ba_token);
    await this.paymentService.getSubscriptionDetail({
      subscriptionId,
    });
    // const result = await this.paymentService.createSubscriptions();
    // return res.json(result);
    return res.redirect(process.env.FRONTEND_URL);
  }

  @Get('/create/subscriptions/cancel')
  async onCancelPayment(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Request> {
    console.log(req);
    // const result = await this.paymentService.createSubscriptions();
    return req;
    // return res.json(result);
  }
}
