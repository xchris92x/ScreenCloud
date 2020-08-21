import React, { useState, useEffect } from "react";
import { Button, Menu, Form, Input, Checkbox, Card } from "antd";
import "./App.css";
import SubMenu from "antd/lib/menu/SubMenu";
import {
  BankOutlined,
  AppstoreOutlined,
  SettingOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from "@ant-design/icons";

interface login {
  name: string;
  pin: string;
  remember: boolean;
}

const App = () => {
  const [Name, setName] = useState("");
  const [ShowProfile, setShowProfile] = useState(false);

  // Check if the user creds are already saved if they are then skip login
  useEffect(() => {
    let name = window.localStorage.getItem("Name");
    let pin = window.localStorage.getItem("Pin");

    if (name && pin) {
      getUserBalance(pin);
    }
  }, []);

  const onFinish = (values: any): void => {
    let formValues: login = values;
    console.log("Success:", formValues);

    // More secure ways to store this but using it as demo of functionality
    if (formValues.remember) {
      window.localStorage.setItem("Name", formValues.name);
      window.localStorage.setItem("Pin", formValues.pin);
    }

    setName(formValues.name);

    setShowProfile(true);
  };

  const onSignOut = (): void => {
    setName("");

    window.localStorage.clear();
  };

  async function getUserBalance(pin: string) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({ pin: pin });

    var requestOptions: any = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const response = await fetch(
      "https://frontend-challenge.screencloud-michael.now.sh/api/pin",
      requestOptions
    );
    const body = await response.json();

    // fetch("https://frontend-challenge.screencloud-michael.now.sh/api/pin", requestOptions)
    // .then(response => response.text())
    // .then(result => console.log(result))
    // .catch(error => console.log('error', error));

    // console.log("ello");
    console.log(response);
    console.log(body);
  }

  return (
    <div className="App">
      <Menu mode="horizontal" id="navbar">
        <Menu.Item
          key="bank"
          icon={<BankOutlined />}
          style={{ color: "white" }}
        >
          MiBank
        </Menu.Item>
        {/* Normally I wouldn't do inline but couldn't seem to add an id */}

        {ShowProfile ? (
          <SubMenu
            key="profileMenuOption"
            icon={<SettingOutlined />}
            title={Name}
            style={{ float: "right", color: "white" }}
          >
            <Menu.Item key="setting:1" onClick={onSignOut}>
              SignOut
            </Menu.Item>
          </SubMenu>
        ) : null}
      </Menu>

      <div id="mainContainer">
        <Card title="Enter Your Bank Credentials" id="loginCard">
          <Form name="basic" onFinish={onFinish}>
            <Form.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Pin"
              name="pin"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>

      <footer className="footer">
        <section className="footerbar">
            <ul className="footerbar-list">
                <li>&copy; 2020 Copyright MiBank Inc.</li>
            </ul>
        </section>
    </footer>

   
    </div>
  );
};

export default App;
