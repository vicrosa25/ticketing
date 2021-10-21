import request from "supertest";
import { app } from "../../app";
import { Photo } from "../../models/Photo";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nat-wrapper";

it("has a route handler to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("returns a status other than 401 if the useris signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({});
  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "",
      price: 10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      price: 10,
    })
    .expect(400);
});

it("returns an error if an invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "test title",
      price: -10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "test title",
    })
    .expect(400);
});

it("creates a tickets with valid title and price", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const title = "test title";
  const price = 20;
  const description = "Description test";

  const photo = new Photo()
  photo.cloudId = "asdfasd";
  photo.url = "asldkfasldf";
  photo.secureUrl = "sla;ldskfja";
  const images = [];
  images.push(photo);


  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title,
      price,
      description,
      images,
    })
    .expect(201);

  tickets = await Ticket.find({relations: ['photos']});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(title);
  expect(tickets[0].price).toEqual(price);
  expect(tickets[0].description).toEqual(description);
  expect(tickets[0].photos[0].cloudId).toEqual(photo.cloudId);
});

it("publishes an event when creates a ticket", async () => {
  const title = "test title";
  const price = 20;
  const description = "Description test";
  
  const photo = new Photo()
  photo.cloudId = "asdfasd";
  photo.url = "asldkfasldf";
  photo.secureUrl = "sla;ldskfja";
  const images = [];
  images.push(photo);

  await request(app).post("/api/tickets").set("Cookie", global.signin()).send({
    title,
    price,
    description,
    images,
  });

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
