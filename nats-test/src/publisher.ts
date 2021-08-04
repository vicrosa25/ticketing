import nats from "node-nats-streaming";

console.clear();

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Publisher connected to NATS");

  const data = JSON.stringify({
    id: 12,
    title: "concert",
    price: 23,
  });

  stan.publish("ticket:create", data, () => {
    console.log("Event publish");
  });
});
