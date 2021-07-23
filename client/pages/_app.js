import "bootstrap/dist/css/bootstrap.css";
import App from "next/app";
import axios from "axios";

class AppComponent extends App {
  static async getInitialProps(appContext) {
    // calls page's `getInitialProps` and fills `appProps.pageProps`
    const appProps = await App.getInitialProps(appContext);

    const { data } = await axios.get(
      "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
      {
        headers: appContext.ctx.req.headers,
      }
    );

    return {
      ...data,
      ...appProps,
    };
  }

  render() {
    const { Component, appProps, currentUser } = this.props;
    // Workaround for https://github.com/zeit/next.js/issues/8592
    const { err } = this.props;
    const modifiedPageProps = { ...appProps, currentUser, err };
    return (
      <div id="comp-wrapp">
        <h1>Header {currentUser.email}</h1>
        <Component {...modifiedPageProps} />
      </div>
    );
  }
}

export default AppComponent;
