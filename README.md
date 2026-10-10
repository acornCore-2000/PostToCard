# PostToCard

Turn X (Twitter) posts into shareable image cards.
PostToCard is a web application that takes an X (Twitter) post URL and transforms the post into a visually styled card that can be downloaded as an image.

## Features

- **Post Preview:** Fetch post information from an X (Twitter) URL.
- **Author Information:** Display the author's name, username, profile picture, and verification badge.
- **Post Content:** Display post text, media, and engagement statistics.
- **Light and Dark Themes:** Switch between light and dark card styles.
- **Image Export:** Download the generated card as an image.
- **QR Code:** Generate a QR code linking to the original post.
- **Emoji Support:** Render emojis in post content.
- **Multilingual Content:** Support for English and Persian text.

## Screenshots

### Main Page

![PostToCard Main Page](frontend/public/mainpage.png)

### Dark Mode

![PostToCard Dark Mode](frontend/public/dark_mode.png)

### Light Mode

![PostToCard Light Mode](frontend/public/light_mode.png)

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- Axios
- `html-to-image`
- `qr-code-styling`
- `react-icons`
- `@twemoji/api`
- `react-loading-skeleton`
- Inter and Vazirmatn fonts

### Backend

- Node.js
- Express
- TypeScript

## Getting Started

### Prerequisites

- Node.js
- npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/acornCore-2000/PostToCard.git
cd PostToCard
```

### 2. Set Up the Backend

```bash
cd backend
npm install
npm run dev
```

The backend should run on `http://localhost:5000`.

### 3. Configure the Frontend

Open a separate terminal:

```bash
cd frontend
npm install
```

In the frontend `.env` file, configure the API URL used by Axios:

```env
VITE_API_URL=http://localhost:5000
```

**Important:** When running locally, make sure Axios uses `http://localhost:5000` instead of the deployed backend URL.

Start the frontend:

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

> The commands above assume the backend uses `npm run dev` and listens on port `5000`. Adjust them if your project configuration differs.

## Usage

1. Open PostToCard in your browser.
2. Paste the URL of an X (Twitter) post.
3. Generate the post card.
4. Choose between light and dark themes.
5. Download the card as an image.
6. Scan the QR code to open the original post.

## Deployment

- **Frontend:** Netlify
- **Backend:** DockHosting

The frontend communicates with the backend through the API URL configured in the frontend environment variables.

## Supported Platform

PostToCard currently supports **X (Twitter) only**.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
