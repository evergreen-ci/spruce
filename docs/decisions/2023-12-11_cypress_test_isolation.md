# 2023-12-11 Cypress tests run independently by resetting browser and database state

- status: accepted
- date: 2023-6-26
- authors: SupaJoon

## Context and Problem Statement

Cypress tests that mutate browser or Evergreen database state affected outcomes of tests that ran after. This prevented parallelzing tests in CI, running a subset, and thoroughly testing UI flows that mutate Evergreen data.

## Decision Outcome

Cypress tests that mutate Evergreen data follow up with a database reset operation before running the next test. Also, dom state, cookies, localStorage and sessionStorage are reset before each test.
