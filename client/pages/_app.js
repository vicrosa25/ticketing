import "bootstrap/dist/css/bootstrap.css";
// import App from "next/app";
import buildClient from "../helper/build-client";
import Header from "../components/header";

function MyApp({ Component, pageProps, currentUser }) {
  return (
    <div id="comp-wrapp">
      <div className="container">
        <Header currentUser={currentUser} />
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);

  // Fetching data from MyApp
  const { data } = await client.get("/api/users/currentuser");

  // Fetching data from the components
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }

  return {
    pageProps,
    ...data,
  };
};

export default MyApp;
