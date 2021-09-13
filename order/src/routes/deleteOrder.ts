import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@tfg-victor-rosa/common";
import express, { Request, Response } from "express";
import { Order } from "../models/order";

const router = express.Router();

router.delete(
  "/api/order/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const order = await Order.findOne(parseInt(req.params.orderId));
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

      res.status(204).send(order);
    } catch (error) {
      console.log(error);
    }
  }
);

export { router as deleteOrderRouter };
