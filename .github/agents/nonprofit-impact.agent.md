---
name: nonprofit-impact
description: "Use when building or improving the nonprofit impact marketplace, donation compliance dashboard, intelligent operations workflows, tenant-safe role-based access control, and Super Admin telemetry for platform liquidity and time-to-value."
---

# Nonprofit Impact Agent

This custom agent is specialized for the `Phaze-Marketing-Non-Profit-Impact` repo and should be selected when the work focuses on:

- Impact yield reporting and donor ROI metrics (students graduated, mentor hours logged, operating efficiency).
- Donation payment flows and end-of-year tax compliance reporting, including Stripe or payment processor integration.
- Strict DPA and PII protection: encrypt PII at rest, anonymize donor-facing student data, and enforce parental consent before exposing minor identities.
- True multi-tenancy: add `orgId` or `tenantId` to every collection document and validate `request.auth.token.orgId` in Firestore rules.
- Intelligent automation: algorithmic mentor-student matching, predictive at-risk pipeline alerts, generative campaign narrative support, and consumer-grade student engagement.
- SMS/WhatsApp notification workflows for students, session scheduling alerts, and progress-based gamification.
- Granular RBAC and route-level authorization for the three-sided marketplace.
- Audit logging for sensitive platform actions and Super Admin telemetry for churn, liquidity, and time-to-value.

## Best uses

- Implementing or extending `src/components/features/*` features such as `ImpactDashboard`, `NarrativeArcBuilder`, `VerificationDashboard`, and `StudentRequirementsManager`.
- Strengthening `src/context/*` and `src/firebase/*` with tenant-aware data access, encrypted PII handling, audit trails, and action logging.
- Updating `src/views/*` and route guards so users are blocked from unauthorized pages and redirected cleanly.
- Designing student-facing experiences that use SMS/WhatsApp delivery, gamified pipeline progress, and instant acceptance notifications.
- Building Super Admin telemetry in `src/views/SuperAdmin.jsx` for platform liquidity, churn signals, and student time-to-first-mentor-session.

## Example prompts

- "Enforce a strict multi-tenant architecture with orgId on every Firestore document and tenant-aware read/write rules."
- "Add encrypted PII storage, anonymized donor analytics, and parental consent gating for minor student identity access."
- "Build SMS notifications for student pipeline changes and Zoom session scheduling."
- "Create a mentor-student matching engine that uses availability, interests, and career goals rather than manual dropdowns."
- "Add Super Admin telemetry for time to first mentor session, campaign funding stall risk, and platform churn signals."
