import React from "react";
import { render, screen, getByRole, waitFor, fireEvent } from "@testing-library/react";
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
}

const expectedNoteValues = [
  {
    withdrawlAmount: 50,
    expectedValues: [
      "1x £20 notes withdrawn",
      "2x £10 notes withdrawn",
      "2x £5 notes withdrawn",
    ],
  },
];

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
  const linkElement = getByText(/£320/i);
  expect(linkElement).toBeInTheDocument();
});

// This is also the full form flow
test("Test Full WithDrawl Flow", async () => {


  render(<Dashboard overdraft={overdraft} initialBalance={initialBalance} />)


  


  // Click withdrawl button
  userEvent.click(screen.getByText("Withdraw"));

  // Test That the form appears
  // var withdrawlForm = await screen.getByText(/Make a Withdrawl/i);


  // Click withdrawl button
  userEvent.type(screen.getByRole("withdrawlInput"), "50");

  await act( async () => {
    await fireEvent.click(screen.getByRole('submit'));
  });


  
    // Enter the withdrawl amount

    // Submit the form
    
    // Iterate through each test case
    expectedNoteValues.forEach(async (noteTest: noteTest) => {

      
      // Check the correct note values are showing
      noteTest.expectedValues.forEach((expectedValue: string) => {
        // Check each of the expected outputs
        const linkElement = screen.getByText(`${expectedValue}`);
        expect(linkElement).toBeInTheDocument();
      });
    });
  
});
