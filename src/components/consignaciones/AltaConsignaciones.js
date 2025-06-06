import React, { useEffect, useState } from "react";
import {Button,Col,Row,Form,Spinner,Table,InputGroup} from "react-bootstrap";
import {PostConsignacion,GetConsignacionByID,GetClientes,GetLibros,GetConsignaciones} from "../ApiHandler";
import { formatDate } from "../utils";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import Select from 'react-select';

const ConsignacionesForm = ({ clientes, libros }) => {
  const [librosSeleccionados, setLibrosSeleccionados] = useState([]);
  const [inputs, setInputs] = useState({ libro: "", cantidad: "" });

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleLibroChange = (selectedOption) => {
    setInputs((values) => ({
      ...values,
      libro: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleSeleccionadoDelete = (isbn) => {
    setLibrosSeleccionados(
      librosSeleccionados.filter((libro) => libro.libro.isbn !== isbn)
    );
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
          item.libro.isbn === existingBook.libro.isbn
            ? { ...item, cantidad: item.cantidad + parseInt(inputs.cantidad) }
            : item
        );
        setLibrosSeleccionados(updatedLibrosSeleccionados);
      } else {
        setLibrosSeleccionados([
          ...librosSeleccionados,
          {
            cantidad: parseInt(inputs.cantidad),
            libro: libros.find((libro) => libro.isbn === inputs.libro),
          },
        ]);
      }

      setInputs({ libro: "", cantidad: "" });
    
  };

  const librosOptions = libros
                          .filter((libro) => libro.stock > 0)
                          .map((libro) => ({
                            value: libro.isbn,
                            label: `${libro.titulo} (${libro.stock})`,
                            stock: libro.stock,
                          }));  

  const handleSubmit = (event) => {
    event.preventDefault();
    const listaLibros = librosSeleccionados.map((libro) => {
      return {
        isbn: libro.libro.isbn,
        cantidad: parseInt(libro.cantidad),
      };
    });

    PostConsignacion(parseInt(event.target.cliente.value),listaLibros);
    event.target.reset();
    setLibrosSeleccionados([]);
  };

  return (
    <div className="container mt-3">
      <h2 className="mb-4"> Alta de consignaciones</h2>
      <Form onSubmit={handleSubmit}>
        <Col xs={8} className="mb-4">
          <Form.Group controlId="cliente">
            <h4>Cliente</h4>
            <Form.Select>
              {clientes.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
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
              value={
                librosOptions.find((option) => option.value === inputs.libro) ||
                null
              }
              name="libro"
              onChange={handleLibroChange}
              options={librosOptions}
              placeholder="Seleccione un libro..."
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


const ListaConsignaciones = ({ consignaciones }) => {
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  const filteredItems = consignaciones.filter(
    (item) =>
      item.nombre_cliente &&
      item.nombre_cliente.toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (
      <FilterComponent
        onFilter={(e) => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  return (
    <div className="container mt-1">
      <DataTable
        title="Consignaciones"
        columns={columns}
        data={filteredItems}
        pagination
        paginationResetDefaultPage={resetPaginationToggle}
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        persistTableHead
        expandableRows
        expandableRowsComponent={ExpandedComponent}
      />
    </div>
  );
};

const columns = [
  {
    name: "ID",
    selector: (row) => row.id,
    sortable: true,
  },
  {
    name: "Nombre Cliente",
    selector: (row) => row.nombre_cliente,
    sortable: true,
  },
  {
    name: "Cuit",
    selector: (row) => row.cuit,
    sortable: true,
  },
  {
    name: "Fecha",
    selector: (row) => formatDate(row.fecha),
    sortable: true,
  },
];

const ExpandedComponent = ({ data }) => {
  const [loading, setLoading] = useState(true);
  const [consignacion, setConsignacion] = useState(null);

  useEffect(() => {
    const fetchConsignaciones = async () => {
      try {
        const cons = await GetConsignacionByID(data.id);
        setConsignacion(cons);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    
    fetchConsignaciones();
  }, [data]);

  

  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  } else {
    return (
      <div className="container">
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>ISBN</th>
              <th>Titulo</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
          {consignacion.libros?.map((fila) => (
              <tr key={fila.isbn}>
                <td>{fila.isbn}</td>
                <td>{fila.titulo}</td>
                <td>{fila.cantidad}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button variant="success" onClick={() => window.open(consignacion.file_path, "_blank")}>
          Remito
        </Button>
      </div>
    );
  }
};

const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <InputGroup>
    <Form.Control
      id="search"
      type="text"
      placeholder="Buscar por cliente..."
      value={filterText}
      onChange={onFilter}
    />
    <Button variant="outline-secondary" onClick={onClear}>
      x
    </Button>
  </InputGroup>
);

export const AltaConsignaciones = () => {
  const [clientes, setClientes] = useState([]);
  const fetchClientes = async () => {
    const data = await GetClientes();
    setClientes(data);
  };

  const [libros, setLibros] = useState([]);
  const fetchLibros = async () => {
    const data = await GetLibros();
    setLibros(data);
  };

  const [consignaciones, setConsignaciones] = useState([]);
  const fetchConsignaciones = async () => {
    const data = await GetConsignaciones();
    setConsignaciones(data);
  };

  useEffect(() => {
    fetchClientes();
    fetchLibros();
    fetchConsignaciones();
  }, []);

  return (
    <div className="container mt-10">
      <ConsignacionesForm clientes={clientes} libros={libros} />
      <ListaConsignaciones consignaciones={consignaciones} />
    </div>
  );
};
