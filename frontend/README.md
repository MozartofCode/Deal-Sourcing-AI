# Deal Sourcing AI - Frontend

React frontend for the Deal Sourcing AI application with a ChatGPT-like interface.

## Setup

1. Install dependencies:
```bash
npm install
```

## Running the Development Server

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Building for Production

Build the production bundle:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Features

- ChatGPT-like chat interface
- Left sidebar with conversation history
- Responsive design (mobile-friendly)
- Real-time message display
- API integration ready

## Environment Variables

Create a `.env` file in the frontend directory to configure the API URL:
```
VITE_API_URL=http://localhost:8000
```

If not set, it defaults to `http://localhost:8000`

## Project Structure

```
src/
├── components/
│   ├── ChatInterface.jsx  # Main chat area
│   ├── Sidebar.jsx        # Conversation history sidebar
│   ├── Message.jsx        # Individual message component
│   └── SearchBar.jsx      # Chat input component
├── services/
│   └── api.js             # API service layer
├── App.jsx                # Main application component
├── main.jsx               # Application entry point
└── index.css              # Global styles
```

