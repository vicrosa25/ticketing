import { requireAuth } from "@tfg-victor-rosa/common";
import express, { Request, Response } from "express";
import { Order } from "../models/order";

const router = express.Router();

router.get("/api/order", requireAuth, async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({
      where: {
        userId: req.currentUser!.id,
      },
      relations: ["ticket"],
    });

    res.send(orders);
  } catch (error) {
    console.log(error);
  }
});

export { router as listOrdersRouter };
