import React, { useEffect, useState } from "react";
import {Button,Col,Row,Form} from "react-bootstrap";
import {GetClientesConsignacion,GetStockById,PostDevolucionConsignacion} from "../ApiHandler";
import Swal from "sweetalert2";
import Select from "react-select";

export const BajaConsignaciones = () => {
  const[clientes, setClientes] = useState([]);
  const[libros, setLibros] = useState([]);
  const[inputs, setInputs] = useState({isbn:"",cantidad:""});
  const[librosSeleccionados, setLibrosSeleccionados] = useState([]);
  const[clienteSeleccionado, setClienteSeleccionado] = useState("");

  const getClientes = async () => {
    const data = await GetClientesConsignacion();
    setClientes(data);
  }

  useEffect(() => {
    getClientes();
  }, []);


  
  useEffect(() => {
    const getLibros = async () => {
      if(clienteSeleccionado){
          setLibrosSeleccionados([]);
          const response = await GetStockById(clienteSeleccionado);
          setLibros(response);
      }
    };
    getLibros();
  }, [clienteSeleccionado]);

  const handleLibroChange = (selectedOption) => {
    setInputs((values) => ({
      ...values,
      libro: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const listaLibros = librosSeleccionados.map((libro) => {
      return {
        isbn: libro.libro.isbn,
        cantidad: parseInt(libro.cantidad),
      };
    });
    PostDevolucionConsignacion(parseInt(clienteSeleccionado),listaLibros);
    e.target.reset();
    setLibrosSeleccionados([]);
    
  }

  const handleChange = (event) => {
    setInputs((values) => ({ ...values, [event.target.name]: event.target.value }));
  };

  const handleSeleccionadoAdd = (event) => {
    event.preventDefault();

    if (inputs.cantidad === "" || inputs.libro === "") {
      Swal.fire({
        title: "Advertencia",
        text: "Debe completar todos los campos",
        icon: "warning",
      });
      return;
    }

    const selectedBook = libros.find((libro) => libro.isbn === inputs.libro)
 

    if (!selectedBook) {
      Swal.fire({
        title: "Error",
        text: "El libro seleccionado no se encuentra disponible",
        icon: "error",
      });
      return;
    }

    const newQuantity = parseInt(inputs.cantidad, 10);
    const existingBook = librosSeleccionados.find(
      (item) => item.libro.isbn === selectedBook.isbn
    );

    // Validamos que la suma de la cantidad no supere el stock del libro
    if (existingBook) {
      if (existingBook.cantidad + newQuantity > selectedBook.stock) {
        Swal.fire({
          title: "Error",
          text: "No puede agregar más libros que el stock disponible",
          icon: "error",
        });
        return;
      }
    } else {
      if (newQuantity > selectedBook.stock) {
        Swal.fire({
          title: "Error",
          text: "La cantidad supera el stock disponible",
          icon: "error",
        });
        return;
      }
    }

    if (existingBook) {
      const updatedLibrosSeleccionados = librosSeleccionados.map((item) =>
        item.libro.isbn === selectedBook.isbn
          ? { ...item, cantidad: item.cantidad + newQuantity }
          : item
      );
      setLibrosSeleccionados(updatedLibrosSeleccionados);
    } else {
      setLibrosSeleccionados([
        ...librosSeleccionados,
        { cantidad: newQuantity, libro: selectedBook },
      ]);
    }

    setInputs({ libro: "", cantidad: "" });
  };

  const handleSeleccionadoDelete = (isbn) => {
    setLibrosSeleccionados(
      librosSeleccionados.filter((libro) => libro.isbn !== isbn)
    );
  }

  const librosOptions =
    clienteSeleccionado
      ? libros
          .filter((libro) => libro.stock > 0)
          .map((libro) => ({
            value: libro.isbn,
            label: `${libro.titulo} (${libro.stock})`,
            stock: libro.stock,
          }))
      : []


  return (
    <div className="container mt-4">
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
          <div key={libro.libro.isbn} className="mb-2">
            <span className="align-middle">📘{libro.libro.titulo}</span>{" "}
            <span className="align-middle">({libro.cantidad})</span>
            <button
              type="button"
              className="btn-close align-middle"
              aria-label="Close"
              onClick={() => handleSeleccionadoDelete(libro.libro.isbn)}
            />
          </div>
        ))}

        <Row className="mb-3 align-items-center">
          <Form.Group as={Col} controlId="libro">
              <Select
                options={librosOptions}
                value={
                  librosOptions.find((option) => option.value === inputs.libro) ||
                  null
                }
                onChange={handleLibroChange}
                placeholder={
                  clienteSeleccionado
                    ? "Seleccione un libro"
                    : "Seleccione un cliente"
                }
                isDisabled={!clienteSeleccionado}
              />
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