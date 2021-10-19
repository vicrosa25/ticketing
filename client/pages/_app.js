import NProgress from "nprogress";
import Router from "next/router";
import buildClient from "../helper/build-client";
import Header from "../components/header";
import Layout from "../components/layout";
import "../components/styles/nprogress.css";

// NProgress setup
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps, currentUser }) {
  return (
    <Layout>
      <Header currentUser={currentUser} />
      <Component currentUser={currentUser} {...pageProps} />
    </Layout>
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
