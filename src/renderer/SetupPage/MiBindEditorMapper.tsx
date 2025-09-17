import React from 'react';
import { HADevice } from '../useHA';
import { KNXItem } from './types';
import { Alert } from 'antd';

interface MiBindEditorMapperProps {
  devices: HADevice[];
  knxItems: KNXItem[];
}

const MiBindEditorMapper: React.FC<MiBindEditorMapperProps> = ({
  devices,
  knxItems,
}) => {
  return (
    <div>
      <Alert
        message={`KNX 数量: ${knxItems.length}，设备数量: ${devices.length}`}
        type="info"
      />
    </div>
  );
};

export default MiBindEditorMapper;
