import React,{useState,useEffect} from 'react';
import { GetUser } from '../ApiHandler';
import { Button, Card, Container, Spinner } from 'react-bootstrap';
import { usePerson } from '../../context/PersonContext';


export const Perfil = () => {
    const { doLogout } = usePerson();
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLoggedUser = async () => {
            const response = await GetUser();
            setUser(response?.data);
            setLoading(false);
        };
        fetchLoggedUser();
    }
    , []);

    return (
    <Container className="mt-5">
      <Card className="shadow-sm rounded">
      {loading ? 
        <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
          <Spinner animation="border" role="status" />
        </div> 
        : 
        <Card.Body>        
          <Card.Title className="text-center mb-4">Perfil de Usuario</Card.Title>
          <div className="mb-3">
            <strong>Username:</strong> <span>{user.username}</span>
          </div>
          <div className="mb-3">
            <strong>Razón Social:</strong> <span>{user.razon_social}</span>
          </div>
          <div className="mb-3">
            <strong>Domicilio:</strong> <span>{user.domicilio}</span>
          </div>
          <div className="mb-3">
            <strong>Condición Fiscal:</strong> <span>{user.cond_fiscal}</span>
          </div>
          <div className="mb-3">
            <strong>CUIT:</strong> <span>{user.cuit}</span>
          </div>
          <div className="text-center">
            <Button
              variant="danger"
              size="lg"
              onClick={doLogout}
              className="w-100"
            >
              Cerrar Sesión
            </Button>
          </div>          
        </Card.Body>
      }
      </Card>
    </Container>
    );
};