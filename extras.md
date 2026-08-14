I checked the updated collection. The only change I see is that `username/check` and `username/reserve` now require the selected `domain` as well as the username. There are still **no plan, subscription, checkout, or webhook APIs** in the collection. 

That said, I **would not** place plan selection after username reservation. From both a UX and backend perspective, the better flow is:

# Recommended Registration Flow

```text
Landing

↓

Choose Email Address
    ↓
GET /public/hosted-domains

↓

Check username availability
POST /public/usernames/check

↓

Choose Plan
GET /public/plans

↓

Choose Billing
Monthly / Yearly

↓

If Free
    ↓
Reserve Username

If Paid
    ↓
Create Checkout Session

↓

Redirect to Payment Provider

↓

Customer completes payment
(or starts trial)

↓

Payment Provider
↓
Webhook
↓
Create Subscription
↓
Store metadata
↓
Generate checkout token

↓

Frontend redirected back

↓

Reserve Username

↓

Register Account

↓

Login

↓

Mailbox
```

---

# APIs I'd Add

## 1. Plans

```http
GET /api/v1/public/plans
```

Response

```json
{
  "plans": [
    {
      "id": "free",
      "name": "Free",
      "priceMonthly": 0,
      "priceYearly": 0,
      "storage": "5GB"
    },
    {
      "id": "starter",
      "priceMonthly": 49,
      "priceYearly": 490,
      "trialDays": 30
    },
    {
      "id": "business",
      "priceMonthly": 199,
      "priceYearly": 1990,
      "trialDays": 30
    },
    {
      "id": "enterprise",
      "contactSales": true
    }
  ]
}
```

---

## 2. Create Checkout

```http
POST /api/v1/public/billing/checkout
```

Body

```json
{
  "username": "ripun",
  "domain": "norestmail.com",
  "planId": "starter",
  "billingCycle": "monthly",
  "trial": true
}
```

Response

```json
{
  "checkoutUrl": "...",
  "checkoutSessionId": "...",
  "expiresAt": "..."
}
```

---

## 3. Payment Webhook

```http
POST /api/v1/public/billing/webhook
```

The payment provider (Stripe, Razorpay, etc.) sends events such as:

* checkout.completed
* subscription.created
* invoice.paid
* invoice.payment_failed
* subscription.updated
* subscription.canceled
* mandate.created
* mandate.revoked
* trial.will_end
* trial.ended

---

## 4. Registration

Only after payment (or free plan).

```http
POST /api/v1/public/auth/register
```

```json
{
  "reservationId": "...",
  "checkoutSessionId": "...",
  "password": "..."
}
```

The backend should already know:

* username
* domain
* plan
* billing cycle
* payment customer
* subscription

There is no need to send them again.

---

# Subscription APIs

Instead of only

```http
GET /api/v1/subscription
```

I'd expose:

## Current Subscription

```http
GET /api/v1/subscription/me
```

Example

```json
{
  "subscriptionId": "sub_xxx",
  "status": "active",

  "plan": {
    "id": "starter",
    "name": "Starter"
  },

  "billing": {
    "cycle": "monthly",
    "currency": "INR",
    "amount": 49
  },

  "trial": {
    "enabled": true,
    "startedAt": "...",
    "endsAt": "...",
    "daysRemaining": 21
  },

  "renewal": {
    "autoRenew": true,
    "nextRenewalAt": "...",
    "daysRemaining": 51
  },

  "payment": {
    "provider": "stripe",
    "customerId": "...",
    "subscriptionId": "...",
    "defaultMethod": "Visa ****4242",
    "mandateStatus": "active"
  },

  "limits": {
    "mailboxes": 1,
    "aliases": 10,
    "storageGB": 25,
    "customDomains": 5
  }
}
```

---

## Subscription History

```http
GET /api/v1/subscription/history
```

Returns

* invoices
* renewals
* refunds
* failed payments
* upgrades
* downgrades

---

## Upcoming Invoice

```http
GET /api/v1/subscription/upcoming
```

---

## Cancel Auto Renewal

```http
POST /api/v1/subscription/cancel
```

---

## Resume

```http
POST /api/v1/subscription/resume
```

---

## Change Plan

```http
POST /api/v1/subscription/change-plan
```

---

## Update Billing Cycle

```http
POST /api/v1/subscription/change-cycle
```

Monthly ↔ Yearly.

---

## Payment Methods

```http
GET /api/v1/payment-methods
POST /api/v1/payment-methods
DELETE /api/v1/payment-methods/:id
PUT /api/v1/payment-methods/default
```

---

# Metadata to Persist from the Webhook

Every successful checkout should result in a subscription record that stores at least:

* Account ID (once created)
* Payment provider
* Customer ID
* Subscription ID
* Checkout session ID
* Plan ID
* Plan name
* Billing cycle (monthly/yearly)
* Currency
* Amount
* Tax amount
* Discount/Coupon
* Trial enabled
* Trial duration
* Trial start/end
* Subscription status
* Auto-renew enabled
* Next renewal date
* Current billing period start/end
* Mandate ID
* Mandate status
* Default payment method
* Cancellation requested date
* Cancellation effective date
* Payment failure count
* Grace period end (if applicable)
* Created/updated timestamps

With this model, your frontend can build a complete **Billing** page from a single `GET /api/v1/subscription/me` call, showing the user's plan, renewal date, trial status, payment method, remaining days, storage entitlement, and whether auto-renew is enabled, while the backend remains the source of truth for all subscription state.
