import express, { Request, Response } from "express";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@tfg-victor-rosa/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nat-wrapper";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60; // 1 minuto

router.post(
  "/api/order",
  requireAuth,
  [body("ticketId").not().isEmpty().withMessage("TicketId must be provided")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    const ticket = await Ticket.findOne(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    //1.Checking the ticket is not already reserved
    const isReserved = await ticket.isReserved();
    if (isReserved!) {
      throw new BadRequestError("Ticket is allready reserved");
    }


    // 2. Calculate the expiration date of the order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // 3. Create the order and save to the database
    const order = new Order();
    order.userId = req.currentUser!.id;
    order.expireAt = expiration;
    order.status = OrderStatus.AwaitingPayment;
    order.ticket = ticket;
    await order.save();

    // 4. Publish a create order  event
    await new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      userId: order.userId,
      status: order.status,
      expireAt: order.expireAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    // 5. Send the reponse
    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
