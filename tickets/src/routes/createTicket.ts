import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@tfg-victor-rosa/common";
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-create-publisher";
import { natsWrapper } from "../nat-wrapper";
import { Photo } from "../models/Photo";


const router = express.Router();


interface Image {
  cloudId: string;
  url: string;
  secureUrl: string;
}


router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("price").isFloat({ gt: 0 }).withMessage("Price must be grater than 0"),
    body('description').notEmpty().withMessage("Description is required"),
    body('images').isArray().notEmpty().withMessage("You must upload at least one image")
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price, description, images } = req.body;
  

    const userId = req.currentUser!.id;

    // 1. Create the ticket
    const ticket = new Ticket();
    ticket.title = title;
    ticket.price = price;
    ticket.description = description;
    ticket.userId = userId;

    // 2. Create and add images
    images.forEach((image: Image) => {
      const photo = new Photo();
      photo.cloudId = image.cloudId;
      photo.url = image.url;
      photo.secureUrl = image.secureUrl;
      ticket.addPhoto(photo);
    })


    // 3. Saves the ticket
    await ticket.save();


    // 4. Publish the Create Ticket Event
    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
