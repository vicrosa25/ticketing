import "bootstrap/dist/css/bootstrap.css";
import App from "next/app";
import axios from "axios";

import Header from "../components/header";

class AppComponent extends App {
  static async getInitialProps(appContext) {
    // calls page's `getInitialProps` and fills `appProps.pageProps`
    const appProps = await App.getInitialProps(appContext);

    // Only fetch data in server calls not in the browser
    if (typeof window === "undefined") {
      const { data } = await axios.get(
        "http://auth-srv:3000/api/users/currentuser",
        {
          headers: appContext.ctx.req.headers,
        }
      );
      return {
        ...data,
        ...appProps,
      };
    } else {
      return {
        ...appProps,
      };
    }
  }

  render() {
    const { Component, appProps, currentUser } = this.props;
    // Workaround for https://github.com/zeit/next.js/issues/8592
    const { err } = this.props;
    const modifiedPageProps = { ...appProps, currentUser, err };
    return (
      <div id="comp-wrapp">
        <Header currentUser={currentUser} />
        <Component {...modifiedPageProps} />
      </div>
    );
  }
}

export default AppComponent;
