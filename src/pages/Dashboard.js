import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Progress, List } from 'antd';
import { 
    ShoppingOutlined, 
    UserOutlined, 
    DollarOutlined,
    InboxOutlined
} from '@ant-design/icons';
import { productAPI, userAPI } from '../config/api';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalUsers: 0,
        totalRevenue: 0,
        lowStockProducts: []
    });
    const [recentProducts, setRecentProducts] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const products = await productAPI.getAllProducts();
            const users = await userAPI.getAllUsers();

            const totalProducts = products.length;
            const totalUsers = users.length;
            const lowStockProducts = products.filter(p => p.stock < 10);

            const mockStats = {
                totalProducts,
                totalUsers,
                totalRevenue: 15000000,
                lowStockProducts
            };

            setStats(mockStats);
            setRecentProducts(products.slice(0, 5));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const topProducts = [
        { name: 'Áo Đấu Manchester United đen 2024/25', sales: 100 },
        { name: 'Áo Đấu Manchester City 2024/25', sales: 98 },
        { name: 'Áo Đấu Real Madrid 2024/25', sales: 85 },
        { name: 'Áo Đấu Chelsea 2024/25', sales: 75 }
    ];

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
                            title="Doanh thu"
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
                                            percent={Math.round((item.sales / 120) * 100)} 
                                            size="small" 
                                            status="active"
                                            style={{ width: 120 }}
                                        />
                                    </div>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={12}>
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
                </Col>
            </Row>

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
