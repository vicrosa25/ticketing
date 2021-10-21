import request from "supertest";
import { app } from "../../app";
import { Photo } from "../../models/Photo";

it("returns a 404 if the ticket is not found", async () => {
  const response = await request(app).get("/api/tickets/1").send();
});

it("returns the ticket it is found", async () => {
  const title = "concert";
  const price = 20;
  const description = "Description test";

  const photo = new Photo()
  photo.cloudId = "asdfasd";
  photo.url = "asldkfasldf";
  photo.secureUrl = "sla;ldskfja";
  const images = [];
  images.push(photo);

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title, price, description, images })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
  expect(ticketResponse.body.description).toEqual(description);
  expect(ticketResponse.body.photos[0].cloudId).toEqual(photo.cloudId);
});
