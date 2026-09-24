# Personal Weather Companion

Problem Statement ID	

26076

Problem Statement Title	

Development of personalized homepage for 'Mausam' mobile application:

Description	

• Health-conscious users Highlight Air Quality Index (AQI), pollen count, UV index, and humidity levels to help users manage allergies, asthma, or skin sensitivity.

• Outdoor fitness enthusiasts Show sunrise/sunset times, 'best running hours,' wind speed, and heat alerts to optimize workout planning.

• Beachgoers & surfers Display sea conditions, tide timings, wave height, and water temperature for safe and enjoyable beach activities.

• Travelers Provide quick access to saved destinations, severe weather alerts for flights, and packing suggestions (e.g., 'Carry a raincoat in London').

• Parents & families Emphasize school commute conditions, rain alerts, and severe weather warnings to plan daily routines.

• Agriculture & gardeners Show soil moisture, rainfall predictions, frost alerts, and seasonal planting guidance.

• Commuters Integrate weather with traffic updates, visibility conditions, and alerts for storms or fog that affect travel.

• Event planners Offer extended forecasts, probability of rain, and 'comfort index' for outdoor gatherings or weddings.

Organization	Ministry of Earth Sciences (MoES)

Department	India Meteorological Department

Category	Software

Theme	Smart Automation

This is the problem statement I need to create a full website how can I create and what are the language I use to create a full homepage website I need full guide


Add a complete, modern, responsive authentication system to my existing website.

IMPORTANT:

Do NOT redesign, remove, or modify my existing website unnecessarily.

Keep the current website layout, theme, colors, typography, spacing, navigation, and overall visual style.

The new login/authentication pages should visually match the existing website.

Make the authentication experience clean, simple, professional, and mobile-friendly.

1. Login Page

Create a dedicated /login page with:

Website/app logo at the top

Heading: "Welcome Back"

Short subtitle: "Sign in to continue"

Username or Email input field

Password input field

Show/hide password button/icon

"Remember me" checkbox

"Forgot Password?" link

Main "Login" button

Google login button with Google icon

Divider with "OR"

Text: "Don't have an account?"

"Create Account" link/button that opens the registration page

The login form should have proper validation:

Email/username cannot be empty

Password cannot be empty

Display clear and user-friendly error messages

Disable the Login button while the login request is processing

Show a loading indicator while authentication is in progress

Display a clear success/error message after login

2. Create Account / Registration Page

Create a dedicated /register or /signup page.

Include:

Logo

Heading: "Create Your Account"

Subtitle: "Sign up to get started"

Full Name field

Username field

Email field

Password field

Confirm Password field

Show/hide password controls

Terms and Conditions checkbox

"Create Account" button

Google Sign Up button

Divider with "OR"

Text: "Already have an account?"

"Login" link

Validation:

All required fields must be completed

Validate email format

Username should have appropriate validation

Password should meet reasonable security requirements

Confirm password must match password

Terms and Conditions must be accepted

Show clear validation messages

Prevent duplicate account creation

Show loading state during account creation

3. Google Login

Add a simple and professional "Continue with Google" authentication option.

Requirements:

Use the official Google authentication flow.

Display the Google logo/icon.

Users should be able to sign in or create an account using their Google account.

If the user is already registered, log them in.

If they are new, create their account automatically.

Handle cancelled authentication and authentication errors gracefully.

Do not store Google passwords or sensitive authentication information in the frontend.

4. Authentication Backend

If authentication/backend is not already configured, use a secure authentication solution compatible with this project, preferably Supabase Auth if Supabase is already connected.

Create the required authentication functionality for:

Email/password registration

Email/password login

Google OAuth login

Logout

Password reset

Session persistence

Authentication state checking

If Supabase is already connected:

Use the existing Supabase project.

Do not create a second authentication system.

Use Supabase Auth properly.

Store only necessary user profile information in the database.

Never store plain-text passwords.

If authentication is not configured yet, set up the required structure and clearly indicate any credentials/configuration that I need to add.

5. Forgot Password

Create a /forgot-password page.

Include:

Heading: "Forgot Password?"

Email input

"Send Reset Link" button

Link back to Login

After submitting:

Show a confirmation message.

Send a secure password reset email.

Provide a password reset page where the user can create a new password.

6. User Session

After successful login:

Redirect the user to the existing main/home page.

Keep the user logged in when appropriate.

Protect pages that require authentication.

If an unauthenticated user tries to access a protected page, redirect them to /login.

Add a logout function.

After logout, redirect the user to the login page.

7. User Profile

After registration/login, create or maintain a basic user profile containing only necessary information such as:

User ID

Full Name

Username

Email

Profile creation date

Do not store passwords directly in the database.

8. UI/UX Requirements

Make the authentication pages:

Clean

Modern

Professional

Minimal

Fully responsive

Easy to understand

Accessible on desktop, tablet, and mobile

Use consistent:

Colors

Fonts

Buttons

Border radius

Shadows

Input styles

Icons

based on my existing website.

Add subtle animations for:

Page transitions

Button hover

Input focus

Loading states

Do not make the animations excessive.

9. Error Handling

Handle common situations properly:

Incorrect email/password

Account already exists

Invalid email

Weak password

Password mismatch

Google authentication failure

Network/API failure

Expired password reset link

User not authenticated

Session expiration

Show simple messages such as:
"Invalid email or password."
"An account with this email already exists."
"Your password must meet the required security criteria."

Do not expose technical errors, database errors, API keys, or sensitive information to users.

10. Navigation

Add the following authentication flow:

Login
→ Create Account
→ Login

Login
→ Forgot Password
→ Reset Password
→ Login

Login
→ Continue with Google
→ Existing account: Login
→ New account: Create account

Successful Login
→ Existing Website/Home Page

Logout
→ Login Page

11. Final Requirement

Before making changes, inspect my existing website and understand its current design system.

Do not replace my existing homepage or existing functionality.

Only add the authentication system and make the minimum necessary changes to connect authentication with the existing website.

Make sure all buttons, links, forms, redirects, validation, authentication states, and logout functionality actually work.

After implementation, test the complete flow:

Create a new account

Login with email/password

Login with Google

Logout

Forgot password

Reset password

Try accessing protected pages while logged out

Verify responsive design on mobile and desktop

If any backend configuration or environment variables are required, tell me exactly what needs to be configured instead of using fake credentials.
Add a complete, modern, responsive authentication system to my existing website.

IMPORTANT:

Do NOT redesign, remove, or modify my existing website unnecessarily.

Keep the current website layout, theme, colors, typography, spacing, navigation, and overall visual style.

The new login/authentication pages should visually match the existing website.

Make the authentication experience clean, simple, professional, and mobile-friendly.

1. Login Page

Create a dedicated /login page with:

Website/app logo at the top

Heading: "Welcome Back"

Short subtitle: "Sign in to continue"

Username or Email input field

Password input field

Show/hide password button/icon

"Remember me" checkbox

"Forgot Password?" link

Main "Login" button

Google login button with Google icon

Divider with "OR"

Text: "Don't have an account?"

"Create Account" link/button that opens the registration page

The login form should have proper validation:

Email/username cannot be empty

Password cannot be empty

Display clear and user-friendly error messages

Disable the Login button while the login request is processing

Show a loading indicator while authentication is in progress

Display a clear success/error message after login

2. Create Account / Registration Page

Create a dedicated /register or /signup page.

Include:

Logo

Heading: "Create Your Account"

Subtitle: "Sign up to get started"

Full Name field

Username field

Email field

Password field

Confirm Password field

Show/hide password controls

Terms and Conditions checkbox

"Create Account" button

Google Sign Up button

Divider with "OR"

Text: "Already have an account?"

"Login" link

Validation:

All required fields must be completed

Validate email format

Username should have appropriate validation

Password should meet reasonable security requirements

Confirm password must match password

Terms and Conditions must be accepted

Show clear validation messages

Prevent duplicate account creation

Show loading state during account creation

3. Google Login

Add a simple and professional "Continue with Google" authentication option.

Requirements:

Use the official Google authentication flow.

Display the Google logo/icon.

Users should be able to sign in or create an account using their Google account.

If the user is already registered, log them in.

If they are new, create their account automatically.

Handle cancelled authentication and authentication errors gracefully.

Do not store Google passwords or sensitive authentication information in the frontend.

4. Authentication Backend

If authentication/backend is not already configured, use a secure authentication solution compatible with this project, preferably Supabase Auth if Supabase is already connected.

Create the required authentication functionality for:

Email/password registration

Email/password login

Google OAuth login

Logout

Password reset

Session persistence

Authentication state checking

If Supabase is already connected:

Use the existing Supabase project.

Do not create a second authentication system.

Use Supabase Auth properly.

Store only necessary user profile information in the database.

Never store plain-text passwords.

If authentication is not configured yet, set up the required structure and clearly indicate any credentials/configuration that I need to add.

5. Forgot Password

Create a /forgot-password page.

Include:

Heading: "Forgot Password?"

Email input

"Send Reset Link" button

Link back to Login

After submitting:

Show a confirmation message.

Send a secure password reset email.

Provide a password reset page where the user can create a new password.

6. User Session

After successful login:

Redirect the user to the existing main/home page.

Keep the user logged in when appropriate.

Protect pages that require authentication.

If an unauthenticated user tries to access a protected page, redirect them to /login.

Add a logout function.

After logout, redirect the user to the login page.

7. User Profile

After registration/login, create or maintain a basic user profile containing only necessary information such as:

User ID

Full Name

Username

Email

Profile creation date

Do not store passwords directly in the database.

8. UI/UX Requirements

Make the authentication pages:

Clean

Modern

Professional

Minimal

Fully responsive

Easy to understand

Accessible on desktop, tablet, and mobile

Use consistent:

Colors

Fonts

Buttons

Border radius

Shadows

Input styles

Icons

based on my existing website.

Add subtle animations for:

Page transitions

Button hover

Input focus

Loading states

Do not make the animations excessive.

9. Error Handling

Handle common situations properly:

Incorrect email/password

Account already exists

Invalid email

Weak password

Password mismatch

Google authentication failure

Network/API failure

Expired password reset link

User not authenticated

Session expiration

Show simple messages such as:
"Invalid email or password."
"An account with this email already exists."
"Your password must meet the required security criteria."

Do not expose technical errors, database errors, API keys, or sensitive information to users.

10. Navigation

Add the following authentication flow:

Login
→ Create Account
→ Login

Login
→ Forgot Password
→ Reset Password
→ Login

Login
→ Continue with Google
→ Existing account: Login
→ New account: Create account

Successful Login
→ Existing Website/Home Page

Logout
→ Login Page

11. Final Requirement

Before making changes, inspect my existing website and understand its current design system.

Do not replace my existing homepage or existing functionality.

Only add the authentication system and make the minimum necessary changes to connect authentication with the existing website.

Make sure all buttons, links, forms, redirects, validation, authentication states, and logout functionality actually work.

After implementation, test the complete flow:

Create a new account

Login with email/password

Login with Google

Logout

Forgot password

Reset password

Try accessing protected pages while logged out

Verify responsive design on mobile and desktop

If any backend configuration or environment variables are required, tell me exactly what needs to be configured instead of using fake credentials.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/012653f5-03af-4a6c-b23c-13b080688ee5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
