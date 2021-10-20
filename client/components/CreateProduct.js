import Router from "next/router";
import useRequest from "../hooks/use-request";
import useForm from "../hooks/useForm";
import DisplayError from "../components/DisplayError";
import Form from "./styles/Form";

export default function CreateProduct() {
  // Hook to manage forms
  const { inputs, handleChange } = useForm({
    image: "",
    title: "",
    price: "",
    description: "",
  });

  const { image, title, price, description } = inputs;

  // Hook to manage request
  const { doRequest, error } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: {
      title,
      price,
    },
    onSuccess: (tikcet) => Router.push("/"),
  });

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
    inputs.price = value.toFixed(2);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <DisplayError error={error} />
      <fieldset>
        <label htmlFor="title">
          title
          <input
            type="text"
            id="title"
            name="title"
            placeholder="title"
            value={inputs.title}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="price">
          Price
          <input
            type="text"
            id="price"
            name="price"
            placeholder="price"
            value={inputs.price}
            onBlur={onBlur}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="description">
          Description
          <textarea
            id="description"
            name="description"
            placeholder="Description"
            value={inputs.description}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="image">
          Image
          <input type="file" id="image" name="image" onChange={handleChange} />
        </label>
        <button type="submit">+ Add Product</button>
      </fieldset>
    </Form>
  );
}