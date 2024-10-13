# T4SG Starter Project

- [T4SG Starter Project](#t4sg-starter-project)
  - [Introduction](#introduction)
  - [Setup](#setup)
    - [(1) Clone repository](#1-clone-repository)
    - [(2) Package installation](#2-package-installation)
    - [(3) Supabase Connection Setup](#3-supabase-connection-setup)
    - [(4) Supabase Database Setup](#4-supabase-database-setup)
    - [(5) Supabase + Google Authentication Setup](#5-supabase--google-authentication-setup)
      - [User auth workflow + security explained](#user-auth-workflow--security-explained)
    - [(6) Supabase CLI Setup](#6-supabase-cli-setup)
    - [(7) Run the webapp](#7-run-the-webapp)
    - [(8) (Recommended) Configure git message template](#8-recommended-configure-git-message-template)
    - [(9) Github CI workflow (for SSWEs, do during project setup)](#9-github-ci-workflow-for-sswes-do-during-project-setup)
  - [File walkthrough](#file-walkthrough)
    - [`app/`](#app)
    - [`components/`](#components)
    - [`lib/`](#lib)
    - [Configuration Files & More](#configuration-files--more)
    - [Files to Alter for Specific Purposes](#files-to-alter-for-specific-purposes)
  - [Stack references](#stack-references)
    - [Typescript](#typescript)
    - [Components and Styling: `shadcn/ui`, Radix, and Tailwind CSS](#components-and-styling-shadcnui-radix-and-tailwind-css)
    - [Next.js](#nextjs)
      - [Tips for learning:](#tips-for-learning)
    - [Supabase](#supabase)
      - [Troubleshooting the Supabase CLI](#troubleshooting-the-supabase-cli)
    - [Environment variables](#environment-variables)
  - [Development tools](#development-tools)
    - [Code formatting and linting tools](#code-formatting-and-linting-tools)
      - [`eslint`](#eslint)
      - [`prettier`](#prettier)
      - [EditorConfig](#editorconfig)
      - [Github CI workflow](#github-ci-workflow)
      - [VSCode-specific settings](#vscode-specific-settings)
    - [VSCode Extensions](#vscode-extensions)
      - [`eslint`, `prettier`, `editorconfig`, and `tailwindcss`](#eslint-prettier-editorconfig-and-tailwindcss)
      - [BetterComments](#bettercomments)
      - [Live Share](#live-share)
      - [Format Code Action](#format-code-action)
      - [Error Lens](#error-lens)
      - [Pretty Typescript Errors](#pretty-typescript-errors)
  - [Deployment guides](#deployment-guides)
  - [Additional stack options (for SSWEs)](#additional-stack-options-for-sswes)
  - [Updating this project (for DOEs + future maintainers)](#updating-this-project-for-does--future-maintainers)

---

## Introduction

This project is a versatile starter project for T4SG web development projects. The stack and development tools have been chosen carefully to enable teams to develop rapidly on a variety of projects and build apps that are more easily maintainable by clients post-handoff.

The project uses Next.js, a React-based framework with significant optimizations. The frontend uses `shadcn/ui`, an open-source library of UI components that are built with Radix primitives and styled with Tailwind CSS. The backend uses Supabase, an open-source Firebase alternative. The entire stack is written in Typescript to provide comprehensive typesafety across both frontend and backend.

Along with this README, the codebase has several comments that should be helpful for understanding the code!

---

## Setup

#### (1) Clone repository

`cd` into a desired destination folder, then clone the repo (preferably using SSH):

```shell
git clone git@github.com:hcs-t4sg/starter-project-2023-v2.git
```

#### (2) Package installation

1. Open the project folder in VSCode. You can do so with the following terminal shortcut:

   ```bash
   # Navigate into the project directory
   cd starter-project-2023-v2

   # Open in VSCode
   code .

   # If the second command gives you an error, you probably don't have the VS Code 'code' keyword added to your PATH variable. Follow this tutorial:
   # https://www.freecodecamp.org/news/how-to-open-visual-studio-code-from-your-terminal/#:~:text=Once%20your%20terminal%20is%20open,Then%20hit%20enter%20.&text=Once%20you%20hit%20enter%20%2C%20VS%20Code%20will%20now%20open.
   ```

2. Open a terminal in the project folder by dragging up from the bottom of the code window or by going to `Terminal > New Terminal` in the menu bar.

3. Run: `npm install` (`npm i` for short)

   - If you get something like "command not found", you might not have `npm` installed.

- If successful you should see something like:

  ```bash
  added 414 packages, and audited 415 packages in 13s

  149 packages are looking for funding
  run `npm fund` for details

  found 0 vulnerabilities
  ```

4. You should see a popup in the bottom right prompting you to install recommended extensions. Please install these, they'll be helpful for code formatting and developing the webapp. You can also view the recommended extensions in the extensions sidebar (`cmd + shift + X`.)

5. You will also get a prompt to use the workspace's Typescript version; accept it. You may have to navigate to any `.ts` or `.tsx` file in the project and open it to receive the prompt. If you don't get one, or if you get an error that the path "does not point to a valid tsserver install", make sure you're using the workspace's Typescript version by pressing `cmd` + `shift` + `P` and typing "typescript", selecting `Typescript: Select Typescript Version`, and selecting `Use Workspace Version`. Again, you'll need to be viewing a `.tsx` or `.ts` file to do this.

#### (3) Supabase Connection Setup

1. Visit the Supabase website, create an account (or login if you already have one), and create a new project. You will be prompted to set a **Database Password; remember it**. Wait for your database provisioning and setup to finish.

   - Try to avoid using special characters like `?`, `$`, etc. in your password.

2. There is a `.env.example` file in your local project directory (e.g. in VSCode). Duplicate it (into the same directory) and rename to `.env`. Inside `.env`, set the following variables according to your Supabase project settings:

   - `NEXT_PUBLIC_SUPABASE_URL`: Paste from Project Settings > API > Project URL.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Paste from Project Settings > API > Project API Keys > `anon` `public`.
   - `SECRET_SUPABASE_CONNECTION_STRING`: Paste from Project Settings > Database > Connection String > Nodejs, then replace `[YOUR-PASSWORD]` with your database password.
     - If you insist on using special characters in your password you will need to replace them with the **percent-encoded** version ([see this reference](https://stackoverflow.com/a/76551917))

   The final result should look something like this:

   ```shell
   # Some other comments above
   NEXT_PUBLIC_SUPABASE_URL="https://abcdefghijklmnopqrst.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="longlonglongstring"
   SECRET_SUPABASE_CONNECTION_STRING="postgresql://postgres:YourDatabasePasswordHere@db.abcdefghijklmnopqrst.supabase.co:5432/postgres"
   ```

You should not share these keys publicly, especially the `SECRET_SUPABASE_CONNECTION_STRING`. Note that this project uses a package from the popular [T3 stack](https://create.t3.gg/) to validate and provide typesafety to environment variables in `env.mjs` (more on this below). When using these environment variables in your code, you can import them from `env.mjs`. `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are used in the codebase itself and are thus included in this file. `SECRET_SUPABASE_CONNECTION_STRING` is used only in a helper script in `package.json` and not in the app itself, so it doesn't need to be validated.

#### (4) Supabase Database Setup

1. In your Supabase project dashboard, navigate to `SQL Editor` in the left sidebar, then click `(+) New Query` > `New blank query`. If you wish, you can rename the query from "Untitled Query" to something else by clicking the dropdown in the left sidebar.
2. In your starter code, there is a `setup.sql` file containing a SQL script that will set up the database for you. Copy the entire contents of the file and paste it into your new query.
   - You should also read through the script to see what it does. The most important part is the trigger that updates the `profiles` table when a new user signs in through Supabase Auth.
3. Run the query with the button in the bottom right or by pressing `cmd` + `return`. In the results panel, you should see the message `Success. No rows returned`.

#### (5) Supabase + Google Authentication Setup

Supabase offers user authentication through a wide range of providers (email + password, email magic link, OAuth, etc.). This starter project uses Google OAuth for user authentication, as it is among the most secure methods and should be widely applicable for many clients.

To set up user authentication:

1. Follow the instructions in the **Prerequisites** and **Application code configuration** sections in Supabase's Google OAuth documentation [here](https://supabase.com/docs/guides/auth/social-login/auth-google).
   - When creating your Google Cloud project, use your Harvard Google account, use the `college.harvard.edu` organization, and select "Internal" user type. This is the quickest setup for development, but it limits your app to Harvard users. Make sure to change to "External" user type for handoff/deployment to your client; this will take time to verify your app!
   - When adding your site URL to the **Authorized Javascript Origins** (step 7 of Application code configuration), use `http://localhost:3000`. This is fine for development, but you will need to change this when deploying!
   - We're not using Google's pre-built configuration. The "Signing users in" section has already been completed, but you can read through it for more info. It's particularly helpful if you plan to connect your to additional Google services or APIs.
2. Login to your Supabase dashboard and navigate to Authentication (left sidebar) > URL Configuration > Redirect URLs > Add URL, and add the following URL: `http://localhost:3000/auth/callback`.
   - Supabase's auth workflow needs to redirect to the `/auth/callback` route after login in order to properly store the user session in cookies. Thus, we need to add this route to our list of allowed redirects in our Supabase project!
   - This config works fine for development. When deploying a production build, make sure to navigate to the same location in your Supabase dashboard and update both the **Site URL** and **Redirect URLs** to match your website/deployment! (i.e. Site URL should be `http://mywebsite.com` and Redirect URL should be `http://mywebsite.com/auth/callback`.)

Check out the [Supabase Auth documentation](https://supabase.com/docs/guides/auth/server-side/nextjs?queryGroups=router&router=app) for more explanation on how Supabase Auth works with Next.js, as well as helpful guides for switching authentication providers if you need!

##### User auth workflow + security explained

When a user logs in, Supabase stores info about the user in the `users` table in the `auth` schema. This table is internal to Supabase and cannot be edited to store additional user info. Thus, in the `setup.sql` script we ran earlier, we created a `profiles` table in the `public` schema, which is the part of the database that is accessible and configurable. We also added a database trigger that creates a new row in the `profiles` table whenever a new user signs in. The `id` of the new row in `public.profiles` matches the `id` of the new user in `auth.users`. Thus, you can manage the columns in the `profiles` table to structure the user-associated data your app needs (e.g. email, display name, biography, etc).

If you need to remove a user from your Supabase project (e.g. so that they can sign in "for the first time" again), you should remove their corresponding row from `public.profiles`. You can then navigate to Authentication > Users and delete their corresponding user.

Finally, note that the `setup.sql` script enables row-level security (RLS) for the `profiles` table it created. Whenever you modify your database schema (e.g. adding/editing tables), make sure to **enable and properly configure the RLS policies for your tables**. This is very important for creating a **secure app** for your client! BaaS platforms such as Supabase allow us to skip the trouble of setting up a backend, but that also means that you have to be extra careful to set up correct security policies in your platform’s settings, because you’re not implementing them in your code.

#### (6) Supabase CLI Setup

1. The Supabase CLI will be helpful for a number of functions, such as running Supabase locally and generating Typescript types from our database schema. For the CLI to work, you will have to install [Docker](https://www.docker.com). During the installation process, if Docker prompts you to run an `osascript`, make sure to run it.

2. If you've done `npm install`, the CLI should already be installed. You can test it by running `npx supabase`, which will give you a version (`Supabase CLI 1.64.8`) and a list of commands.

3. We preconfigured a command (in `package.json`) for you to easily generate type definitions in `lib/schema.ts` from your remote Supabase database schema. If you've created tables in Supabase, you can test this command now. Otherwise, make sure to run it frequently in development whenever you edit your database schema.

   ```ts
   // Introspects your remote Supabase database and generates types in lib/schema.ts
   npm run types
   ```

   > Notes:
   >
   > - You need to have `SECRET_SUPABASE_CONNECTION_STRING` configured in `.env` in order for the above command to work.
   > - If you want to generate type definitions for a local Supabase project, you can run the full version of the command (read more about it [here](https://supabase.com/docs/guides/api/rest/generating-types)) or edit the `npm` script in `package.json`.

More instructions on troubleshooting potential errors are below.

#### (7) Run the webapp

You can run the webapp with the following terminal command. By default, the webapp should be accessible at `http://localhost:3000/`.

```bash
# Start the webapp in development mode (usually what you do in development). Exit with Ctrl + C
npm run dev

# You'll get several "compiling" messages after running this command. That's expected!
```

#### (8) (Recommended) Configure git message template

This project also includes a template for writing good git commit messages. You can configure this template (affects only the project repo) using the following terminal command:

```bash
# Set git commit message to the .gitmessage file (this only affects git in the project repo, not globally)
git config commit.template .gitmessage
```

In future commits, you can run `git commit` (with no attached message or `-m` tag) to open the commit message template in VSCode. Fill in the blanks, save the file (`cmd + S`), and close the file (`cmd + W`) to finish the commit.

#### (9) Github CI workflow (for SSWEs, do during project setup)

We implemented a [Github Actions](https://docs.github.com/en/actions) workflow for CI ([continuous integration](<https://www.atlassian.com/continuous-delivery/continuous-integration#:~:text=Continuous%20integration%20(CI)%20is%20the,builds%20and%20tests%20then%20run.>)) that will process any pull requests made to `main`. The workflow auto-formats the code in the pull request with `prettier` and checks for any `eslint` errors. This allows SWEs to freely make commits on side branches (without enforced formatting or linting) but still prevents code with poor quality or formatting from being pushed to `main`. To set this up, do the following steps:

1. In Github, go to Actions > Enable all workflows
2. Go to Settings > Actions > General and under "Workflow Permissions", make sure "Read and write permissions" is selected.
3. Create a dummy branch with a trivial edit (try not to add anything that creates a bug), and create a pull request from that branch to `main`. If you forked the starter project repo, make sure you're pull-requesting into the correct repo (your own)! After creating the pull request, you should see "Some checks haven't completed yet". Wait for the check to finish, it should succeed.
4. Now we can create a Github [branch protection rule](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule) for our `main` branch. Go to Settings > Branches > Add branch protection rule. We recommend using the following settings:
   - Branch name pattern: `main`
   - Require a pull request before merging
     - Require approvals (1)
     - Dismiss stale pull request approvals when new commits are pushed
   - Require status checks to pass before merging
     - Require branches to be up to date before merging
     - **Required status checks: "Format source code and check for linting errors"** (important to get our CI workflow to run!)

---

## File walkthrough

#### `app/`

This folder contains the main application code, including pages, some components, and route handlers.

- `(components-navbar)`

  The `(components-navbar)` folder contains components related to the navigation bar, including user authentication status, login functionality, and theme toggling.

  - `auth-status.tsx`: Checks the user's authentication status using Supabase, and either displays the `UserNav` component or the `LoginButton` component.
  - `login-button.tsx`: Provides a button for users to login using Google OAuth and handles the sign-in process.
  - `mode-toggle.tsx`: Provides a dropdown menu component that allows users to toggle between light, dark, and system themes.
  - `navbar.tsx`: Renders the main navigation bar of the application. It includes links to the various pages of the application. To add a new 'tab' to the navbar, the developer must edit this file.
  - `user-nav.tsx`: Displays a dropdown menu with user-specific options such as viewing the profile, accessing settings, and logging out.

- `auth/callback`

  The `auth/callback` folder contains the `route.ts` file, which handles the callback from Supabase authentication. Its primary function is to process the authentication code received from Supabase, exchange it for a session, and set the session cookies. If the authentication is successful, it redirects the user to the specified next URL; otherwise, it redirects to an error page.

- `dashboard`

  The `dashboard` folder contains the `page.tsx` file, which renders the dashboard page. This page is a protected route, so it is only accessible to authenticated users. This folder provides a template for how to create new authenticated pages for the developer's project.

- `settings`

  The `settings` folder contains components and pages related to user settings and profile management. It provides a basic template for the developer to allow users to edit both general and profile settings.

  - `general/page.tsx`: Renders the general settings page. Edit this file to allow users to edit general settings.
  - `profile`:
    - `page.tsx`: Renders the profile settings page for authenticated users, using the `ProfileForm` component.
    - `profile-form.tsx`: A client component that provides a form for users to update their profile information.
  - `layout.tsx`: Defines the layout for the settings pages. It ensures that only authenticated users can access the settings and provides a consistent structure for the settings pages, including a sidebar navigation.
  - `page.tsx`: Redirects users to the general settings page when they navigate to the `/settings` route.

- Other files
  - `layout.tsx`: Defines the root layout for the entire application, including a navigation bar and main content area.
  - `page.tsx`: Serves as the home page of the application, and is rendered when the user navigates to the root URL (`/`).
  - `not-found.tsx` and `loading.tsx`: These are the fallback pages for the application, and are rendered when the user navigates to a page that does not exist or when the page is loading.
  - `providers.tsx`: Sets up the context providers for the application.
  - `globals.css`: Defines the global styles for the application.

#### `components/`

This folder contains components that are used across multiple pages of the application. The developer may add components to this folder as needed throughout a project, or use the existing built-in components.

- `global/`: Houses reusable, typically more general-purpose components that are used across multiple pages or sections of the application.
- `ui/`: Houses reusable UI components that are specific to the user interface and styling of the application. Some of the built-in components include a button, typography, and form elements.

#### `lib/`

This folder contains utility functions and type definitions that facilitate both client-side and server-side operations within the application. The developer may need to edit or use this folder when interacting with Supabase, managing environment variables, updating type definitions, or utilizing general utility functions for both client-side and server-side operations.

- `client-utils.ts`: Contains utility functions that are intended to be used exclusively in client-side components. The primary function provided in this file creates a Supabase client configured for use in the browser.
- `reset.d.ts`: Enables the `ts-reset` package, which enhances TypeScript's type-checking capabilities.
- `schema.ts`: Contains TypeScript type definitions that correspond to the database schema. The developer should update this file as the database schema changes, to ensure that database operations are type-checked.
- `server-utils.ts`: Contains utility functions that are intended to be used exclusively in server-side components. The primary functions provided in this file include creating a Supabase client configured for server-side operations and managing cookies for authentication.
- `utils.ts`: Contains general utility functions that can be used in both server and client components. The functions provided include one for conditionally merging Tailwind CSS classes, one for pausing execution for debugging purposes, and one for retrieving user profiles from Supabase.

#### Configuration Files & More

The rest of the repository includes configuration and other files that collectively ensure that the project maintains high code quality, consistent styling, and secure environment variable management, while also providing necessary configurations for development and production environments.

- `.env`: Stores environment variables that configure various aspects of the application, such as Supabase connection.
- `env.mjs`: Validates and provides type safety for environment variables.
- `.gitignore`: Specifies which files and directories should be ignored by Git.
- `package.json`, `package-lock.json`: Defines the project's metadata, dependencies, scripts, and other configurations.
- `next.config.js`: Configures various settings for the Next.js application.
- `setup.sql`: Contains SQL code to set up the database schema and initial data.
- `middleware.ts`: Defines middleware functions that run before requests are completed.
- `components.json`: Configures the `shadcn/ui` library.
- `eslintrc.cjs`, `prettierrc.cjs`, `postcss.config.cjs`, `tailwind.config.ts`, `tsconfig.json`: Configures ESLint, Prettier, PostCSS, Tailwind CSS, and TypeScript, respectively, to enforce code quality, formatting, and type safety.

#### Files to Alter for Specific Purposes

- **Adding new pages or routes**: Create new files in the `app/` directory. To create a new route, create a new folder in the `app/` directory and add a `page.tsx` file. The route of the new page is the name of the folder. For example, if you create a `my-page` folder, the route of the page is `/my-page`.

- **Adding new components**: Create new files in the `components/` directory. For UI-specific components, create a new file in the `components/ui` directory.

- **Updating environment variables**: Modify the `.env` file and update `env.mjs` to reflect the new environment variables.

- **Updating styles**: Modify `tailwind.config.ts` and `app/globals.css` to update the styles of the webapp.

- **Updating utility functions**: Modify or add new functions in `lib` to update the utility functions.

---

## Stack references

This section provides a short description and important commands related to each component of the stack.

### Typescript

Typescript is a strongly-typed programming language based on Javascript. It integrates closely with your editor and provides type inference and static type checking to catch errors/bugs early-on and provide a great developer experience. Furthermore, it is a superset of Javascript and can be transpiled to any version of Javascript to run in browsers.

Typescript applies type inference to your files automatically, but you can also manually run it with the following terminal command:

```bash
# Type check all typescript files (--noEmit disables generation of a report file, which is not needed)
npx tsc --noEmit
```

A quick tip on coding with Typescript: When fixing type errors, you should avoid using [type assertions](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule) (with `as`) and the [`any` type](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule) **as much as possible**. These functionalities are escape hatches built into Typescript to allow you to avoid type-checking, but they don't actually solve the underlying problem of a type error! Simply ignoring the problem by avoiding type-checking will only make future bugs much more difficult to fix. Personally, out of all the type errors I've resolved in Typescript, I've only had one situation where the `as` keyword was necessary; every other time, the type error exposed an important error/oversight in my code.

Also, note that this project implements a few additions to make Typescript's type-checking more strict (and thus encourage better code). Because of this, you may get typing/warning errors when using code repurposed from projects with less strict type-checking. If these become overly burdensome for you/your team, feel free to remove/disable them!

- The package `ts-reset` is installed, implementing additional rules surrounding JSON and array operations ([read more here](https://github.com/total-typescript/ts-reset?tab=readme-ov-file))
- The rule `noUncheckedIndexedAccess` is set to `true` in `tsconfig.json` to improve typesafety of accessing objects ([read more here](https://www.totaltypescript.com/tips/make-accessing-objects-safer-by-enabling-nouncheckedindexedaccess-in-tsconfig))
- The `eslint` config in `eslintrc.cjs` extends the rule configurations `plugin:@typescript-eslint/recommended-type-checked` and `plugin:@typescript-eslint/stylistic-type-checked`, whereas other projects may extend the less-strict configurations `plugin:@typescript-eslint/recommended` and `plugin:@typescript-eslint/stylistic` ([read more here](https://typescript-eslint.io/linting/typed-linting/)).

Finally, note that type definitions for many `npm` packages are [maintained by the Typescript community](https://github.com/DefinitelyTyped/DefinitelyTyped) and may be found with the `@types/` prefix on [`npm`](https://www.npmjs.com), if they're not already included in the package itself (generally they are). Several of the config files in the project (ex: `.prettierrc.cjs`) manually import type definitions, but you generally will not need to worry about such syntax in your actual source code.

> **More references**
>
> - [T3 Guide to Typescript](https://create.t3.gg/en/usage/typescript)
> - [Official Typescript documentation](https://www.typescriptlang.org/)

### Components and Styling: `shadcn/ui`, Radix, and Tailwind CSS

The project uses UI components from `shadcn/ui`, an open-source library of UI components prebuilt with Radix and Tailwind CSS.

Radix is what developers refer to as a "headless" (or "behavior") UI library. It controls how components **work** (i.e. dropdowns, buttons, checkboxes) and provides a set of unstyled, functional, accessible components (aka **primitives**) to which further styling can be applied. To change how our components **look**, we style them with Tailwind CSS, which is a CSS framework that allows us to rapidly apply CSS styling to our components by adding html classes.

`shadcn/ui` provides a set of UI components prebuilt with Radix and TailwindCSS that can be copy-pasted into our project or added with its CLI (with the terminal command `npx shadcn-ui add`). These components are not "imported" like they are in other component libraries like MUI; they are simply additional code added to our project, which gives us full control over the styling and functionality of each component if necessary. The result is a component library that looks nice with minimal effort but is also easily customizable! Individual `shadcn/ui` components can be customized in `components/ui`, and global theming can be customized in `app/globals.css`.

> **More references**
>
> - [Official `shadcn/ui` documentation](https://ui.shadcn.com)
> - [Radix documentation](https://www.radix-ui.com/docs/primitives/overview/introduction)
> - [Official Tailwind CSS documentation](https://tailwindcss.com/docs/installation)
> - [Tailwind CSS cheat sheet](https://nerdcave.com/tailwind-cheat-sheet)
> - [Tailwind in 100 seconds](https://www.youtube.com/watch?v=mr15Xzb1Ook)
> - [Reusing styles and creating abstractions when using Tailwind](https://tailwindcss.com/docs/reusing-styles)

### Next.js

Next.js is a React-based framework that offers significant optimizations with relatively small learning curve. Notably, it provides a powerful page routing system, ability to create built-in API routes without a separate backend, and a variety of options for fetching data and rendering content on the server.

To run the webapp in development mode, use the following terminal command:

```bash
# Start the webapp in development mode (usually what you do in development). Exit with Ctrl + C
npm run dev
```

To create and run a production build of the webapp (great for testing before deployment), use the following terminal command:

```bash
# Create a production build
npm run build

# Start the production build
npm start
```

#### Tips for learning:

Note that React 18 introduced server components, which form a new paradigm for conceptualizing and constructing webapps. This project uses the Next.js `app/` router, which was introduced in Next.js 13 and uses React server components. Server components are very new and can take a while to wrap one's head around (especially for people already accustomed to React's old "mental model"). However, React and Next.js development is shifting towards this new paradigm, just like how we shifted from using class components and lifecycle methods to using functional components and hooks in React a few years ago. So we at T4SG Eng want to move along with the rest of the developer community and ensure that we're learning/practicing the most relevant skills!

If you are new to React, check out the React documentation first before touching Next.js. The Next.js docs have a great [React Essentials](https://nextjs.org/docs/getting-started/react-essentials) section. When browsing documentation or looking at tutorials for Next.js, try to first look for examples explicitly referencing Next 13 or the `app` router, not the `pages` router (which is the older way of building Next.js webapps).

> **More references**
>
> - [Official Next.js documentation](https://nextjs.org)
> - [Official React documentation](https://react.dev)
> - [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
> - [Next.js GitHub repository](https://github.com/vercel/next.js/) - good place to ask for help!
> - [Example Next.js project](https://github.com/shadcn/taxonomy) built by `shadcn`!

### Supabase

The backend uses [Supabase](https://supabase.com), an open-source Firebase alternative. (Both are BaaS platforms: backend as a service.) Supabase provides all of Firebase's most important functionality and more:

- **Database:** Built on Postgres, a relational database which has better structure than Firebase's Firestore NoSQL database and is open-source (thus more easily maintainable by clients).
- **Realtime:** Analogous to Firestore's `onSnapshot` realtime listeners, allowing you to listen to changes in the **database** (aka Postgres Changes). Supabase also offers Broadcast and Presence, which are other forms of realtime that provide ultra-fast synchronization for features like chatrooms or online games.
- **User authentication:** Like Firebase, a simple auth system with all social providers and user permissions for database access.
- **File storage:** Like Firebase, cloud storage for any kind of digital content.
- **Edge functions:** Server-side Typescript functions that run on Supabase without needing to set up a backend server. Analogous to Firebase Cloud Functions, which are not available on the free tier!
- **Local development:** Ability to easily create locally-hosted Supabase projects with tracked migration history (super useful when working in teams)
- **Typesafety:** The Supabase CLI (command line interface) can be used to generate Typescript types based on your database schema, allowing for typesafe database queries.

> **More references**
>
> - [Official Supabase documentation](https://supabase.com/docs)
> - [Example project](https://github.com/supabase/auth-helpers/tree/main/examples/nextjs) using Supabase auth with Next.js app router
> - [Another example project](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)

##### Troubleshooting the Supabase CLI

Whenever you're running the CLI (such as running the type-generating command above) you might get an error:

```bash
Cannot connect to the Docker daemon at unix:///Users/matthewsu/.docker/run/docker.sock. Is the docker daemon running?
```

Make sure you have Docker running, and start a new terminal and retry the command. If that still doesn't work, you may need to manually point your terminal to Docker in the terminal configuration. Example instructions for using a `zsh` terminal on MacOS:

1. Find your `.zshrc` file. Instructions for finding it are [here](https://osxdaily.com/2021/11/18/where-the-zshrc-file-is-located-on-mac/#:~:text=zshrc%20file%20on%20a%20Mac,customizations%20to%20the%20z%20shell.); note that it is a hidden file, so you may have to press `cmd` + `shift` + `.` in Finder in order to see your hidden files.

2. Open `.zshrc` with notepad and add this line:

   ```bash
   export DOCKER_HOST=unix://"$HOME/.docker/run/docker.sock"
   ```

3. Save and close `.zshrc`, then start a new terminal (make sure you're using a `zsh` terminal and not a `bash` terminal) and retry the command.

Feel free to reach out for help!

### Environment variables

The project uses a package from the popular [T3 stack](https://create.t3.gg/) to validate and provide typesafety to environment variables, so the process of adding an environment variable (for use on the client or server) is slightly more involved than just updating `.env.local`. Instructions for managing environment variables are [here](https://create.t3.gg/en/usage/env-variables).

---

## Development tools

This section provides information on various tools this project uses to streamline the development process.

### Code formatting and linting tools

This starter project uses a [combination](https://stackoverflow.com/questions/48363647/editorconfig-vs-eslint-vs-prettier-is-it-worthwhile-to-use-them-all) of code formatting and linting tools to catch errors and enforce consistent code styling across all collaborators working on the project. Documentation and a quick description of each tool is given below. The configuration files for each tool have also been commented with additional information/references.

The preset configurations should work great out of the box, but feel free to customize them to your liking.

#### [`eslint`](https://eslint.org)

A [linting](<https://en.wikipedia.org/wiki/Lint_(software)>) tool that statically analyzes our code to detect and fix issues with code quality (like unused variables, residual console statements, etc). `eslint` is configured to run on save and before making a `git commit` (see below), but you can also run it manually with the following terminal commands:

```bash
# Easiest way to lint all relevant files in the project. Notifies you of any linting issues.
npm run lint

# Lint all relevant files in the project, fix any auto-fixable issues, and notify you of the remaining issues.
npm run lint:fix

# Specification of these npm scripts are in package.json
```

```bash
# Lint a specific file (or all relevant files by using "."). Add the --fix tag to have eslint correct errors that are automatically fixable.
npx eslint [filepath or .] --fix
```

If you need to exclude certain folders/files from the ESLint rules, you can create a `.eslintignore` file.

If you want to modify the `eslint` rules, you can edit the `rules` array in `.eslintrc.cjs`. If adding a new rule, make sure that it doesn't conflict with `prettier` by running the following command ([more info here](https://github.com/prettier/eslint-config-prettier#cli-helper-tool)):

```bash
# Test eslint-config-prettier against some file in the codebase, for example index.tsx. You usually only need to run this for one file
npx eslint-config-prettier src/index.tsx
```

However, note that **if you encounter an `eslint` error when coding, you shouldn't just immediately ignore it or turn the rule off**. These rules are put in place to catch errors you may not even know about, so you should do some extensive research on the rule (and how you might change your code to conform to it) and only ignore/disable the rule as a **last resort**. Listening to `eslint` builds good code quality habits!

Config file is in `.eslintrc.cjs`.

#### [`prettier`](https://prettier.io)

Formats outputted code to a consistent, opinionated style **after** it has been written. `prettier` is configured to run on save and before making a git commit (see below), but you can also run it manually with the following terminal commands:

```bash
# Check files for formatting errors and give a human-friendly summary of all errors.
npm run prettier

# Fix formatting errors in-place for all files.
npm run prettier:fix

# Specification of these npm scripts are in package.json
```

Note that `prettier` and `eslint` have [overlapping functionalities](https://www.robinwieruch.de/prettier-eslint/), so to prevent conflict between the two we also add [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier#cli-helper-tool), which disables all `eslint` rules that would conflict with `prettier`

Finally, our `prettier` configuration also includes a [plugin](https://github.com/trivago/prettier-plugin-sort-imports) for sorting import declarations.

If you need to exclude certain folders/files from the `prettier` formatting, you can create a `.prettierignore` file. The `prettier` config file is in `.prettierrc.cjs`.

#### [EditorConfig](https://editorconfig.org)

Standardizes some settings (only in the project workspace) across different editors (Sublime, VSCode, etc) to apply formatting rules **before** writing code (e.g. hitting `tab` leaves two spaces). Config file is in `.editorconfig`. Both EditorConfig and `prettier` work in tandem to enforce consistent styling/formatting across your entire team, which will help prevent some annoying formatting situations (ex: every line in a pull request being marked as a `diff` because one team member uses tab indents and another uses space indents).

#### Github CI workflow

We implemented a [Github Actions](https://docs.github.com/en/actions) workflow for CI ([continuous integration](<https://www.atlassian.com/continuous-delivery/continuous-integration#:~:text=Continuous%20integration%20(CI)%20is%20the,builds%20and%20tests%20then%20run.>)) that will process any pull requests made to `main`. The workflow auto-formats the code in the pull request with `prettier` and checks for any `eslint` errors. This allows SWEs to freely make commits on side branches (without enforced formatting or linting) but still prevents code with poor quality or formatting from being pushed to `main`.

If you have `eslint` and `prettier` VSCode extensions installed on VSCode (see below), your editor should auto-format and notify you of linting errors as you code, but you can also run formatting manually (see `eslint` and `prettier` sections above). Finally, you can use the following terminal command, which will auto format all your code and notify you of any linting issues that need to be fixed for your pull request to pass the integration test.

```bash
# Format all relevant files with Prettier and check all relevant files for eslint errors
npm run format

# Specification of npm scripts are in package.json
```

For SSWEs, you should protect your `main` branch from unprotected pushes using a Github [branch protection rule](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule). We recommend you use the settings detailed in the setup instructions.

#### VSCode-specific settings

The project contains workspace-specific VSCode settings in `.vscode/settings.json`. These settings (which only apply when inside the project workspace) set the editor to:

- Format with `prettier`, then lint with `eslint` on save (this is the quickest way)

  - (Note that we use an extension, [Format Code Action](https://marketplace.visualstudio.com/items?itemName=rohit-gohri.format-code-action&ssr=false#review-details), to achieve this specific order)

- Use `prettier` as the default formatter
- Prompt the user to use the codebase's version of Typescript for Intellisense (preventing errors arising from differing Typescript versions)

### VSCode Extensions

#### `eslint`, `prettier`, `editorconfig`, and `tailwindcss`

These add in-editor support (syntax highlighting, error checking, etc.) for their respective tools. The recommended workspace extensions are configured in `.vscode/extensions.json`.

#### [BetterComments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments)

Allows you to categorize your comments into color-coded Alerts, Queries, TODOs, and Highlights for more human-friendly annotations.

#### [Live Share](https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsliveshare)

Enables you to collaboratively edit and debug with others in real time. Think Google Docs functionality but for your codebase.

#### [Format Code Action](https://marketplace.visualstudio.com/items?itemName=rohit-gohri.format-code-action&ssr=false#review-details)

Allows us to run `eslint` after `prettier` on save, which is the fastest order.

#### [Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens)

Improves error highlighting and displays diagnostic text inline.

#### [Pretty Typescript Errors](https://marketplace.visualstudio.com/items?itemName=yoavbls.pretty-ts-errors)

Formats Typescript errors to be more human-readable.

---

## Deployment guides

Deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker). The easiest way to deploy is with Vercel, which was created by the creators of Next.js!

When deploying, make sure you set the appropriate environment variables for your deployment corresponding to those found in `.env`. That is, if you're using a separate Supabase project for production, use the environment variables for that project, but if you're just using your development database, you can paste in the contents of your local `.env` file.

Additionally, you need to make sure you configure Supabase's redirect URLs to accept login requests from your deployed site. Specifically, it needs to accept `https://my-domain-name.com/auth/callback`, since Supabase redirects to the `/auth/callback` route after login.

The easiest way to do this is to login to your Supabase dashboard and navigate to Authentication (left sidebar) > URL Configuration > Redirect URLs > Add URL, and add the following URL: `https://my-domain-name.com/auth/callback`.

Read more about it [here](https://supabase.com/docs/guides/auth#redirect-urls-and-wildcards).

Finally, make sure that you've reconfigured your Google Cloud Project to accept authentication for your deployed website! Specifically, you need to add your site URL to the **Authorized Javascript Origins**.

---

## Additional stack options (for SSWEs)

Check out [this article](https://t4sg.notion.site/Tech-Stack-Recommendations-279121b43d254bdc96f41fea2af17f77?pvs=4) in our Eng Wiki for additional stack recommendations!

## Updating this project (for DOEs + future maintainers)

Ideally this project's dependencies should be updated during summer/winter breaks to prepare for the semester.

You can run `npm outdated` to see what packages are out of date in package.json. The `Wanted` column shows the package versions that are allowed by the [semantic versioning](https://docs.npmjs.com/about-semantic-versioning) in `package.json`. You can update to those versions with `npm update`, a command which respects semantic versioning. After updating dependencies, you should fully test the project from initial setup to user login.

Occasionally (e.g. at least once a year, and especially after major releases of core dependencies), you should update all packages to their latest versions disregarding semantic versioning; [this guide](https://medium.com/subjective-developer/update-all-node-packages-to-latest-aa128396b92b) is helpful. Note that this can introduce bugs/breaking changes into the app, so you should test thoroughly and revisit the codebase itself.

It would be cool to add a testing suite (e.g. Cypress) to handle necessary testing after updating dependencies!
