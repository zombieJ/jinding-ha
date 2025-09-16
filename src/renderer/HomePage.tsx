import React, { useEffect } from 'react';
import { Form, Input, Button, Card, Typography } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface HomeAssistantFormValues {
  address: string;
  username: string;
  password: string;
}

const HomePage: React.FC = () => {
  const [form] = Form.useForm();

  // 组件加载时从localStorage读取数据
  useEffect(() => {
    const savedData = localStorage.getItem('homeAssistantConfig');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        form.setFieldsValue(parsedData);
      } catch (error) {
        console.error('Failed to parse saved data:', error);
      }
    }
  }, [form]);

  // 表单数据变化时保存到localStorage
  const onValuesChange = (changedValues: Partial<HomeAssistantFormValues>, allValues: HomeAssistantFormValues) => {
    localStorage.setItem('homeAssistantConfig', JSON.stringify(allValues));
  };

  const onFinish = (values: HomeAssistantFormValues) => {
    console.log('Home Assistant Address:', values.address);
    console.log('Username:', values.username);
    console.log('Password:', values.password);
    // 这里可以添加提交地址的逻辑
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh'
    }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <HomeOutlined style={{ fontSize: 48, color: '#1890ff' }} />
          <Title level={3} style={{ marginTop: 16, marginBottom: 0 }}>Home Assistant 配置</Title>
          <p style={{ color: '#888' }}>请输入您的 Home Assistant 地址和账户信息</p>
        </div>

        <Form
          form={form}
          name="homeAssistantForm"
          onFinish={onFinish}
          layout="vertical"
          onValuesChange={onValuesChange}
        >
          <Form.Item
            name="address"
            label="地址"
            validateFirst
            rules={[
              {
                required: true,
                message: '请输入 Home Assistant 的地址!'
              },
              {
                pattern: /^(http|https):\/\/(\d{1,3}\.){3}\d{1,3}:\d{1,5}$/,
                message: '请输入有效的地址格式，例如: http://192.168.50.116:8123'
              },
              {
                validator: (_, value) => {
                  if (value) {
                    // 检查是否以 http 或 https 开头
                    if (!value.startsWith('http://') && !value.startsWith('https://')) {
                      return Promise.reject('地址必须以 http:// 或 https:// 开头');
                    }

                    // 提取主机和端口部分
                    const urlWithoutProtocol = value.replace(/^(http|https):\/\//, '');
                    const parts = urlWithoutProtocol.split(':');
                    if (parts.length !== 2) {
                      return Promise.reject('请输入有效的地址格式，例如: http://192.168.50.116:8123');
                    }

                    const ip = parts[0];
                    const port = parts[1];

                    // 验证IP地址
                    const ipParts = ip.split('.');
                    if (ipParts.length !== 4) {
                      return Promise.reject('请输入有效的IP地址');
                    }
                    for (const part of ipParts) {
                      const num = parseInt(part);
                      if (isNaN(num) || num < 0 || num > 255) {
                        return Promise.reject('请输入有效的IP地址');
                      }
                    }

                    // 验证端口
                    const portNum = parseInt(port);
                    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
                      return Promise.reject('端口号必须在 1-65535 之间');
                    }
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input
              placeholder="例如: http://192.168.50.116:8123"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="username"
            label="用户名"
            rules={[
              {
                required: true,
                message: '请输入用户名!'
              }
            ]}
          >
            <Input
              placeholder="请输入用户名"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              {
                required: true,
                message: '请输入密码!'
              }
            ]}
          >
            <Input.Password
              placeholder="请输入密码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              style={{ width: '100%' }}
            >
              连接
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default HomePage;
