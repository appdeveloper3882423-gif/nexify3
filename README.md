# Nexify Tech Solutions — Website + Admin CMS

A responsive animated company website for GitHub + Firebase + Vercel. Team members are represented by animated initials only: **no team photos are used**. The Nexify circuit-N logo icon is extracted from the supplied company artwork, with the wordmark/tagline excluded. Product cards support artwork upload through the admin console. Zylokids is preconfigured with its Google Play listing URL; upload its official app artwork in Admin → Products when you have the original image file.

## Files

- `index.html`, `styles.css`, `site.js`: public animated website.
- `admin.html`, `admin.js`: Firebase-authenticated content management console.
- `product.html`, `product.js`: product detail page.
- `firebase-config.js`: supplied Firebase web configuration.
- `firestore.rules`, `storage.rules`: database and product-image access rules.
- `firebase.json`, `vercel.json`: hosting deployment settings.
- `assets/nexify-icon.jpg`: icon-only crop from your company logo.
- `scripts/seed-content.js`: initial content seed.
- `scripts/set-admin-claim.js`: securely grant admin claim using Firebase Admin SDK.

## 1. Firebase Console setup

1. Open Firebase project `nexify-60191`.
2. In **Authentication → Sign-in method**, enable **Email/Password**.
3. In **Authentication → Users**, create your admin account with a strong password.
4. Create/enable **Cloud Firestore** database.
5. Enable **Storage** and complete its initial setup (billing/plan requirements may apply to your project).
6. In Project settings → Your apps, verify that the web app config in `firebase-config.js` matches this project.

## 2. Seed content and grant administrator access

Use a trusted local computer. Do not commit your service account key to GitHub or upload it to Vercel.

1. Firebase Console → Project settings → Service accounts → Generate new private key. Save it locally as `serviceAccountKey.json` in this folder temporarily.
2. Install Node.js, then run:

```bash
npm install
node scripts/seed-content.js ./serviceAccountKey.json
node scripts/set-admin-claim.js ./serviceAccountKey.json YOUR_ADMIN_EMAIL
```

3. Delete the local `serviceAccountKey.json` when finished. It is ignored by `.gitignore`.
4. Sign out of the Admin Console and sign in again so Firebase refreshes the custom claim.

The admin console checks the server-issued `admin: true` custom claim. Do not replace this with a client-side role field. Only a trusted Admin SDK process should grant the claim.

## 3. Apply Firebase security rules

From this folder, install Firebase CLI and sign in:

```bash
npm install -g firebase-tools
firebase login
firebase use nexify-60191
firebase deploy --only firestore:rules,storage
```

The Firestore rules allow visitors to create validated inquiries and read published public content. Only admins can manage site content and read inquiries. Storage rules allow public reads of product artwork and admin-only image uploads (5 MB max).

## 4. GitHub

1. Create a new **private or public** GitHub repository named `nexify-tech-solutions`.
2. Copy the contents of this folder into the repository root (not the parent folder).
3. Confirm `serviceAccountKey.json` is not present.
4. Commit and push the code.

```bash
git init
git add .
git commit -m "Launch Nexify Tech Solutions website and admin CMS"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/nexify-tech-solutions.git
git push -u origin main
```

## 5. Vercel deployment

1. Sign in to Vercel and choose **Add New → Project**.
2. Import the GitHub repository.
3. Framework preset: **Other**. Build command: leave empty. Output directory: `.` (project root).
4. Deploy. Vercel provides a free `*.vercel.app` address; connect a custom domain later if you buy one.
5. Every push to the connected production branch triggers a new deployment.

Firebase Hosting can also serve the same static files if you prefer it, but Vercel is the primary website host in this setup. Firebase remains the backend for Auth, Firestore and Storage.

## 6. Admin panel

Open `https://YOUR-VERCEL-DOMAIN/admin.html` and sign in with the Firebase admin account. You can add/edit/delete/publish/unpublish services, products, team text profiles and social links; upload product artwork; review/delete inquiries; and update global company/contact/SEO settings. Team records contain names, roles and initials only — no team photo field is exposed in the editor.

The CMS is extensible: additional collections and page modules can be added in code. This admin panel controls the modules currently implemented; it cannot safely invent brand-new code features or arbitrary page layouts by itself. For a future custom section/module, add its schema/renderer and then it can be managed through the CMS.

## Important notes

- The Firebase web API key is expected to be visible in frontend code. Security comes from Firestore/Storage rules and verified authentication, not hiding the key.
- Enable Firebase Authentication, Firestore and Storage before expecting live admin/contact functionality.
- Initial public content is included as a static fallback and in the seed script. Run the seed script once so the admin panel can edit the initial records.
- Product art is editable/uploadable from Admin → Products. The provided Zylokids store URL is official from the project details; this code does not pretend a placeholder illustration is the official app icon.
- Animations include motion, hover interactions, scroll reveals and responsive transitions. The site honors `prefers-reduced-motion` for accessibility.
