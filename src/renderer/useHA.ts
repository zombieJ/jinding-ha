import React from 'react';

/** A control of Home Assistant */
export interface Instance {
  login: (host: string, token: string) => Promise<void>;
  getDevices: () => Promise<HADevice[]>;
  getEntities: () => Promise<any>;
}

/** Home Assistant Device */
export interface HADevice {
  deviceId: string;
  name: string;
  entities: string[];
}

export default function useHA(): Instance {
  const urlRef = React.useRef<{
    host?: string;
    token?: string;
  }>({});

  return React.useMemo<Instance>(() => {
    const inst = {
      login: async (host: string, token: string) => {
        try {
          const response = await fetch(`${host}/api/config`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const config = await response.json();
            console.log('Home Assistant Config:', config);

            urlRef.current = { host, token };
          } else {
            console.error(
              'Failed to fetch Home Assistant config:',
              response.status,
              response.statusText,
            );
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
        } catch (error) {
          console.error('Error fetching Home Assistant config:', error);
          throw error;
        }
      },

      getDevices: async () => {
        const url = `${urlRef.current.host}/api/template`;

        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${urlRef.current.token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              template:
                "{% set devices = states | map(attribute='entity_id') | map('device_id') | unique | reject('eq',None) | list %}{%- set ns = namespace(devices = []) %}{%- for device in devices %}{%- set entities = device_entities(device) | list %}{%- if entities %}{%- set ns.devices = ns.devices +  [ {device: {'name': device_attr(device, 'name'), 'entities': entities}} ] %}{%- endif %}{%- endfor %}{{ ns.devices | tojson }}",
            }),
          });

          if (response.ok) {
            const devices = await response.json();
            // console.log('Home Assistant Devices:', devices);

            const deviceList = devices.map((obj: any) => {
              const keys = Object.keys(obj);
              const deviceId = keys[0];
              const { name, entities, ...rest } = obj[deviceId];

              return {
                name,
                entities,
                deviceId,
                ...rest,
              };
            });

            return deviceList;
          } else {
            console.error(
              'Failed to fetch Home Assistant devices:',
              response.status,
              response.statusText,
            );
            return [];
          }
        } catch (error) {
          console.error('Error fetching Home Assistant devices:', error);
          return [];
        }
      },

      getEntities: async () => {
        const url = `${urlRef.current.host}/api/states`;

        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${urlRef.current.token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const entities = await response.json();
            return entities;
          } else {
            console.error(
              'Failed to fetch Home Assistant entities:',
              response.status,
              response.statusText,
            );
            return [];
          }
        } catch (error) {
          console.error('Error fetching Home Assistant entities:', error);
          return [];
        }
      },
    };
    return inst;
  }, []);
}

export const HAContext = React.createContext<Instance | undefined>(undefined);
