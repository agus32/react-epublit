import React from "react";
import { Modal, Form, Input, Button } from "antd";

export const EditPerfil = ({ visible, onClose, onSave, user }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title="Editar Perfil"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ email: user.email, punto_venta: user.punto_venta }}
        onFinish={onSave}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{type: "email"}]}
        >
          <Input placeholder="Ingrese su email" />
        </Form.Item>

        <Form.Item
          label="Punto de Venta"
          name="punto_venta"
        >
          <Input placeholder="Ingrese su punto de venta" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Guardar Cambios
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

