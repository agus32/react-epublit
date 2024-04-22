import React from "react";
import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { usePerson } from "../context/PersonContext";

export const NavBar = () => {
  const { doLogout } = usePerson();

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">
          <img
              alt="epublit logo"
              src={require("../media/epublit_logo.png")}
              height="35"
              className="d-inline-block align-top"
            />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="Libros" id="collasible-nav-dropdown">
              <NavDropdown.Item href="nuevo-libro">
                Nuevo Libro
              </NavDropdown.Item>
              <NavDropdown.Item href="lista-libros">
                Lista de Libros
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link href="ventas">Ventas</Nav.Link>
            <Nav.Link href="clientes">Clientes</Nav.Link>
            <NavDropdown title="Personas" id="collasible-nav-dropdown">
              <NavDropdown.Item href="autores">
                Autores
              </NavDropdown.Item>
              <NavDropdown.Item href="ilustradores">
                Ilustradores
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="consignaciones">Consignaciones</Nav.Link>
          </Nav>
          <Button variant="outline-light" onClick={doLogout}>
            Logout
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
