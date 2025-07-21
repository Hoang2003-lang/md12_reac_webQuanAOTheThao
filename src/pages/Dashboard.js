import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Statistic, Table, Progress, List, DatePicker, Space, Typography } from 'antd';
import {
    ShoppingOutlined,
    UserOutlined,
    DollarOutlined,
    InboxOutlined
} from '@ant-design/icons';
import { productAPI, userAPI, orderAPI } from '../config/api';
import dayjs from 'dayjs';
const { Title } = Typography;


const calculateRevenueByDate = (orders, from, to) => {
    if (!Array.isArray(orders)) return 0;
    const fromDate = new Date(dayjs(from).startOf('day').toISOString());
    const toDate = new Date(dayjs(to).endOf('day').toISOString());
    const filteredOrders = orders.filter(order => {
        const createdAt = new Date(order.createdAt);
        return (
            createdAt >= fromDate &&
            createdAt <= toDate &&
            order.status === 'delivered'
        );
    });
    return filteredOrders.reduce((sum, order) => sum + (order.finalTotal || 0), 0);
};

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalUsers: 0,
        totalRevenue: 0,
        lowStockProducts: []
    });
    const [recentProducts, setRecentProducts] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [revenue, setRevenue] = useState(0);
    const [fromDate, setFromDate] = useState(dayjs().startOf('month'));
    const [toDate, setToDate] = useState(dayjs());
    const totalSales = topProducts.reduce((sum, p) => sum + p.sales, 0);

    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            const products = await productAPI.getAllProducts();
            const users = await userAPI.getAllUsers();
            const res = await orderAPI.getAllOrders();
            const data = Array.isArray(res) ? res : res.data?.orders || res.data || [];

            setOrders(data);
            const totalProducts = products.length;
            const totalUsers = users.length;
            const lowStockProducts = products.filter(p => p.stock < 10);
            const totalRevenue = data
                .filter(o => o.status === 'delivered')
                .reduce((sum, o) => sum + Number(o.finalTotal || 0), 0);

            setStats({
                totalProducts,
                totalUsers,
                totalRevenue,
                lowStockProducts
            });

            const productSalesMap = {};
            const productNameMap = {};

            data
                .filter(order => order.status === 'delivered')
                .forEach(order => {
                    const items = order.items || order.cart || [];

                    items.forEach(item => {
                        const id = item.id_product || item.productId || item.id;
                        const name = item.name;
                        const quantity = item.purchaseQuantity || item.quantity || 1;

                        if (id && name) {
                            productSalesMap[id] = (productSalesMap[id] || 0) + quantity;
                            productNameMap[id] = name;
                        }
                    });
                });

            const sortedTopProducts = Object.entries(productSalesMap)
                .map(([id, sales]) => ({
                    name: productNameMap[id],
                    sales
                }))
                .sort((a, b) => b.sales - a.sales)
                .slice(0, 5);

            setTopProducts(sortedTopProducts);
            setRecentProducts(products.slice(0, 5));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);
    useEffect(() => {
        if (fromDate && toDate && orders.length > 0) {
            const total = calculateRevenueByDate(orders, fromDate, toDate);
            setRevenue(total);
        }
    }, [fromDate, toDate, orders]);

    return (
        <div>
            <h1 style={{ marginBottom: 24 }}>Tổng quan hệ thống</h1>
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card loading={loading}>
                        <Statistic
                            title="Tổng số sản phẩm"
                            value={stats.totalProducts}
                            prefix={<ShoppingOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card loading={loading}>
                        <Statistic
                            title="Người dùng"
                            value={stats.totalUsers}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card loading={loading}>
                        <Statistic
                            title="Tổng doanh thu"
                            value={stats.totalRevenue}
                            prefix={<DollarOutlined />}
                            suffix="đ"
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card loading={loading}>
                        <Statistic
                            title="Sản phẩm sắp hết hàng"
                            value={stats.lowStockProducts.length}
                            prefix={<InboxOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Card
                        title="Top sản phẩm bán chạy"
                        loading={loading}
                        style={{ marginBottom: 24 }}
                    >
                        <List
                            dataSource={topProducts}
                            renderItem={(item, index) => (
                                <List.Item key={index}>
                                    <List.Item.Meta
                                        avatar={
                                            <div
                                                style={{
                                                    width: 24,
                                                    textAlign: 'center',
                                                    fontWeight: 'bold',
                                                    color: index < 3 ? '#1890ff' : 'inherit'
                                                }}
                                            >
                                                #{index + 1}
                                            </div>
                                        }
                                        title={item.name}
                                    />
                                    <div>
                                        <Progress
                                            percent={totalSales > 0 ? Math.round((item.sales / totalSales) * 100) : 0}
                                            size="small"
                                            status="active"
                                            style={{ width: 120 }}
                                            format={(percent) => `${percent}%`}
                                        />
                                    </div>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

                <Col span={12}>
                    <Card
                        title="Khoảng thời gian thống kê doanh thu"
                        loading={loading}
                        style={{ marginBottom: 24 }}
                    >
                        <Space direction="vertical" style={{ marginBottom: 24 }}>
                            <Space size="large">
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <Title level={5} style={{ marginTop: 16 }}>
                                        Từ ngày:
                                    </Title>
                                    <DatePicker
                                        value={fromDate}
                                        onChange={(date) => setFromDate(date ? dayjs(date) : null)}
                                        placeholder="Từ ngày"
                                        format="DD/MM/YYYY"
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <Title level={5} style={{ marginTop: 16 }}>
                                        Đến ngày:
                                    </Title>
                                    <DatePicker
                                        value={toDate}
                                        onChange={(date) => setToDate(date ? dayjs(date) : null)}
                                        placeholder="Đến ngày"
                                        format="DD/MM/YYYY"
                                    />
                                </div>
                            </Space>
                            <Title level={4} style={{ marginTop: 16 }}>
                                Doanh thu: {revenue.toLocaleString()} VND
                            </Title>
                        </Space>
                    </Card>
                </Col>
            </Row>

            <Card
                title="Sản phẩm sắp hết hàng"
                loading={loading}
                style={{ marginBottom: 24 }}
            >
                <Table
                    dataSource={stats.lowStockProducts}
                    rowKey="_id"
                    pagination={false}
                    size="small"
                    columns={[
                        {
                            title: 'Tên sản phẩm',
                            dataIndex: 'name',
                            key: 'name',
                        },
                        {
                            title: 'Tồn kho',
                            dataIndex: 'stock',
                            key: 'stock',
                            render: (stock) => (
                                <span style={{ color: stock < 5 ? '#cf1322' : '#faad14' }}>
                                    {stock}
                                </span>
                            ),
                        },
                        {
                            title: 'Trạng thái',
                            key: 'status',
                            render: (_, record) => (
                                <Progress
                                    percent={Math.round((record.stock / 10) * 100)}
                                    size="small"
                                    status={record.stock < 5 ? "exception" : "active"}
                                    style={{ width: 80 }}
                                />
                            ),
                        },
                    ]}
                />
            </Card>

            <Card title="Sản phẩm mới thêm" loading={loading}>
                <Table
                    dataSource={recentProducts}
                    rowKey="_id"
                    pagination={false}
                    columns={[
                        {
                            title: 'Tên sản phẩm',
                            dataIndex: 'name',
                            key: 'name',
                        },
                        {
                            title: 'Giá',
                            dataIndex: 'price',
                            key: 'price',
                            render: (price) => `${price?.toLocaleString('vi-VN')}đ`,
                        },
                        {
                            title: 'Tồn kho',
                            dataIndex: 'stock',
                            key: 'stock',
                        }
                    ]}
                />
            </Card>
        </div>
    );
};

export default Dashboard;
