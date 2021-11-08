import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Router from "next/router";
import useRequest from "../hooks/useRequest";
// import useForm from "../hooks/useForm";
import DisplayError from "../components/DisplayError";
import Form from "./styles/Form";
import UploaderField from "./images/UploaderField";

export default function CreateProduct() {
  // Hook to manage forms
  // const { inputs, handleChange } = useForm({
  //   title: "",
  //   price: "",
  //   description: "",
  // });
  // const { title, price, description } = inputs;
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(null);
  const [description, setDescription] = useState("");

  // Custom Hook to manage requests
  const { doRequest, errors, setErrors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: {
      title,
      price,
      description,
      images,
    },
    onSuccess: (product) => {
      toast.success(`${product.title} created`);
      setTimeout(() => {
        Router.push("/");
      }, 5000);
    },
  });

  useEffect(() => {
    if (errors) {
      console.log(errors);
      errors.forEach((error) => toast.error(error.message));
    }
    return () => {
      setErrors(null);
    };
  }, [errors]);

  const handleSubmit = (event) => {
    event.preventDefault();
    doRequest();
  };

  // Fix the price with two digits
  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) {
      return;
    }
    setPrice(value.toFixed(2));
  };

  return (
    <div>
      <ToastContainer />
      <Form onSubmit={handleSubmit}>
        {/* <DisplayError error={error} /> */}
        <fieldset>
          <label htmlFor="title">
            title
            <input
              type="text"
              id="title"
              name="title"
              placeholder="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label htmlFor="price">
            Price
            <input
              type="text"
              id="price"
              name="price"
              placeholder="price"
              value={price}
              onBlur={onBlur}
              onChange={(e) => setPrice(e.target.value)}
            />
          </label>
          <label htmlFor="description">
            Description
            <textarea
              id="description"
              name="description"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <label htmlFor="images">
            Images
            <UploaderField setImages={setImages} />
          </label>
          <button type="submit">+ Add Product</button>
        </fieldset>
      </Form>
    </div>
  );
}
