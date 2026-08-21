# Phase 1 — Basic Admin Internal Chat Frontend Implementation

## 1. Role and objective

You are working inside an existing **React + TypeScript** frontend for a Water Bill Management System.

The backend for **Phase 1 — Basic Admin Internal Chat** has already been implemented using:

- Spring Boot
- PostgreSQL
- Spring Data JPA
- Spring WebSocket
- STOMP
- Existing JWT authentication

Your task is to implement **ONLY the frontend for Phase 1 — Basic Internal Chat**.

Do not redesign or rewrite unrelated parts of the application.

Do not modify the backend unless a genuine backend/frontend contract mismatch is discovered. If a mismatch is discovered, report it clearly rather than silently changing the backend.

The frontend must integrate with the already implemented backend REST APIs and WebSocket/STOMP functionality.

---

# 2. Existing admin roles

The current backend has these roles:

```text
CUSTOMER
SUPER_ADMIN
SYSTEM_ADMIN
PAYMENT_HANDLER
METER_READER
```

Internal admin chat is available only to:

```text
SUPER_ADMIN
SYSTEM_ADMIN
PAYMENT_HANDLER
METER_READER
```

`CUSTOMER` must never appear in the internal admin chat UI.

Do not introduce future roles such as:

```text
CUSTOMER_HANDLER
```

or any other role that does not currently exist.

Reuse the existing frontend role definitions/types/enums if they already exist.

Do not duplicate role strings throughout the frontend unnecessarily.

---

# 3. Phase 1 scope

Implement ONLY:

- Internal staff discovery
- Staff search
- Role filtering
- One-to-one conversations
- Conversation list
- Conversation search
- Text messages
- Message history
- Pagination/loading older messages
- REST API integration
- WebSocket/STOMP real-time message delivery
- Read state
- Unread count
- Basic real-time read-status updates where supported by the backend

Do NOT implement:

- Group chat
- Attachments
- Images
- File uploads
- PDF/document messages
- Message editing
- Message deletion
- Typing indicators
- Online/offline status
- Last-seen status
- Message search inside conversation history
- Customer messaging
- Push notifications
- PWA functionality
- External messaging
- Reactions
- Voice/video calls
- Any Phase 2+ functionality

Do not add unnecessary libraries or infrastructure.

---

# 4. IMPORTANT: inspect the existing frontend first

Before writing code, inspect the existing frontend thoroughly.

Determine:

1. Frontend folder structure
2. React version
3. TypeScript configuration
4. Existing routing system
5. Existing authentication implementation
6. Existing JWT/token storage mechanism
7. Existing API client/service structure
8. Existing Axios/fetch configuration
9. Existing WebSocket/STOMP dependencies
10. Existing UI/component library
11. Existing styling approach
12. Existing dashboard/layout structure
13. Existing role-based rendering logic
14. Existing loading/error handling conventions
15. Existing toast/notification system
16. Existing reusable search/input components
17. Existing reusable modal/dialog components
18. Existing avatar/user components
19. Existing date/time formatting utilities
20. Existing environment configuration
21. Existing TypeScript models/interfaces
22. Existing testing setup

Follow the existing project's conventions.

Do not create a competing frontend architecture.

If the project already has:

```text
api/
services/
hooks/
components/
pages/
types/
utils/
```

or another established structure, follow it.

---

# 5. Authentication

The existing application already authenticates users using JWT.

Reuse the existing authentication implementation.

Do NOT create a second authentication system.

The frontend must obtain the currently authenticated user's identity from the existing authentication mechanism.

The frontend should not ask the user to manually provide:

```text
senderId
userId
role
```

when the backend can determine these values from the authenticated JWT.

For REST requests, reuse the application's existing authenticated API client.

For WebSocket/STOMP:

- obtain the existing JWT
- send it in the STOMP CONNECT headers in the way expected by the backend
- do not create another token
- do not decode/modify authentication information unnecessarily

The backend is responsible for validating the JWT and determining the authenticated sender.

---

# 6. Main UI structure

Create an internal admin chat page integrated into the existing application layout.

The exact route should follow the existing project's routing conventions.

For example, if appropriate:

```text
/admin/internal-chat
```

Do not blindly use this route if the project already has an established route naming convention.

The main chat UI should have a structure conceptually similar to:

```text
┌─────────────────────────────────────────────────────────────┐
│ Internal Admin Chat                                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ [ All ] [ Super Admin ] [ System Admin ] [ Payment Handler ]│
│ [ Meter Reader ]                                           │
│                                                             │
├───────────────────────┬─────────────────────────────────────┤
│ Search                │ Conversation Header                │
│ [ Search staff... ]   │                                     │
│                       │                                     │
│ Conversations         │                                     │
│                       │                                     │
│ Nimal Perera          │                                     │
│ System Admin          │                                     │
│ Please check meter... │                                     │
│ 10:35           2     │                                     │
│                       │                                     │
│ Kamal Silva           │                                     │
│ Payment Handler       │                                     │
│ Okay, I'll check...   │                                     │
│ 09:48                 │                                     │
│                       │                                     │
│                       │                                     │
│                       │                                     │
│                       │                                     │
├───────────────────────┤                                     │
│                       │                                     │
│                       │ Messages                            │
│                       │                                     │
│                       │ [message bubbles]                   │
│                       │                                     │
│                       │                                     │
│                       │                                     │
│                       │                                     │
│                       │                                     │
│                       │ [ Type a message...          ] [→] │
└───────────────────────┴─────────────────────────────────────┘
```

The exact visual design must match the existing application.

Do not introduce a completely unrelated design system.

---

# 7. IMPORTANT: Five role tabs

The frontend MUST provide these five tabs:

```text
All
Super Admin
System Admin
Payment Handler
Meter Reader
```

These tabs control both staff discovery and conversation filtering.

## All

The `All` tab includes eligible users from:

```text
SUPER_ADMIN
SYSTEM_ADMIN
PAYMENT_HANDLER
METER_READER
```

Customers are excluded.

The conversation list in this tab shows conversations with any eligible internal role.

## Super Admin

Shows:

```text
SUPER_ADMIN
```

users/conversations only.

## System Admin

Shows:

```text
SYSTEM_ADMIN
```

users/conversations only.

## Payment Handler

Shows:

```text
PAYMENT_HANDLER
```

users/conversations only.

## Meter Reader

Shows:

```text
METER_READER
```

users/conversations only.

Do not implement role filtering only visually.

The selected role must be reflected in the backend API request whenever appropriate.

For example:

```text
GET /api/internal-chat/users?role=SYSTEM_ADMIN
```

and:

```text
GET /api/internal-chat/conversations?role=SYSTEM_ADMIN
```

For `All`, omit the role parameter.

---

# 8. Search behavior

The chat interface needs search functionality.

Search must support the backend's staff-search capabilities:

- Full name
- User UUID / user ID

For example:

```text
Nimal Perera
```

or:

```text
550e8400-e29b-41d4-a716-446655440000
```

The frontend must not assume that users can only be found by name.

The search should work in combination with the selected role tab.

For example:

```text
System Admin + "nimal"
```

should request/search only System Admin users.

Similarly:

```text
Payment Handler + "550e8400..."
```

should search Payment Handler users using the UUID.

---

# 9. Staff discovery API

Use:

```http
GET /api/internal-chat/users
```

Optional parameters:

```text
role
search
```

Examples:

```http
GET /api/internal-chat/users
```

```http
GET /api/internal-chat/users?role=SYSTEM_ADMIN
```

```http
GET /api/internal-chat/users?role=SYSTEM_ADMIN&search=nimal
```

Do not hardcode the results.

Load staff from the backend.

The backend already excludes the current user and customers.

The frontend should nevertheless avoid presenting obviously invalid users if the response contract provides enough information to do so.

---

# 10. Starting a conversation

The user should be able to start a one-to-one conversation with an eligible staff member.

Possible UI behavior:

1. Search/select a staff member.
2. Click/select that staff member.
3. Frontend sends a request to create/retrieve the direct conversation.
4. Backend returns the existing conversation if one already exists.
5. Open that conversation.

Use:

```http
POST /api/internal-chat/conversations
```

The request must follow the backend's actual DTO contract.

Do NOT invent a different request structure.

The backend is responsible for:

- checking eligibility
- preventing self-conversations
- preventing customer participation
- preventing duplicate conversations
- creating/retrieving the existing direct conversation

The frontend must not attempt to implement its own duplicate-conversation logic as the source of truth.

---

# 11. Conversation list

Load conversations using:

```http
GET /api/internal-chat/conversations
```

Optional parameters:

```text
role
search
```

Examples:

```http
GET /api/internal-chat/conversations
```

```http
GET /api/internal-chat/conversations?role=SYSTEM_ADMIN
```

```http
GET /api/internal-chat/conversations?role=SYSTEM_ADMIN&search=nimal
```

The conversation list should display information supplied by the backend such as:

- conversation ID
- other participant ID
- other participant name
- other participant role
- latest message preview
- latest message timestamp
- unread count

Do not display the current user's own name as the conversation participant.

The "other participant" is the person that should be displayed.

---

# 12. Conversation filtering

This is important.

When a role tab is selected, filter conversations according to the role of the OTHER participant.

Example:

```text
Hansana ↔ Nimal
Nimal = SYSTEM_ADMIN
```

This conversation must appear under:

```text
All
System Admin
```

but not:

```text
Super Admin
Payment Handler
Meter Reader
```

Do not filter conversations based on the current user's role.

---

# 13. Conversation search

Conversation search must search the OTHER participant's:

- full name
- UUID/user ID

Example:

```http
GET /api/internal-chat/conversations?role=SYSTEM_ADMIN&search=nimal
```

The frontend should send search/filter parameters to the backend rather than downloading a potentially large conversation list and performing all filtering locally.

Use debouncing if appropriate.

For example, a reasonable debounce interval can be around:

```text
300–500 ms
```

Follow the existing application's search behavior if one already exists.

Do not introduce excessive requests for every keystroke if the application already has a standard debouncing approach.

---

# 14. Empty states

Implement clear empty states.

Examples:

### No conversations

```text
No conversations yet.
Search for an admin to start a conversation.
```

### No search results

```text
No admins found.
```

### No conversations for selected role

```text
No conversations with Payment Handlers.
```

Use wording appropriate to the application's existing UI style.

---

# 15. Conversation selection

When a conversation is selected:

1. Store its conversation ID in frontend state.
2. Load its message history.
3. Display the other participant's information.
4. Subscribe to the corresponding WebSocket/STOMP destination.
5. Mark the conversation as read.
6. Update the unread count in the UI.

Do not create a new conversation simply because the user selected an existing conversation.

---

# 16. Message history

Use:

```http
GET /api/internal-chat/conversations/{conversationId}/messages
```

with:

```text
page
size
```

Example:

```http
GET /api/internal-chat/conversations/{conversationId}/messages?page=0&size=30
```

The backend uses pagination.

The frontend must not assume that the entire conversation history is returned.

---

# 17. Initial message loading

When opening a conversation:

- request the most recent messages according to the backend pagination behavior
- display them in chronological order in the UI
- correctly determine which messages belong to the current user
- correctly determine which messages belong to the other participant

If the backend returns pages in newest-first order, normalize the display order appropriately.

Do not alter the backend's returned data.

---

# 18. Loading older messages

The frontend should support retrieving older messages.

Possible UX:

```text
          Load older messages
                 ↓
        ┌───────────────────┐
        │ Older message     │
        │ Older message     │
        ├───────────────────┤
        │ Current messages  │
        │ Current messages  │
        └───────────────────┘
```

The exact UI can use:

- a "Load older messages" button
- infinite scrolling
- another existing pagination component

Prefer the approach that fits the existing application.

When older messages are loaded, avoid unnecessarily jumping the user's scroll position.

---

# 19. Message model

Create a TypeScript interface/type corresponding to the backend `MessageResponse`.

At minimum the backend message concept contains:

```text
id
conversation
sender
content
createdAt
```

Use the actual backend response structure after inspecting the implementation.

Do not assume nested fields that do not exist.

---

# 20. Sending text messages

Phase 1 supports text messages only.

The message composer should contain:

```text
[ Type a message...                         ] [Send]
```

Requirements:

- reject empty/blank messages on the frontend
- trim unnecessary leading/trailing whitespace where appropriate
- respect the backend's maximum message length
- disable sending while a message is being submitted if appropriate
- clear the input after successful sending
- handle send failures clearly

The backend remains responsible for final validation.

Do not rely only on frontend validation.

---

# 21. REST message sending

The backend provides:

```http
POST /api/internal-chat/conversations/{conversationId}/messages
```

The request contains message content.

Use this endpoint where appropriate according to the backend implementation.

Do not send:

```text
senderId
```

unless the actual backend DTO explicitly requires it.

The server determines the sender from the authenticated principal.

---

# 22. WebSocket/STOMP

Real-time message delivery must use the backend's STOMP/WebSocket implementation.

The backend uses a destination conceptually equivalent to:

```text
/ws/internal-chat
```

and application destination:

```text
/app/internal-chat/send
```

with conversation broadcast destination:

```text
/topic/internal-chat/conversation/{conversationId}
```

Use the exact destinations implemented by the backend after inspecting the actual code.

Do not blindly assume these names if the backend implementation differs.

---

# 23. STOMP client

First inspect whether the project already has a STOMP/WebSocket dependency.

If a suitable dependency already exists, reuse it.

If not, use an appropriate maintained STOMP client compatible with the project's React/TypeScript setup.

Do not add duplicate WebSocket libraries.

A typical client architecture may use:

```text
@stomp/stompjs
```

but only introduce it if it is not already present and is compatible with the project.

Follow the project's dependency conventions.

---

# 24. WebSocket authentication

When establishing the STOMP connection, send the existing JWT in the CONNECT headers expected by the backend.

Conceptually:

```text
STOMP CONNECT
    ↓
Authorization: Bearer <JWT>
    ↓
Spring STOMP authentication interceptor
    ↓
Authenticated UserPrincipal
```

Do not:

- create another token
- send a fake user ID
- trust a client-side sender ID
- create another authentication mechanism

If the existing frontend token storage/API authentication mechanism is unclear, inspect it first.

---

# 25. WebSocket connection lifecycle

Implement a robust WebSocket/STOMP lifecycle.

The frontend should handle:

```text
CONNECTING
CONNECTED
DISCONNECTED
ERROR
```

At minimum:

- connect when appropriate
- authenticate the connection
- subscribe only to the required conversation destination
- unsubscribe when leaving/changing a conversation
- disconnect when the page/component is destroyed if appropriate
- avoid duplicate subscriptions
- avoid creating multiple STOMP clients accidentally

Do not create a new WebSocket connection every time React re-renders.

Be especially careful with:

```text
useEffect
```

dependencies and cleanup.

---

# 26. Conversation subscription

When conversation `123` is open, subscribe to:

```text
/topic/internal-chat/conversation/123
```

Use the actual destination returned/defined by the backend.

When switching from conversation A to conversation B:

1. unsubscribe from A
2. subscribe to B
3. load B's REST message history
4. mark B as read

Do not leave stale subscriptions active.

---

# 27. Real-time incoming message

When a STOMP message is received:

1. Parse the message payload.
2. Validate that it belongs to the expected conversation.
3. Convert it into the TypeScript message model.
4. Update the open conversation's message list.
5. Scroll appropriately if the user is already near the bottom.
6. Update conversation preview/latest-message information.
7. Update unread counts appropriately.
8. Avoid adding duplicate messages.

The backend broadcasts the saved message.

Do not create a temporary duplicate message if the server's broadcast will provide the authoritative message.

---

# 28. Offline/disconnected recipient

The frontend must work correctly when the recipient is offline.

The backend persists messages in PostgreSQL before broadcasting.

Therefore:

```text
WebSocket = real-time delivery
REST = persistent source/history
PostgreSQL = source of truth
```

If a recipient is disconnected:

```text
User A
   ↓
Backend
   ↓
PostgreSQL
```

When the recipient returns:

```text
React
   ↓
REST
   ↓
Persisted messages
```

The frontend must not assume that a WebSocket event is the only way a message can arrive.

---

# 29. Avoid duplicate messages

This is an important frontend concern.

A message may be involved in:

```text
REST response
```

and:

```text
STOMP event
```

The frontend should avoid displaying the same message twice.

Use the backend message ID as the stable identity.

For example:

```text
message.id
```

should be used to detect an already-present message.

Do not use message text alone to identify duplicates.

---

# 30. Read status

When the user opens a conversation and its messages have been viewed, call:

```http
POST /api/internal-chat/conversations/{conversationId}/read
```

The backend uses:

```text
ConversationParticipant.lastReadAt
```

to calculate read/unread state.

The frontend should mark the conversation as read when appropriate, such as:

- opening it
- viewing its latest messages
- receiving messages while the conversation is actively open and visible

Do not mark unrelated conversations as read.

---

# 31. Unread counts

Conversation list items should display unread counts when greater than zero.

Example:

```text
Nimal Perera
System Admin
Please check meter 1045...
10:35                 2
```

When the conversation is opened/read:

```text
2
```

should disappear/update.

When a new message arrives in a conversation that is not currently open:

```text
unreadCount++
```

When the conversation is currently open and visible, mark it as read according to the backend API.

Do not calculate unread counts independently if the backend already provides them.

The backend is the authoritative source.

---

# 32. Real-time read-status events

If the backend broadcasts read-status events, subscribe/handle them according to the actual backend event structure.

The UI should be able to update the sender's message/read indication when appropriate.

Do not invent a per-message read model.

Phase 1 uses the conversation-level:

```text
lastReadAt
```

approach.

---

# 33. Message UI

Messages should clearly distinguish:

### Current user's messages

Typically aligned to one side.

### Other participant's messages

Typically aligned to the opposite side.

Example:

```text
                     ┌──────────────────────┐
                     │ Hello, I'll check it │
                     │ 10:30                │
                     └──────────────────────┘

┌────────────────────────────┐
│ Thanks.                    │
│ 10:31                 ✓✓  │
└────────────────────────────┘
```

Follow the existing application's visual language.

Do not hardcode names.

Use authenticated user identity / message sender information.

---

# 34. Message timestamps

Display message timestamps using the project's existing date/time formatting utilities if available.

Do not introduce inconsistent date formatting.

For example, conversation list timestamps may be compact:

```text
10:35
```

while older messages may use:

```text
Aug 21, 10:35
```

The exact formatting should follow existing application conventions.

---

# 35. Conversation preview

Each conversation list item should display:

```text
Other participant name
Other participant role
Latest message preview
Latest message timestamp
Unread count
```

Example:

```text
Nimal Perera
System Admin
Please check meter 1045...
10:35
2
```

The preview should come from the backend's latest message data.

Do not reconstruct it by fetching every conversation's messages individually.

---

# 36. Sorting conversations

The conversation list should normally display the most recently active conversations first.

Use the backend's:

```text
updatedAt
```

or latest-message timestamp according to the actual response contract.

When a new message arrives:

- update that conversation's preview
- update its timestamp
- move it to the appropriate position if the UI supports dynamic sorting

Do not reload the entire application unnecessarily.

---

# 37. Starting a chat from staff search

The UI should make it easy to start a new conversation.

For example:

```text
Search staff
      ↓
Nimal Perera
SYSTEM_ADMIN
      ↓
[Start chat]
```

If a conversation already exists:

```text
Nimal Perera
SYSTEM_ADMIN
      ↓
[Open chat]
```

However, the backend's create-conversation endpoint already returns an existing conversation when appropriate.

Therefore the frontend may simply use:

```text
Select staff
      ↓
POST /conversations
      ↓
Open returned conversation
```

This keeps duplicate prevention in the backend.

---

# 38. Search and conversation tabs interaction

The selected tab must remain active while searching.

Example:

```text
[All] [Super Admin] [System Admin] [Payment Handler] [Meter Reader]

Search:
[ nimal                         ]
```

If:

```text
System Admin
```

is selected, search only System Admin staff/conversations.

If:

```text
All
```

is selected, search across all eligible internal roles.

Changing tabs should update the backend request and reset/refresh the appropriate list.

---

# 39. Search state

Keep staff search and conversation search logically separated if the UI contains both concepts.

Do not accidentally apply a conversation search term to staff discovery or vice versa.

If the design uses one shared search input for both lists, clearly define its behavior and ensure the backend receives the correct query.

Prefer the simplest UX that fits the existing application.

---

# 40. Loading states

Implement loading states for:

- staff discovery
- conversation list
- conversation creation
- message history
- older-message loading
- sending messages
- WebSocket connection

Do not show a blank UI while data is loading.

Use existing project loading components/spinners if available.

---

# 41. Error handling

Handle at least:

### REST errors

- unauthorized
- forbidden
- conversation not found
- user not found
- validation failure
- server error

### WebSocket errors

- connection failure
- authentication failure
- STOMP error
- disconnection

Show user-friendly messages.

Do not display raw backend stack traces.

Reuse the application's existing error-handling/toast mechanisms.

---

# 42. Unauthorized conversation access

The backend protects conversations by participant membership.

The frontend must not assume that possession of a conversation UUID gives access.

If the backend returns:

```text
403
```

or:

```text
404
```

for an inaccessible conversation:

- show an appropriate error
- clear the invalid conversation selection if appropriate
- do not continue trying to subscribe to it

Do not attempt to bypass backend authorization.

---

# 43. Responsive design

The chat interface should work reasonably on:

- desktop
- laptop
- tablet

If the existing application is already responsive, follow its responsive conventions.

On smaller screens, it is acceptable to use a conversation-list → chat-detail navigation pattern.

Do not completely redesign the application solely for chat.

---

# 44. Component architecture

Use reusable React components where appropriate.

A possible structure is:

```text
internal-chat/
├── InternalChatPage.tsx
├── components/
│   ├── ChatRoleTabs.tsx
│   ├── StaffSearch.tsx
│   ├── StaffList.tsx
│   ├── ConversationList.tsx
│   ├── ConversationListItem.tsx
│   ├── ChatHeader.tsx
│   ├── MessageList.tsx
│   ├── MessageItem.tsx
│   ├── MessageComposer.tsx
│   └── EmptyChatState.tsx
├── hooks/
│   ├── useInternalChat.ts
│   └── useInternalChatWebSocket.ts
├── services/
│   └── internalChatApi.ts
└── types/
    └── internalChat.ts
```

This is only a conceptual structure.

If the existing project has a different structure, follow the existing structure instead.

Do not create unnecessary files merely to match this example.

---

# 45. API service layer

Do not place raw Axios/fetch calls throughout React components.

Prefer a dedicated service/API layer consistent with the existing project.

Conceptually:

```text
internalChatApi.getUsers(...)
internalChatApi.getConversations(...)
internalChatApi.createConversation(...)
internalChatApi.getMessages(...)
internalChatApi.markAsRead(...)
internalChatApi.sendMessage(...)
```

Use the existing authenticated API client.

Do not duplicate JWT header construction if the project already has an Axios interceptor/API wrapper.

---

# 46. TypeScript types

Create or reuse types for:

```text
InternalChatUser
Conversation
Message
CreateConversationRequest
SendMessageRequest
```

The exact fields must match the backend DTOs.

Do not use:

```typescript
any
```

as a shortcut for backend responses.

If the backend DTO structure is unclear, inspect the backend implementation and use its actual response structure.

Keep types strongly typed.

---

# 47. State management

Use the application's existing state-management approach.

If the application uses:

```text
useState
useReducer
Context
Redux
Zustand
React Query
```

or another established approach, follow it where appropriate.

Do not introduce Redux/Zustand/etc. solely for this feature if the application does not already use it.

For Phase 1, local component state and custom hooks may be sufficient.

---

# 48. React effects and cleanup

Pay particular attention to `useEffect`.

Avoid:

- duplicate API requests caused by incorrect dependencies
- duplicate STOMP connections
- duplicate subscriptions
- stale conversation IDs
- stale JWT values
- state updates after unmount

Every WebSocket subscription must have an appropriate cleanup mechanism.

---

# 49. WebSocket service/hook

A dedicated WebSocket hook/service is recommended if consistent with the project.

It should handle concepts such as:

```text
connect()
disconnect()
subscribeToConversation(conversationId)
unsubscribeFromConversation(conversationId)
sendMessage(conversationId, content)
```

Do not expose unnecessary low-level STOMP details to every UI component.

The exact architecture should follow the existing frontend style.

---

# 50. Message sending architecture

Prefer:

```text
MessageComposer
       ↓
Chat hook/service
       ↓
STOMP
       ↓
Backend
       ↓
Database
       ↓
STOMP broadcast
       ↓
React
```

The frontend should treat the backend-broadcast saved message as authoritative.

Do not permanently insert an invented local message with a fake ID unless the architecture explicitly requires optimistic UI.

If optimistic UI is used, clearly reconcile it with the authoritative server message and avoid duplicates.

For this university project, a simple server-authoritative approach is preferred.

---

# 51. REST and WebSocket responsibilities

Use REST for:

```text
staff search
conversation list
conversation creation
conversation details if implemented
message history
pagination
mark as read
```

Use WebSocket/STOMP for:

```text
new message events
real-time message delivery
real-time read-status events if implemented
```

Do not make the entire chat page dependent on WebSocket availability.

The user should still be able to:

- view conversations
- retrieve history
- send/retrieve persisted messages according to the backend API

through REST.

---

# 52. WebSocket reconnect behavior

If the connection is temporarily lost:

1. Show an appropriate connection state.
2. Allow the UI to continue displaying already-loaded messages.
3. Reconnect according to a reasonable strategy supported by the STOMP client.
4. Re-subscribe to the currently open conversation after reconnection.
5. Refresh relevant persisted data if necessary to ensure no messages were missed.

Do not assume every message is received through WebSocket.

REST remains the recovery mechanism.

Avoid aggressive infinite reconnect loops.

---

# 53. Route protection

If the existing frontend has protected routes, the internal chat page must use the same route-protection mechanism.

Only authenticated users should be able to access the page.

If the application supports frontend role-based route protection, restrict the page to:

```text
SUPER_ADMIN
SYSTEM_ADMIN
PAYMENT_HANDLER
METER_READER
```

However, backend authorization remains the actual security boundary.

Never rely solely on frontend role checks for security.

---

# 54. UI security considerations

Never display:

```text
passwordHash
JWT
authentication secrets
activation tokens
```

The frontend should only consume fields intentionally returned by the backend DTOs.

Do not store chat message content in insecure persistent storage unless the existing application architecture specifically requires it.

---

# 55. Performance

Do not:

- repeatedly reload all conversations after every message
- fetch all messages every time a new message arrives
- create a WebSocket connection for every conversation
- request the staff list on every component render
- perform unnecessary full-page reloads

Update only the affected UI state where practical.

Use:

- debounced search
- pagination
- memoization where actually useful
- stable WebSocket subscriptions

Do not over-optimize prematurely.

---

# 56. Browser refresh behavior

After refreshing the page:

- authenticated session should continue using the existing authentication mechanism
- conversation list should be loaded again
- previously selected conversation may optionally be restored if consistent with the application's existing routing/state approach
- message history must come from REST
- WebSocket must reconnect

Do not depend on in-memory React state surviving refresh.

---

# 57. URL/query-state consideration

If the existing application commonly stores selected resources in the URL, consider supporting a conversation ID in the route/query string.

For example:

```text
/internal-chat?conversation=<uuid>
```

or:

```text
/internal-chat/<conversationId>
```

Only implement this if it fits existing routing conventions.

Do not introduce URL state unnecessarily.

---

# 58. Accessibility

The chat UI should provide basic accessibility:

- buttons should have accessible labels
- inputs should have labels/placeholders
- keyboard navigation should work
- Enter should behave sensibly in the message composer
- Shift+Enter may create a new line if multiline input is used
- unread indicators should not rely only on color
- loading/error states should be understandable

Follow the existing application's accessibility conventions.

---

# 59. Do not implement future features accidentally

Do not create frontend structures specifically for:

```text
attachments
typing indicators
online status
last seen
group participants
message editing
message deletion
message search
```

The architecture should be clean enough to extend later, but Phase 1 should remain simple.

Do not build Phase 2/3/4 functionality now.

---

# 60. Testing requirements

Inspect the existing frontend testing setup first.

Add tests following the project's existing conventions.

At minimum, cover important behavior such as:

## Role tabs

- All tab shows all eligible roles
- Super Admin tab filters correctly
- System Admin tab filters correctly
- Payment Handler tab filters correctly
- Meter Reader tab filters correctly

## Staff search

- name search works
- UUID search works
- role + search works
- empty search works

## Conversation list

- conversations render correctly
- other participant information renders correctly
- unread count renders correctly
- role filtering works
- conversation search works

## Conversation

- selecting a conversation loads messages
- current user's messages are displayed correctly
- other user's messages are displayed correctly
- message pagination/loading older messages works
- empty conversation state works

## Sending

- blank message is rejected
- valid message can be sent
- composer clears appropriately
- send errors are handled

## Read state

- opening a conversation triggers mark-as-read behavior
- unread count updates appropriately

## WebSocket

Where the existing test setup allows it, test:

- connection setup
- subscription
- incoming message handling
- duplicate message prevention
- cleanup/unsubscription

Do not create a huge testing infrastructure solely for this feature.

---

# 61. Important backend/frontend contract

The backend implementation already provides the Phase 1 API.

From the backend specification, the main REST API is conceptually:

```text
GET    /api/internal-chat/users
GET    /api/internal-chat/conversations
POST   /api/internal-chat/conversations
GET    /api/internal-chat/conversations/{conversationId}
GET    /api/internal-chat/conversations/{conversationId}/messages
POST   /api/internal-chat/conversations/{conversationId}/read
POST   /api/internal-chat/conversations/{conversationId}/messages
```

The backend currently has controller endpoints corresponding to:

```text
GET /api/internal-chat/users
GET /api/internal-chat/conversations
POST /api/internal-chat/conversations
GET /api/internal-chat/conversations/{conversationId}/messages
POST /api/internal-chat/conversations/{conversationId}/read
POST /api/internal-chat/conversations/{conversationId}/messages
```

Use the actual implemented backend DTOs and response structures rather than guessing.

The backend WebSocket controller currently uses the application destination concept:

```text
/internal-chat/send
```

which, with the configured application destination prefix, is expected to be used by the STOMP client as something conceptually equivalent to:

```text
/app/internal-chat/send
```

The backend broadcasts conversation messages to a destination conceptually equivalent to:

```text
/topic/internal-chat/conversation/{conversationId}
```

Inspect the actual WebSocket configuration and use the exact destinations it exposes.

---

# 62. Critical WebSocket rule

The backend persists the message before broadcasting it.

Therefore the frontend should NOT assume:

```text
SEND → immediately display locally → hope backend saves
```

Instead, the authoritative flow is:

```text
React
   ↓
STOMP SEND
   ↓
Spring WebSocket
   ↓
InternalChatService
   ↓
PostgreSQL
   ↓
saved MessageResponse
   ↓
STOMP broadcast
   ↓
React
```

The UI should ultimately display the persisted server message.

This is important because the message ID and timestamp are generated/controlled by the backend.

---

# 63. Important sender rule

The frontend must NOT attempt to impersonate another user.

Do not send:

```json
{
  "senderId": "..."
}
```

unless the actual backend request DTO requires it.

The backend determines:

```text
authenticated JWT
        ↓
UserPrincipal
        ↓
current user
        ↓
message.sender
```

The current frontend user's ID should be used only for presentation/comparison purposes.

---

# 64. Important authorization rule

Never assume that a conversation is accessible simply because its ID is present in the frontend.

The backend verifies:

```text
current user
      ↓
conversation participant?
      ↓
allowed / rejected
```

The frontend must handle authorization failures gracefully.

Do not implement client-side workarounds for authorization failures.

---

# 65. Existing application integration

Do not modify unrelated features.

Do not modify:

- billing
- payments
- meter reading
- reports
- predictions
- blogs
- customer messaging
- authentication
- unrelated dashboards

unless an existing shared frontend infrastructure genuinely needs a minimal change.

If a shared component needs modification, preserve all existing behavior.

---

# 66. Comments

I am learning this implementation.

Therefore add clear comments for important/non-obvious frontend logic.

Explain things such as:

- why the STOMP connection is created in a particular location
- why the JWT is sent in STOMP CONNECT headers
- why subscriptions are cleaned up
- why REST is used for history
- why WebSocket is used for real-time delivery
- why the backend message is treated as authoritative
- why message IDs are used for duplicate prevention
- how unread counts are updated
- why conversations are filtered by the OTHER participant's role
- why the frontend does not trust sender IDs
- why reconnect logic exists
- why specific `useEffect` dependencies are necessary

Do NOT add meaningless comments such as:

```typescript
// Set loading
setLoading(true);
```

Comments should explain reasoning, architecture, or non-obvious behavior.

---

# 67. Do not over-engineer

This is a university project and this is Phase 1.

Do not add:

- Redux solely for chat
- Web Workers
- service workers
- Redis
- Kafka
- GraphQL
- microservices
- IndexedDB chat persistence
- complex caching infrastructure
- separate WebSocket servers
- elaborate event buses
- unnecessary state-management frameworks

Use the existing React application architecture.

A clean implementation using:

```text
React
TypeScript
existing API client
REST
STOMP/WebSocket
existing UI system
```

is sufficient.

---

# 68. Implementation process

Follow this process.

## Step 1 — Inspect

Inspect:

- frontend project structure
- package.json
- routing
- authentication
- API client
- existing role types
- UI components
- styling
- state management
- WebSocket/STOMP dependencies
- environment variables

## Step 2 — Inspect backend contract

Inspect the implemented backend classes and determine:

- exact DTO structures
- exact API paths
- exact query parameters
- exact WebSocket endpoint
- exact STOMP application destination
- exact subscription destination
- exact authentication header expected by STOMP
- exact response structures

Do not guess these values.

## Step 3 — Design

Determine the smallest frontend architecture that fits the existing application.

## Step 4 — Implement types

Create/reuse TypeScript interfaces.

## Step 5 — Implement API service

Implement REST calls.

## Step 6 — Implement WebSocket service/hook

Implement:

- connection
- authentication
- subscriptions
- sending
- reconnect
- cleanup

## Step 7 — Implement components

Implement:

- role tabs
- staff search
- staff results
- conversation list
- conversation item
- chat header
- message list
- message item
- composer
- empty/loading/error states

## Step 8 — Integrate routing

Add the page to the existing application routing system.

## Step 9 — Integrate authentication

Reuse the existing authentication mechanism.

## Step 10 — Implement read/unread behavior

Integrate:

```text
lastReadAt
```

through the backend API.

## Step 11 — Test

Run frontend tests.

## Step 12 — Build

Run the frontend build/type-check process.

Fix all TypeScript and build errors.

## Step 13 — Verify integration

Verify:

- login → chat page
- role tabs
- staff search
- conversation creation
- existing conversation retrieval
- message history
- sending
- real-time delivery
- unread count
- read state
- reconnect
- refresh
- authorization errors

## Step 14 — Check regressions

Verify that existing application functionality still works.

---

# 69. Acceptance criteria

The implementation is complete only when:

- [ ] Internal Chat page is accessible through the existing application routing.
- [ ] Only authenticated users can access it.
- [ ] Customers cannot use the internal admin chat.
- [ ] Five tabs exist: All, Super Admin, System Admin, Payment Handler, Meter Reader.
- [ ] All tab shows all eligible internal roles.
- [ ] Super Admin tab filters Super Admin users/conversations.
- [ ] System Admin tab filters System Admin users/conversations.
- [ ] Payment Handler tab filters Payment Handler users/conversations.
- [ ] Meter Reader tab filters Meter Reader users/conversations.
- [ ] Staff search works by full name.
- [ ] Staff search works by UUID/user ID.
- [ ] Search works together with role filtering.
- [ ] Current user is not presented as a target staff member.
- [ ] Customers are not displayed in staff search.
- [ ] A user can select another staff member and start a conversation.
- [ ] Existing conversations are reused rather than duplicated.
- [ ] Conversation list loads from the backend.
- [ ] Conversation list displays the other participant.
- [ ] Conversation list displays the other participant's role.
- [ ] Conversation preview is displayed.
- [ ] Conversation timestamp is displayed.
- [ ] Unread count is displayed.
- [ ] Conversation search works by participant name.
- [ ] Conversation search works by participant UUID.
- [ ] Conversation search respects the selected role.
- [ ] Selecting a conversation loads persisted messages.
- [ ] Messages are paginated.
- [ ] Older messages can be retrieved.
- [ ] Current user's messages are visually distinguished.
- [ ] Other participant's messages are visually distinguished.
- [ ] Text messages can be sent.
- [ ] Blank messages cannot be sent.
- [ ] Message validation follows the backend contract.
- [ ] REST authentication uses the existing JWT mechanism.
- [ ] STOMP authentication uses the existing JWT.
- [ ] WebSocket connections do not create duplicate connections.
- [ ] Conversation subscriptions are cleaned up correctly.
- [ ] New messages arrive in real time without page refresh.
- [ ] Messages are not duplicated when REST and WebSocket data overlap.
- [ ] Disconnected users can retrieve missed messages through REST.
- [ ] Opening a conversation marks it as read.
- [ ] Unread counts update correctly.
- [ ] Real-time read-status events are handled if provided by the backend.
- [ ] WebSocket reconnection works reasonably.
- [ ] Authorization failures are handled gracefully.
- [ ] Loading states are implemented.
- [ ] Empty states are implemented.
- [ ] Error states are implemented.
- [ ] UI follows the existing application's design.
- [ ] No Phase 2/3/4 features are implemented.
- [ ] No unrelated application functionality is modified.
- [ ] TypeScript has no avoidable `any` usage.
- [ ] Frontend tests for critical functionality are added.
- [ ] Frontend compiles/builds successfully.

---

# 70. Final verification report

After implementation, provide a concise report containing:

1. Files created
2. Files modified
3. Routes added
4. REST API calls implemented
5. WebSocket/STOMP endpoint used
6. STOMP application destination used
7. STOMP subscription destination used
8. Authentication approach
9. Components created
10. Hooks/services created
11. Tests added
12. Build/type-check result
13. Any assumptions
14. Any backend/frontend contract mismatches
15. Any issues that still require attention

Do not claim something was implemented or tested if it was not actually verified.

---

# 71. Final instruction

Before coding, inspect the existing frontend and the actual implemented backend.

Do NOT blindly generate the implementation from this prompt.

The existing project conventions take priority over the example architecture in this prompt.

The backend implementation is the source of truth for:

- DTO structures
- REST response structures
- request structures
- WebSocket endpoint
- STOMP destinations
- authentication expectations

The frontend must integrate with the existing system rather than redesigning it.

Implement **Phase 1 — Basic Admin Internal Chat frontend only**.