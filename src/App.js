import { NavBar } from "./components/NavBar";
import React from "react";
import { Route, Routes } from "react-router-dom";
import { Login } from "./components/login/Login";
import { LoginForm } from "./components/login/LoginForm";
import { RegisterForm } from "./components/login/RegisterForm";
import { Spinner } from "react-bootstrap";
import { PersonProvider, usePerson } from "./context/PersonContext";
import { Autores } from "./components/personas/Autores";
import { Ilustradores } from "./components/personas/Ilustradores";
import { ListarLibros } from "./components/libros/ListaLibros";
import { CrearLibro } from "./components/libros/NuevoLibro";
import { ShowClientes } from "./components/clientes/Clientes";
import { ShowVentas } from "./components/ventas/Ventas";
import { AltaConsignaciones } from "./components/consignaciones/AltaConsignaciones";
import { BajaConsignaciones } from "./components/consignaciones/BajaConsignaciones";
import { Perfil } from "./components/personas/Perfil";
import { Metricas } from "./components/Metricas";
import { Home } from "./components/Home";


const AppRender = () => {
  const { user, loading } = usePerson();

  if (loading) {
    return (
      <Spinner className="loading-spinner" animation="border" role="status" />
    );
  }

  if(Object.keys(user).length === 0){
    return (
      <Routes>
        <Route path="/*" element={<Login Child={LoginForm}/>} />
        <Route path="/register" element={<Login Child={RegisterForm}/>} />
      </Routes>
    )
  }

  return(
  <div className="App">
    <NavBar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/lista-libros" element={<ListarLibros />} />
      <Route path="/nuevo-libro" element={<CrearLibro />} />
      <Route path="/ventas" element={<ShowVentas />} />
      <Route path="/clientes" element={<ShowClientes />} />
      <Route path="/autores" element={<Autores />} />
      <Route path="/ilustradores" element={<Ilustradores />} />
      <Route path="/alta-consignacion" element={<AltaConsignaciones />} />
      <Route path="/baja-consignacion" element={<BajaConsignaciones />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/metricas" element={<Metricas />} />
    </Routes>
  </div>
  ); 
};

function App() {
  return (
    <PersonProvider>
      <AppRender />
    </PersonProvider>
  );
}

export default App;
