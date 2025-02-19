import {Button,Col,Row,Form,Table,InputGroup,Spinner} from "react-bootstrap";
import Select from 'react-select';
import React, { useEffect, useState } from "react";
import {PostVenta,GetVentaById,GetClientes,GetLibros,GetMedioPago,GetAllVentas,GetStockById,PostVentaConsignacion} from "../ApiHandler";
import { formatDate } from "../utils";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";

const AltaVenta = ({ Clientes, medioPago, libros, fetchVentas }) => {
  const [librosSeleccionados, setLibrosSeleccionados] = useState([]);
  const [inputs, setInputs] = useState({ libro: "", cantidad: "" });
  const [tipoVenta, setTipoVenta] = useState("");
  const [librosDisponibles, setLibrosDisponibles] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleTipoVentaChange = (event) => {
    setTipoVenta(event.target.value);
    setLibrosSeleccionados([]);
    setInputs({ libro: "", cantidad: "" });
    setClienteSeleccionado("");
    setLibrosDisponibles([]);
  };

  const handleClienteChange = async (event) => {
    const clienteId = event.target.value;
    setClienteSeleccionado(clienteId);
    if (tipoVenta === "consignacion" && clienteId !== "") {
      // Se obtienen los libros disponibles para este cliente
      const librosConsignacion = await GetStockById(clienteId);
      setLibrosDisponibles(librosConsignacion);
    } else {
      setLibrosDisponibles([]);
    }
  };

  const handleSeleccionadoDelete = (isbn) => {
    setLibrosSeleccionados(
      librosSeleccionados.filter((libro) => libro.libro.isbn !== isbn)
    );
  };


  const handleLibroChange = (selectedOption) => {
    setInputs((values) => ({
      ...values,
      libro: selectedOption ? selectedOption.value : "",
    }));
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

    const selectedBook =
      tipoVenta === "firme"
        ? libros.find((libro) => libro.isbn === inputs.libro)
        : librosDisponibles.find((libro) => libro.isbn === inputs.libro);

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

  const handleSubmit = async(event) => {
    event.preventDefault();

    const listaLibros = librosSeleccionados.map((item) => ({
      isbn: item.libro.isbn,
      cantidad: parseInt(item.cantidad, 10),
    }));

    if (tipoVenta === "firme") {
      const response = await PostVenta(
        parseInt(event.target.cliente.value, 10),
        parseFloat(event.target.descuento.value) || 0,
        event.target.medio_pago.value,
        parseInt(event.target.tipo_cbte.value, 10),
        listaLibros
      );
      if(!response.success) return; 
    } else {
      const response = await PostVentaConsignacion(
        parseInt(event.target.cliente.value, 10),
        event.target.fecha_venta.value,
        parseFloat(event.target.descuento.value) || 0,
        event.target.medio_pago.value,
        parseInt(event.target.tipo_cbte.value, 10),
        listaLibros
      );
      if(!response.success) return; 
    }
    fetchVentas();
    event.target.reset();
    setLibrosSeleccionados([]);
  };

  const librosOptions =
    tipoVenta === "consignacion"
      ? clienteSeleccionado
        ? librosDisponibles
            .filter((libro) => libro.stock > 0)
            .map((libro) => ({
              value: libro.isbn,
              label: `${libro.titulo} (${libro.stock})`,
              stock: libro.stock,
            }))
        : []
      : libros
          .filter((libro) => libro.stock > 0)
          .map((libro) => ({
            value: libro.isbn,
            label: `${libro.titulo} (${libro.stock})`,
            stock: libro.stock,
          }));

  return (
    <div className="container mt-3">
      <Form>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="tipo_venta">
              <Form.Label>Tipo de Venta</Form.Label>
              <Form.Select value={tipoVenta} onChange={handleTipoVentaChange}>
                <option value="">Seleccione tipo de venta</option>
                <option value="firme">Venta en Firme</option>
                <option value="consignacion">Venta sobre Consignación</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Form>

      {tipoVenta && (
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3 mt-3">
            <Col sm>
              <Form.Group className="mb-3" controlId="cliente">
                <Form.Label>Cliente</Form.Label>
                <Form.Select onChange={handleClienteChange}>
                  <option value="">Seleccione un cliente</option>
                  {Clientes.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col sm>
              <Form.Group className="mb-3" controlId="descuento">
                <Form.Label>Descuento</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="0.00"
                />
              </Form.Group>
            </Col>
            <Col sm>
              <Form.Group className="mb-3" controlId="medio_pago">
                <Form.Label>Medio de Pago</Form.Label>
                <Form.Select defaultValue="Choose...">
                  {medioPago.map((medio, index) => (
                    <option key={index} value={medio}>
                      {medio}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col sm>
              <Form.Group controlId="tipo_cbte">
                <Form.Label>Tipo de Factura</Form.Label>
                <Form.Select>
                  <option key={1} value={1} disabled>
                    Factura A
                  </option>
                  <option key={6} value={6} disabled>
                    Factura B
                  </option>
                  <option key={11} value={11}>
                    Factura C
                  </option>
                  <option key={51} value={51} disabled>
                    Factura M
                  </option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {tipoVenta === "consignacion" && (
            <Row className="mb-3">
              <Col xs={6} sm>
                <Form.Group className="mb-3" controlId="fecha_venta">
                  <Form.Label>Fecha de Venta</Form.Label>
                  <Form.Control type="date" />
                </Form.Group>
              </Col>
            </Row>
          )}

          <h4>Libros</h4>

          {librosSeleccionados.length !== 0 && (
            <Table bordered hover size="sm">
              <thead>
                <tr>
                  <th>Título</th>
                  <th className="text-center">Cantidad</th>
                  <th className="text-end">Precio Unitario</th>
                  <th className="text-center">Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {librosSeleccionados.map((item) => (
                  <tr key={item.libro.isbn}>
                    <td>{item.libro.titulo}</td>
                    <td className="text-center">{item.cantidad}</td>
                    <td className="text-end">{item.libro.precio}</td>
                    <td className="text-center">
                      <button
                        type="button"
                        className="btn-close align-middle"
                        aria-label="Close"
                        onClick={() => handleSeleccionadoDelete(item.libro.isbn)}
                      />
                    </td>
                  </tr>
                ))}
                <tr>
                  <td>Total:</td>
                  <td colSpan={3} className="text-start">
                    {librosSeleccionados.reduce((total, item) => {
                      const cantidad = parseInt(item.cantidad, 10);
                      const precioUnitario = item.libro.precio;
                      return total + cantidad * precioUnitario;
                    }, 0)}
                  </td>
                </tr>
              </tbody>
            </Table>
          )}

          <br />

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
                  tipoVenta === "consignacion" && !clienteSeleccionado
                    ? "Seleccione un cliente"
                    : "Seleccione un libro"
                }
                isDisabled={tipoVenta === "consignacion" && !clienteSeleccionado}
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
                type="button"
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
      )}
    </div>
  );
};


const Ventas = ({ Clientes, medioPago, libros, ventas, fetchVentas }) => {
  return (
    <div className="container mt-3">
      <h2>Nueva venta</h2>
      <AltaVenta
        Clientes={Clientes}
        medioPago={medioPago}
        libros={libros}
        fetchVentas={fetchVentas}
      />
      <ListaVentas ventas={ventas} />
    </div>
  );
};

const ListaVentas = ({ ventas }) => {
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  const filteredItems = ventas.filter(
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
        title="Ventas"
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
    name: "Tipo Venta",
    selector: (row) => row.type === "venta" ? "En Firme" : "Sobre Consignado",
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
    name: "Medio de pago",
    selector: (row) => row.medio_pago,
    sortable: true,
  },
  {
    name: "Fecha",
    selector: (row) => formatDate(row.fecha),
    sortable: true,
  },
  {
    name: "Total",
    selector: (row) => row.total,
    sortable: true,
  },
];

const ExpandedComponent = ({ data }) => {
  const [loading, setLoading] = useState(true);
  const [ventas, setVentas] = useState(null);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const venta = await GetVentaById(data.id);
        setVentas(venta);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchVentas();
  }, [data]);

  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Cargando...</span>
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
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {ventas.libros?.map((fila) => (
              <tr key={fila.isbn}>
                <td>{fila.isbn}</td>
                <td>{fila.titulo}</td>
                <td>{fila.cantidad}</td>
                <td>{fila.precio}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button
          variant="success"
          onClick={() => window.open(ventas.file_path, "_blank")}
        >
          Factura
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

export const ShowVentas = () => {
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

  const [medioPago, setMedioPago] = useState([]);
  const fetchMedioPago = async () => {
    const data = await GetMedioPago();
    setMedioPago(data);
  };
  const [ventas, setVentas] = useState([]);
  const fetchVentas = async () => {
    const data = await GetAllVentas();
    setVentas(data);
  };

  useEffect(() => {
    fetchClientes();
    fetchLibros();
    fetchMedioPago();
    fetchVentas();
  }, []);

  return (
    <Ventas
      Clientes={clientes}
      libros={libros}
      medioPago={medioPago}
      ventas={ventas}
      fetchVentas={fetchVentas}
    />
  );
};
