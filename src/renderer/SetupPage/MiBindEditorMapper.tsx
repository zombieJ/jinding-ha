import React, { useContext, useEffect } from 'react';
import { HAContext, HADevice } from '../useHA';
import { KNXItem } from './types';
import { Alert, Flex } from 'antd';

interface MiBindEditorMapperProps {
  devices: HADevice[];
  knxItems: KNXItem[];
}

const MiBindEditorMapper: React.FC<MiBindEditorMapperProps> = ({
  devices,
  knxItems,
}) => {
  const instance = useContext(HAContext);

  // useEffect(() => {
  //   if (instance) {
  //     instance.getEntities().then((entities) => {
  //       console.log(
  //         'Home Assistant Entities:',
  //         entities.filter((a) => a.entity_id.includes('giot')),
  //       );
  //     });
  //   }
  // }, []);

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
