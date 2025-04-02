import React from "react";
import "../../App.css";
import { Navbar, Container } from "react-bootstrap";

export const Login = ({Child}) => {
  return (
    <div style={{
      backgroundImage: 'url("/media/library.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
    }}>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">
            <img
              alt="epublit logo"
              src="/media/epublit_logo.png"
              height="35"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
        </Container>
      </Navbar>
      <div className="sign-in-box">
        <Child/>
      </div>
    </div>
  );
};
