import React, { useEffect, useState } from "react";
import {Button,Col,Row,Form} from "react-bootstrap";
import {GetClientesConsignacion,GetStockById,PostDevolucionConsignacion} from "../ApiHandler";
import Swal from "sweetalert2";

const ConsignacionesForm = () => {
  const[clientes, setClientes] = useState([]);
  const[libros, setLibros] = useState([]);
  const[inputs, setInputs] = useState({isbn:"",cantidad:""});
  const[librosSeleccionados, setLibrosSeleccionados] = useState([]);
  const[clienteSeleccionado, setClienteSeleccionado] = useState(-1);

  const getClientes = async () => {
    const data = await GetClientesConsignacion();
    setClientes(data);
  }

  useEffect(() => {
    getClientes();
  }, []);


  
  useEffect(() => {
    const getLibros = async () => {
      if(parseInt(clienteSeleccionado) !== -1){
          const response = await GetStockById(clienteSeleccionado);
          setLibros(response);
      }
    };
    getLibros();
  }, [clienteSeleccionado]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(parseInt(clienteSeleccionado) === -1 || librosSeleccionados.length === 0){
      Swal.fire({
        title: "Advertencia",
        text: "Debe completar todos los campos",
        icon: "warning",
      });
    }else{
        PostDevolucionConsignacion(parseInt(clienteSeleccionado),librosSeleccionados);
      }
    e.target.reset();
    setLibrosSeleccionados([]);
    
  }

  const handleChange = (event) => {
    setInputs((values) => ({ ...values, [event.target.name]: event.target.value }));
  };

  const handleSeleccionadoAdd = (event) => {
    event.preventDefault();
    if (inputs.cantidad === "" || inputs.isbn === "") {
      Swal.fire({
        title: "Advertencia",
        text: "Debe completar todos los campos",
        icon: "warning",
      });
    } else {
      const existingBook = librosSeleccionados.find(
        (item) => item.isbn === inputs.isbn
      );
  
      if (existingBook) {
        const updatedLibrosSeleccionados = librosSeleccionados.map((item) =>
          item.isbn === existingBook.isbn
            ? { ...item, cantidad: item.cantidad + parseInt(inputs.cantidad) }
            : item
        );
        setLibrosSeleccionados(updatedLibrosSeleccionados);
      } else {
        setLibrosSeleccionados([
          ...librosSeleccionados,
          {
            cantidad: parseInt(inputs.cantidad),
            isbn: inputs.isbn,
            titulo: libros.find((libro) => libro.isbn === inputs.isbn).titulo,
          },
        ]);
      }

      setInputs({ isbn: "", cantidad: "" });
    }
  };

  const handleSeleccionadoDelete = (isbn) => {
    setLibrosSeleccionados(
      librosSeleccionados.filter((libro) => libro.isbn !== isbn)
    );
  }



  return (
    <div className="container mt-3">
      <h2 className="mb-4"> Devolución de libros consignados</h2>     
      <Form onSubmit={handleSubmit}>
      <Row className="mb-3 align-items-center">
          <Col xs={8} className="mb-4">
          <Form.Group controlId="cliente">
            <h4>Cliente</h4>
            <Form.Select value={clienteSeleccionado} onChange={(e) => setClienteSeleccionado(e.target.value)}>
                <option value={-1}>Seleccione un cliente</option>
              {clientes.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        </Row>
        <h4>Libros</h4>

        {librosSeleccionados.map((libro) => (
          <div key={libro.isbn} className="mb-2">
            <span className="align-middle">📘{libro.titulo}</span>{" "}
            <span className="align-middle">({libro.cantidad})</span>
            <button
              type="button"
              className="btn-close align-middle"
              aria-label="Close"
              onClick={() => handleSeleccionadoDelete(libro.isbn)}
            />
          </div>
        ))}

        <Row className="mb-3 align-items-center">
          <Form.Group as={Col} controlId="libro">
            <Form.Select
              value={inputs.isbn}
              name="isbn"
              onChange={handleChange}
            >
              {parseInt(clienteSeleccionado) === -1 ? <option value="">Seleccione un cliente</option> : <option value="">Seleccione un libro</option>}
              {libros.map((libro) => (
                <option key={libro.isbn} value={libro.isbn}>
                  {libro.titulo} ({libro.stock})
                </option>
              ))}
              
            </Form.Select>
          </Form.Group>

          <Form.Group as={Col} controlId="cantidad">
            <Form.Control
              type="number"
              placeholder="Cantidad"
              name="cantidad"
              value={inputs.cantidad || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Col>
            <Button
              variant="outline-primary"
              type="submit"
              onClick={handleSeleccionadoAdd}
            >
              Agregar
            </Button>
          </Col>
        </Row>

        <Button variant="primary" type="submit">
          Enviar
        </Button>
      </Form>
    </div>
  );
};


export const BajaConsignaciones = () => (
    <div className="container mt-1">
      <ConsignacionesForm/>
    </div>
)
 