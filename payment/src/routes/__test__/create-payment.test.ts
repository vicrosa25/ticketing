import request from "supertest";
import { OrderStatus } from "@tfg-victor-rosa/common";
import { app } from "../../app";
import { Order } from "../../models/order";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

jest.mock("../../stripe");

it("returns a 404 when purchasing an order that not exist", async () => {
  await request(app)
    .post("/api/payment")
    .set("Cookie", global.signin())
    .send({
      token: "asdfasdf",
      orderId: 234,
    })
    .expect(404);
});

it("returns a 401 when purchasing an order that doesnt belong to the user", async () => {
  // 1. Create an order
  const order = new Order();
  order.id = 1;
  order.userId = 1;
  order.price = 20;
  order.status = OrderStatus.Created;
  await order.save();

  // 2. Make the request
  await request(app)
    .post("/api/payment")
    .set("Cookie", global.signin())
    .send({
      token: "asdfasdf",
      orderId: order.id,
    })
    .expect(401);
});

it("returns a 400 when pubchasing a cancelled order", async () => {
  // 1. Create an order
  const order = new Order();
  order.id = 1;
  order.userId = 1;
  order.price = 20;
  order.status = OrderStatus.Cancelled;
  await order.save();

  // 2. Make the request
  await request(app)
    .post("/api/payment")
    .set("Cookie", global.signin(order.userId))
    .send({
      token: "asdfasdf",
      orderId: order.id,
    })
    .expect(400);
});

// Test Stripe
it("returns a 201 with valid inputs", async () => {
  // 1. Create an order
  const order = new Order();
  order.id = 1;
  order.userId = 1;
  order.price = 20;
  order.status = OrderStatus.Created;
  await order.save();

  await request(app)
    .post("/api/payment")
    .set("Cookie", global.signin(order.userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  // Assertions. The mock function charges.create was called wiht correct arguments
  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.source).toEqual("tok_visa");
  expect(chargeOptions.amount).toEqual(20 * 100);
  expect(chargeOptions.currency).toEqual("eur");
});

it("saves a payment object", async () => {
  // 1. Create an order
  const order = new Order();
  order.id = 1;
  order.userId = 1;
  order.price = 20;
  order.status = OrderStatus.Created;
  await order.save();

  // 2. Make the request
  await request(app)
    .post("/api/payment")
    .set("Cookie", global.signin(order.userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  // 3. Create the fake charge
  const charge = await stripe.charges.create();

  // 4. Fecht the new payment
  const payment = await Payment.findOne({
    where: {
      orderId: order.id,
      stripeId: charge.id,
    },
  });

  // 5. Assertions
  expect(payment).not.toBeNull();
});
