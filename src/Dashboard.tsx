import { LeftOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Form,
  InputNumber,
  List,
  Modal,
  notification,
  Timeline,
} from "antd";
import React, { useState } from "react";

const Dashboard = ({
  initialBalance,
  overdraft,
}: {
  initialBalance: number;
  overdraft: number;
}) => {
  const [showWithdrawlForm, setShowWithdrawlForm] = useState(false);
  const [showWithdrawlConfirmation, setShowWithdrawlConfirmation] = useState(
    false
  );
  const [showActivity, setShowActivity] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [showOverdraftModal, setShowOverdraftModal] = useState(false);
  const [userBalance, setUserBalance] = useState(initialBalance + overdraft);
  const [activityHistory, setActivity] = useState([]) as any;
  const [withDrawnNotes, setwithDrawnNotes] = useState([]) as any;

  const [availableNotes, setAvailableNotes] = useState({
    "5": 4,
    "10": 15,
    "20": 7,
  }) as any;

  const onWithDrawalFormSubmission = (formValues: any) => {
    calculateNoteWithdrawl(formValues.withdrawlAmount);
  };

  const calculateNoteWithdrawl = async (withdrawlAmount: number) => {
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

    let tempBalanceAfterWithdrawl = userBalance - withdrawlAmount;

    if (withdrawlAmount > initialBalance || tempBalanceAfterWithdrawl < overdraft) {

      // Warn them they will use their overdraft if higher than balance and into the overdraft
      if (
        !window.confirm(
          "This withdrawl will require you to use your overdraft, would you like to proceed ?"
        )
      ) {
        return "User Does not wish to proceed";
      }
    }

    // Sort availables from largest to smallest
    let sortedNotes: string[] = Object.keys(availableNotes).sort(
      (a: string, b: string) => {
        return Number(b) - Number(a);
      }
    );

    let remainingWithdrawlAmount: number = withdrawlAmount;
    let notesWithdrawn: any = [];

    let currentAvailableNotes: any = Object.assign({}, availableNotes);

    // Iterate through each note and work out how many of each note is required starting with the largest to smallest
    await sortedNotes.forEach((note: string, index: number) => {
      let numberOfPossibleNotesAvailable = availableNotes[note];

      let numberOfNotesRequired = Math.floor(
        remainingWithdrawlAmount / Number(note)
      );

      if (numberOfPossibleNotesAvailable < numberOfNotesRequired) {
        numberOfNotesRequired = numberOfPossibleNotesAvailable;
      }

      //Each note larger note is 2x larger than the previous, by splitting it in half it should allow a more even distribution
      if (numberOfNotesRequired > 1 && index != sortedNotes.length - 1) {
        let smallerNotesTotal = 0;

        // Check if there are enough smaller notes to meet the balance requirement
        for (let i = index + 1; i < sortedNotes.length; i++) {
          let smallerNote = sortedNotes[i];

          smallerNotesTotal +=
            currentAvailableNotes[smallerNote] * Number(smallerNote);
        }

        // Calculate the balance if the number of larger notes was cut in half
        let requiredBalance =
          withdrawlAmount -
          Math.round(numberOfNotesRequired / 2) * Number(note);

        // If the smaller notes are large enough to meet the requirement then half the number of larger notes
        if (requiredBalance < smallerNotesTotal) {
          numberOfNotesRequired = Math.round(numberOfNotesRequired / 2);
        }
      }

      // Remove Values from remaining WithdrawlAmount
      remainingWithdrawlAmount -= numberOfNotesRequired * Number(note);

      notesWithdrawn.push({ note: note, value: numberOfNotesRequired });

      // // Subtract the notes from the running total

      currentAvailableNotes[note] -= numberOfNotesRequired;
    });

    let activity: string[] = [...activityHistory];

    activity.push(
      `£${withdrawlAmount} withdrawn ${new Date().toLocaleDateString()}`
    );

    // // Add Item to Activity
    setActivity(activity);

    setAvailableNotes(currentAvailableNotes);
    setUserBalance(userBalance - withdrawlAmount);

    setwithDrawnNotes(notesWithdrawn);
    setShowWithdrawlForm(false);
    setShowWithdrawlConfirmation(true);
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
            id="withdrawButton"
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
        <div>
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
            <Form
              name="basic"
              onFinish={onWithDrawalFormSubmission}
              layout="horizontal"
            >
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
                <InputNumber role="withdrawlInput" id="withdrawlInput" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" role="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      ) : null}
      {showWithdrawlConfirmation ? (
        <Card
          title={
            <div>
              <button
                role="backButton"
                className="CardBackButton"
                onClick={() => {
                  setShowWithdrawlConfirmation(false);

                  setShowBalance(true);
                }}
              >
                <LeftOutlined />
                Back
              </button>
              <span>Withdrawl Successful</span>
            </div>
          }
          id="ConfrimationCard"
        >
          <List
            itemLayout="horizontal"
            dataSource={withDrawnNotes}
            renderItem={(note: { note: string; value: number }) => (
              <List.Item role="listItem">
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={`${process.env.PUBLIC_URL}/Pound-Sterling.png`}
                    />
                  }
                  title={
                    <div>
                      {note.value}x £{note.note} notes withdrawn
                    </div>
                  }
                />
              </List.Item>
            )}
          />
          <Button
            className="BalanceButton"
            type="primary"
            onClick={() => {
              setShowWithdrawlConfirmation(false);

              setShowBalance(true);
            }}
          >
            View Account
          </Button>
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
            {activityHistory.map((activity: string) => {
              return <Timeline.Item>{activity}</Timeline.Item>;
            })}
          </Timeline>
        </Card>
      ) : null}
    </div>
  );
};

export default Dashboard;
