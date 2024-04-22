import DataTable from "react-data-table-component";
import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import { DeletePerson } from "../ApiHandler";
import Swal from "sweetalert2";

const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <InputGroup>
    <Form.Control
      id="search"
      type="text"
      placeholder="Buscar por nombre..."
      value={filterText}
      onChange={onFilter}
    />
    <Button variant="outline-secondary" onClick={onClear}>
      x
    </Button>
  </InputGroup>
);

const columns = [
  {
    name: "Nombre",
    selector: (row) => row.nombre,
    sortable: true,
  },
  {
    name: "Email",
    selector: (row) => row.email,
    sortable: false,
  },
  {
    name: "DNI",
    selector: (row) => row.dni,
    sortable: true,
  },
];

export const DataPersonTable = ({ data, setPeople, type }) => {
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);

  const handleRowSelected = React.useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const filteredItems = data.filter(
    (item) =>
      item.nombre &&
      item.nombre.toLowerCase().includes(filterText.toLowerCase())
  );
  const contextActions = React.useMemo(() => { // utilizo useMemo porque estaba en el ejemplo de la documentación, por lo que entiendo , evita que se renderice cada vez que se actualiza algo que no este en las dependencias
    const handleDelete = () =>{
    Swal.fire({
      title: "Estas seguro que quieres borrar:",
      text: `${selectedRows.map((r) => r.nombre )}?`,
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        setToggleCleared(!toggleCleared);
        setPeople(data.filter((r) => !selectedRows.includes(r)));
        selectedRows.forEach((r) => DeletePerson(r.id))
      }
    })
    };

    return (
      <Button key="delete" onClick={handleDelete} variant="danger">
        Eliminar
      </Button>
    );
  }, [data, selectedRows, toggleCleared, setPeople]);

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
    <div className="container mt-3">
      <DataTable
        title={type}
        columns={columns}
        data={filteredItems}
        pagination
        paginationResetDefaultPage={resetPaginationToggle}
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        selectableRows
        persistTableHead
        contextActions={contextActions}
        onSelectedRowsChange={handleRowSelected}
        clearSelectedRows={toggleCleared}
      />
    </div>
  );
};
