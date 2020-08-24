import React from "react";
import {
  render,
  screen,
  getByRole,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import App from "./App";
import Dashboard from "./Dashboard";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import ReactDOM from "react-dom";

const overdraft: number = 100;
const initialBalance: number = 220;

interface noteTest {
  withdrawlAmount: number;
  expectedValues: string[];
  expectedBalance: number;
}

// Mock window.confirm, this will allow the full flow test to proceed without handing on the popup
window.confirm = jest.fn(() => true) // always click 'yes'

// Issue with Jest, using the official workaround to make matchMediaWork
// https://jestjs.io/docs/en/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

test("The user balance is correctly shown", () => {
  const { getByText } = render(
    <Dashboard overdraft={overdraft} initialBalance={initialBalance} />
  );
  const balanceElement = getByText(/£320/i);
  expect(balanceElement).toBeInTheDocument();
});



test("Test Full WithDrawl Flow", async () => {

  const expectedNoteValues = [
    {
      withdrawlAmount: 140,
      expectedValues: [
        "4x £20 notes withdrawn",
        "6x £10 notes withdrawn",
        "0x £5 notes withdrawn",
      ],
      expectedBalance: 180
    },
    {
      withdrawlAmount: 50,
      expectedValues: [
        "1x £20 notes withdrawn",
        "3x £10 notes withdrawn",
        "0x £5 notes withdrawn",
      ],
      expectedBalance: 130
    },
    {
      withdrawlAmount: 90,
      expectedValues: [
        "1x £20 notes withdrawn",
        "6x £10 notes withdrawn",
        "2x £5 notes withdrawn",
      ],
      expectedBalance: 40
    }
  ];
  
  render(<Dashboard overdraft={overdraft} initialBalance={initialBalance} />);


  for (let i = 0; i < expectedNoteValues.length; i++) {
    let noteTest: noteTest = expectedNoteValues[i];

    // Click withdrawl button
    userEvent.click(screen.getByText("Withdraw"));

    // Test That the form appears
    var withdrawlForm = await screen.getByText(/Make a Withdrawl/i);

    expect(withdrawlForm).toBeInTheDocument();

    userEvent.type(screen.getByRole("withdrawlInput"), `${noteTest.withdrawlAmount}`);

    await act(async () => {
      await fireEvent.click(screen.getByRole("submit"));
    });

    // Check the correct note values are showing
    noteTest.expectedValues.forEach((expectedValue: string) => {
      // Check each of the expected outputs
      const linkElement = screen.getByText(`${expectedValue}`);
      expect(linkElement).toBeInTheDocument();
    });

    // Return to main account
    userEvent.click(screen.getByText("View Account"))

    // Confirm The Balance is correct
    var withdrawlForm = await screen.getByText(`£${noteTest.expectedBalance}`);

    expect(withdrawlForm).toBeInTheDocument();
  }
});
