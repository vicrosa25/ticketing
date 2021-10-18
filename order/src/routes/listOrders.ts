import { requireAuth } from "@tfg-victor-rosa/common";
import express, { Request, Response } from "express";
import { Order } from "../models/order";

const router = express.Router();

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    where: {
      userId: req.currentUser!.id,
    },
    relations: ["ticket"],
  });

  // const orders = await Order.find({
  //   where: {
  //     userId: req.currentUser!.id,
  //   }
  // });

  res.send(orders);
});

export { router as listOrdersRouter };
