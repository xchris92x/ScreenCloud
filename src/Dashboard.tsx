import React, { useEffect, useState } from "react";
import {
  Card,
  Timeline,
  Button,
  Form,
  Input,
  InputNumber,
  notification,
} from "antd";
import { LeftOutlined } from "@ant-design/icons";
const Dashboard = ({
  userBalance,
  overdraft,
}: {
  userBalance: number;
  overdraft: number;
}) => {
  const [ShowWithdrawlForm, setShowWithdrawlForm] = useState(false);
  const [ShowActivity, setShowActivity] = useState(false);
  const [ShowBalance, setShowBalance] = useState(true);

  const notes = {
    5: 4,
    10: 15,
    20: 7,
  };

  const onWithDrawalFormSubmission = (formValues: any) => {
    console.log(formValues);

    calculateNoteWithdrawl(formValues.withdrawlAmount);
  };

  const calculateNoteWithdrawl = (withdrawlAmount: number) => {
    // Sort availables from largest to smallest
    let sortedNotes = Object.keys(notes).sort((a: string, b: string) => {
      return Number(b) - Number(a);
    });

    // Make sure the withdrawl amount is in multiples of 5 to allow notes to meet the value
    if(withdrawlAmount % 5 != 0){
        notification.error({
            message: "Invalid Amount",
            description: "Requested Amount must be in multiples of 5 e.g. 5, 10, 15",
          });
    
          return("Requested Amount Exceeds User Balance");
    }

    // First check if they can withdraw with combined overdraft
    if (withdrawlAmount > (userBalance + overdraft)) {
      notification.error({
        message: "Balance Exceeded",
        description: "Requested Amount Exceeds User Balance",
      });

      return("Requested Amount Exceeds User Balance");
    }



    // Warn them they will use their overdraft if higher than balance and into the overdraft

    // Iterate through each note and work out how many of each note is required starting with the largest to smallest

    console.log(sortedNotes);
  };

  return (
    <div id="Dashboard">
      {ShowBalance ? (
        <Card title="Balance" id="BalanceCard" >
          <h1 id="Balance">£{userBalance + overdraft}</h1>
          <p>Overdraft: £{overdraft} </p>
          <Button
            className="BalanceButton"
            type="primary"
            onClick={() => {
              setShowWithdrawlForm(true);

              setShowBalance(false);
            }}
          >
            Withdraw
          </Button>

          <Button
            className="BalanceButton"
            type="primary"
            onClick={() => {
              setShowActivity(true);

              setShowBalance(false);
            }}
          >
            View Activity
          </Button>
        </Card>
      ) : null}

      {ShowWithdrawlForm ? (
        <Card
          title={
            <div>
              <button
                className="CardBackButton"
                onClick={() => {
                  setShowWithdrawlForm(false);

                  setShowBalance(true);
                }}
              >
                <LeftOutlined />
                Back
              </button>
              <span>Make a Withdrawl</span>
            </div>
          }
          id="withdrawlCard"
        >
          <Form name="basic" onFinish={onWithDrawalFormSubmission}>
            <Form.Item
              label="Amount"
              name="withdrawlAmount"
              rules={[
                {
                  required: true,
                  message: "Please enter amount to withdraw !",
                },
                { type: "integer", message: "Please enter a number !" },
              ]}
            >
              <InputNumber />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ) : null}

      {ShowActivity ? (
        <Card
          title={
            <div>
              <button
                className="CardBackButton"
                onClick={() => {
                  setShowActivity(false);

                  setShowBalance(true);
                }}
              >
                <LeftOutlined />
                Back
              </button>
              <span>Activity</span>
            </div>
          }
        >
          <Timeline>
            <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
            <Timeline.Item>
              Solve initial network problems 2015-09-01
            </Timeline.Item>
            <Timeline.Item>Technical testing 2015-09-01</Timeline.Item>
            <Timeline.Item>
              Network problems being solved 2015-09-01
            </Timeline.Item>
          </Timeline>
        </Card>
      ) : null}
    </div>
  );
};

export default Dashboard;
