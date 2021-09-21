import { Ticket } from "../ticket";

it("implements optimistic cocurrency control", async (done) => {
  // 1. create an instance of a ticket
  const ticket = new Ticket();
  ticket.id = 1;
  ticket.userId = 1;
  ticket.title = "concert";
  ticket.price = 20;

  // 2. Save the ticket to the database
  await ticket.save();

  // 3. Fetch the ticket twice
  const firstInstance = await Ticket.findOne(ticket.id);
  const secondInstance = await Ticket.findOne(ticket.id);

  // 4. make to separate changes to the tickets we fetched
  firstInstance!.price = 10;
  secondInstance!.price = 30;

  // 5. save the first fetched ticket
  await firstInstance!.save();

  // 6. Save the second fetched ticket and expect an error
  try {
    await secondInstance!.save();
  } catch (error) {
    return done();
  }

  throw new Error("Shoul not reach this point");
});

it("increments the version number on multiples saves", async () => {
  // 1. create an instance of a ticket
  const ticket = new Ticket();
  ticket.id = 1;
  ticket.userId = 1;
  ticket.title = "concert";
  ticket.price = 20;

  await ticket.save();
  expect(ticket.version).toEqual(1);

  ticket.title = "concert 2";
  await ticket.save();
  expect(ticket.version).toEqual(2);

  ticket.title = "concert 3";
  await ticket.save();
  expect(ticket.version).toEqual(3);
});
