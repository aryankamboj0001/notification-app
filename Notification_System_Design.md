# Stage 1 - Notification System Design

## Objective

Display the Top 10 highest priority notifications from the notification service.

## Priority Rules

Notifications are ranked based on:

1. Placement
2. Result
3. Event

Priority values:

* Placement = 3
* Result = 2
* Event = 1

## Sorting Logic

Notifications are first sorted by priority.

If two notifications have the same priority, the most recent notification is shown first based on Timestamp.

## Algorithm

1. Fetch notifications from the API.
2. Assign priority values using a mapping.
3. Sort notifications:

   * Higher priority first.
   * Newer timestamp first.
4. Select the first 10 notifications.

## Time Complexity

Sorting takes:

O(n log n)

where n is the number of notifications.

## Handling New Notifications

Whenever the application fetches new notifications:

1. Merge with existing notifications.
2. Re-run the sorting logic.
3. Keep only the top 10 notifications.

This ensures that the Priority Inbox always displays the most important and recent notifications.

## Technology Used

* React
* Axios
* JavaScript

## API Used

GET /evaluation-service/notifications

Authorization: Bearer Token
