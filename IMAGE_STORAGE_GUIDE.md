# Image Storage Setup Guide

Your real estate app now supports multiple image storage options. Here's how to set up each one:

## 🏠 Local Storage (Current - Free)
**Pros:** Completely free, simple setup
**Cons:** Images stored with your app, larger deployment size

**Setup:**
1. Set `NEXT_PUBLIC_IMAGE_PROVIDER=local` in `.env.local`
2. Add images to `public/images/` folder
3. Images accessible via `/images/filename.jpg`

## ☁️ Cloudinary (Recommended - Free Tier)
**Pros:** 25GB storage + 25GB bandwidth free, image optimization, CDN
**Cons:** Requires account setup

**Setup:**
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Create an "unsigned upload preset" in Settings > Upload
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_IMAGE_PROVIDER=cloudinary
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
   ```

## 📸 Imgur (Free - Unlimited)
**Pros:** Unlimited uploads for non-commercial use
**Cons:** Requires API registration

**Setup:**
1. Register app at [api.imgur.com](https://api.imgur.com/oauth2/addclient)
2. Get Client ID
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_IMAGE_PROVIDER=imgur
   NEXT_PUBLIC_IMGUR_CLIENT_ID=your-client-id
   ```

## 🎨 Unsplash (Demo Mode)
**Pros:** Beautiful random property images
**Cons:** Random images, not your actual uploads

**Setup:**
1. Set `NEXT_PUBLIC_IMAGE_PROVIDER=unsplash` in `.env.local`
2. Perfect for development/demos

## 🔥 Firebase Storage (Current Fallback)
**Pros:** Integrated with your Firebase project
**Cons:** Limited free tier (5GB)

**Setup:**
1. Set `NEXT_PUBLIC_IMAGE_PROVIDER=firebase` in `.env.local`
2. Uses your existing Firebase configuration

## Cost Comparison:

| Provider | Free Tier | Best For |
|----------|-----------|----------|
| Local | Unlimited | Small sites |
| Cloudinary | 25GB + 25GB bandwidth | Production apps |
| Imgur | Unlimited non-commercial | Personal projects |
| Unsplash | Unlimited (demo images) | Development |
| Firebase | 5GB | Small to medium apps |

## Recommendation:
- **Development:** Use `unsplash` for beautiful demo images
- **Production:** Use `cloudinary` for best performance and features
- **Personal/Small:** Use `imgur` for unlimited free storage
