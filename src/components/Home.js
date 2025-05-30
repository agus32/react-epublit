import React from 'react';
import { Card, Typography, Layout } from 'antd';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

// Objeto de ejemplo
const noticias = [
  {
    titulo: 'Versión 1.0 de la plataforma Epublit',
    fecha: '29 de mayo de 2025',
    descripcion: 'Ahora podés editar tu perfil desde la sección perfil.',
    autor: 'Equipo de desarrollo',
  },
  {
    titulo: 'Nueva funcionalidad de búsqueda avanzada',
    fecha: '27 de mayo de 2025',
    descripcion: 'Ahora podés buscar libros por autor, título o género.',
    autor: 'Equipo de desarrollo',
  }
];

export const Home = () => {
  return (
    <Layout style={{
        backgroundImage: 'url("/media/library.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        paddingTop: '3rem',
        paddingBottom: '3rem',
      }}>
      <Content className="container">
        <div className="text-center mb-4">
          <img
            src="/media/epublit_logo.png"
            alt="Epublit Logo"
            className="img-fluid"            
          />
        </div>
        <div className="bg-white rounded-4 shadow p-4">
          <Title level={2} className="text-center mb-4">
            Noticias de la semana
          </Title>
          {noticias.map((item, index) => (
            <Card
              key={index}
              className="mb-4 rounded-3"
              bodyStyle={{ padding: '1.5rem' }}
            >
              <Title level={4}>{item.titulo}</Title>
              <Text type="secondary">{item.fecha} · {item.autor}</Text>
              <Paragraph className="mt-3">{item.descripcion}</Paragraph>
            </Card>
          ))}
        </div>
      </Content>
    </Layout>
  );
};

