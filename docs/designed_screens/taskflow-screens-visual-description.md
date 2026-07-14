# Analytic Visual Description: TaskFlow Application

This document provides a comprehensive analytic breakdown of the various screens within the TaskFlow application.

---

## 1. Global Layout Architecture
Before analyzing specific pages, it is important to note the consistent global layout:
*   **Sidebar (Left Region):** Occupies ~15-20% of the viewport width. It acts as the primary navigation hub containing the application logo, workspace navigation (Dashboard, Tasks, Categories, Reports, Notifications, Profile), and a footer section containing the current user profile and settings.
*   **Top Bar (Header Region):** A horizontal strip across the top of the main content area. It contains breadcrumb navigation, a persistent global search bar, a notification alert icon, a "New Task" primary action button, and a logout/exit icon.
*   **Main Content Area:** The central workspace area that adapts dynamically based on the active route.

---

## 2. Dashboard (homepage-taskflow.png)
The Dashboard serves as the central command center, prioritizing high-level data visualization and actionable insights.

*   **KPI Cards (Top Center):** A row of 4 distinct cards displaying key metrics ("Total Tasks," "In Progress," "Completed," "Overdue"). Each card uses a subtle iconography and simple numeric typography to provide immediate status awareness.
*   **Tasks by Status (Center Left):** A large, rectangular container displaying a horizontal bar chart. It categorizes tasks by workflow state (Backlog, To Do, In Progress, Review, Completed), providing a quick visual snapshot of team bottlenecks.
*   **Priority Mix (Center Right):** A vertical list displaying task distribution by severity (Critical, High, Medium, Low) with numerical counts.
*   **Upcoming Deadlines (Bottom Left):** A tabular list view showing specific tasks, their assigned status, and due dates.
*   **Recent Activity (Bottom Right):** An activity feed showing the latest actions taken by team members (e.g., "Sarah Chen completed...", "Alex Rivera uploaded...").
*   **Styling:** Clean, card-based interface with generous whitespace.

---

## 3. Tasks (taskspage-taskflow.png)
The Tasks screen is an interactive workspace designed for project management and detailed task tracking.

*   **Filter Toolbar:** A row situated below the breadcrumbs featuring a search input, "Filter" button, "Sort" button, and a "Board/List" view toggle.
*   **Kanban Board (Main Area):** A multi-column layout where each column represents a workflow stage (Backlog, To Do, In Progress, Review).
    *   **Cards:** Each card represents a task, showing title, tags (Priority, Category), assigned user avatars, and metadata (date, comments).
*   **Details Drawer (Right Overlay):** When a task is selected, a panel slides out from the right, overlaying a portion of the screen.
    *   **Media Component:** Displays a video player preview.
    *   **Task Info:** Title, detailed description, metadata fields (Priority, Due Date, Category, Assignees).
    *   **Comments Section:** A threaded view of user comments with an input field at the bottom.
*   **Styling:** High-utility layout focusing on interaction and data density.

---

## 4. Categories (categoriespage-taskflow.png)
This screen focuses on structural organization and project management taxonomy.

*   **Header Section:** Includes the "Categories" title and a "New Category" primary action button.
*   **Category Grid:** A grid of cards, each representing a distinct department or work track (Engineering, Design, Product, Operations, Research).
*   **Card Components:** Each card displays:
    *   The Category Title.
    *   Task count (e.g., "4 tasks").
    *   A progress bar indicating completion status with percentage text.
*   **Styling:** Modular design that emphasizes grouping.

---

## 5. Reports (reportspage-taskflow.png)
Designed for management analysis, this screen visualizes throughput and status distribution.

*   **Action Bar:** Includes an "Export CSV" button to allow for external data processing.
*   **Weekly Throughput (Upper Chart):** A wide container showing a line/area chart placeholder representing performance over the week.
*   **Data Clusters (Lower Section):**
    *   **Status Distribution:** A comparative list showing task counts against workflow status.
    *   **By Category:** A comparative list showing task distribution across the various business units/departments.
*   **Styling:** Data-dense, focusing on clarity through visual separation and alignment.

---

## 6. Notifications (notificationspage-taskflow.png)
A streamlined feed for communication and status updates.

*   **Header:** "Notifications" title, "Unread" count, and a "Mark all as read" action link.
*   **Tab Navigation:** Filtering mechanisms (All, Mentions, Assignments, Comments) to isolate specific communication types.
*   **Notification List:** A vertical list of items, each containing:
    *   User Avatar/Initials.
    *   Message text (e.g., "Sarah Chen mentioned you...").
    *   Timestamp.
    *   A status dot (likely indicating unread state).
*   **Styling:** Minimalist list view, prioritized by readability.

---

## 7. Profile (profilepage-taskflow.png)
A settings-oriented screen for user customization and identity management.

*   **User Header:** A clear identification block with Avatar, Full Name, Role, and Email.
*   **Profile Section:** A form container with input fields for updating personal information (Full name, Display name, Email, Role, Bio). Features "Cancel" and "Save changes" buttons.
*   **Preferences Section:** A list of toggles for application behavior:
    *   Email notifications (Daily digest).
    *   Play attachments inline (Hover preview toggle).
    *   Reduce motion (Accessibility toggle).
*   **Styling:** Standard form-based layout with grouped settings containers.
