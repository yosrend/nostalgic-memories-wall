# App Flow Document

# Wall of Memories App Flow Document

## Onboarding and Sign-In/Sign-Up

When a first-time visitor arrives, they are greeted by the public Wall of Memories landing page. There is no mandatory account creation for visitors. However, if the visitor wants to link a social profile before submitting a memory, they click the Social Connect button, which opens a modal prompting them to authorize via supported social platforms. This step remains optional, and visitors may skip it and submit anonymously. For administrators, there is a dedicated Admin Login page accessible via a link in the site footer or a direct URL. The admin page displays email and password fields along with a “Forgot Password” link. When admins enter credentials, the system sends them to Supabase Auth to be verified. Upon failed login, an inline error appears beneath the form. If the admin clicks “Forgot Password,” they are asked to enter their email. Supabase then sends a reset link, and the admin follows that link back to the app to set a new password. Successful sign-in sets a secure session cookie and redirects the admin to the curation dashboard. A Sign Out button in the admin header ends the session when clicked, clears authentication cookies, and returns the user to the public wall.

## Main Dashboard or Home Page

After loading the site, visitors see the Main Wall of Memories. The page header includes the site title, a button to open the Social Connect modal, and a button to open the memory submission form. The body of the page is a dynamic, animated grid of memory cards arranged in a nostalgic collage style. Each card displays text, an optional image thumbnail, a timestamp, and icons for emoji reactions. A floating Submit Memory button in the lower right corner opens an overlay form for adding new memories. The page footer contains links to the static Reunion page, admin login, and site information. Administrators who have successfully signed in instead see a link in the header to switch to the curation dashboard.

## Detailed Feature Flows and Page Transitions

Memory Submission and Photo Upload begins when a visitor clicks the Submit Memory button. A modal appears with fields for name, text memory, optional social handle, and an image upload input. The visitor selects an image from their device. The form validates file size and type on the client, showing an error under the upload field if requirements are not met. When the visitor clicks “Submit,” the app sends the data to a Next.js API route. The API route checks the input again, uploads the image to Supabase Storage, and inserts a new row into the posts table with status set to “pending.” A success toast message confirms receipt, and the modal closes. The visitor returns to the wall and can continue browsing.

Admin Curation Dashboard opens when an authenticated admin clicks the Dashboard link or completes login. The dashboard displays a paginated list of pending memory submissions. Each row shows the poster’s name, memory text, thumbnail image, submission time, and action buttons labeled Approve, Reject, or Delete. When the admin clicks Approve, the app calls a server endpoint that updates the post’s status to “approved.” Supabase Realtime triggers a broadcast so that all visitors viewing the wall see the new memory appear instantly. If the admin clicks Reject, the post status updates to “rejected” and it no longer appears on the wall. Delete permanently removes the record. The admin can sign out or navigate back to the public wall via header links.

Interactive Wall of Memories is the default view for visitors. Approved memories are fetched via a Next.js API route that queries Supabase. The frontend subscribes to real-time updates for new approvals and reactions. As new memories arrive, the grid rearranges with smooth CSS transforms. Clicking on any card opens an expanded view with full text and a larger image. Visitors can close the view to return to the grid.

Real-time Updates and Reactions allow visitors to click emoji icons on each memory card. When a reaction icon is clicked, the ReactionButtons component sends a request to the reactions API endpoint. The server stores the reaction and broadcasts the new tally in real time. Other visitors immediately see updated counts without refreshing. Admins also see live reaction updates on the dashboard.

Social Connect and Comments become available when visitors open the Social Connect modal. They choose to log in with a social provider. Once connected, they return to the wall and their social handle is auto-filled in subsequent memory submissions or comment posts. To add a comment, a visitor clicks the Comments icon on a memory card. A comment pane slides up showing existing comments and a text box for new entries. Submitting a comment writes it to the comments table via an API route. Supabase broadcasts the new comment so all viewers of that card see it instantly.

Static Reunion Page is accessible via the footer link. It contains a hero section with a large banner image and event details. Scrolling down reveals an image gallery where visitors can click thumbnails to open a lightbox view powered by the UI library. Further down is an interactive map highlighting locations shared in memories. An FAQ section answers common questions. The page is static and does not require authentication.

## Settings and Account Management

Only administrators have access to account settings. Within the curation dashboard header, there is a Profile icon that opens the Admin Settings page. Here admins can update their display name, change email, and update their password. Changing the password requires entering the current password for security. Profile updates are sent to Supabase Auth and on success the admin sees a confirmation banner. Admins can also manage notification preferences, choosing to receive email alerts for new submissions. Saving preferences writes to a user_settings table in Supabase. A breadcrumb link at the top of the settings page returns the admin to the dashboard.

## Error States and Alternate Paths

If visitors submit invalid data such as empty memory text or unsupported image format, the form displays red inline error messages instructing the correct input. If the image upload fails during the server process, a global error toast appears, advising the visitor to try again later. In case of network loss, the app shows a full-screen offline banner until connectivity returns. For admins, attempting to access the dashboard without a valid session triggers the route middleware, which redirects them to the login page with an “Access denied” message. If Supabase returns a 401 error during an API call, the admin is automatically signed out and redirected to the login page with a note to re-authenticate.

## Conclusion and Overall App Journey

A visitor lands on the Wall of Memories, browses a lively collage of approved submissions, and optionally links a social profile. They can share their own memories and see them appear once approved by an admin. Real-time reactions and comments keep the experience engaging. Administrators sign in via the dedicated login page, curate submissions through the protected dashboard, and manage their account settings. The static Reunion page offers an event overview and gallery. Throughout this journey, theme variables and animated UI elements maintain a nostalgic school vibe. Error handling ensures that invalid input or connectivity issues are clearly communicated, and the real-time data streams keep both the wall and dashboard seamlessly synchronized. From sign-up to everyday usage, each step connects smoothly, guiding users towards sharing and celebrating memories.

---
**Document Details**
- **Project ID**: 08ff3b20-1691-4506-892c-099f84beabfb
- **Document ID**: 0cc31609-5723-4438-a809-8e601245d6c1
- **Type**: custom
- **Custom Type**: app_flow_document
- **Status**: completed
- **Generated On**: 2025-10-15T07:13:27.251Z
- **Last Updated**: N/A
