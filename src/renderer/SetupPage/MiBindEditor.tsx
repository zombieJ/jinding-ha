import React, { useContext, useEffect, useState } from 'react';
import { HAContext, HADevice } from '../useHA';
import { message, Spin, Tabs } from 'antd';
import MiBindEditorDebugList from './MiBindEditorDebugList';
import MiBindEditorMapper from './MiBindEditorMapper';
import { KNXItem } from './types';

const { TabPane } = Tabs;

interface MiBindEditorProps {
  knxItems: KNXItem[];
}

const MiBindEditor: React.FC<MiBindEditorProps> = ({ knxItems }) => {
  const haInstance = useContext(HAContext);
  const [devices, setDevices] = useState<HADevice[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGetDevices = async () => {
    try {
      setLoading(true);
      if (haInstance) {
        const nextDevices = await haInstance.getDevices();

        // 过滤出 entities 里包含 `switch.` 开头的 devices
        const filteredDevices = nextDevices.filter(
          (device) =>
            device.entities.some((entity) => entity.startsWith('switch.')) &&
            device.entities.some((entity) => entity.includes('giot')),
        );

        console.log('获取到的设备信息:', filteredDevices);
        setDevices(filteredDevices);
        message.success('成功获取设备信息！');
      } else {
        message.error('Home Assistant实例未正确初始化');
      }
    } catch (error) {
      console.error('获取设备信息失败:', error);
      message.error('获取设备信息失败，请检查连接配置');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetDevices();
  }, []);

  return (
    <div>
      {loading ? (
        <Spin tip="加载中...">
          <div style={{ height: 100 }} />
        </Spin>
      ) : (
        <Tabs>
          <TabPane tab="配对" key="0">
            <MiBindEditorMapper devices={devices} knxItems={knxItems} />
          </TabPane>
          <TabPane tab="调试" key="1">
            <MiBindEditorDebugList devices={devices} />
          </TabPane>
        </Tabs>
      )}
    </div>
  );
};

export default MiBindEditor;
