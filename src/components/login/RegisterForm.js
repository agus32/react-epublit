import React,{useState} from "react";
import { Button, Form, Spinner} from "react-bootstrap";
import {PostUser} from "../../components/ApiHandler";

export const RegisterForm = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.target);
    const data = {
      username: formData.get("username"),
      password: formData.get("password"),
      cuit: formData.get("cuit"),
      email: formData.get("email"),
    };
    const response = await PostUser(data);
    setLoading(false);
    if(response?.success){
      window.location.href = "/";
      formData.reset();
    }
    console.log(response);
  };


  return (
    <> 
    {loading ?  (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '438px',width: "400px" }}>
            <Spinner animation="border" role="status" />
        </div>
        ) : (
        <Form onSubmit={handleSubmit} style={{ width: "400px"}}>
        <h1>Register</h1>
        <Form.Group className="mb-3">
            <Form.Label>Usuario</Form.Label>
            <Form.Control type="text" name="username" placeholder="Usuario" required />
        </Form.Group>
        
        <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control type="password" name="password" placeholder="Contraseña" required />
        </Form.Group>
        
        <Form.Group className="mb-3">
            <Form.Label>CUIT</Form.Label>
            <Form.Control type="text" name="cuit" placeholder="CUIT" required />
        </Form.Group>
        
        <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" placeholder="Correo Electrónico" required />
        </Form.Group>

        <Button variant="outline-light" type="submit">
            Enviar
        </Button>        
        </Form>
    )
    }
    <div style={{ textAlign: "right", marginTop: "10px" }}>
            <a href="/" style={{ color: "white", textDecoration: "none" }}>
            ¿Ya tienes una cuenta? 
            </a>{" "}
            <a href="/" style={{ color: "white" }}>
            Ingresar
            </a>
        </div>
    </>
    
  );
};
