import React, { useState } from "react";
import { Form, Input, Switch, Button, Icon, Row, Col } from "antd";
import "./Form.css";
import Override from "./Overide";
import Header from "./Header";

export default props => {
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
      style: {
        textAlign: "left"
      }
    },

    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 }
    }
  };
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 0 }
    }
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0
      },
      sm: {
        span: 16,
        offset: 0
      }
    }
  };

  const [switchValue, setSwitchValue] = useState(props.formData.enable);
  // const [TabUrlValue, setTabUrlValue] = useState(props.formData.target);
  const [overrides, setOverrides] = useState(props.formData.overrides);
  const [headers, setHeaders] = useState(props.formData.headers);
  const [saving, setSaving] = useState(false);
  const setOverride = (id, override) => {
    overrides[id] = { ...overrides[id], ...override };
    setOverrides(overrides);
    chrome.storage.sync.set({ overrides });
  };
  const deleteOverride = id => {
    overrides.splice(id, 1);
    setOverrides(overrides);
    chrome.storage.sync.set({ overrides });
  };

  const setHeader = (id, header) => {
    headers[id] = { ...headers[id], ...header };
    setHeaders(headers);
    chrome.storage.sync.set({ headers });
  };
  const deleteHeader = id => {
    headers.splice(id, 1);
    setHeaders(headers);
    chrome.storage.sync.set({ headers });
  };
  const onSave = () => {
    setSaving(true);
    chrome.runtime.sendMessage(
      {
        redirctly: {
          // target: TabUrlValue,
          enable: switchValue,
          overrides: overrides,
          headers: headers
        }
      },
      () => {
        setSaving(false);
      }
    );
  };
  return (
    <Form className="form">
      <Form.Item
        {...formItemLayout}
        label="Enable"
        style={{ textAlign: "left" }}
      >
        <Switch
          checked={switchValue}
          onChange={checked => {
            setSwitchValue(checked);
            chrome.storage.sync.set({ enable: checked });
          }}
        />
      </Form.Item>
      {/* <Form.Item
        {...formItemLayout}
        label="Tab URL"
        style={{ textAlign: "left" }}
      >
        <Input
          value={TabUrlValue}
          onChange={e => {
            e.preventDefault();
            setTabUrlValue(e.target.value);
            chrome.storage.sync.set({ target: e.target.value });
          }}
        />
      </Form.Item> */}
      {overrides.length > 0 ? <h3>Redirects:</h3> : null}
      {overrides.map((elm, i) => {
        return (
          <Override
            key={i}
            id={i}
            override={elm}
            setOverride={setOverride}
            onDelete={deleteOverride}
          />
        );
      })}
      {headers.length > 0 ? <h3>headers:</h3> : null}
      {headers.map((elm, i) => {
        return (
          <Header
            key={i}
            id={i}
            header={elm}
            setHeader={setHeader}
            onDelete={deleteHeader}
          />
        );
      })}
      <Row>
        <Col span={12}>
          <Form.Item>
            <Button
              type="dashed"
              onClick={() => {
                setOverrides([...overrides, {}]);
              }}
              style={{ width: "80%" }}
            >
              <Icon type="plus" /> Add redirects
            </Button>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item {...formItemLayoutWithOutLabel}>
            <Button
              type="dashed"
              onClick={() => {
                setHeaders([...headers, {}]);
              }}
              style={{ width: "80%" }}
            >
              <Icon type="plus" /> Add headers
            </Button>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" icon="save" size="large" onClick={onSave}>
          {saving ? "Saving" : "Save"}
        </Button>
      </Form.Item>
    </Form>
  );
};
