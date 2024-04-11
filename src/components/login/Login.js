import React from "react";
import "../../App.css";
import { Navbar, Container } from "react-bootstrap";
import { LoginForm } from "./LoginForm";

export const Login = () => {
  return (
    <div className="bdy">
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">
            <img
              alt="epublit logo"
              src={require("../../media/epublit_logo.png")}
              height="35"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
        </Container>
      </Navbar>
      <div className="sign-in-box">
        <h1>Login</h1>
        <LoginForm />
      </div>
    </div>
  );
};
