# Environment Variables

This document describes all environment variables required for this project.

## Supabase Configuration

### `NEXT_PUBLIC_SUPABASE_URL`

- **Description**: Your Supabase project URL
- **Example**: `https://xnjqckplnufgsrwngofj.supabase.co`
- **Required**: Yes

### `NEXT_PUBLIC_SUPABASE_ANON_KEY`

- **Description**: Your Supabase anonymous/public key (publishable key)
- **Example**: `sb_publishable_eInsQ38N0FboM43UOEhc7w_rZNdgwjy`
- **Required**: Yes

## Firebase Configuration

### `NEXT_PUBLIC_FIREBASE_API_KEY`

- **Description**: Firebase API key
- **Required**: Yes

### `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`

- **Description**: Firebase authentication domain
- **Required**: Yes

### `NEXT_PUBLIC_FIREBASE_PROJECT_ID`

- **Description**: Firebase project ID
- **Required**: Yes

### `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`

- **Description**: Firebase storage bucket URL
- **Required**: Yes

### `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`

- **Description**: Firebase messaging sender ID
- **Required**: Yes

### `NEXT_PUBLIC_FIREBASE_APP_ID`

- **Description**: Firebase app ID
- **Required**: Yes

## Inference Layer

### `INFERENCE_LAYER_URL`

- **Description**: URL for the inference layer API
- **Default**: `http://localhost:8000`
- **Required**: No (has default value)

## Setup Instructions

1. Copy `.env.local` and add your environment variables:

   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in all required values in `.env.local`

3. For Supabase:
   - Get your project URL and anon key from your Supabase project settings
   - Add them as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Important**: Configure OAuth redirect URLs in Supabase Dashboard:
     - Go to Authentication > URL Configuration
     - Add both redirect URLs:
       - `http://localhost:3000/auth/callback` (for local development)
       - `https://duo-keyboard-koalition.com/auth/callback` (for production)
     - This ensures localhost stays on localhost and production stays on production

4. For Firebase:
   - Get your Firebase config from the Firebase Console
   - Add all Firebase environment variables with the `NEXT_PUBLIC_` prefix

5. For Inference Layer:
   - Set `INFERENCE_LAYER_URL` if you're using a custom inference layer endpoint
   - Otherwise, it will default to `http://localhost:8000`

## Notes

- All `NEXT_PUBLIC_*` variables are exposed to the browser/client-side code
- Never commit `.env.local` to version control (it should be in `.gitignore`)
- Use `.env.local` for local development
- Use your hosting platform's environment variable settings for production
