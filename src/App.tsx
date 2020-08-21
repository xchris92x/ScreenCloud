import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Button, Card, Checkbox, Form, Input, notification } from "antd";
import React, { useEffect, useState } from "react";
import "./App.css";
import Navigation from "./Navigation";

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
    let name = window.localStorage.getItem("Name")!;
    let pin= window.localStorage.getItem("Pin")!;

    if (name && pin) {
      getCachedUserCredentials(name,pin);
    }
  }, []);

  const getCachedUserCredentials = async (name: string, pin: string) => {
    let userInfo = await login(pin);
    processLoginResponse(userInfo, { name: name, pin: pin, remember: true });
  };

  const onLoginSubmission = async (values: any): Promise<void> => {
    let formValues: login = values;
    console.log("Success:", formValues);

    let userInfo = await login(formValues.pin);

    processLoginResponse(userInfo, formValues);

    console.log(userInfo);
  };

  const processLoginResponse = (userInfo: any, formValues: login) => {
    // Login Successful
    if (userInfo.currentBalance) {
      setName(formValues.name);

      setShowProfile(true);

      // More secure ways to store this but using it as demo of functionality
      if (formValues.remember) {
        window.localStorage.setItem("Name", formValues.name);
        window.localStorage.setItem("Pin", formValues.pin);
      }
    } else {
      if (userInfo.error) {

        // Clear local storage, this prevents incorrect stored credentials being reused
        window.localStorage.clear();

        notification.error({
          message: "Invalid Pin",
          description: userInfo.error,
        });
      }
    }
  };

  const onSignOut = (): void => {
    setName("");

    setShowProfile(false);

    window.localStorage.clear();
  };

  async function login(pin: string) {
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

    return body;
  }

  return (
    <div className="App">
      <Navigation ShowProfile={ShowProfile} Name={Name} onSignOut={onSignOut} />
      <div id="mainContainer">
        <Card title="Enter Your Bank Credentials" id="loginCard">
          <Form name="basic" onFinish={onLoginSubmission}>
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
