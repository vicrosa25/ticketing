import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@tfg-victor-rosa/common";
import express, { Request, Response } from "express";
import { Order } from "../models/order";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nat-wrapper";

const router = express.Router();

router.delete(
  "/api/order/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const order = await Order.findOne(parseInt(req.params.orderId), {
        relations: ["ticket"],
      });

      if (!order) {
        throw new NotFoundError();
      }

      if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
      }

      // Change the order status
      order.status = OrderStatus.Cancelled;
      await order.save();

      // Publishing an cancel event
      await new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
          id: order.ticket.id,
        },
      });

      res.status(204).send(order);
    } catch (error) {
      console.log(error);
    }
  }
);

export { router as deleteOrderRouter };
