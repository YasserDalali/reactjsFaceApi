# React Face API Project

## Environment Setup

1. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

2. Add your Gemini API key to the `.env` file:

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

3. Never commit the `.env` file to version control. It's already added to `.gitignore`.

## Development

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

## Features

- Face detection and recognition
- Attendance tracking
- AI-powered employee analytics
- Real-time monitoring
- Performance insights

## Security Notes

- Keep your API keys secure and never commit them to version control
- Use environment variables for sensitive information
- Regularly rotate your API keys
- Monitor API usage to prevent abuse
