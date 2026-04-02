# How to Run AutoPilotX Locally on Your PC

Follow these detailed steps to download, set up, and run this application on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed on your PC:
1. **Node.js**: Version 18.17.0 or higher (Version 20+ recommended). You can download it from [nodejs.org](https://nodejs.org/).
2. **npm**: Comes pre-installed with Node.js.
3. **A Code Editor**: Such as [Visual Studio Code (VS Code)](https://code.visualstudio.com/).
4. **Git**: (Optional but recommended) for version control.

---

## Step 1: Download the Project

Since you are currently in the Google AI Studio Build environment:
1. Look for the **Export** or **Download** button in the AI Studio interface (usually found in the top right menu or settings).
2. Download the project as a `.zip` file.
3. Extract the `.zip` file to a folder on your PC (e.g., `Documents/AutoPilotX`).

---

## Step 2: Open the Project

1. Open your terminal (Command Prompt, PowerShell, or macOS/Linux Terminal).
2. Navigate to the extracted folder:
   ```bash
   cd path/to/your/extracted/folder
   ```
3. Alternatively, open the folder directly in VS Code and open the integrated terminal (`Ctrl + \`` or `Cmd + \``).

---

## Step 3: Install Dependencies

In your terminal, run the following command to install all the required packages (Next.js, React, Tailwind, Google GenAI SDK, etc.):

```bash
npm install
```
*(This might take a minute or two depending on your internet speed).*

---

## Step 4: Set Up Environment Variables

The application requires certain environment variables to function correctly, especially the Gemini API key for the AI agents.

1. In the root of your project folder, create a new file named `.env.local`.
2. Open `.env.local` and add your Gemini API key:

   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
   ```
   
   *Note: You can get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).*

3. **Firebase Configuration (Optional but recommended)**: 
   If the app uses Firebase, ensure your `firebase-applet-config.json` is present in the root directory, or set up your own Firebase project and update the configuration files accordingly.

---

## Step 5: Run the Development Server

Once the dependencies are installed and the environment variables are set, start the local development server:

```bash
npm run dev
```

---

## Step 6: View the Application

1. Open your web browser (Chrome, Edge, Safari, etc.).
2. Navigate to: **[http://localhost:3000](http://localhost:3000)**
3. You should now see the AutoPilotX dashboard running locally on your PC!

---

## Troubleshooting

- **Port 3000 is already in use**: If you get an error saying port 3000 is in use, Next.js will usually ask if you want to use another port (like 3001). Type `y` to accept, or manually stop whatever is running on port 3000.
- **Missing API Key Errors**: If the AI agents aren't responding, double-check that your `.env.local` file is named exactly that (not `.env.local.txt`) and that your API key is valid. Restart the server (`Ctrl + C`, then `npm run dev`) after changing environment variables.
- **Module not found errors**: Try deleting the `node_modules` folder and the `package-lock.json` file, then run `npm install` again.
