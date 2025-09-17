import React, { useEffect, useContext, JSX } from 'react';
import { Form, Input, Button, Card, Typography, App } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { HAContext } from './useHA';

const { Title } = Typography;

interface HomeAssistantFormValues {
  address: string;
  token: string;
}

function HomePage(): JSX.Element {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const haInstance = useContext(HAContext);
  const navigate = useNavigate();

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
  const onValuesChange = (
    changedValues: Partial<HomeAssistantFormValues>,
    allValues: HomeAssistantFormValues,
  ) => {
    localStorage.setItem('homeAssistantConfig', JSON.stringify(allValues));
  };

  // 登录验证函数
  const loginToHomeAssistant = async (values: HomeAssistantFormValues) => {
    try {
      // 使用useHA context的login方法
      if (haInstance) {
        await haInstance.login(values.address, values.token);
        message.success('成功连接到 Home Assistant!');
        // 登录成功后跳转到设置页面
        navigate('/setup');
      } else {
        message.error('Home Assistant实例未正确初始化');
      }
    } catch (error) {
      // 网络错误或其他异常
      message.error('连接过程中发生错误，请检查网络连接和地址。');
      console.error('Login error:', error);
    }
  };

  const onFinish = (values: HomeAssistantFormValues) => {
    console.log('Home Assistant Address:', values.address);
    console.log('Token:', values.token);
    // 调用登录验证函数
    loginToHomeAssistant(values);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Card
        style={{
          width: 400,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <HomeOutlined style={{ fontSize: 48, color: '#1890ff' }} />
          <Title level={3} style={{ marginTop: 16, marginBottom: 0 }}>
            Home Assistant 配置
          </Title>
          <p style={{ color: '#888' }}>请输入您的 Home Assistant 地址和令牌</p>
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
                message: '请输入 Home Assistant 的地址!',
              },
              {
                pattern: /^(http|https):\/\/(\d{1,3}\.){3}\d{1,3}:\d{1,5}$/,
                message:
                  '请输入有效的地址格式，例如: http://192.168.50.116:8123',
              },
              {
                validator: (_, value) => {
                  if (value) {
                    // 检查是否以 http 或 https 开头
                    if (
                      !value.startsWith('http://') &&
                      !value.startsWith('https://')
                    ) {
                      return Promise.reject(
                        new Error('地址必须以 http:// 或 https:// 开头'),
                      );
                    }

                    // 提取主机和端口部分
                    const urlWithoutProtocol = value.replace(
                      /^(http|https):\/\//,
                      '',
                    );
                    const parts = urlWithoutProtocol.split(':');
                    if (parts.length !== 2) {
                      return Promise.reject(
                        new Error(
                          '请输入有效的地址格式，例如: http://192.168.50.116:8123',
                        ),
                      );
                    }

                    const ip = parts[0];
                    const port = parts[1];

                    // 验证IP地址
                    const ipParts = ip.split('.');
                    if (ipParts.length !== 4) {
                      return Promise.reject(new Error('请输入有效的IP地址'));
                    }
                    ipParts.forEach((part: any) => {
                      const num = parseInt(part, 10);
                      if (Number.isNaN(num) || num < 0 || num > 255) {
                        return Promise.reject(new Error('请输入有效的IP地址'));
                      }
                    });

                    // 验证端口
                    const portNum = parseInt(port, 10);
                    if (
                      Number.isNaN(portNum) ||
                      portNum < 1 ||
                      portNum > 65535
                    ) {
                      return Promise.reject(
                        new Error('端口号必须在 1-65535 之间'),
                      );
                    }
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              placeholder="例如: http://192.168.50.116:8123"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="token"
            label="令牌"
            tooltip="HA界面：左下角进入个人页面 > 右上方点击安全 tab > 滚动到最下面点击创建令牌"
            rules={[
              {
                required: true,
                message: '请输入令牌!',
              },
            ]}
          >
            <Input.TextArea
              placeholder="请输入令牌"
              size="large"
              rows={3}
              style={{ resize: 'vertical' }}
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
}

export default HomePage;
