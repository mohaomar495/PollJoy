# PollJoy: Create, Share, and Analyze Polls with Ease

Welcome to PollJoy, a full-stack polling application that allows you to create, share, and vote on polls in a fun and interactive way. This project was created as part of the ALX AI for Developers program, showcasing the power of AI-assisted coding to build practical and engaging applications.

---

## Live Demo

Experience PollJoy live at: **[https://polljoy.netlify.app](https://polljoy.netlify.app)**

---

## Why PollJoy? The PollJoy Advantage

In a world saturated with social media platforms that offer polling features, like Twitter and Telegram, PollJoy stands out by offering a dedicated, feature-rich, and customizable polling experience.

### Beyond Social Media Polls

While platforms like Twitter and Telegram are great for quick, casual polls, they are limited by their ecosystem. PollJoy breaks free from these limitations by providing:

*   **A Dedicated Platform:** No need to be part of a specific social network to participate. Anyone with the link can vote (or you can restrict it to logged-in users).
*   **Enhanced Privacy Control:** Choose between public polls for maximum reach or private polls for a more controlled environment. This is something you can't do on most social media platforms.
*   **Customizable Voting Options:** Allow single or multiple votes, and set an expiration date for your polls. This level of control is not available on platforms like Twitter.
*   **No Distractions:** PollJoy is a focused environment for polling. There are no distracting timelines or notifications from other sources.

### The Importance of a Dedicated Polling Tool

In professional and personal contexts, having a dedicated tool for gathering opinions is crucial. PollJoy provides a centralized and organized way to make decisions, gather feedback, and engage with your audience without the noise of social media.

---

## Use Cases

PollJoy is a versatile tool that can be used in various scenarios:

*   **Business Decisions:** Gather feedback from your team on new features, project ideas, or meeting times.
*   **Market Research:** Conduct quick market research by polling your target audience on their preferences.
*   **Community Engagement:** Engage with your online community by running fun and interactive polls.
*   **Education:** Teachers can use PollJoy to create quizzes and surveys for their students.
*   **Personal Use:** Settle debates with friends, choose a movie for the weekend, or decide on a place to eat.

---

## Features

*   **User Authentication:** Secure user authentication system that allows users to sign up, log in, and log out.
*   **Poll Management:** Create, view, edit, and delete polls with ease.
*   **Public & Private Polls:** Choose to make your polls public for everyone to see and vote on, or keep them private for a select group of people.
*   **Flexible Voting Options:** Allow users to vote for a single option or multiple options, depending on the nature of the poll.
*   **Poll Expiration:** Set an expiration date for your polls.
*   **QR Code Sharing:** Share your polls with others by generating a QR code that can be easily scanned.
*   **Fuzzy Search:** Quickly find the polls you're looking for with our powerful fuzzy search functionality.
*   **User Profiles:** Every user has a profile with a unique avatar.

---

## How to Use PollJoy

1.  **Sign up for an account:** To get started, you'll need to create an account.
2.  **Create a poll:** Once you're logged in, you can create a new poll by clicking on the "Create Poll" button.
3.  **Customize your poll:** Add a title, description, and options. You can also set the privacy and voting options.
4.  **Share your poll:** Share your poll with others by sending them a link or by generating a QR code.
5.  **Vote on polls:** Vote on public polls or polls that have been shared with you.
6.  **View the results:** See the results of the polls you've voted on in real-time.

---

## Technologies Used

*   **Framework:** [Next.js](https://nextjs.org/)
*   **Database and Auth:** [Supabase](https://supabase.io/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
*   **Fuzzy Search:** [Fuse.js](https://fusejs.io/)
*   **QR Code Generation:** [qrcode.react](https://www.npmjs.com/package/qrcode.react)

---

## Getting Started (for Developers)

To run this project locally, you'll need to have Node.js and npm installed.

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd alx-polly
    ```
3.  **Install the dependencies:**
    ```bash
    npm install
    ```
4.  **Set up your environment variables:**
    Create a `.env.local` file in the root of the `alx-polly` directory and add the following variables:
    ```
    NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
    ```
    You can get these from your Supabase project settings.

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

Now you can open [http://localhost:3000](http://localhost:3000) in your browser to see the application.
