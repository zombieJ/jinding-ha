import React, { JSX, useContext } from 'react';
import {
  Timeline,
  Typography,
  Card,
  Button,
  Space,
  Steps,
  message,
} from 'antd';
import { SettingOutlined, WifiOutlined } from '@ant-design/icons';
import { HAContext } from './useHA';
// 将 import { useContext } from 'react'; 移到合适位置，这里已在文件开头导入了 react，无需重复导入，此句可移除

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
        alignItems: 'center',
        minHeight: '100vh',
        width: '100%',
        padding: '20px',
      }}
    >
      <Card
        style={{
          marginInline: 32,
          width: '100%',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <Title level={3} style={{ marginTop: 16, marginBottom: 0 }}>
            系统设置向导
          </Title>
          <p style={{ color: '#888' }}>请按照以下步骤完成系统配置</p>
        </div>

        <Steps
          items={[
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
    </div>
  );
}

export default SetupPage;
