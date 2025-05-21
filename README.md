# Spanish-English Translator App

## Project info

**URL**: https://lovable.dev/projects/825d36ee-fde2-4761-b69a-b7dac4b9810c

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/825d36ee-fde2-4761-b69a-b7dac4b9810c) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Transformers.js (for AI-powered translation)

## Translation Features

This application is a powerful English-Spanish translator that runs entirely in your browser using AI models from Hugging Face.

### Key Features

- **Bidirectional Translation**: Translate from English to Spanish or Spanish to English
- **Client-Side Processing**: All translation happens in your browser - no server required
- **Progress Tracking**: Detailed progress indicators show you exactly what's happening during translation
- **Optimized for Long Texts**: Can handle large blocks of text by processing in chunks
- **Responsive Design**: Works on desktop and mobile devices
- **Upload .txt File**: Load text from a `.txt` file using the 'Upload .txt file' button
- **Copy to Clipboard**: Copy the translated output with a single click via the copy icon
- **Save as Text File**: Download the translation as a `.txt` file using the save icon

### First-Time Translation

When you use the translator for the first time:

1. The browser will download the necessary AI model files from Hugging Face (this may take a moment)
2. You'll see a progress bar indicating the download and processing status
3. Once downloaded, the model is cached in your browser for faster future translations

### Performance Notes

- First translation: Expect a delay as the model downloads (typically 5-15 seconds depending on your connection)
- Subsequent translations: Much faster as the model is already cached
- Long texts: Processed in chunks for optimal performance

## How can I deploy this project?

### Deploy with Lovable

Simply open [Lovable](https://lovable.dev/projects/825d36ee-fde2-4761-b69a-b7dac4b9810c) and click on Share -> Publish.

### Deploy to Render

This app can be deployed to [Render](https://render.com) as a static site:

1. **Prepare for deployment**
   ```bash
   ./deploy.sh
   ```
   This script builds the app and creates necessary configuration files.

2. **Create a new Static Site on Render**
   - Sign up/in to [Render](https://render.com)
   - Select "New" > "Static Site"
   - Connect your GitHub/GitLab repository

3. **Configure deployment settings**
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variables**: Add `VITE_HF_TOKEN` if you're using private Hugging Face models

4. **Deploy**
   - Click "Create Static Site"
   - Render will build and deploy your app

Your translator will be available at the URL provided by Render (e.g., `https://your-app-name.onrender.com`).

> **Note**: Since this app runs entirely in the browser, no backend or API is needed. All translation happens client-side using Transformers.js.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Development & Testing

**Prerequisites**
- Node.js v14+ and npm

**Installation**
```bash
npm install
```
> **Note**: If you don't see `node_modules` here, they may be located at `../node_modules` (e.g. `/root/CascadeProjects/TRANSLATOR-2/Translator-Lovable/node_modules`).

**Running the app**
```bash
npm run dev
```

**Running tests**
```bash
npm test
npm run test:coverage
```

**Scripts**
```bash
./run-tests.sh      # Run ALL tests in single-run mode
./run-few-tests.sh  # Run only critical tests for faster verification
./run-app.sh        # Kill existing port and start dev server, auto-open browser
```

**Testing Strategy**
- `run-tests.sh` runs the complete test suite, including all component, integration, and utility tests
- `run-few-tests.sh` runs only a strategic subset of tests for quick verification during development
- Both scripts run in single-run mode (not watch mode) for CI/CD compatibility

**Environment Variables**
- `VITE_HF_TOKEN`: Your Hugging Face API token (for private or large models).

## Accessibility Highlights

- ARIA labels on text areas and buttons
- Live regions (`aria-live`) for progress updates and character count
- Semantic sections with landmarks and hidden headings for screen readers

## Caching & Retry Mechanism

- Browser-side cache of translated chunks to speed up repeated translations
- Retry logic with up to 2 attempts per chunk on failures, marking errors after retries

## Clean Code Plan

See [CLEAN_CODE_PLAN.md](./CLEAN_CODE_PLAN.md) for details on clean code refactoring steps and their statuses.

<!-- End of documentation updates -->
