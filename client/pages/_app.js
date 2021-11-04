import NProgress from "nprogress";
import Router from "next/router";
import { AuthProvider } from "../contexts/AuthContext";
import Layout from "../components/layout";
import "../components/styles/nprogress.css";
import "../components/styles/chatProduct.css";
import { SWRConfig } from "swr";
import axios from "axios";

// NProgress setup
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Layout>
        <SWRConfig value={{ fetcher: (url) => axios(url).then((r) => r.data) }}>
          <Component {...pageProps} />
        </SWRConfig>
      </Layout>
    </AuthProvider>
  );
}

export default MyApp;
