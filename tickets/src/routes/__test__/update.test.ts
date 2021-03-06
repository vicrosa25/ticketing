import request from "supertest";
import { app } from "../../app";
import { natsWrapper } from "../../nat-wrapper";
import { Ticket } from "../../models/ticket";
import { Photo } from "../../models/Photo";


const photo = new Photo();
photo.cloudId = "asdfasd";
photo.url = "asldkfasldf";
photo.secureUrl = "sla;ldskfja";
const images = Array<Photo>();
images.push(photo);

it("returns a 404 if the provided id does not exists", async () => {
  await request(app)
    .put("/api/tickets/2")
    .set("Cookie", global.signin())
    .send({
      title: "asdfasd",
      price: 20,
      description: 'alsdkfjas',
      images
    })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  await request(app)
    .put("/api/tickets/2")
    .send({
      title: "asdfasd",
      price: 20,
      description: "alsdkfjalsd",
      images,
    })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "asdfasdf",
      price: 20,
      description: 'alsdkfjas',
      images
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({
      title: "newtitle",
      price: 34,
      description: 'alsdkfjas',
      images
    })
    .expect(401);
});
it("returns a 400 if the user provides an invalid title or price", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "asdfasdf",
      price: 20,
      description: 'alsdkfjas',
      images
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 34,
      description: 'alsdkfjas',
      images
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "test title",
      price: -10,
      description: 'alsdkfjas',
      images
    })
    .expect(400);
});

it("returns a 200 if the user provides an valid title or price", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "asdfasdf",
      price: 20,
      description: 'alsdkfjas',
      images
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "test title",
      price: 34,
      description: 'alsdkfjas',
      images
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual("test title");
  expect(ticketResponse.body.price).toEqual(34);
});

it("publishes an event when updates a ticket", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "asdfasdf",
      price: 20,
      description: 'alsdkfjas',
      images
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "test title",
      price: 34,
      description: 'alsdkfjas',
      images
    });

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("rejects updates if the ticket is reserved", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "asdfasdf",
      price: 20,
      description: 'alsdkfjas',
      images
    });

  const ticket = await Ticket.findOne(response.body.id);
  ticket!.orderId = 1;
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "test title",
      price: 34,
    })
    .expect(400);
});
