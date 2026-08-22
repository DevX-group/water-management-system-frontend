# Dashboard and Widget System Analysis

**Repositories inspected**

- Backend: `D:/ACADEMICS/Software Project/CODE/kaweesha/COMBINED/backend/water-management-system-backend`
- Frontend: `D:/ACADEMICS/Software Project/CODE/kaweesha/COMBINED/frontend/water-management-system-frontend`
- Inspection date: 2026-08-21

This document is an analysis and implementation specification only. No dashboard components, controllers, services, migrations, or application code were added as part of this analysis.

## 1. Executive Summary

The system already has five logical role experiences, but only the customer dashboard route has a customer page and the admin dashboard route currently renders an empty `DashboardPage` (`src/pages/DashboardPage.tsx`). The feature pages and API services are sufficiently developed to support a first dashboard release composed of customer summaries, recent activity, actions, lists, alerts, usage charts, inquiry status, and staff communication.

The system is not yet a configurable widget platform. There is no discovered `Dashboard`, `Widget`, `DashboardWidget`, saved layout, or user dashboard-preference entity. Widget management therefore requires new backend persistence, role-authorized administration APIs, and a frontend registry/grid. The backend must remain authoritative for data and feature authorization; hiding a widget in React is not sufficient security.

The largest cross-cutting issue is the requested rename from `PAYMENT_HANDLER` to `CUSTOMER_HANDLER`. The old value is present in the backend enum and authorization expressions, and in frontend role unions, route allow-lists, navigation, role labels, internal-chat filters, and default routing. The migration must be coordinated across tokens, persisted user roles, API authorization, frontend types, and displayed labels. A simple label change will leave the application inconsistent.

The existing real-time infrastructure can support notification, customer bank-slip, and internal-chat widgets. It does not currently publish general dashboard summary events for bills, payments, inquiries, meter-reading progress, reports, or configuration changes.

## 2. Existing Architecture

### 2.1 Backend

The backend is a Spring Boot application under `src/main/java/com/backend/water_management_system`, organized by domain. The application enables scheduling and asynchronous work in `WaterManagementSystemApplication.java`. JWT authentication is implemented by `security/JwtService.java`, `security/JwtAuthenticationFilter.java`, `security/CustomUserDetailsService.java`, and `security/UserPrincipal.java`.

Important backend domains found:

- `alerts`: persisted alert records and alert API.
- `billing`: bills, billing rules/rates, current/outstanding bill queries, downloads, and generation.
- `blog`: blog CRUD and public blog retrieval.
- `common`: `Region`, `ConnectionRate`, shared DTOs, and configuration.
- `customer`: customer CRUD and customer-scoped access.
- `inquiry`: inquiries and inquiry messages.
- `internal_chat`: direct staff conversations, read receipts, attachments/support code where present, REST, and STOMP.
- `meter_reading`: meter readings and entry APIs.
- `messaging`: scheduled, triggered, sent messages, templates, dispatchers, and history.
- `notification`: customer notification persistence and delivery.
- `payments`: payments, payment allocations, bank slips, online/manual payment flows, and payment configuration.
- `predictions`: prediction service and monthly/customer prediction responses.
- `reports`: customer, bill, area, and monthly reports.
- `settings`: regions and system details.
- `user`: customers/admin users, roles, statuses, activation tokens, and user management.
- `usage`: system-wide and customer usage analytics.

### 2.2 Frontend

The frontend is a Vite React + TypeScript application. `src/App.tsx` provides public, customer, and admin route trees. `src/routes/ProtectedRoute.tsx` checks authentication and the role allow-list. `src/contexts/AuthContext.tsx` owns authenticated user state and `src/contexts/AdminContext.tsx` derives the current admin role from it.

The admin shell consists of:

- `src/pages/AdminIndex.tsx`: nested admin routes and a section access check.
- `src/components/layout/AdminLayout.tsx`: admin shell composition.
- `src/components/layout/AdminNavbar.tsx` and `AdminSidebar.tsx`: navigation and role display.
- `src/constants/adminNav.ts`: role-to-section navigation matrix.
- `src/utils/adminAccess.ts`: admin role list, section checks, and default admin paths.
- `src/pages/DashboardPage.tsx`: currently an empty placeholder.

Customer-facing routes currently include dashboard, bills, payments, usage, notifications, inquiries, profile, and settings. Admin routes currently include users, meter, payments, billing, messaging, internal chat, inquiries, reports, predictions, blog, settings, and system settings. The requested five dashboards should be implemented as role-specific views over these existing route capabilities, not as five unrelated feature implementations.

### 2.3 Database and persistence

The backend uses JPA repositories and PostgreSQL configuration. A hand-maintained `database/schema.sql` and `database/data.sql` also exist. The Java entities are the primary source of the runtime persistence model.

No dashboard/widget tables were found. No dashboard JSON layout or user preference persistence was found.

### 2.4 Authentication and authorization

JWT claims contain the authenticated NIC as subject and a string `role` claim. The backend uses `@PreAuthorize` on many controllers and services. The frontend also applies route and navigation restrictions, but those checks are only user-interface controls.

Authorization design requirement:

1. **Feature authorization**: backend permits or rejects the underlying operation.
2. **Widget visibility**: dashboard configuration decides whether an authorized widget is displayed.
3. **Data authorization**: every widget API checks the caller's role and, for customers, ownership of the subscription number.

A widget must never grant access to data that the corresponding feature endpoint would reject.

### 2.5 WebSockets

There are two relevant STOMP configurations:

- `common/config/WebSocketConfig.java`: endpoint `/ws`, broker prefixes `/topic` and `/queue`, application prefix `/app`, user prefix `/user`.
- `internal_chat/config/InternalChatWebSocketConfig.java`: endpoint `/ws/internal-chat`, broker prefixes `/topic`, `/queue`, and `/user`; it authenticates the STOMP `CONNECT` frame using a Bearer JWT.

The frontend uses `src/services/websocketService.ts` for customer notifications and bank-slip updates, and `src/services/internalChatSocket.ts` with `InternalChatPage.tsx` for staff chat.

MCP was not found in the inspected source. It is not a current dashboard dependency or integration point.

## 3. Role Definitions

| Intended role | Current implementation | Intended dashboard scope |
|---|---|---|
| `CUSTOMER` | Present in backend and customer routes | Own bills, payments, usage, notifications, inquiries, profile/settings, and other features actually exposed to customers |
| `METER_READER` | Present in backend and admin shell | Meter-reading entry/progress and internal staff chat |
| `CUSTOMER_HANDLER` | **Not implemented; replaces `PAYMENT_HANDLER`** | Billing, payments, customer management, inquiries, and internal staff chat |
| `SYSTEM_ADMIN` | Present in backend and admin shell | Customer-handler scope plus messaging, reports, predictions, blogs, usage, anomaly/alert oversight, and internal chat |
| `SUPER_ADMIN` | Present in backend and admin shell | All system-admin scope plus admin management, region/settings management, and future widget management |

The actual current navigation does not match all intended responsibilities. For example, customer management and inquiry navigation currently exclude `PAYMENT_HANDLER`, while payments and internal chat include it. Meter readers can reach the admin shell but only the meter and chat sections in the current navigation.

## 4. Existing Backend Data Sources

### 4.1 Entities and dashboard-relevant fields

| Entity | Important fields and relationships | Dashboard use |
|---|---|---|
| `customer/entity/Customer` | `subscriptionNumber` primary key, `accountHolderName`, `user`, `address`, `connectionType`, `outstandingBalance`, `region` | Customer count, customer search, connection-type grouping, outstanding balance, region grouping. System-wide aggregation methods are not consistently exposed. |
| `billing/entity/Bill` | `billId`, `customer`, `billingPeriod`, `billDate`, `dueDate`, `usageUnits`, `baseCharge`, `usageCharge`, `taxAmount`, `totalAmount`, `balanceDue`, `outstandingAtIssue`, `status`, `generatedAt`, `meterReading` | Current bill, outstanding bill list/amount, due dates, bill status, usage and revenue. |
| `meter_reading/entity/MeterReading` | `readingId`, `meterNumber`, `customer`, `previousReading`, `currentReading`, `usageUnits`, `readingDate`, `notes`, `submittedBy` | Customer usage charts, reading history, and meter-entry activity. No assignment/progress entity was found. |
| `payments/entity/Payment` | `paymentId`, `subscriptionNumber`, `amount`, `status`, `paymentType`, `paymentMethod`, `createdAt`, `orderId`, `payherePaymentId`, `bankSlip` | Customer payment history, recent payments, payment status/method charts, revenue. Most admin summaries still require aggregation queries. |
| `payments/entity/PaymentAllocation` | `id`, `paymentId`, `billId`, `amount` | Allocation detail; useful for accurate outstanding/revenue calculations. |
| `payments/entity/BankSlip` | `slipId`, `subscriptionNumber`, `amount`, file metadata/path, `bankReference`, `status`, `bankPaymentDate`, `uploadedAt`, `reviewedAt`, `rejectionReason` | Pending-review queue, customer slip status, payment-verification alert. |
| `common/entity/Region` | `regionCode`, `regionName`, `isActive` | Active region list and region configuration. Customer/bill regional summaries need joins and aggregation. |
| `common/entity/ConnectionRate` | `connectionType`, `baseRate`, three unit rates, tier limits, `taxRate` | Billing-rate configuration and explanation, not a direct activity metric. |
| `alerts/entity/Alert` | `id`, `severity`, `title`, `description`, `usage`, `time`, `dismissed` | Active severity-sorted alerts. This is an alert store, not evidence of a complete anomaly detector. |
| `notification/entity/Notification` | `id`, `subscriptionNumber`, `title`, `message`, `readStatus`, `createdAt`, `notificationType` | Customer unread count, recent notifications, real-time notification list. |
| `inquiry/entity/Inquiry` | `id`, `name`, `email`, `category`, `status` (`open`, `pending`, `resolved`), `createdAt`, messages | Customer inquiry status and admin queue. Category/status summaries need aggregation. |
| `inquiry` message entity | Inquiry conversation messages associated with an inquiry | Latest reply, response history, and action links. |
| `user/entity/User` | User identity/NIC, contact fields, role, status, timestamps, activation relationship | Admin management, account status, role counts. Exact fields should be read through `User.java` and DTOs when implementing. |
| `user/entity/ActivationToken` | Activation-token persistence for account activation | Operational account activation status, but tokens must never be exposed in widgets. |
| `blog/entity/Blog` | `id`, `title`, `category`, `imageUrl`, `content`, `date` | Customer announcements/blog list and admin publication activity. |
| `messaging/entity/Message` | `id`, `name`, `channels`, `recipients`, default flag, SMS/email templates | Message configuration counts and quick links. |
| `messaging/entity/ScheduledMessage` | Schedule type/day/date/time, last sent timestamp, one-time sent flag | Scheduled-message status. |
| `messaging/entity/TriggeredMessage` | Trigger type and `active` flag | Active trigger count/status. |
| `messaging/entity/SentMessage` | Sent date/time, email/SMS success rates, sent/failed/delivered totals | Delivery-success and failure widgets. |
| `messaging/entity/SentMessageFailure` | Sent message, customer, SMS/email failure flags | Failure queue and delivery alerts. |
| `internal_chat/entity/Conversation` | UUID, created/updated timestamps, participants | Recent staff conversations and activity. |
| `internal_chat/entity/ConversationParticipant` | User, joined/read timestamps | Unread counts and read state. |
| `internal_chat/entity/Message` | UUID, conversation, sender, content, created timestamp | Latest internal-chat activity; message body should not be shown broadly without authorization. |
| `reports/entity/BillReport` and `UsageRecord` | Report persistence fields and report usage records | Existing report pages and possible report links; not a generic dashboard summary contract. |
| `settings/entity/SystemDetails` | System-level configuration/details | Super-admin settings status, not a general activity metric. |

No concrete anomaly entity, prediction persistence entity, water-supply-outage entity, chatbot conversation entity, dashboard entity, widget entity, or meter-reader assignment entity was found. `Alert` exists, and prediction/usage services exist, but those are not equivalent to all features described in the product brief.

### 4.2 Backend services

| Service | Responsibility and widget value | Current limitation |
|---|---|---|
| `billing/service/BillingService` and billing services | Bill calculation, rates, current/outstanding bill operations | No discovered system summary contract for total generated, paid, overdue, or outstanding bills. |
| `payments/service/PaymentService` | Manual payment, payment history, recent payments, update/delete operations | Recent list exists; system totals and grouped status/method data need aggregation. |
| `payments/service/CustomerPaymentService` | Customer online payment flow, current bill, outstanding bills, customer history | Strong source for customer dashboard widgets; customer-scoped. |
| `payments/service/BankSlipService` | Upload, pending queue, review, deletion, Cloudinary file handling, admin WebSocket event | Pending list exists; pending count/amount summary is not a compact endpoint. |
| `customer/service/CustomerService` and `CustomerAccessService` | Customer CRUD and ownership enforcement | `getCustomers` returns a collection; dashboard totals should not load every customer into React. |
| `meter_reading/service/MeterReadingService` | Reading entry and reading retrieval | No assignment, completion, invalid-reading, or anomaly summary service. |
| `usage/service/UsageAnalyticsService` | System-wide or customer usage by year; monthly totals, total/peak/minimum/average, connection-type chart data | Current implementation reads lists and calculates in Java; it has a fixed monthly reference limit and a mock category fallback when total is zero. |
| `notification/service/NotificationService` | Customer notification retrieval/read state and publication | Customer-focused; no general admin notification aggregate was found. |
| `inquiry/service/InquiryService` | Inquiry creation, message replies, status resolution | Admin list exists; status/category aggregates need queries. |
| `internal_chat/service/InternalChatService` | Staff eligibility, conversations, messages, read markers, participant access | Useful for a chat/unread widget, but no dashboard-specific activity summary. |
| `messaging/service/ScheduledMessageService`, `TriggeredMessageService`, dispatchers, and history services | Message CRUD, scheduling, triggers, sending, delivery metrics/history | Existing sent-message metrics can support admin charts if response APIs expose them. |
| `predictions/service/PredictionService` | Monthly/customer prediction responses used by the predictions page | Prediction response should be verified before using as a dashboard chart; no prediction entity was found. |
| `reports/service/CustomerReportService`, `BillReportService`, `AreaReportService` | Customer/bill/area/monthly report calculations | Existing report endpoints are not consistently role-annotated; secure and shape them before dashboard reuse. |
| `blog/service/BlogService` | Blog CRUD/public content | Useful for recent announcements, with pagination/limit preferred. |
| `settings/service/RegionService` and `SystemSettingsService` | Region and system details management | Region list/configuration is super-admin work; not a regional statistics API. |
| `user/service/UserService` | Admin creation, update, status management | Useful for admin status widgets, but counts/grouping need summary methods. |
| `alerts/service/AlertService` | Active and severity-filtered alerts/dismissal | Supports alert list widgets. It does not prove automatic leak/fault detection exists. |

### 4.3 Backend APIs relevant to widgets

The following are actual mappings found in controllers or consumed by the frontend. Role restrictions shown are the visible `@PreAuthorize` restrictions; endpoints without a visible restriction require a security review before dashboard reuse.

#### Authentication, users, customers, and settings

| Method and endpoint | Visible access | Widget use |
|---|---|---|
| `POST /api/auth/login` | Public login | Establishes role/NIC context; not a widget API. |
| `POST /api/auth/activate` | Activation flow | Not a widget API. |
| `GET /api/users` | User controller; super-admin intent from user-management flow | Admin list; source for admin table, not a count summary. |
| `POST /api/users` | Admin-management flow; verify controller restriction | Super-admin admin-registration action. |
| `PUT /api/users/{id}` | Admin-management flow; verify controller restriction | Admin-management action. |
| `PATCH /api/users/{id}/status?status={status}` | Admin-management flow; verify controller restriction | Admin status action. |
| `GET /api/customers` | Customer controller; verify visible restriction | Customer list/search and handler table. |
| `GET /api/customers/{subscriptionNumber}` | Customer controller; ownership/admin restriction must be verified | Customer detail link. |
| `GET /api/customers/search?query={query}` | Customer search flow | Customer-handler quick action. |
| `POST /api/customers` | Customer management flow | Customer-handler action. |
| `PUT /api/customers/{subscriptionNumber}` | Customer management flow | Customer-handler action. |
| `DELETE /api/customers/{subscriptionNumber}` | Customer management flow | Soft-delete action if implemented by service. |
| `GET /api/regions` | Region controller | Super-admin region list; possible customer region label. |
| `POST /api/regions` | Region administration | Super-admin action. |
| `DELETE /api/regions/delete/{regionCode}` | Region administration | Super-admin action. |
| `GET /api/system-settings/get` | System settings | Super-admin settings view. |
| `PUT /api/system-settings/update` | System settings | Super-admin action. |

#### Bills, billing, meter readings, payments, and slips

| Method and endpoint | Visible access | Widget use |
|---|---|---|
| `GET /api/bills/customer/me` | Customer hook | Customer bill list/current-bill summary source. |
| `GET /api/bills/current/{subscriptionNumber}` | Payment/admin flow; verify controller restriction | Current bill widget for an authorized customer or staff detail view. |
| `GET /api/bills/outstanding/{subscriptionNumber}` | Payment/admin flow; verify controller restriction | Outstanding amount/list for customer or staff detail. |
| `GET /api/bills/customer/{subscriptionNumber}` | Billing admin search flow | Customer-handler billing lookup. |
| `GET /api/bills/{billId}/download` | Customer/admin bill flow | Quick action; do not fetch document into a summary widget. |
| `GET /api/rates` | Billing settings | Rate-card/status widget for authorized staff. |
| `POST /api/rates` | Billing settings | System-admin/customer-handler billing configuration action after access review. |
| Meter-reading controller mappings under `/api/meter-readings` | Meter-reading page; exact paths should be taken from `MeterReadingController.java` | Meter entry and reading history. A completion widget needs new aggregate data. |
| `POST /api/payments` | `SUPER_ADMIN`, `SYSTEM_ADMIN`, current `PAYMENT_HANDLER` in `PaymentController` | Customer-handler payment action after role migration. |
| `GET /api/payments/customer/{subscriptionNumber}` | Same payment controller restriction | Staff customer payment summary. |
| `GET /api/payments/history/{subscriptionNumber}?page=&size=&year=&paymentMethod=` | Same payment controller restriction | Staff payment history table. |
| `GET /api/payments/customerInfo/{subscriptionNumber}` | Same payment controller restriction | Payment customer detail. |
| `GET /api/payments/recent?limit=` | Same payment controller restriction | Recent payments list widget. |
| `PATCH /api/payments/{paymentId}` | Same payment controller restriction | Payment correction action; never expose as a dashboard read. |
| `DELETE /api/payments/delete/{paymentId}` | Same payment controller restriction | Payment deletion action; never expose as a dashboard read. |
| `GET /api/customer/payments/current-bill` | Customer | Current bill widget. |
| `GET /api/customer/payments/outstanding-bills` | Customer | Outstanding amount/list widget. |
| `GET /api/customer/payments/history?page=&size=&year=&paymentMethod=` | Customer | Payment history widget. |
| `POST /api/customer/payments/initiate` | Customer | Pay-now action. |
| `GET /api/customer/payments/status/{orderId}` | Customer | Payment status action/result. |
| `POST /api/slips/upload` | Customer | Upload bank slip action. |
| `GET /api/slips/my?page=&size=&year=&status=` | Customer | Customer slip-status list. |
| `GET /api/slips/pending?page=&size=&search=` | `SUPER_ADMIN`, `SYSTEM_ADMIN`, current `PAYMENT_HANDLER` | Pending verification table/list. |
| `GET /api/slips/pending/all` | Same admin roles | Small pending list only; avoid dashboard use at scale. |
| `POST /api/slips/review` | Same admin roles | Review action. |
| `GET /api/slips/{slipId}` | Same admin roles | Review detail. |
| `DELETE /api/slips/delete/{slipId}` | Customer plus current admin roles | Delete action; role migration and ownership review required. |
| `POST /api/slips/extract` | Customer | Bank-slip upload assistance, not a summary widget. |

#### Usage, alerts, notifications, inquiries, messaging, reports, predictions, and blogs

| Method and endpoint | Visible access | Widget use |
|---|---|---|
| `GET /api/analytics/usage?year=` | `SUPER_ADMIN`, `SYSTEM_ADMIN` | System usage chart and summary. |
| `GET /api/analytics/usage/{subscriptionNumber}?year=` | `CUSTOMER`, `SUPER_ADMIN`, `SYSTEM_ADMIN` with ownership enforcement | Customer usage chart. Customer Handler/Meter Reader access is not currently granted. |
| Alert controller mappings under `/api/alerts` | Alert service/page; verify exact mappings and annotations | Active alert list. |
| `GET /api/customer/notifications` | Customer | Recent notification list. |
| `GET /api/customer/notifications/unread` | Customer | Unread notification stat/list. |
| `PUT /api/customer/notifications/{id}/read` | Customer | Mark-read action. |
| `PUT /api/customer/notifications/read-all` | Customer | Mark-all-read action. |
| `GET /api/inquiries` | Customer/admin inquiry hooks; inspect controller restriction | Inquiry queue/status list. |
| `POST /api/inquiries` | Customer | New inquiry action. |
| `POST /api/inquiries/{id}/messages` | Customer/handler flow; inspect restriction | Reply action. |
| `PATCH /api/inquiries/{id}/status?status=resolved` | Admin inquiry flow; inspect restriction | Resolve action. |
| Scheduled-message mappings under `/api/messages/scheduled` | System-admin/super-admin messaging flow | Scheduled-message status/list. |
| Triggered-message mappings under `/api/messages/triggered` | System-admin/super-admin messaging flow | Trigger status/list. |
| Message history/failure mappings under messaging controller | System-admin/super-admin flow | Delivery metrics and failure list. |
| Messaging enums endpoint | Messaging page | Configuration, not a widget metric. |
| `GET /api/reports/monthly?year=` | `MonthlyReportController` has no visible `@PreAuthorize` | Monthly usage/revenue chart after access hardening. |
| Other report mappings under `AreaReportController`, `BillReportController`, `CustomerReportController` | Must inspect and secure before reuse | Report quick links/charts. |
| Prediction mappings under `PredictionController` | Predictions page; verify annotations | Prediction chart/list for system admins. |
| Blog mappings under `/api/blogs` | Public/admin flows | Recent blog/announcement list and admin content status. |
| Internal chat mappings under `/api/internal-chat/*` | Service enforces eligible staff and participation | Unread conversation/action widget. |

### 4.4 Existing aggregation capability

The current code already has useful customer-scoped aggregation:

- `BillRepository.getTotalPendingBalance(subscriptionNumber)` is used by bank-slip validation.
- Customer outstanding-bill responses contain an outstanding list and summary.
- `UsageAnalyticsService` calculates total, peak, minimum, average, monthly, and category values.
- Payment history uses pagination and customer filtering.
- Internal chat repositories calculate unread counts per conversation.

The code does not provide a single optimized admin dashboard summary. Do not implement admin widgets by downloading all customers, bills, or payments and calculating totals in React.

## 5. Existing Frontend Data Sources

### 5.1 Pages and reusable UI

| Existing page/component | Reuse opportunity |
|---|---|
| `pages/Dashboard.tsx` | Customer dashboard shell and existing customer summary presentation, subject to inspection of its actual current data. |
| `pages/DashboardPage.tsx` | Admin dashboard host; currently empty and the natural dashboard renderer entry point. |
| `pages/Bills.tsx`, `components/bills/*` | Current bill, bill list, status, download, and bill card/widget reuse. |
| `pages/CustomerPayments.tsx`, `components/payments/*` | Customer payment summary, current bill, outstanding list, payment history, payment actions. |
| `pages/PaymentsPage.tsx` | Admin recent payments, customer search, pending bank slips. |
| `components/payments/RecentPaymentsList.tsx` | Direct candidate for recent-payments list widget. |
| `components/payments/PendingBankSlipsTable.tsx` | Direct candidate for customer-handler/system-admin pending-slip widget. |
| `pages/MeterReadingPage.tsx`, `components/meter-reading/*` | Meter entry action and latest reading UI. |
| `pages/Usage.tsx`, `components/usage/*`, `components/charts/*` | Usage chart and summary reuse. |
| `pages/Notifications.tsx`, `components/notifications/*` | Notification list, unread state, and WebSocket refresh. |
| `pages/CustomerInquiryPage.tsx`, `pages/AdminInquiriesPage.tsx`, `components/inquiries/*`, `components/inquiry/*` | Inquiry list/status/reply/action widgets. |
| `pages/InternalChatPage.tsx`, `services/internalChatSocket.ts` | Staff chat widget or unread-conversation quick action. |
| `pages/MessagingPage.tsx`, `components/messaging/*` | Scheduled/triggered message status/action reuse. |
| `pages/ReportsPage.tsx` | Report links and existing report presentation. |
| `pages/PredictionsPage.tsx`, `components/predictions/*` | Prediction chart/list reuse after verifying response contract. |
| `pages/AdminBlogPage.tsx`, `pages/Info/Blog.tsx` | Recent blog/announcement list and publication action. |
| `pages/UserManagementPage.tsx`, `components/user-management/*` | Admin/user status list and super-admin actions. |
| `components/ui/*` | Existing Card, Table, Badge, Button, Alert, Tabs, Dialog, Skeleton, and layout primitives. |
| `components/charts/*` | Existing chart wrappers should be reused instead of adding a second chart library. |

### 5.2 Frontend services, hooks, and types

| File | Existing methods/data | Candidate widget use |
|---|---|---|
| `services/paymentService.ts` | Customer summary, current/outstanding bills, payment history, recent payments, online payment status, update/delete | Current bill, balance, payment history, recent payments, pay-now action. |
| `services/bankSlipService.ts` | Upload, customer slips, pending slips, review, detail, delete | Slip status and pending-review queue. |
| `services/customerService.ts` | Customer list/detail/create/search/update/delete/billing | Customer lookup and management actions. |
| `services/adminService.ts` | `getAdmins`, `createAdmin`, `updateAdmin`, `updateAdminStatus` | Super-admin admin-status list/actions. |
| `services/internalChatService.ts` | Staff search, conversations, messages, read | Internal chat list/unread/action. |
| `services/internalChatSocket.ts` | Authenticated internal-chat STOMP connection and subscriptions | Live staff activity. |
| `services/websocketService.ts` | `connectAdminSlipSocket`, `connectCustomerNotificationSocket` | Live pending-slip and customer-notification updates. |
| `services/notificationService.ts` | Customer notifications, unread, read, read-all | Notification count/list/action. |
| `services/inquiryService.ts`, `hooks/useInquiries.ts`, `useAdminInquiries.ts`, `useCustomerInquiryPage.ts` | Inquiry fetch/create/reply/resolve and polling | Customer inquiry status and staff queue. |
| `services/messageService.ts`, `hooks/useMessageHistory.ts`, `useMessageForm.ts` | Scheduled/triggered CRUD, history, failures, enums | Messaging status/delivery widgets. |
| `hooks/useBilling.ts` | Rates and customer bill search/download | Billing quick actions/rate status. |
| `hooks/useMeterReading.ts` | Meter-reading entry/retrieval flow | Meter entry action and latest reading. |
| `hooks/useUsage.ts` | Usage analytics request/state | Customer/system usage chart. |
| `hooks/useAdminBlogs.ts` | Blog list/create/image upload/delete | Recent blogs/admin publication actions. |
| `services/regionService.ts` | Active regions/add/delete | Super-admin region action/list. |
| `services/reportService.ts` | Currently local/static report list and download helpers | Treat as navigation only until backed by report APIs. |
| `services/systemSettingsService.ts` | System details get/update | Super-admin settings status/action. |
| `types/admin.ts` | Admin roles, statuses, admin forms | Must replace old role union during migration. |
| `types/payment.ts`, `billing.ts`, `meter.ts`, `usage.ts`, `notification.ts`, `inquiry.ts`, `messaging.ts`, `bankSlip.ts`, `internalChat.ts`, `region.ts`, `user.ts` | Feature response/request types | Reuse in widget props and data adapters. |

### 5.3 Role routing and navigation gaps

Current frontend role references are concentrated in:

- `src/types/admin.ts`: `AdminRole` includes `PAYMENT_HANDLER`.
- `src/utils/adminAccess.ts`: `ADMIN_ROLES` includes it; default path sends it to payments.
- `src/constants/adminNav.ts`: payments/internal chat include it; customer management, inquiries, billing, and dashboard do not reflect intended customer-handler scope.
- `src/App.tsx`: admin `ProtectedRoute` allow-list includes it.
- `src/components/layout/AdminNavbar.tsx`: role labels/colors include `PAYMENT_HANDLER` and lowercase variants.
- `src/pages/InternalChatPage.tsx`: role tabs and role labels include it.
- `src/contexts/AdminContext.tsx`: derives role through `isAdminRole`, so its behavior changes with the union.

The dashboard renderer should derive role from `AuthContext`, but all navigation and route guards must be updated consistently.

## 6. Candidate Widgets

Priority meanings: **P0** essential for the first usable dashboard, **P1** important follow-up, **P2** optional or dependent on missing data.

### 6.1 Customer Dashboard

| Widget | Type | Actual data path | Live? | New backend work | New frontend work | Priority |
|---|---|---|---|---|---|---|
| Current Bill | `STAT` / `ACTION` | `paymentService.getCurrentBillForCustomer()` -> `/api/customer/payments/current-bill` -> `Bill` | Refresh after bill notification; no dedicated event required | No for first version | Adapt current bill card into widget | P0 |
| Outstanding Balance | `STAT` | `getOutstandingBillsForCustomer()` -> `/api/customer/payments/outstanding-bills` -> `Bill`/customer balance | Poll/refetch after payment; no summary event | No | Extract summary presentation | P0 |
| Recent Payment History | `TABLE` / `LIST` | `getPaymentHistoryForCustomer()` -> `/api/customer/payments/history` -> `Payment` | Payment completion can trigger refetch; no general event confirmed | No | Reuse payment history card/table with compact limit | P0 |
| Pay Bill | `ACTION` | `initiatePayment()` -> `/api/customer/payments/initiate` | Status endpoint gives result | No | Reuse online payment action | P0 |
| Usage Trend | `CHART` | `useUsage()` -> `/api/analytics/usage/{subscriptionNumber}?year=` -> `UsageAnalyticsService` / `MeterReading` | No usage event found | No | Reuse chart with loading/empty states | P0 |
| Unread Notifications | `STAT` / `LIST` | `getUnreadCustomerNotifications()` -> `/api/customer/notifications/unread` -> `Notification` | Yes: `/topic/customer/notifications`, `/user/queue/notifications`, and subscription topic | No | Extract notification badge/list | P0 |
| Inquiry Status | `LIST` / `PROGRESS` | `useCustomerInquiryPage` and `/api/inquiries` -> `Inquiry` | No inquiry event found; current hooks poll in places | No | Compact status list and link | P1 |
| Recent Blog/Announcements | `ANNOUNCEMENT` | Blog page/API under `/api/blogs` -> `Blog` | No blog event found | No | Add bounded recent-content query/use | P1 |
| Bank Slip Status | `LIST` | `getMySlips()` -> `/api/slips/my` -> `BankSlip` | Customer upload event is currently admin topic only | No | Compact status list and upload action | P1 |
| Customer Profile Quick Actions | `ACTION` | `customerService` and profile routes | No | No | Link existing profile/settings | P1 |
| Chatbot | Not proposed as a dashboard widget | No confirmed chatbot backend/API was found in the inspected source | No | Full feature/API verification required | Do not place on initial dashboard solely from the brief | P2 |
| Water Supply Information | `ANNOUNCEMENT` only if backed by existing data | No confirmed outage/supply entity or dedicated API was found | No | Required | Required | P2 |

### 6.2 Meter Reader Dashboard

| Widget | Type | Actual data path | Live? | New backend work | New frontend work | Priority |
|---|---|---|---|---|---|---|
| Quick Meter Reading Entry | `ACTION` | `MeterReadingPage`, `useMeterReading`, meter-reading controller/service, `MeterReading` | No event required | No | Extract entry form/action | P0 |
| Latest Reading / Customer Lookup | `TABLE` / `LIST` | Meter-reading APIs and customer search | No | No if existing response includes required fields | Compact lookup/result component | P0 |
| Reading History / Usage Preview | `CHART` / `LIST` | `UsageAnalyticsService` customer usage endpoint, if role access is extended | No | Authorization change likely: current customer usage endpoint allows customer, super/system admins, not meter readers | Adapt existing usage chart and define scope | P1 |
| Reading Progress | `PROGRESS` | No assignment or work-order entity/API found | No | Yes: assignment/current-period status/count query | New summary endpoint and widget | P0 for a true progress metric, otherwise omit |
| Pending/Completed/Invalid Readings | `STAT` / `TABLE` | `MeterReading` has no validation/status field; repository has date/customer/year queries | No | Yes for period status model and aggregate queries | New widget only after contract exists | P1 |
| Consumption Anomaly Alerts | `ALERT` | `Alert` exists, but no confirmed meter anomaly detector or meter-reader-scoped alert API | No | Likely yes | Adapt alert component after scope exists | P2 |
| Staff Chat | `ACTION` / `LIST` | `internalChatService` and `/ws/internal-chat` | Yes for messages/read receipts | No | Compact unread/conversation widget | P0 |
| PWA Install/Offline State | `ACTION` / `STATUS` | `PWAInstallButton`, `usePWAInstall`, `PWAManifestController` | Browser state | No | Reuse existing control | P1 |

### 6.3 Customer Handler Dashboard

This role is the intended replacement for the current `PAYMENT_HANDLER` and should receive the broader customer-service scope stated in the brief.

| Widget | Type | Actual data path | Live? | New backend work | New frontend work | Priority |
|---|---|---|---|---|---|---|
| Customer Search / Quick Open | `ACTION` | `customerService.searchCustomersApi()` -> `/api/customers/search` | No | No | Reuse payment search/customer search | P0 |
| Customer Count | `STAT` | `GET /api/customers` can provide a list but is inefficient | No | Yes: count query/summary endpoint | New stat widget | P0 |
| Pending Bank Slip Reviews | `STAT` / `TABLE` | `getPendingSlips()` -> `/api/slips/pending` -> `BankSlip` | Yes: `/topic/admin/bank-slips` currently reaches admins broadly | No for list; count/amount summary recommended | Reuse `PendingBankSlipsTable` with bounded data | P0 |
| Recent Payments | `LIST` | `getRecentPayments()` -> `/api/payments/recent` -> `Payment` | No payment dashboard event found | No | Reuse `RecentPaymentsList` | P0 |
| Outstanding Customer Payment Lookup | `STAT` / `ACTION` | `getCustomerPaymentSummary`, current/outstanding bill endpoints | No | No | Reuse customer payment panels in compact form | P0 |
| Inquiry Queue | `TABLE` / `LIST` | `useAdminInquiries` -> `/api/inquiries` and reply/status endpoints | No confirmed event; polling exists in hooks | No for list | Compact queue with count/status filters | P0 |
| Billing Rate Snapshot | `LIST` / `STAT` | `useBilling` -> `/api/rates` -> `ConnectionRate` | No | No | Link or compact rate summary | P1 |
| Customer Management Actions | `ACTION` | `customerService` CRUD | No | No | Link existing form/actions after role authorization update | P0 |
| Internal Chat | `LIST` / `ACTION` | `internalChatService`, `/ws/internal-chat` | Yes | No | Compact unread widget | P1 |
| Meter Progress | Not initially proposed | No assignment/progress data | No | Yes | Yes | P2 |

### 6.4 System Admin Dashboard

| Widget | Type | Actual data path | Live? | New backend work | New frontend work | Priority |
|---|---|---|---|---|---|---|
| Customer and Account Overview | `STAT` | Customer and user repositories | No | Yes: count/grouped summary endpoints | New stats widget | P0 |
| Billing/Payment Summary | `STAT` / `CHART` | `Bill`, `Payment`, `PaymentAllocation`, existing report services | No | Yes: period/status aggregation | New summary DTO and chart adapter | P0 |
| Pending Bank Slips | `STAT` / `TABLE` | `/api/slips/pending` and `BankSlipService` | Yes for new slip list event | No for list | Reuse table as compact queue | P0 |
| Inquiry Queue | `STAT` / `LIST` | `/api/inquiries` and `InquiryService` | No confirmed event | Prefer status-count query | Compact queue | P0 |
| Usage Trend | `CHART` | `/api/analytics/usage?year=` and `UsageAnalyticsService` | No | No for current year chart; pagination/aggregation may be needed at scale | Reuse usage chart | P0 |
| Monthly Revenue/Usage | `CHART` | `/api/reports/monthly?year=` -> `MonthlyReportDTO` (`month`, `usage`, `revenue`) | No | Secure endpoint; verify query performance | Reuse report chart | P0 |
| Predictions | `CHART` / `LIST` | `PredictionController`/`PredictionService` | No | Verify response and role restrictions | Adapt prediction chart | P1 |
| Active Alerts | `ALERT` | `/api/alerts` -> `Alert` | No alert WebSocket found | No for list; add event if live is required | Reuse alert list | P0 |
| Messaging Delivery | `CHART` / `STAT` | sent-message history/failure APIs -> `SentMessage`/`SentMessageFailure` | No | Possibly summary endpoint to avoid history download | Compact delivery metrics | P1 |
| Recent Blogs | `ANNOUNCEMENT` | `useAdminBlogs` -> `/api/blogs` -> `Blog` | No | Limit/paginate | Compact recent list | P1 |
| Internal Chat | `LIST` / `ACTION` | internal-chat REST/STOMP | Yes | No | Compact unread widget | P0 |
| Customer Handler Workflow | `ACTION` | Customer search, billing, payment, inquiry routes | No | No | Quick-action strip | P1 |

### 6.5 Super Admin Dashboard

| Widget | Type | Actual data path | Live? | New backend work | New frontend work | Priority |
|---|---|---|---|---|---|---|
| System Summary | `STAT` | Customers, users, bills, payments, alerts, inquiries, regions | No | Yes: one authorized summary service/query set | New stats row | P0 |
| Admin Status | `TABLE` / `STAT` | `adminService.getAdmins()` -> `/api/users` -> `User` | No | Count endpoint recommended | Reuse user management table in compact form | P0 |
| Region Overview | `TABLE` / `LIST` | `regionService.getAllActiveRegions()` -> `/api/regions` -> `Region` | No | Regional customer/billing counts need joins | Region list plus later aggregate | P1 |
| Customer and Billing Overview | `STAT` / `CHART` | Customer/Bill/Payment repositories and report services | No | Yes: aggregation and role-scoped summary | New charts | P0 |
| Payment Verification Queue | `ALERT` / `TABLE` | `/api/slips/pending`, bank-slip event | Yes for new slips | No for list | Reuse queue | P0 |
| Usage/Revenue Trends | `CHART` | usage analytics and monthly report APIs | No | Secure and optimize report/analytics queries | Reuse charts | P0 |
| Anomaly/Alert Center | `ALERT` | `Alert`/`AlertService` | No | Detector/event pipeline only if automatic detection is required | Alert center | P1 |
| Messaging Delivery | `CHART` / `TABLE` | `SentMessage` history/failures | No | Summary query recommended | Compact delivery dashboard | P1 |
| Admin Activity | `LIST` | User timestamps, internal chat timestamps, sent messages, audit data if available | No audit entity was found | Yes for a reliable audit/activity feed | New activity list | P1 |
| Blog Publication | `LIST` / `ACTION` | Blog API and `AdminBlogPage` | No | No | Reuse recent publication list | P1 |
| Widget Management | `ACTION` / `TABLE` | No current backend or frontend implementation | No | Yes: widget/dashboard persistence and APIs | Yes: configuration UI/renderer | P0 for configurable dashboards |
| System Settings/Regions | `ACTION` | `/api/system-settings/*`, `/api/regions/*` | No | No | Link existing settings pages | P1 |
| Internal Chat | `LIST` / `ACTION` | internal chat | Yes | No | Compact widget | P1 |

## 7. Widget Data Mapping

The implementation should keep each widget's data contract explicit. Representative mappings are:

```text
Current Bill Widget
  Frontend component: CurrentBillWidget.tsx (new adapter around existing bill/payment card)
  Frontend service: paymentService.getCurrentBillForCustomer()
  API: GET /api/customer/payments/current-bill
  Backend: CustomerPaymentController -> CustomerPaymentService
  Repository/entity: BillRepository -> Bill, Customer
  Database data: billing period, due date, total amount, balance due, status
```

```text
Pending Slip Review Widget
  Frontend component: adapted PendingBankSlipsTable.tsx
  Frontend service: bankSlipService.getPendingSlips()
  API: GET /api/slips/pending?page=&size=&search=
  Backend: BankSlipController -> BankSlipService
  Repository/entity: BankSlipRepository -> BankSlip
  Database data: slip id, subscription number, amount, status, uploaded/reviewed dates
```

```text
Customer Usage Trend Widget
  Frontend component: adapted Usage chart component
  Frontend hook: useUsage()
  API: GET /api/analytics/usage/{subscriptionNumber}?year=
  Backend: UsageAnalyticsController -> UsageAnalyticsService
  Repository/entity: MeterReadingRepository -> MeterReading, Customer
  Database data: reading date, usage units, connection type
```

```text
Monthly Revenue and Usage Widget
  Frontend component: adapted Reports chart
  Frontend service: report API adapter; current reportService.ts is partly local/static
  API: GET /api/reports/monthly?year=
  Backend: MonthlyReportController -> CustomerReportService
  Repository/entity: report repositories and Bill/Payment-related data used by service
  Response: MonthlyReportDTO { month, usage, revenue }
```

For system-wide widgets, the preferred contract is a small summary DTO rather than a raw entity list:

```json
{
  "period": "2026-08",
  "customerCount": 0,
  "activeAdminCount": 0,
  "pendingSlipCount": 0,
  "pendingSlipAmount": 0,
  "outstandingBillCount": 0,
  "outstandingAmount": 0,
  "paidAmount": 0,
  "openInquiryCount": 0,
  "activeAlertCount": 0
}
```

The exact fields should be finalized with the reporting period, currency, timezone, and role scope. This is a proposed response shape, not an existing API.

## 8. Widget Role Permission Matrix

Legend: `P0` = essential candidate, `P1` = important, `P2` = optional; `-` = do not expose by default; `API gap` = requires new backend contract.

| Widget | Customer | Meter Reader | Customer Handler | System Admin | Super Admin |
|---|---:|---:|---:|---:|---:|
| Current bill | P0 | - | P1/customer lookup | P1/customer lookup | P1/customer lookup |
| Own outstanding balance | P0 | - | P1/customer lookup | P1/customer lookup | P1/customer lookup |
| Own payments | P0 | - | P1/customer lookup | P1/customer lookup | P1/customer lookup |
| Recent system payments | - | - | P0 | P0 | P0 |
| Pending bank slips | - | - | P0 | P0 | P0 |
| Customer search/management | - | - | P0 | P1 | P1 |
| Meter entry | - | P0 | - | P1 | P1 |
| Meter progress | - | P0/API gap | P1/API gap | P1/API gap | P1/API gap |
| Own usage trend | P0 | P1 after authorization decision | P1 if business-approved | P1 | P1 |
| System usage trend | - | - | - | P0 | P0 |
| Inquiry status/queue | Own only P1 | - | P0 | P0 | P0 |
| Customer notifications | P0 | - | - | - | - |
| Active alerts | Customer-scoped only if API supports it | P1 if scoped | P1 | P0 | P0 |
| Messaging delivery | - | - | - | P1 | P1 |
| Predictions | - | - | - | P1 | P1 |
| Blog/announcements | P1 | - | - | P1 | P1 |
| Internal chat | - | P0 | P0 | P0 | P0 |
| Admin management | - | - | - | - | P0 |
| Region management | - | - | - | - | P0 |
| Widget management | - | - | - | - | P0 |

The matrix is a product recommendation constrained by current functionality. Backend controllers must implement the same data boundary. In particular, do not let a customer-handler dashboard call a system-wide endpoint merely because the widget is hidden from customers.

## 9. Real-Time Widget Opportunities

### 9.1 Existing events that can be reused

```text
Customer notification widgets
  Event: notification publication
  Topics: /topic/customer/notifications, /user/queue/notifications,
          /topic/customer/{subscriptionNumber}/notifications
  Frontend listener: websocketService.connectCustomerNotificationSocket()
  UI: Notifications.tsx/useNotifications; dashboard can share/refetch the same cache
```

```text
Pending bank-slip widget
  Event: new uploaded bank slip
  Topic: /topic/admin/bank-slips
  Backend publisher: BankSlipService.uploadSlip()
  Frontend listener: websocketService.connectAdminSlipSocket()
  UI: PendingBankSlipsTable.tsx
  Note: the current topic is broad; backend must ensure only authorized staff receive it.
```

```text
Internal chat widget
  Event: saved message/read receipt
  Endpoint/topic: /ws/internal-chat, /topic/internal-chat/conversation/{id},
                  /user/queue/internal-chat, read queue
  Backend: InternalChatWebSocketController and InternalChatService
  Frontend: InternalChatSocket and InternalChatPage.tsx
```

### 9.2 Events that would require new work

No dashboard event was found for payment completion, bill generation, inquiry creation/status change, meter-reading submission, alert creation, blog publication, prediction completion, report completion, region changes, or widget configuration changes. These widgets should initially refresh after their own action or use bounded polling. Add domain events only when the operational need justifies them.

Every new event should define payload identity, role/region/customer scope, topic authorization, replay/refetch behavior, and a REST source of truth. WebSocket messages must not be the only source for a dashboard statistic.

## 10. Widget Management Architecture

No current dashboard configuration model was found. A durable design should introduce three concepts, with names adapted to the existing Java naming style:

### 10.1 Proposed backend model

- `WidgetDefinition`: stable key such as `CURRENT_BILL`, display metadata, type, component key, active flag, allowed roles, default size, and version.
- `DashboardDefinition`: role or named dashboard, active/default flag, version, and optional scope (`CUSTOMER`, `STAFF`, `SYSTEM`).
- `DashboardWidget`: dashboard definition, widget definition, grid position/size, visible flag, ordinal, and validated JSON configuration.
- Optional `UserDashboardPreference`: authenticated user override for visibility/order/size. Do not use arbitrary component names from the client as executable code.

Use an enum or controlled string for widget types: `STAT`, `CHART`, `TABLE`, `LIST`, `ALERT`, `ACTION`, `PROGRESS`, and `ANNOUNCEMENT`. Use a stable `componentKey` registry on the frontend, not a file path or eval-like value.

### 10.2 Proposed API surface

These are recommended future endpoints, not existing APIs:

- `GET /api/dashboards/me`: resolve the authenticated user's role dashboard and authorized widget instances.
- `GET /api/dashboards/{role}`: super-admin read-only configuration view, if needed.
- `PUT /api/dashboards/{dashboardId}/widgets`: replace validated layout/configuration.
- `POST /api/widgets`: create a widget definition; super-admin only.
- `PUT /api/widgets/{widgetId}`: update metadata/active state; super-admin only.
- `DELETE /api/widgets/{widgetId}`: deactivate rather than destructive delete when referenced.
- `GET /api/widgets/catalog`: return only definitions the caller is allowed to use.

The backend should validate role access, component-key allow-lists, JSON schema/configuration bounds, grid dimensions, and duplicate widget placement.

### 10.3 Proposed frontend rendering flow

```text
DashboardPage
  -> DashboardGrid
  -> WidgetRenderer
  -> componentKey allow-list
  -> specific widget component
  -> feature service/hook
```

A registry can be typed as `Record<WidgetComponentKey, React.ComponentType<WidgetProps>>`. Unknown, inactive, or unauthorized definitions should render a controlled unavailable state and be logged, not dynamically imported from an arbitrary server-provided path.

## 11. Required Backend Changes

1. Replace `PAYMENT_HANDLER` with `CUSTOMER_HANDLER` in `Role`, authorization expressions, seed data, tests, and any persisted role migration.
2. Add a dashboard summary service with role/scope-aware DTOs.
3. Add aggregation repository queries for customer/user counts, bill status and balance totals, payment status/method totals, pending slip count/amount, inquiry status counts, alert counts, and regional rollups where required.
4. Add meter-reading period/assignment status if progress is a real requirement. Current `MeterReading` has no status or assignment model.
5. Add customer-scoped alert/water-supply APIs only if those are actual supported business features. Do not infer them from `Alert` alone.
6. Secure report endpoints, especially `MonthlyReportController`, with explicit role and scope checks.
7. Add dashboard/widget persistence and configuration APIs.
8. Define optional dashboard event payloads and authorization for bill/payment/inquiry/reading/configuration updates.
9. Add pagination/limit parameters to recent dashboard lists and avoid `findAll()` for large tables.
10. Add tests for role access, ownership, aggregation correctness, empty data, date boundaries, and widget configuration validation.

## 12. Required Frontend Changes

1. Replace the empty admin `DashboardPage` with a role-resolved dashboard host.
2. Decide whether `pages/Dashboard.tsx` is the customer dashboard shell or a legacy page, then consolidate rather than create two customer dashboard implementations.
3. Create typed widget definitions, a component registry, `DashboardGrid`, `WidgetRenderer`, loading/error/empty states, and responsive layout behavior.
4. Add service adapters for new summary endpoints; keep existing feature services for detailed links/actions.
5. Reuse existing payment, bill, chart, table, alert, notification, inquiry, and chat components through compact widget wrappers.
6. Update `AdminRole`, protected routes, `adminNav`, `adminAccess`, navbar labels/colors, internal-chat role filters, translations, and default paths for `CUSTOMER_HANDLER`.
7. Add React Query keys/cache invalidation or the project’s established data-fetching pattern so multiple widgets do not issue duplicate requests.
8. Subscribe only to authorized existing WebSocket topics and refetch from REST after events.
9. Add widget management UI for super-admin only after backend configuration APIs exist.
10. Add tests for each role’s route, widget visibility, loading/error states, and unauthorized API responses.

## 13. Reusable Existing Components

| Existing component/feature | Dashboard adaptation |
|---|---|
| Payment cards, `PaymentHistoryCard`, `RecentPaymentsList` | Add compact props such as `limit`, `onViewAll`, and dashboard density. |
| `PendingBankSlipsTable` | Add compact mode and bounded pagination; keep review action authorization. |
| Usage chart components | Accept the existing `UsageAnalyticsResponse`; show actual empty data rather than the backend’s mock category proportions without a product decision. |
| Inquiry list/status badges | Add compact status grouping and deep link to the full queue. |
| Notification list/toast infrastructure | Share WebSocket/cache path; do not create a second notification socket. |
| Alert UI | Adapt active `Alert` list and severity styles; do not label alerts as automatically detected anomalies unless the detector is verified. |
| Internal chat components/socket | Add unread summary and open-chat action, preserving participant checks. |
| `Card`, `Table`, `Badge`, `Button`, `Skeleton`, `Alert` in `components/ui` | Use as the common widget frame and state primitives. |
| `PWAInstallButton` | Meter-reader dashboard action/status. |
| Existing charts in `components/charts` and report/prediction pages | Reuse the chart library/configuration already installed. |

## 14. Missing APIs / Data

| Missing requirement | Why current code is insufficient | Existing sources | Suggested future contract |
|---|---|---|---|
| Total customers | A full customer list is not an efficient stat API | `CustomerRepository`, `Customer` | `GET /api/dashboard/customer-summary` with `count`, status/type/region breakdowns as authorized. |
| Pending payment total/count | Customer outstanding endpoint is scoped to a subscription; recent payments is a list | `Bill`, `Payment`, `PaymentAllocation` | `GET /api/dashboard/payment-summary?period=` with counts and monetary totals. |
| Revenue by month/status | Report exists but access/performance/response scope needs verification | `CustomerReportService`, `MonthlyReportDTO`, payment/bill data | Secure `GET /api/dashboard/revenue?from=&to=&region=`. |
| Meter-reading progress | No assignment, period target, status, or invalid flag | `MeterReading` | Add reading work-period/assignment model or define a precise query contract; then return assigned/completed/pending/invalid counts. |
| Regional usage/revenue | `Region` is related to customers, but no dashboard aggregation contract was found | `Region`, `Customer`, `MeterReading`, `Bill`, `Payment` | `GET /api/dashboard/regions/summary?period=` with strict role scope. |
| Inquiry status counts | Inquiry list exists, but a list is not a count contract | `InquiryRepository`, `Inquiry` | `GET /api/dashboard/inquiry-summary` returning open/pending/resolved counts and oldest open timestamp. |
| Dashboard anomaly detection | `Alert` is present but no complete detector/model/API was confirmed | `Alert`, `MeterReading`, `Bill` | First define detection source and severity contract; then expose scoped active alerts. |
| Water supply interruptions | No outage/supply entity or API was found | No confirmed source | Add a domain model and notification/event contract only if the feature is in scope. |
| Customer chatbot | No confirmed chatbot service/API was found | No confirmed source | Do not include as a data-backed widget until an API and authorization model exist. |
| Admin activity/audit feed | No audit entity was found | User/message timestamps only | Add append-only audit events with actor, role, action, resource, timestamp, and scope. |
| Widget layout/configuration | No dashboard/widget persistence exists | None | Add `WidgetDefinition`, `DashboardDefinition`, `DashboardWidget`, optional user preference. |

## 15. Performance Considerations

- Use database `COUNT`, `SUM`, grouped status queries, and date-bounded queries for dashboard stats.
- Use pagination for pending slips, payments, inquiries, messages, customers, blogs, and activity feeds.
- Do not mount five widgets that each independently download the same full customer/payment list. Add a role-scoped summary endpoint or shared query cache.
- Lazy-load lower-priority charts and pages after P0 stats/actions render.
- Cache stable configuration such as regions, rates, widget definitions, and system details with explicit invalidation.
- Use a bounded `limit` for recent lists and include server-side ordering.
- Avoid exposing full `Bill`, `Payment`, `Customer`, or internal-message entities where a summary DTO is enough.
- Keep WebSocket events small and refetch authoritative REST data after receiving an event.
- Verify usage/report queries at production data volume; `UsageAnalyticsService` currently loads readings and calculates monthly totals in Java.
- Define period/timezone semantics consistently. Bills use several date/time types (`LocalDate`, `LocalDateTime`, `OffsetDateTime`).

## 16. Security Considerations

- Backend `@PreAuthorize` and service ownership checks are authoritative; frontend route guards are defense-in-depth for UX only.
- Replace every old role value in both authorization expressions and persisted data. A frontend label-only rename will not secure the backend.
- Review controllers with no visible method/class `@PreAuthorize`, especially monthly and other report controllers.
- Scope customer widgets to the authenticated customer. Never accept an arbitrary subscription number for a customer dashboard without `CustomerAccessService.enforceOwnership`.
- Scope admin widgets to the intended role and, when regional restrictions are introduced, to allowed regions.
- Restrict `/topic/admin/bank-slips`; the current broad topic requires careful broker/security review.
- Validate widget component keys against a server/client catalog. Never render arbitrary server-provided component paths.
- Validate widget configuration JSON and grid bounds server-side.
- Do not return activation tokens, passwords, JWTs, Cloudinary secrets, payment credentials, or private attachment URLs in dashboard DTOs.
- Internal chat must retain participant checks and authenticated STOMP connection handling.
- Do not treat a hidden widget as permission to call a privileged API.

## 17. Recommended Dashboard Layouts

### Customer

1. Header: welcome, unread notification count, profile/settings action.
2. First row: current bill, outstanding balance, pay-now action.
3. Main row: usage trend chart and recent payments.
4. Lower row: inquiry status, bank-slip status, announcements.

### Meter Reader

1. Header: current reading period and PWA/offline state.
2. First row: quick reading entry, latest reading, confirmed backend progress metric when available.
3. Main row: assigned/customer lookup and reading history.
4. Lower row: alerts if properly scoped and internal-chat action.

### Customer Handler

1. Header: customer search and quick actions.
2. First row: customer count, pending slip count/amount, open inquiry count.
3. Main row: pending bank-slip queue and recent payments.
4. Lower row: customer/billing shortcuts, inquiry queue, internal chat.

### System Admin

1. Header: system date/period and alert count.
2. First row: customer count, outstanding amount, pending verification, open inquiries.
3. Main row: monthly revenue/usage and system usage charts.
4. Lower row: active alerts, predictions, messaging delivery, recent blog/activity links.

### Super Admin

1. Header: system health, configuration and widget-management actions.
2. First row: system totals, active admins, regions, outstanding/revenue summary.
3. Main row: regional/system usage and revenue charts.
4. Lower row: verification queue, alerts/activity, admin status, widget configuration.

## 18. Widget Priority

### P0

- Customer: current bill, outstanding balance, payments, pay-now, usage, notifications.
- Meter Reader: meter entry, customer/latest-reading context, internal chat.
- Customer Handler: customer search, pending slips, recent payments, payment lookup, inquiries, customer-management actions.
- System Admin: system/customer/billing/payment summary, pending slips, inquiries, usage/report charts, alerts, internal chat.
- Super Admin: system summary, admin status, payment verification, billing/payment/usage trends, widget management.

P0 should only include widgets with an existing API or a small, clearly specified aggregation API. Do not make meter progress P0 until its business definition and data model exist.

### P1

Predictions, messaging delivery, blogs, regional summary, customer-handler billing-rate snapshot, customer inquiry/blog/slip secondary panels, PWA state, and admin activity after the required API/security work is complete.

### P2

Automatic anomaly widgets, water-supply information, chatbot dashboard integration, and any advanced regional/seasonal analytics without an existing contract.

## 19. Risks and Issues

- `PAYMENT_HANDLER` is a live backend role, not just a display label.
- The frontend admin dashboard route is empty, while navigation currently exposes dashboard only to `SUPER_ADMIN` and `SYSTEM_ADMIN`.
- Intended `CUSTOMER_HANDLER` responsibilities are broader than current `PAYMENT_HANDLER` navigation and backend authorization.
- Report authorization is inconsistent or not visible on some controllers.
- Several requested product capabilities are not confirmed by code: water-supply interruption model, chatbot API, complete anomaly detector, meter assignment/progress, and dashboard widget management.
- Usage analytics falls back to fixed category percentages when no data exists; this must not be presented as measured data without a product decision.
- `reportService.ts` contains local/static report helpers even though backend report controllers exist; dashboard implementation must use the actual backend contract.
- WebSocket configuration uses permissive allowed-origin patterns; production origin and subscription authorization should be reviewed.
- Multiple date/time types and unqualified report periods can produce inconsistent charts.
- Full-list APIs and Java-side aggregation may become expensive as customer, bill, payment, and reading volume grows.

## 20. `PAYMENT_HANDLER` -> `CUSTOMER_HANDLER` Migration Checklist

### Backend

- `user/enums/Role.java`: replace enum constant and update any persisted role values.
- Every `@PreAuthorize` expression containing `hasRole('PAYMENT_HANDLER')`, including `payments/controller/PaymentController.java` and `BankSlipController.java`.
- User creation/update DTO validation and any role conversion logic.
- Bootstrap/seed data in `SuperAdminBootstrap.java`, `database/data.sql`, and test fixtures.
- Internal-chat role filtering/repository queries and DTO serialization.
- JWT role generation/consumption and existing tokens. Existing tokens with the old claim need an explicit migration/expiry strategy.
- Database user-role values, if users are persisted as strings.

### Frontend

- `types/admin.ts`: `AdminRole` union and related form types.
- `utils/adminAccess.ts`: `ADMIN_ROLES` and default path. The customer-handler default should be a customer-service dashboard or customer-management route, not necessarily payments.
- `constants/adminNav.ts`: grant customer-handler access to billing, payments, customer management, inquiries, and internal chat according to the intended role definition.
- `App.tsx`: admin protected-route allow-list.
- `AdminContext.tsx`: derived role behavior and fallback handling.
- `AdminNavbar.tsx`: `ROLE_LABELS`, `ROLE_COLORS`, and lowercase legacy keys.
- `AdminSidebar.tsx`/`AdminNavbar.tsx`: filtered navigation uses the role matrix.
- `InternalChatPage.tsx`: `ROLE_TABS` and `ROLE_LABELS`.
- API request/response types, role filters, translations, test mocks, fixtures, and local storage values.

Migration acceptance criteria:

1. No authorization path accepts the old role accidentally.
2. Existing persisted users are migrated or a backwards-compatible transition is explicitly implemented.
3. A customer handler can access the intended feature set and cannot access system-admin/super-admin-only features.
4. Meter readers retain only their intended feature set.
5. Tokens, frontend route guards, navigation, internal chat filters, and backend checks agree on the same five final roles.

## 21. Recommended Implementation Order

1. Agree on final role migration and data ownership rules.
2. Harden and document API authorization, especially reports, customer ownership, bank-slip topics, and internal chat.
3. Add small role-scoped summary DTOs and aggregation queries.
4. Build P0 customer dashboard widgets using existing services/components.
5. Build P0 meter-reader and customer-handler widgets and update role navigation.
6. Build system-admin and super-admin summary/chart widgets.
7. Add WebSocket refetch behavior for notifications and bank slips; add new events only where needed.
8. Add `WidgetDefinition`/`DashboardDefinition`/`DashboardWidget` persistence and super-admin configuration APIs.
9. Add the frontend `DashboardGrid`/`WidgetRenderer` registry and saved layout loading.
10. Add role/ownership/aggregation/performance tests, then validate with production-scale representative data.

## 22. Files Relevant to Dashboard Implementation

### Backend

- `src/main/java/com/backend/water_management_system/user/enums/Role.java`
- `src/main/java/com/backend/water_management_system/security/JwtService.java`
- `src/main/java/com/backend/water_management_system/common/config/WebSocketConfig.java`
- `src/main/java/com/backend/water_management_system/internal_chat/config/InternalChatWebSocketConfig.java`
- `src/main/java/com/backend/water_management_system/customer/entity/Customer.java`
- `src/main/java/com/backend/water_management_system/billing/entity/Bill.java`
- `src/main/java/com/backend/water_management_system/meter_reading/entity/MeterReading.java`
- `src/main/java/com/backend/water_management_system/payments/entity/Payment.java`
- `src/main/java/com/backend/water_management_system/payments/entity/BankSlip.java`
- `src/main/java/com/backend/water_management_system/common/entity/Region.java`
- `src/main/java/com/backend/water_management_system/alerts/entity/Alert.java`
- `src/main/java/com/backend/water_management_system/notification/entity/Notification.java`
- `src/main/java/com/backend/water_management_system/inquiry/entity/Inquiry.java`
- `src/main/java/com/backend/water_management_system/usage/service/UsageAnalyticsService.java`
- `src/main/java/com/backend/water_management_system/usage/controller/UsageAnalyticsController.java`
- `src/main/java/com/backend/water_management_system/payments/controller/PaymentController.java`
- `src/main/java/com/backend/water_management_system/payments/controller/BankSlipController.java`
- `src/main/java/com/backend/water_management_system/reports/controller/MonthlyReportController.java`
- `src/main/java/com/backend/water_management_system/internal_chat/controller/InternalChatWebSocketController.java`
- `database/schema.sql`
- `database/data.sql`

### Frontend

- `src/App.tsx`
- `src/routes/ProtectedRoute.tsx`
- `src/contexts/AuthContext.tsx`
- `src/contexts/AdminContext.tsx`
- `src/pages/Dashboard.tsx`
- `src/pages/DashboardPage.tsx`
- `src/pages/AdminIndex.tsx`
- `src/constants/adminNav.ts`
- `src/utils/adminAccess.ts`
- `src/types/admin.ts`
- `src/services/paymentService.ts`
- `src/services/bankSlipService.ts`
- `src/services/customerService.ts`
- `src/services/adminService.ts`
- `src/services/notificationService.ts`
- `src/services/internalChatService.ts`
- `src/services/internalChatSocket.ts`
- `src/services/websocketService.ts`
- `src/hooks/useUsage.ts`
- `src/hooks/useAdminInquiries.ts`
- `src/hooks/useMeterReading.ts`
- `src/pages/InternalChatPage.tsx`
- `src/pages/PaymentsPage.tsx`
- `src/components/payments/RecentPaymentsList.tsx`
- `src/components/payments/PendingBankSlipsTable.tsx`
- `src/components/charts/`
- `src/components/ui/`

## 23. Final Summary

The five dashboards are:

1. Customer Dashboard
2. Meter Reader Dashboard
3. Customer Handler Dashboard
4. System Admin Dashboard
5. Super Admin Dashboard

The most reliable first widgets are current/outstanding bills, customer payment history and pay action, customer usage, notifications, meter entry, pending bank slips, recent payments, inquiry queues, active alerts, monthly usage/revenue, and internal-chat actions. They map to real entities, services, controllers, frontend services, hooks, and reusable components already present in the repositories.

The most important missing backend work is the set of role-scoped aggregation APIs for admin summaries, meter-reading progress, regional rollups, inquiry counts, payment/bill totals, and dashboard configuration persistence. Automatic anomaly detection, water-supply information, and chatbot widgets should remain out of the initial implementation until their actual backend contracts are confirmed.

The most important architectural/security work is to make backend authorization consistent, protect unannotated report endpoints, preserve customer ownership checks, restrict WebSocket topics, avoid full-list dashboard aggregation in React, and make `CUSTOMER_HANDLER` a coordinated replacement for `PAYMENT_HANDLER` across persistence, JWTs, authorization, frontend types, routing, navigation, labels, internal chat, and tests.
