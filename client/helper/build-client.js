import axios from "axios";

export default function buildClient(req = null) {
  if (typeof window === "undefined" && req === null) {
    // In the server
    return axios.create({
      baseURL:
        "http://nginx-ingress-microk8s-controller-m6w6f.ingress.svc.cluster.local",

      headers: {
        Host: "ticketing.dev",
      },
    });
  }

  if (typeof window === "undefined" && req) {
    // In the server
    return axios.create({
      baseURL:
        "http://nginx-ingress-microk8s-controller-m6w6f.ingress.svc.cluster.local",

      headers: req.headers,
    });
  } else {
    // In the browser
    return axios.create({
      baseURL: "/",
    });
  }
}
