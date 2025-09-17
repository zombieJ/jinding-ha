import React, { JSX, useState } from 'react';
import { Card, Steps, Row, Col, Alert } from 'antd';
import { SettingOutlined, WifiOutlined } from '@ant-design/icons';
import KNXEditor from './KNXEditor';
import MiBindEditor from './MiBindEditor';
import { KNXItem } from './types';

function SetupPage(): JSX.Element {
  const [currentStep, setCurrentStep] = useState(0);
  const [knxList, setKnxList] = useState<KNXItem[]>([]);

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const handleKNXChange = (items: KNXItem[]) => {
    console.log('KNX 数据更新:', items);
    setKnxList(items);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <KNXEditor onKNXChange={handleKNXChange} />;
      case 1:
        return <MiBindEditor knxItems={knxList} />;
      default:
        return null;
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
              current={currentStep}
              onChange={handleStepChange}
              items={[
                {
                  icon: <SettingOutlined />,
                  title: '配置 KNX 开关',
                  description: '把开发商的开关接入 HA 盒子',
                },
                {
                  icon: <WifiOutlined />,
                  title: '配置小米设备',
                  description: '绑定小米智能设备和 KNX 开关的关系',
                },
              ]}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="配置详情">{renderStepContent()}</Card>
        </Col>
      </Row>
    </div>
  );
}

export default SetupPage;
