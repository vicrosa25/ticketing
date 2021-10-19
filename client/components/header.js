import styled from "styled-components";
import Link from "next/link";
import NavStyles from "../components/styles/NavStyles";

const Logo = styled.h1`
  font-size: 4rem;
  margin-left: 2rem;
  position: relative;
  z-index: 2;
  background: red;
  transform: skew(-7deg);
  a {
    color: white;
    text-decoration: none;
    text-transform: uppercase;
    padding: 0.5rem 1rem;
  }
`;

const HeaderStyles = styled.header`
  .bar {
    border-bottom: 10px solid var(--black, black);
    display: grid;
    grid-template-columns: auto 1fr;
    justify-content: space-between;
    align-items: stretch;
  }
  .sub-bar {
    display: grid;
    grid-template-columns: 1fr auto;
    border-bottom: 1px solid var(--black, black);
  }
`;

export default function Header({ currentUser }) {
  const links = [
    !currentUser && { label: "Sign up", href: "/auth/signup" },
    !currentUser && { label: "Sign in", href: "/auth/signin" },
    currentUser && { label: "Sell Tickets", href: "/ticket/createTicket" },
    currentUser && { label: "My Orders", href: "/order" },
    currentUser && { label: "Sign out", href: "/auth/signout" },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <Link key={href} href={href}>
          <a>{label}</a>
        </Link>
      );
    });

  return (
    <HeaderStyles>
      <div className="bar">
        <Logo>
          <Link href="/">Sick fits</Link>
        </Logo>
        <NavStyles>{links}</NavStyles>
      </div>

      <div className="sub-bar">
        <p>Search</p>
      </div>
    </HeaderStyles>
  );
}
