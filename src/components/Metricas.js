import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, DatePicker } from 'antd';
import { Line, Pie, Column } from '@ant-design/charts';
import dayjs from 'dayjs';
import { GetAllVentas } from './ApiHandler';

const { RangePicker } = DatePicker;

export const MetricasChart = ({ data }) => {
  const defaultRange = [dayjs().startOf('month'), dayjs().endOf('month')];
  const [selectedRange, setSelectedRange] = useState(defaultRange);
  const [totalSales, setTotalSales] = useState(0);
  const [salesByPayment, setSalesByPayment] = useState([]);
  const [salesByTransactionType, setSalesByTransactionType] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);

  useEffect(() => {
    if (data) {
      const filteredData = data.filter((item) => {
        if (!selectedRange) return true; // Si no hay rango, no filtrar
        const saleDate = dayjs(item.fecha).toDate();
        const startDate = selectedRange[0].toDate();
        const endDate = selectedRange[1].toDate();
        return saleDate >= startDate && saleDate <= endDate;
      });

      const totalSales = filteredData.reduce((acc, item) => acc + item.total, 0);
      setTotalSales(totalSales);

      const paymentMethods = filteredData.reduce((acc, item) => {
        acc[item.medio_pago] = (acc[item.medio_pago] || 0) + item.total;
        return acc;
      }, {});
      setSalesByPayment(Object.entries(paymentMethods).map(([key, value]) => ({ name: key, value })));

      const transactionTypes = filteredData.reduce((acc, item) => {
        acc[item.type] = (acc[item.type] || 0) + item.total;
        return acc;
      }, {});
      setSalesByTransactionType(Object.entries(transactionTypes).map(([key, value]) => ({ name: key, value })));

      const monthlyAggregation = filteredData.reduce((acc, item) => {
        const key = dayjs(item.fecha).format('MM/YY');
        acc[key] = (acc[key] || 0) + item.total;
        return acc;
      }, {});

      setMonthlySales(Object.entries(monthlyAggregation).map(([key, value]) => ({ date: key, sales: value })));
    }
  }, [selectedRange, data]);

  const handleRangeChange = (dates) => {
    setSelectedRange(dates || defaultRange); // Si es null, restablecer al mes actual
  };

  return (
    <div style={{ padding: 16 }}>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="Monto Total Vendido" value={totalSales} prefix="$" />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <RangePicker
              value={selectedRange}
              onChange={handleRangeChange}
              format="DD/MM/YYYY"
              allowClear
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Ventas por método de pago">
            <Pie data={salesByPayment} angleField="value" colorField="name" radius={0.8} label={{ text: 'name' }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Ventas por tipo de transacción">
            <Column data={salesByTransactionType} xField="name" yField="value" columnWidthRatio={0.2} colorField="name" label={{ position: 'bottom' }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Card title="Montos mensuales de venta">
            <Line data={monthlySales} xField="date" yField="sales" smooth color="#1890ff" point={{ size: 5, shape: 'circle' }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export const Metricas = () => {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    const fetchVentas = async () => {
      const data = await GetAllVentas();
      setVentas(data);
    };
    fetchVentas();
  }, []);

  return <MetricasChart data={ventas} />;
};
