import request from "supertest";
import { app } from "../../app";
import { Photo } from "../../models/Photo";

// Helper function
const createTicket = (title: string, price: number, description: string, images: Photo[]) => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title,
      price,
      description,
      images,
    })
    .expect(201);
};

it("returns all the tickets", async () => {
  const photo = new Photo()
  photo.cloudId = "asdfasd";
  photo.url = "asldkfasldf";
  photo.secureUrl = "sla;ldskfja";
  const images = [];
  images.push(photo);

  await createTicket("test1 ticket", 12, "description", images);
  await createTicket("test2 ticket", 20, 'description', images);

  // 1. checkt the request is well done
  const response = await request(app).get("/api/tickets").expect(200);

  // 2. check the number of tickets create
  expect(response.body.length).toEqual(2);
});
