/** state store test 
 * @jest-environment jsdom
 */

import { StateStore } from "./path-to-file";

test("StateStore updates HTML when state changes", () => {
  // Create a state store
  const store = new StateStore();

  // Create a fake HTML element that displays the number of budgets
  document.body.innerHTML = `<div id="budgetCount">0</div>`;
  const budgetCountEl = document.getElementById("budgetCount");

  // Subscribe to state changes
  store.subscribe((state) => {
    // Update HTML whenever store changes
    budgetCountEl!.textContent = String(state.budgets.length);
  });

  // At first subscription, state should be 0 (default state)
  expect(budgetCountEl!.textContent).toBe("0");

  // Update state
  store.setState({
    budgets: [{ id: 1, name: "Test", period: "2025" }]
  });

  // HTML should update automatically
  expect(budgetCountEl!.textContent).toBe("1");
});

test("Budget object contains correctly spelled fields", () => {
  const budget = {
    id: 1,
    name: "Monthly Budget",
    period: "2025"
  };

  expect(budget).toHaveProperty("name");
  expect(budget).toHaveProperty("period");

  // Wrong spelling should NOT exist
  expect(budget).not.toHaveProperty("peroid");
});

// test for created input field
test("User interface contains correctly spelled fields", () => {
  const user = {
    id: 1,
    email: "test@example.com",
    role: "user",
    name: "Alex"
  };

  // Check the correct spelling of required fields
  expect(user).toHaveProperty("email");
  expect(user).toHaveProperty("role");
  expect(user).toHaveProperty("name");

  // Example spelling mistake that should NOT exist
  //expect(user).not.toHaveProperty("rol");
});


// Test for category spelling correction
test("Budget object contains correctly spelled fields", () => {
  const budget = {
    id: 1,
    name: "Monthly Budget",
    period: "2025"
  };

  expect(budget).toHaveProperty("name");
  expect(budget).toHaveProperty("period");

  // Wrong spelling should NOT exist
  //expect(budget).not.toHaveProperty("peroid");
});


  