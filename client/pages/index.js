import Link from "next/dist/client/link";
import Products from "../components/Products";

const LandingPage = ({ currentUser, tickets }) => {
  // const ticketList = tickets.map((ticket) => {
  return <Products products={tickets} />;
  //     <tr key={ticket.id}>
  //       <td>{ticket.title}</td>
  //       <td>{ticket.price}</td>
  //       <td>
  //         <Link href="/ticket/[ticketId]" as={`/ticket/${ticket.id}`}>
  //           <a>View</a>
  //         </Link>
  //       </td>
  //     </tr>
  //   );
  // });

  // return (
  //   <div>
  //     <h1>Tickets</h1>
  //     <table className="table">
  //       <thead>
  //         <tr>
  //           <th>Title</th>
  //           <th>Price</th>
  //           <th>Link</th>
  //         </tr>
  //       </thead>
  //       <tbody>{ticketList}</tbody>
  //     </table>
  //   </div>
  // );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  // Fetching all the tickets
  const { data } = await client.get("/api/tickets");
  return { tickets: data };
};

export default LandingPage;
