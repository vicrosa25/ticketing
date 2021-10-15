import axios from "axios";

export default function buildClient({ req }) {
  if (typeof window === "undefined") {
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
