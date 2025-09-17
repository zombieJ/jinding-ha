import React, { useEffect } from 'react';
import { Form, Input, Button, Flex, Typography, Divider, Alert } from 'antd';
import { KNXItem } from './types';

function toKNXText(list: KNXItem[] = []) {
  return `
knx:
  light:
${list
  .filter((item) => item && item.name && item.address)
  .map((item) =>
    [
      // KNX dev
      `    - name: "${item.name}"`,
      `      address: "${item.address}"`,
      `      state_address: "${item.address}"`,
    ].join('\n'),
  )
  .join('\n')}
`.trim();
}

export interface KNXEditorProps {
  onKNXChange?: (items: KNXItem[]) => void;
}

const KNXEditor: React.FC<KNXEditorProps> = ({ onKNXChange }) => {
  const [form] = Form.useForm();

  const items = Form.useWatch('knxItems', form);

  // 初始化时从 localStorage 加载数据
  useEffect(() => {
    const savedData = localStorage.getItem('knxItems');
    if (savedData) {
      try {
        const knxItems = JSON.parse(savedData);
        form.setFieldsValue({ knxItems });
      } catch (e) {
        console.error('解析 localStorage 数据失败:', e);
      }
    }
  }, [form]);

  useEffect(() => {
    if (onKNXChange) {
      onKNXChange(items);
    }
  }, [items, onKNXChange]);

  // 表单数据变化时保存到 localStorage
  const handleValuesChange = () => {
    setTimeout(() => {
      const values = form.getFieldsValue();
      if (values.knxItems) {
        localStorage.setItem('knxItems', JSON.stringify(values.knxItems));
      }
    }, 0);
  };

  return (
    <div>
      <Typography>
        <pre>
          {`
名字：随便起名字，你怎么舒服怎么来。
地址：进入 KNX 网关，访问：192.168.1.200。登录后查看房间，在房间中可以看到灯的列表，点开就有地址。
`.trim()}
        </pre>
      </Typography>
      <Form
        form={form}
        initialValues={{ knxItems: [] }}
        onValuesChange={handleValuesChange}
      >
        <Form.List name="knxItems">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <Flex
                  key={field.key}
                  style={{ marginBottom: 8 }}
                  align="start"
                  gap="middle"
                >
                  <Form.Item
                    {...field}
                    name={[field.name, 'name']}
                    rules={[{ required: true, message: '请输入名称' }]}
                    key="name"
                    style={{ flex: '50%' }}
                  >
                    <Input placeholder="名称,如:主卧主灯" />
                  </Form.Item>
                  <Form.Item
                    {...field}
                    name={[field.name, 'address']}
                    rules={[
                      { required: true, message: '请输入地址' },
                      {
                        pattern: /^\d+\/\d+\/\d+$/,
                        message: '地址格式应为: 数字/数字/数字，如: 1/1/1',
                      },
                    ]}
                    key="address"
                    style={{ flex: '50%' }}
                  >
                    <Input placeholder="地址,如:1/1/1" />
                  </Form.Item>
                  <Button
                    onClick={() => remove(field.name)}
                    danger
                    style={{ flex: 'none' }}
                  >
                    删除
                  </Button>
                </Flex>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{ width: '100%', marginTop: 16 }}
                >
                  添加 KNX 设备
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        {/* 生成 KNX 配置 */}
        <Divider />
        <Alert
          message="将数据直接贴到 configuration.yaml 文件里，重新加载配置首页就会显示房间开关"
          type="info"
        />
        <Form.Item noStyle shouldUpdate>
          {() => {
            const list = form.getFieldValue('knxItems');

            return (
              <Typography>
                <pre>{toKNXText(list)}</pre>
              </Typography>
            );
          }}
        </Form.Item>
      </Form>
    </div>
  );
};

export default KNXEditor;
