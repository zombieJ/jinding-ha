import React, { JSX, useContext } from 'react';
import {
  Timeline,
  Typography,
  Card,
  Button,
  Space,
  Steps,
  message,
  Row,
  Col,
  Alert,
} from 'antd';
import { SettingOutlined, WifiOutlined } from '@ant-design/icons';
import { HAContext } from '../useHA';
import KNXEditor from './KNXEditor';

const { Title } = Typography;

function SetupPage(): JSX.Element {
  const haInstance = useContext(HAContext);

  const handleGetDevices = async () => {
    try {
      if (haInstance) {
        const devices = await haInstance.getDevices();

        // 过滤出 entities 里包含 `switch.` 开头的 devices
        const filteredDevices = devices.filter((device) =>
          device.entities.some(
            (entity) => entity.startsWith('switch.') && entity.includes('giot'),
          ),
        );

        console.log('获取到的设备信息:', filteredDevices);
        message.success('成功获取设备信息！');
      } else {
        message.error('Home Assistant实例未正确初始化');
      }
    } catch (error) {
      console.error('获取设备信息失败:', error);
      message.error('获取设备信息失败，请检查连接配置');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '100vh',
        width: '100%',
        padding: '20px',
      }}
    >
      <Row gutter={32} style={{ width: '100%' }}>
        <Col span={12}>
          <Card title="系统设置向导">
            <Alert
              message="依次操作，点击可以切换当前步骤"
              type="info"
              style={{ marginBottom: 20 }}
            />

            <Steps
              direction="vertical"
              items={[
                {
                  icon: <SettingOutlined />,
                  title: '配置 KNX 节点',
                  description: '编辑 KNX 设备配置',
                },
                {
                  icon: <WifiOutlined />,
                  title: '获取设备信息',
                  description: (
                    <Space>
                      配置完 KNX 设备 和 小米插件后执行
                      <Button
                        type="primary"
                        size="small"
                        onClick={handleGetDevices}
                      >
                        获取
                      </Button>
                    </Space>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="KNX 设备配置">
            <KNXEditor />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default SetupPage;
