# WeShare - Static HTML Version

This is a standalone HTML version of the WeShare website, converted from the original Next.js project.

## 📁 Files Included

- **index.html** - Main HTML file with embedded CSS (no external dependencies)
- **weshare-web1.1.png** - Main app preview image
- **favicon.ico** - Website favicon
- **og.svg** - Open Graph image for social media sharing

## 🚀 How to Deploy

### Option 1: Simple File Hosting
Upload all files in this directory to any web hosting service:
- **GitHub Pages**: Push to a GitHub repo and enable Pages
- **Netlify**: Drag and drop the folder to Netlify
- **Vercel**: Deploy as a static site
- **AWS S3**: Upload to an S3 bucket with static hosting enabled
- **Any traditional web host**: Upload via FTP/SFTP

2. **Configure environment variables:**
   
   Create `.env.local` with your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)**

## Documentation

See [SETUP.md](./SETUP.md) for detailed setup instructions, Firebase configuration, and deployment guide.

## Tech Stack

- **Framework:** Next.js 15 with React 19
- **Styling:** Tailwind CSS
- **Authentication:** Firebase Auth
- **Database:** Cloud Firestore
- **Maps:** Leaflet & OpenStreetMap
- **Icons:** Lucide React
- **Language:** TypeScript

## Project Structure

```
app/              # Next.js pages
src/
  ├── components/ # Reusable UI components
  ├── contexts/   # React contexts (Auth)
  ├── lib/        # Firebase config
  └── types/      # TypeScript definitions
```

## License

1. **Text content**: Find and replace text directly in the HTML
2. **Colors**: Modify the CSS variables in the `:root` section
3. **Images**: Replace the image files with your own (keep the same filenames)
4. **Fonts**: The site uses Google Fonts (Plus Jakarta Sans) - change the link in `<head>`

## 📝 Key Differences from Next.js Version

- No server-side rendering (SSR)
- No dynamic routing
- Images are standard `<img>` tags instead of Next.js Image component
- All CSS is embedded in the HTML file
- JavaScript is minimal (only for dynamic year in footer)

## 🌐 Domain Configuration

Don't forget to update the meta tags in `index.html`:
- Line 10: Update `content="https://your-domain.com/"` with your actual domain
- Line 13-15: Update Open Graph URLs
- Line 18-21: Update Twitter card URLs

## 📱 Browser Support

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Troubleshooting

**Images not loading?**
- Make sure all files are in the same directory
- Check that image filenames match exactly (case-sensitive on some servers)

**Styles look broken?**
- Ensure the HTML file wasn't corrupted during upload
- Check browser console for any errors

**Links not working?**
- The download links are placeholders (`href="#"`)
- Update them with actual App Store/Google Play links when available

## 📄 License

Same as the original WeShare project.
