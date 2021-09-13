import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "@tfg-victor-rosa/common";
import express, { Request, Response } from "express";
import { Order } from "../models/order";

const router = express.Router();

router.get(
  "/api/order/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const [order] = await Order.findByIds([req.params.orderId], {
      relations: ["ticket"],
    });

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(order);
  }
);

export { router as showOrderRouter };
