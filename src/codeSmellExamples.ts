/**
 * CODE SMELL EXAMPLES FOR LEARNING
 *
 * This file contains various code smells and their refactored solutions.
 * Each example demonstrates a common mistake and how to improve it.
 *
 * Topics covered:
 * 1. DRY Principle (Don't Repeat Yourself)
 * 2. Magic Numbers
 * 3. Large Functions
 * 4. Too Many Function Parameters
 * 5. Nested If/Else Statements
 */

// ============================================================================
// 1. DRY PRINCIPLE - REPEATING CODE
// ============================================================================

console.log("--- CODE SMELL #1: DRY VIOLATION ---");

// ❌ CODE SMELL: Repeated calculation logic
function calculateProductPrice_Smell_1(
  quantity: number,
  itemPrice: number,
): number {
  const taxRate = 0.15; // 15% tax
  const basePrice = quantity * itemPrice;
  const tax = basePrice * taxRate;
  const totalPrice = basePrice + tax;
  return totalPrice;
}

function calculateServicePrice_Smell_1(
  quantity: number,
  itemPrice: number,
): number {
  const taxRate = 0.15; // 15% tax - SAME TAX RATE REPEATED
  const basePrice = quantity * itemPrice;
  const tax = basePrice * taxRate;
  const totalPrice = basePrice + tax;
  return totalPrice;
}

console.log("Code Smell #1 Result:", {
  product: calculateProductPrice_Smell_1(2, 50),
  service: calculateServicePrice_Smell_1(3, 40),
});

// ✅ REFACTORED: Extract the common logic into a reusable function
const TAX_RATE = 0.15; // Define constant once

function calculatePriceWithTax(quantity: number, itemPrice: number): number {
  const basePrice = quantity * itemPrice;
  const tax = basePrice * TAX_RATE;
  return basePrice + tax;
}

console.log("Refactored #1 Result:", {
  product: calculatePriceWithTax(2, 50),
  service: calculatePriceWithTax(3, 40),
});

// ============================================================================
// 2. MAGIC NUMBERS
// ============================================================================

console.log("\n--- CODE SMELL #2: MAGIC NUMBERS ---");

// ❌ CODE SMELL: Hard-coded values without meaning
function validateUserAge_Smell_2(age: number): string {
  if (age < 0 || age > 150) {
    return "Invalid age";
  }
  if (age < 18) {
    return "Too young";
  }
  if (age >= 18 && age <= 65) {
    return "Working age";
  }
  return "Retirement age";
}

console.log("Code Smell #2 Result:", {
  age10: validateUserAge_Smell_2(10),
  age30: validateUserAge_Smell_2(30),
  age70: validateUserAge_Smell_2(70),
});

// ✅ REFACTORED: Use named constants for magic numbers
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

console.log("Refactored #2 Result:", {
  age10: validateUserAge(10),
  age30: validateUserAge(30),
  age70: validateUserAge(70),
});

// ============================================================================
// 3. LARGE FUNCTIONS - DOING TOO MUCH
// ============================================================================

console.log("\n--- CODE SMELL #3: LARGE FUNCTION ---");

// ❌ CODE SMELL: One function doing too many things
function processUserData_Smell_3(
  firstName: string,
  lastName: string,
  email: string,
  age: number,
  salary: number,
): string {
  // Validation
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

  // Processing
  const fullName = firstName + " " + lastName;
  const emailDomain = email.split("@")[1];
  const isAdult = age >= 18;
  const highEarner = salary > 100000;

  // Formatting output
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

console.log(
  "Code Smell #3 Result:",
  processUserData_Smell_3("John", "Doe", "john@company.com", 30, 120000),
);

// ✅ REFACTORED: Break into smaller, focused functions
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

function getEmailDomain(email: string): string {
  return email.split("@")[1];
}

function isAdult(age: number): boolean {
  return age >= ADULT_AGE;
}

function isHighEarner(salary: number): boolean {
  const HIGH_EARNER_THRESHOLD = 100000;
  return salary > HIGH_EARNER_THRESHOLD;
}

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

console.log(
  "Refactored #3 Result:",
  processUserData("John", "Doe", "john@company.com", 30, 120000),
);

// ============================================================================
// 4. TOO MANY FUNCTION PARAMETERS
// ============================================================================

console.log("\n--- CODE SMELL #4: TOO MANY PARAMETERS ---");

// ❌ CODE SMELL: Function with many individual parameters
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
  console.log(`Creating user: ${firstName} ${lastName}`);
  console.log(`Email: ${email}, Phone: ${phone}`);
  console.log(`Address: ${street}, ${city}, ${zipCode}, ${country}`);
  console.log(`Age: ${age}, Job: ${jobTitle}`);
}

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

// ✅ REFACTORED: Use objects to group related data
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

function createUser(user: UserProfile): void {
  console.log(`Creating user: ${user.firstName} ${user.lastName}`);
  console.log(`Email: ${user.email}, Phone: ${user.phone}`);
  console.log(
    `Address: ${user.address.street}, ${user.address.city}, ${user.address.zipCode}, ${user.address.country}`,
  );
  console.log(`Age: ${user.age}, Job: ${user.jobTitle}`);
}

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

// ============================================================================
// 5. NESTED IF/ELSE STATEMENTS - COMPLEX LOGIC
// ============================================================================

console.log("\n--- CODE SMELL #5: NESTED IF/ELSE ---");

// ❌ CODE SMELL: Deeply nested conditions (hard to read)
function getDiscount_Smell_5(
  isCustomer: boolean,
  purchaseAmount: number,
  isMember: boolean,
): number {
  if (isCustomer) {
    if (purchaseAmount > 1000) {
      if (isMember) {
        return 0.25; // 25% discount
      } else {
        return 0.15; // 15% discount
      }
    } else {
      if (isMember) {
        return 0.1; // 10% discount
      } else {
        return 0.05; // 5% discount
      }
    }
  } else {
    return 0; // No discount
  }
}

console.log("Code Smell #5 Result:", {
  nonCustomer: getDiscount_Smell_5(false, 2000, true),
  customer2000Member: getDiscount_Smell_5(true, 2000, true),
  customer500Member: getDiscount_Smell_5(true, 500, false),
});

// ✅ REFACTORED: Use early returns and guard clauses
const DISCOUNT_RATES = {
  PREMIUM: 0.25, // Customer + High purchase + Member
  CUSTOMER_HIGH: 0.15, // Customer + High purchase
  MEMBER: 0.1, // Customer + Member
  CUSTOMER: 0.05, // Customer only
  NONE: 0, // Not a customer
};

const HIGH_PURCHASE_THRESHOLD = 1000;

function getDiscount(
  isCustomer: boolean,
  purchaseAmount: number,
  isMember: boolean,
): number {
  // Guard clause: Not a customer? No discount
  if (!isCustomer) {
    return DISCOUNT_RATES.NONE;
  }

  // Check for highest discount tier
  if (purchaseAmount > HIGH_PURCHASE_THRESHOLD && isMember) {
    return DISCOUNT_RATES.PREMIUM;
  }

  // Check for second tier
  if (purchaseAmount > HIGH_PURCHASE_THRESHOLD) {
    return DISCOUNT_RATES.CUSTOMER_HIGH;
  }

  // Check for member discount
  if (isMember) {
    return DISCOUNT_RATES.MEMBER;
  }

  // Default customer discount
  return DISCOUNT_RATES.CUSTOMER;
}
