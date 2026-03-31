# Code Smell Examples & Refactoring Guide

**For Students Learning TypeScript & Clean Code**

This guide provides practical examples of common code smells and how to refactor them for better code quality. Each example shows the problem, explains why it's a problem, and demonstrates the solution.

---

## What is a Code Smell?

A **code smell** is a surface-level indicator that there might be a deeper problem in your code. It doesn't mean your code is broken—it means there's room for improvement. Code smells make your code:

- Harder to read and understand
- Harder to maintain and modify
- More prone to bugs
- Harder to test

---

## 1. DRY Principle - Don't Repeat Yourself

### The Problem

In the code smell example, the same tax calculation logic is repeated in two different functions. If the tax rate changes, you have to update it in multiple places—and you might forget one!

```typescript
// ❌ CODE SMELL: Repeated logic
function calculateProductPrice_Smell_1(
  quantity: number,
  itemPrice: number,
): number {
  const taxRate = 0.15; // Repeated here
  const basePrice = quantity * itemPrice;
  const tax = basePrice * taxRate;
  const totalPrice = basePrice + tax;
  return totalPrice;
}

function calculateServicePrice_Smell_1(
  quantity: number,
  itemPrice: number,
): number {
  const taxRate = 0.15; // And repeated here - Hard to maintain!
  const basePrice = quantity * itemPrice;
  const tax = basePrice * taxRate;
  const totalPrice = basePrice + tax;
  return totalPrice;
}
```

### Why It's a Problem

- **Maintenance nightmare**: If tax rate changes, you must update it in every location
- **Bug risk**: You might miss one location and create inconsistent behavior
- **Code bloat**: The same logic takes up more space than necessary

### The Solution

Extract the common logic into a reusable function and define the constant once:

```typescript
// ✅ REFACTORED: Single source of truth
const TAX_RATE = 0.15; // Defined once

function calculatePriceWithTax(quantity: number, itemPrice: number): number {
  const basePrice = quantity * itemPrice;
  const tax = basePrice * TAX_RATE;
  return basePrice + tax;
}

// Both use the same function
calculatePriceWithTax(2, 50); // Products
calculatePriceWithTax(3, 40); // Services
```

### Key Takeaway

**Write once, use many times.** If you find yourself typing the same logic in multiple places, extract it into a single function or constant.

---

## 2. Magic Numbers

### The Problem

Numbers scattered throughout code without explanation. What do `18`, `65`, and `150` mean? Why these specific values?

```typescript
// ❌ CODE SMELL: Magic numbers
function validateUserAge_Smell_2(age: number): string {
  if (age < 0 || age > 150) {
    // What is 150? Max age?
    return "Invalid age";
  }
  if (age < 18) {
    // What is 18? Legal age?
    return "Too young";
  }
  if (age >= 18 && age <= 65) {
    // What is 65? Retirement?
    return "Working age";
  }
  return "Retirement age";
}
```

### Why It's a Problem

- **Unclear intent**: Future developers (or yourself) may not understand what these numbers represent
- **Hard to maintain**: If you need to change the minimum age, you might miss some places
- **Error-prone**: It's easy to accidentally use `19` instead of `18` somewhere else

### The Solution

Replace magic numbers with named constants that explain their purpose:

```typescript
// ✅ REFACTORED: Named constants with clear meaning
const MIN_VALID_AGE = 0;
const MAX_VALID_AGE = 150;
const ADULT_AGE = 18;
const RETIREMENT_AGE = 65;

function validateUserAge(age: number): string {
  if (age < MIN_VALID_AGE || age > MAX_VALID_AGE) {
    return "Invalid age";
  }
  if (age < ADULT_AGE) {
    return "Too young";
  }
  if (age >= ADULT_AGE && age <= RETIREMENT_AGE) {
    return "Working age";
  }
  return "Retirement age";
}
```

### Key Takeaway

**Name your numbers.** Use constant names that explain _what_ the number represents. When you read the code, it should make sense without extra explanation.

---

## 3. Large Functions - The Single Responsibility Principle

### The Problem

One function doing too many things: validation, processing, AND formatting output. It's hard to test, hard to understand, and hard to reuse.

```typescript
// ❌ CODE SMELL: Doing too much in one function
function processUserData_Smell_3(
  firstName: string,
  lastName: string,
  email: string,
  age: number,
  salary: number,
): string {
  // Validation logic
  if (!firstName || firstName.length === 0) {
    return "Invalid first name";
  }
  if (!lastName || lastName.length === 0) {
    return "Invalid last name";
  }
  if (!email || !email.includes("@")) {
    return "Invalid email";
  }
  if (age < 0 || age > 150) {
    return "Invalid age";
  }
  if (salary < 0) {
    return "Invalid salary";
  }

  // Processing logic
  const fullName = firstName + " " + lastName;
  const emailDomain = email.split("@")[1];
  const isAdult = age >= 18;
  const highEarner = salary > 100000;

  // Formatting logic
  const result =
    "User: " +
    fullName +
    ", Age: " +
    age +
    ", Email: " +
    email +
    ", Domain: " +
    emailDomain +
    ", Adult: " +
    isAdult +
    ", High Earner: " +
    highEarner;

  return result;
}
```

### Why It's a Problem

- **Hard to test**: You have to test validation, processing, and formatting all together
- **Hard to understand**: You have to read through all the logic to understand what it does
- **Hard to reuse**: If you need validation only, or formatting only, you can't use this function
- **High risk of bugs**: Any change affects multiple responsibilities

### The Solution

Break it into smaller, focused functions—each with a single responsibility:

```typescript
// ✅ REFACTORED: Each function does one thing well

// Responsibility 1: Validate the data
function validateUserFields(
  firstName: string,
  lastName: string,
  email: string,
  age: number,
  salary: number,
): string | null {
  if (!firstName || firstName.length === 0) return "Invalid first name";
  if (!lastName || lastName.length === 0) return "Invalid last name";
  if (!email || !email.includes("@")) return "Invalid email";
  if (age < 0 || age > 150) return "Invalid age";
  if (salary < 0) return "Invalid salary";
  return null; // No errors
}

// Responsibility 2: Extract email domain
function getEmailDomain(email: string): string {
  return email.split("@")[1];
}

// Responsibility 3: Determine if adult
function isAdult(age: number): boolean {
  return age >= 18;
}

// Responsibility 4: Determine if high earner
function isHighEarner(salary: number): boolean {
  const HIGH_EARNER_THRESHOLD = 100000;
  return salary > HIGH_EARNER_THRESHOLD;
}

// Responsibility 5: Format user data for display
function formatUserData(
  firstName: string,
  lastName: string,
  email: string,
  age: number,
  salary: number,
): string {
  const fullName = `${firstName} ${lastName}`;
  const emailDomain = getEmailDomain(email);
  const adult = isAdult(age);
  const highEarner = isHighEarner(salary);
  return `User: ${fullName}, Age: ${age}, Email: ${email}, Domain: ${emailDomain}, Adult: ${adult}, High Earner: ${highEarner}`;
}

// Main function: Orchestrate the workflow
function processUserData(
  firstName: string,
  lastName: string,
  email: string,
  age: number,
  salary: number,
): string {
  const validationError = validateUserFields(
    firstName,
    lastName,
    email,
    age,
    salary,
  );
  if (validationError) {
    return validationError;
  }
  return formatUserData(firstName, lastName, email, age, salary);
}
```

### Benefits

- ✅ Each function is easy to understand (one responsibility)
- ✅ Each function is easy to test (test validation separately from formatting)
- ✅ Each function is reusable (use `isAdult()` elsewhere if needed)
- ✅ Easier to maintain (change validation logic without affecting formatting)

### Key Takeaway

**One function = One job.** The "Single Responsibility Principle" means each function should have one reason to change. If you have multiple reasons to change a function, it's doing too much.

---

## 4. Too Many Function Parameters

### The Problem

A function with 10 individual parameters is hard to call correctly and hard to extend. What if you need to add a middle name? Add a state to the address? The function signature keeps growing.

```typescript
// ❌ CODE SMELL: Too many parameters
function createUser_Smell_4(
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  street: string,
  city: string,
  zipCode: string,
  country: string,
  age: number,
  jobTitle: string,
): void {
  // ... implementation
}

// Hard to remember the order!
createUser_Smell_4(
  "Alice",
  "Smith",
  "alice@email.com",
  "555-1234",
  "123 Main St",
  "New York",
  "10001",
  "USA",
  28,
  "Developer",
);
```

### Why It's a Problem

- **Hard to remember**: What order do the parameters go in? It's easy to swap them
- **Hard to extend**: Need to add "middle name"? Now you have 11 parameters
- **Type safety**: Without good IDE support, strings can be in the wrong position
- **Hard to read**: The function call is a long list of values with no context

### The Solution

Group related data into objects (interfaces). This makes the code self-documenting:

```typescript
// ✅ REFACTORED: Use objects to group related data

// Define what fields each group needs
interface UserAddress {
  street: string;
  city: string;
  zipCode: string;
  country: string;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: UserAddress;
  age: number;
  jobTitle: string;
}

// Now the function takes one object instead of 10 parameters
function createUser(user: UserProfile): void {
  console.log(`Creating user: ${user.firstName} ${user.lastName}`);
  // ... implementation
}

// Much clearer! Each field is labeled
const newUser: UserProfile = {
  firstName: "Alice",
  lastName: "Smith",
  email: "alice@email.com",
  phone: "555-1234",
  address: {
    street: "123 Main St",
    city: "New York",
    zipCode: "10001",
    country: "USA",
  },
  age: 28,
  jobTitle: "Developer",
};

createUser(newUser);
```

### Benefits

- ✅ Self-documenting: You can see what data is being passed
- ✅ Easy to extend: Add "middleName" to the interface, TypeScript will tell you where to update
- ✅ Safer: Can't accidentally swap parameters around
- ✅ More readable: The function call looks like a data structure, not a mystery list

### Key Takeaway

**Group related parameters into objects.** When you have more than 3-4 related parameters, consider grouping them into an interface or object.

---

## 5. Nested If/Else Statements - Complex Decision Logic

### The Problem

Deeply nested conditionals are hard to follow. Your brain has to keep track of multiple conditions at once. This is often called "arrow anti-pattern" because the code looks like an arrow →

```typescript
// ❌ CODE SMELL: Nested if/else (hard to read)
function getDiscount_Smell_5(
  isCustomer: boolean,
  purchaseAmount: number,
  isMember: boolean,
): number {
  if (isCustomer) {
    // Level 1
    if (purchaseAmount > 1000) {
      // Level 2
      if (isMember) {
        // Level 3
        return 0.25;
      } else {
        return 0.15;
      }
    } else {
      if (isMember) {
        // Level 3 again
        return 0.1;
      } else {
        return 0.05;
      }
    }
  } else {
    return 0;
  }
}
```

### Why It's a Problem

- **Cognitive load**: Your brain has to track 3+ levels of conditions at once
- **Error-prone**: Easy to put code in the wrong branch
- **Hard to extend**: Want to add another condition? Nesting gets worse
- **Hard to test**: Each combination of conditions is a different code path

### Solution 1: Early Returns & Guard Clauses

Flatten the logic by returning early when conditions aren't met:

```typescript
// ✅ REFACTORED: Using early returns and clear variables
const HIGH_PURCHASE_THRESHOLD = 1000;

function getDiscount(
  isCustomer: boolean,
  purchaseAmount: number,
  isMember: boolean,
): number {
  // Guard clause: Handle the "not a customer" case immediately
  if (!isCustomer) {
    return 0;
  }

  // Now we know they're a customer; check reward conditions in order
  if (purchaseAmount > HIGH_PURCHASE_THRESHOLD && isMember) {
    return 0.25; // Best discount: high purchase + member
  }

  if (purchaseAmount > HIGH_PURCHASE_THRESHOLD) {
    return 0.15; // Good discount: high purchase
  }

  if (isMember) {
    return 0.1; // Member discount
  }

  return 0.05; // Basic customer discount
}
```

### Benefits of Early Returns

- ✅ **Flat structure**: No nested levels, just a sequence of checks
- ✅ **Readable**: You read top-to-bottom, like a checklist
- ✅ **Maintainable**: Easy to see all conditions and their order
- ✅ **Testable**: Each condition is clearly separate

---

### Solution 2: Strategy Pattern / Lookup Table (Advanced)

For more complex scenarios, you can use a data-driven approach:

```typescript
// ✅ REFACTORED (ALTERNATIVE): Strategy Pattern / Lookup Table
// This approach is more advanced but scales well for many rules

interface DiscountRule {
  condition: (
    isCustomer: boolean,
    amount: number,
    isMember: boolean,
  ) => boolean;
  rate: number;
}

const discountRules: DiscountRule[] = [
  // Rules are checked in order, first match wins
  {
    condition: (isCustomer, amount, isMember) =>
      isCustomer && amount > 1000 && isMember,
    rate: 0.25,
  },
  {
    condition: (isCustomer, amount) => isCustomer && amount > 1000,
    rate: 0.15,
  },
  {
    condition: (isCustomer, _, isMember) => isCustomer && isMember,
    rate: 0.1,
  },
  {
    condition: (isCustomer) => isCustomer,
    rate: 0.05,
  },
];

function getDiscountWithStrategy(
  isCustomer: boolean,
  purchaseAmount: number,
  isMember: boolean,
): number {
  const applicableRule = discountRules.find((rule) =>
    rule.condition(isCustomer, purchaseAmount, isMember),
  );
  return applicableRule?.rate ?? 0;
}
```

### When to Use Each Approach

- **Early Returns** (Solution 1): Good for most cases, especially when you have 3-5 conditions
- **Strategy Pattern** (Solution 2): Better when you have many rules that might change frequently, or when rules are complex

### Key Takeaway

**Use guard clauses and early returns.** Return early when conditions aren't met, and use clear variable names to make logic easy to follow. Flatcode is easier to read than nested code.

---

## Discussion Questions for Your Class

1. **DRY Principle**: Can you find other places in the codebase where the same logic is repeated?

2. **Magic Numbers**: Look at the refactored code—do the constant names make the code's purpose clearer?

3. **Large Functions**: The `processUserData` function was split into 5 functions. Which responsibility would be hardest to test in the original version?

4. **Too Many Parameters**: How would you extend the `UserProfile` interface if you needed to store a middle name and a phone number extension?

5. **Nested If/Else**: Try to come up with a new discount rule without touching the code (hint: think about the strategy pattern approach).

---

## Summary: Red Flags to Watch For

| Code Smell          | Red Flag                                | Quick Fix                             |
| ------------------- | --------------------------------------- | ------------------------------------- |
| **DRY Violation**   | Repeating the same logic multiple times | Extract into a function or constant   |
| **Magic Numbers**   | Unexplained numbers in code             | Create named constants                |
| **Large Functions** | Function does more than one thing       | Split into smaller, focused functions |
| **Many Parameters** | Function signature is very long         | Group related parameters into objects |
| **Deep Nesting**    | if/else is multiple levels deep         | Use guard clauses and early returns   |

---

## Practice Exercise

Run the `codeSmellExamples.ts` file and look at the console output. Can you:

1. Identify 2 more places in your own code where DRY principle is violated?
2. Find 3 more "magic numbers" in your projects and replace them with named constants?
3. Find a function you wrote that does multiple responsibilities and split it up?

---

**Remember**: Writing the code that works is just the first step. Writing code that's clean, readable, and maintainable is what makes you a professional developer! 🚀
