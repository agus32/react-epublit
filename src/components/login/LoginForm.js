import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { usePerson } from "../../context/PersonContext";

export const LoginForm = () => {
  const { doLogin } = usePerson();

  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await doLogin(user);
  };

  const handleChange = (event) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <Form onSubmit={handleSubmit} style={{ width: "350px"}}>
      <h1>Login</h1>
      <Form.Group className="mb-3">
        <Form.Label>Usuario</Form.Label>
        <Form.Control
          type="text"
          name="username"
          placeholder="Usuario"
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control
          type="password"
          name="password"
          placeholder="Constraseña"
          onChange={handleChange}
        />
      </Form.Group>

      <Button variant="outline-light" type="submit">
        Enviar
      </Button>
      <div style={{ textAlign: "right", marginTop: "10px" }}>
        <a href="/register" style={{ color: "white", textDecoration: "none" }}>
          ¿No tienes una cuenta? 
        </a>{" "}
        <a href="/register" style={{ color: "white" }}>
           Regístrate
        </a>
      </div>
    </Form>
  );
};
