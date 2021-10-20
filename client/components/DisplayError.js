import styled from "styled-components";
import React from "react";

import PropTypes from "prop-types";

const ErrorStyles = styled.div`
  padding: 2rem;
  background: white;
  margin: 2rem 0;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-left: 5px solid red;
  p {
    margin: 0;
    font-weight: 100;
  }
  strong {
    margin-right: 1rem;
  }
`;

const DisplayError = ({ error }) => {
  if (!error || !error.message) {
    return null;
  } else if (error.response) {
    return (
      <ErrorStyles>
        <p data-test="graphql-error">
          <strong>Shoot!</strong>
          {error.response.data.errors.map((err) => (
            <li key={err.message}>{err.message}</li>
          ))}
        </p>
      </ErrorStyles>
    );
  } else {
    return (
      <ErrorStyles>
        <p data-test="graphql-error">
          <strong>Shoot!</strong>
          {error.message.replace("GraphQL error: ", "")}
        </p>
      </ErrorStyles>
    );
  }
};

export default DisplayError;
