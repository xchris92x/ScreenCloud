import React from "react";
import { BankOutlined, SettingOutlined} from "@ant-design/icons";
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import { Menu } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";

const Navigation = ({
  ShowProfile,
  Name,
  onSignOut,
}: {
  ShowProfile: boolean;
  Name: string;
  onSignOut: () => void;
}) => {
  return (
    <Menu mode="horizontal" id="navbar">
      <Menu.Item key="bank" icon={<BankOutlined />} style={{ color: "white" }}>
        MiBank
      </Menu.Item>

      {ShowProfile ? (
 
        <SubMenu
          key="profileMenuOption"
          title={<div>{Name}      <Avatar size="small" icon={<UserOutlined />}/>
          </div>}
          style={{ float: "right", color: "white" }}
        >
          <Menu.Item key="setting:1" onClick={onSignOut}>
            SignOut
          </Menu.Item>
        </SubMenu>
 

        
      ) : null}
    
    </Menu>
  );
};

export default Navigation;
