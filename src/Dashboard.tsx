import React, { useEffect, useState, useReducer } from "react";
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
  initialBalance,
  overdraft,
}: {
    initialBalance: number;
  overdraft: number;
}) => {

   

  const [showWithdrawlForm, setShowWithdrawlForm] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [userBalance, setUserBalance] = useState(initialBalance + overdraft );
  const [activityHistory, setActivity] = useState([]) as any;

  //   const [availableNotes, setAvailableNotes] = useReducer(
  //     (state: any, action: any): any => {
  //       let stateTemp = Object.assign({}, state);

  //       stateTemp[action.key] = action.value;

  //       return stateTemp;
  //     },
  //     {
  //       "5": 4,
  //       "10": 15,
  //       "20": 7,
  //     }
  //   );

  const [availableNotes, setAvailableNotes] = useState({
    "5": 4,
    "10": 15,
    "20": 7,
  }) as any;

  const onWithDrawalFormSubmission = (formValues: any) => {
    console.log(formValues);

    calculateNoteWithdrawl(formValues.withdrawlAmount);
  };

  const calculateNoteWithdrawl = (withdrawlAmount: number) => {
    console.log("availableNotesStart", availableNotes);

    // Make sure the withdrawl amount is in multiples of 5 to allow notes to meet the value
    if (withdrawlAmount % 5 != 0) {
      notification.error({
        message: "Invalid Amount",
        description:
          "Requested Amount must be in multiples of 5 e.g. 5, 10, 15",
      });

      return "Requested Amount Exceeds User Balance";
    }

    // First check if they can withdraw with combined overdraft
    if (withdrawlAmount > userBalance) {
      notification.error({
        message: "Balance Exceeded",
        description: "Requested Amount Exceeds User Balance",
      });

      return "Requested Amount Exceeds User Balance";
    }

    // Warn them they will use their overdraft if higher than balance and into the overdraft

    // Sort availables from largest to smallest
    let sortedNotes: string[] = Object.keys(availableNotes).sort(
      (a: string, b: string) => {
        return Number(b) - Number(a);
      }
    );

    let remainingWithdrawlAmount: number = withdrawlAmount;
    let withdrawnNotes: any = {};

    let newAvailableNotesValue: any = Object.assign({}, availableNotes);

    // Iterate through each note and work out how many of each note is required starting with the largest to smallest
    sortedNotes.forEach((note: string) => {
      let numberOfPossibleNotesAvailable = availableNotes[note];

      console.log("availableNotes[note]", availableNotes[note]);

      let numberOfNotesRequired = Math.floor(
        remainingWithdrawlAmount / Number(note)
      );

      if (numberOfPossibleNotesAvailable < numberOfNotesRequired) {
        numberOfNotesRequired = numberOfPossibleNotesAvailable;
      }

      //Each note proceeding takes 2x as many to achieve the higher level note, to spread the notes out more evenly,
      //if the large note is greater than 1 then subtract 1 and take 2 of the smaller notes if they are available and do not result in the next notes being 0

      // Remove Values from remaining WithdrawlAmount
      remainingWithdrawlAmount =
        remainingWithdrawlAmount -
        Math.floor(numberOfNotesRequired) * Number(note);

      console.log(numberOfNotesRequired);
      console.log(numberOfNotesRequired);
      console.log("Reduction amount", numberOfNotesRequired * Number(note));

      console.log("remainingWithdrawlAmount", remainingWithdrawlAmount);

      withdrawnNotes[note] = numberOfNotesRequired;

      // // Subtract the notes from the running total

      newAvailableNotesValue[note] -= numberOfNotesRequired;

      // console.log(newAvailableNotesValue[note]);

      console.log("availableNotes", availableNotes);
      console.log("newAvailableNotesValue", newAvailableNotesValue);
    });

    setAvailableNotes(newAvailableNotesValue);
    setUserBalance(userBalance - withdrawlAmount);

    let activity : string[]= [...activityHistory];

    activity.push(`£${withdrawlAmount} withdrawn ${new Date().toLocaleDateString()}`);

    // Add Item to Activity
    setActivity(activity);

    console.log(sortedNotes);
    console.log("withdrawnNotes", withdrawnNotes);
    console.log("availableNotes", availableNotes);
    console.log("newAvailableNotesValue", newAvailableNotesValue);
  };

  return (
    <div id="Dashboard">
      {showBalance ? (
        <Card title="Balance" id="BalanceCard">
          <h1 id="Balance">£{userBalance}</h1>
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

      {showWithdrawlForm ? (
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

      {showActivity ? (
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
              {activityHistory.map((activity: string)=>{

              return(<Timeline.Item>{activity}</Timeline.Item>)
              })}
            {/* <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
            <Timeline.Item>
              Solve initial network problems 2015-09-01
            </Timeline.Item>
            <Timeline.Item>Technical testing 2015-09-01</Timeline.Item>
            <Timeline.Item>
              Network problems being solved 2015-09-01
            </Timeline.Item> */}
          </Timeline>
        </Card>
      ) : null}
    </div>
  );
};

export default Dashboard;
