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

### Option 2: Local Testing
Open `index.html` directly in your browser, or run a local server:

```bash
# Python 3
python3 -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080

# Node.js (if you have npx)
npx serve

# PHP
php -S localhost:8080
```

Then visit `http://localhost:8080` in your browser.

## ✨ Features

- **No build process required** - Just upload and go!
- **No dependencies** - Everything is self-contained in index.html
- **Responsive design** - Works on mobile, tablet, and desktop
- **Fast loading** - Minimal file size with embedded CSS
- **SEO friendly** - Proper meta tags and semantic HTML
- **Accessible** - Follows web accessibility best practices

## 🎨 Customization

To customize the site, simply edit `index.html`:

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
