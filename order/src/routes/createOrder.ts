import express, { Request, Response } from "express";
import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@tfg-victor-rosa/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60; // 15 minutos

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
    order.ticket = ticket;

    await order.save();

    // 4. Publish a create order  event

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
