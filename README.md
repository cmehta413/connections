# Connections Game

A web-based word puzzle game inspired by NYT Connections, featuring a hot pink theme and no login required.

## 🎮 How to Play

1. Find four groups of four words that share a common theme
2. Click on words to select them (up to 4 at a time)
3. Click "Submit" to check if your selection is correct
4. You have 4 mistakes before the game ends
5. Find all four groups to win!

## 🚀 Hosting on GitHub Pages

### Option 1: Quick Setup (Recommended)

1. **Create a GitHub repository:**
   - Go to [GitHub](https://github.com) and create a new repository
   - Name it anything you like (e.g., `connections-game`)
   - Make it public (required for free GitHub Pages)

2. **Push your code:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click on **Settings** tab
   - Scroll down to **Pages** in the left sidebar
   - Under **Source**, select **Deploy from a branch**
   - Choose **main** branch and **/ (root)** folder
   - Click **Save**
   - Your site will be available at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

### Option 2: Using GitHub Actions (Advanced)

If you want more control, you can use GitHub Actions, but for a simple static site, Option 1 is sufficient.

## 📁 Project Structure

```
connections/
├── index.html      # Main HTML file
├── styles.css      # Styling with hot pink theme
├── game.js         # Game logic and functionality
└── README.md       # This file
```

## 🎨 Features

- **No Login Required**: Play instantly without any authentication
- **Hot Pink Theme**: Beautiful gradient pink design
- **Local Stats**: Game statistics saved in browser localStorage
- **Responsive Design**: Works on desktop and mobile devices
- **Hints & Help**: Built-in hint system and help modal

## 🛠️ Local Development

To run locally, simply open `index.html` in your web browser. No build process or server required!

## 📝 Customization

You can customize the game by editing `game.js`:
- Modify `gameData.groups` to change word groups and categories
- Adjust difficulty levels
- Change game mechanics

## 📄 License

Feel free to use and modify this project as you like!

