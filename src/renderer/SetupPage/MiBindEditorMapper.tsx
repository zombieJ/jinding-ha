import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { HAContext, HADevice, HAEntity } from '../useHA';
import { KNXItem } from './types';
import { batchGenScripts } from './util';
import {
  Alert,
  Form,
  Input,
  Button,
  Flex,
  Divider,
  Select,
  Spin,
  Typography,
} from 'antd';

export interface EntityItem {
  entityId: string;
  deviceId: string;
  deviceName: string;
  entity?: HAEntity;
}

interface MiBindEditorMapperProps {
  devices: HADevice[];
}

function Title(props: { value?: string; entities: any }) {
  return (
    <div>{props.entities[props.value!]?.entity?.attributes?.friendly_name}</div>
  );
}

const MiBindEditorMapper: React.FC<MiBindEditorMapperProps> = ({ devices }) => {
  const instance = useContext(HAContext);
  const [form] = Form.useForm();
  const [entities, setEntities] = useState<Record<string, EntityItem>>({});
  const [lightEntityList, setLightEntityList] = useState<HAEntity[]>([]);

  useEffect(() => {
    // 将 devices 里的数据打平成包含 entityId、deviceId 和 deviceName 的列表
    let flattenedEntities: EntityItem[] = devices.flatMap((device) =>
      device.entities
        .filter((ent) => ent.startsWith('switch.'))
        .map((entityId) => ({
          entityId,
          deviceId: device.deviceId,
          deviceName: device.name,
        })),
    );

    // setEntityList(flattenedEntities);

    instance?.getEntities().then((nextEntities) => {
      const nextLightEntityList = nextEntities.filter((ent) =>
        ent.entity_id.startsWith('light.'),
      );
      setLightEntityList(nextLightEntityList);
      // console.log(
      //   'light entities',
      //   nextLightEntityList,
      // );

      const switchEntities = nextEntities.filter((ent) =>
        ent.entity_id.includes('switch'),
      );
      // console.log('entities', switchEntities);

      // Fill flattenedEntities with entity
      flattenedEntities = flattenedEntities.map((item) => {
        const entity = switchEntities.find(
          (ent) => ent.entity_id === item.entityId,
        );
        return {
          ...item,
          entity,
        };
      });
      // console.log('flattenedEntities', flattenedEntities);

      const MATCH_KEYS = [
        // v8
        '开关一键',
        '开关二键',
        '开关三键',
        '开关四键',
        // v5
        '按键1',
        '按键2',
        '按键3',
        '按键4',
      ];

      flattenedEntities = flattenedEntities.filter((item) =>
        MATCH_KEYS.some((key) =>
          item?.entity?.attributes?.friendly_name?.includes(key),
        ),
      );

      // console.log('flattenedEntities', flattenedEntities);
      const filledEntities: Record<string, EntityItem> =
        flattenedEntities.reduce((acc: Record<string, EntityItem>, item) => {
          acc[item.entityId] = item;
          return acc;
        }, {});
      setEntities(filledEntities);
    });
  }, [devices]);

  useEffect(() => {
    // 将 entityList 数据设置到表单中
    const keys = Object.keys(entities);
    if (keys.length > 0) {
      form.setFieldsValue({
        miEntities: keys.map((key) => ({
          entityId: key,
        })),
      });
    }
  }, [entities, form]);

  const selectOptions = useMemo(() => {
    return lightEntityList.map((item) => ({
      label: item.attributes.friendly_name,
      value: item.entity_id,
    }));
  }, [lightEntityList]);

  return (
    <div>
      <Alert
        message={`灯具数量: ${lightEntityList.length}，蓝牙模块数量: ${devices.length}（${Object.keys(entities).length}个按键）`}
        type="info"
      />

      {lightEntityList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin tip="加载中..." />
        </div>
      ) : (
        <Form form={form} layout="vertical">
          <Form.List name="miEntities">
            {(fields) => (
              <>
                {fields.map(({ key, name }) => (
                  <Flex key={key} vertical gap="small">
                    <Divider size="small" />
                    <Form.Item noStyle name={[name, 'entityId']}>
                      <Title entities={entities} />
                    </Form.Item>
                    <Form.Item noStyle name={[name, 'knxItemId']}>
                      <Select options={selectOptions} />
                    </Form.Item>
                  </Flex>
                ))}
              </>
            )}
          </Form.List>

          {/* 生成脚本 */}
          <Divider>automations.yaml</Divider>
          <Alert
            message="覆盖 automations.yaml（如果你自己编辑了自动化可以备份，没有就覆盖），重新加载配置即实现双向绑定"
            type="info"
          />

          <Form.Item noStyle shouldUpdate>
            {() => {
              const list = (
                (form.getFieldValue('miEntities') || []) as {
                  entityId: string;
                  knxItemId: string;
                }[]
              ).filter((item) => item.knxItemId);

              return (
                <Input.TextArea
                  value={batchGenScripts(entities, selectOptions, list)}
                  rows={10}
                />
              );
            }}
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default MiBindEditorMapper;
