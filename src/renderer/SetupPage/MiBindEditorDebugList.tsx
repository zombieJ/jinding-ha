import React from 'react';
import { List, Card, Typography } from 'antd';
import { HADevice } from '../useHA';

const { Text } = Typography;

interface MiBindEditorDebugListProps {
  devices: HADevice[];
}

const MiBindEditorDebugList: React.FC<MiBindEditorDebugListProps> = ({
  devices,
}) => {
  return (
    <List
      dataSource={devices}
      renderItem={(device) => (
        <List.Item>
          <Card title={device.name} size="small" style={{ width: '100%' }}>
            <Text type="secondary">ID: {device.deviceId}</Text>
            <div style={{ marginTop: 8 }}>
              <Text strong>Entities:</Text>
              {device.entities.map((entity, index) => (
                <div key={index}>
                  <Text code>{entity}</Text>
                </div>
              ))}
            </div>
          </Card>
        </List.Item>
      )}
    />
  );
};

export default MiBindEditorDebugList;
