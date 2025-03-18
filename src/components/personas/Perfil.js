import React,{useState,useEffect} from 'react';
import { GetUser } from '../ApiHandler';
import { Card, Avatar, Button, Descriptions, Typography, Divider,Tag} from "antd";
import { Spinner } from 'react-bootstrap';
import { usePerson } from '../../context/PersonContext';
import { LogoutOutlined, UserOutlined } from "@ant-design/icons"

export const Perfil = () => {
    const { doLogout } = usePerson();
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);

    const { Title } = Typography;

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
      <div className="container max-w-3xl mx-auto p-4">
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
          <Spinner animation="border" role="status" />
        </div>
      ) : (
        <Card
          className="shadow-sm p-4"
          actions={[
            <Button
              key="logout"
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={doLogout}
              size="large"
              
            >
              Cerrar Sesión
            </Button>,
          ]}
        >
          <div className="d-flex flex-column flex-md-row align-items-center gap-3 mb-4">
            <Avatar size={96} icon={<UserOutlined />} src={user.avatar} style={{ backgroundColor: "#1890ff" }} />
            <div>
              <Title level={2} className="mb-0">
                {user.username}
              </Title>
              <Title level={4} className="mb-0 text-muted">
                {user.razon_social}
              </Title>
            </div>
          </div>
    
          <Divider className="my-3" />
    
          <Descriptions
            bordered
            column={{ xs: 1, sm: 2 }}
            labelStyle={{ fontWeight: "bold", backgroundColor: "#f0f2f5", padding: "10px" }}
            contentStyle={{ padding: "10px" }}
            className="rounded shadow-sm"
          >
            <Descriptions.Item label="Razón Social" span={2}>
              <strong>{user.razon_social}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="CUIT" span={2}>
              <span className="text-primary">{user.cuit}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Condición Fiscal" span={2}>
              <Tag color="blue">{user.cond_fiscal}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Domicilio" span={2}>
              <span className="text-secondary">{user.domicilio}</span>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    </div>    
    );
};