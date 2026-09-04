import { Link } from 'react-router-dom'
import { useSeo } from '@/hooks/useSeo'

const envVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_CLOUDINARY_CLOUD_NAME',
  'VITE_CLOUDINARY_UPLOAD_PRESET',
]

export default function DashSetup() {
  useSeo({ title: 'Dashboard setup  Mankaa Che', description: 'Dashboard setup instructions.', noindex: true })

  return (
    <div className="min-h-screen bg-void px-6 py-16 text-ink">
      <div className="mx-auto max-w-2xl">
        <p className="mb-3 text-sm uppercase tracking-[0.25em] text-dim">Dashboard setup</p>
        <h1 className="font-display text-3xl font-medium sm:text-4xl">
          Connect Firebase &amp; Cloudinary to unlock /dash
        </h1>
        <p className="mt-4 text-muted">
          The dashboard needs a free Firebase project (for login + storing
          projects) and a free Cloudinary account (for image uploads). Once
          the environment variables below are set, this screen won't show up
          again.
        </p>

        <ol className="mt-10 space-y-8 text-sm text-muted">
          <li>
            <p className="font-display text-base font-medium text-ink">1. Create a Firebase project</p>
            <p className="mt-1.5">
              Go to{' '}
              <span className="text-ink/90">console.firebase.google.com</span> →
              Add project (the free Spark plan is enough).
            </p>
          </li>
          <li>
            <p className="font-display text-base font-medium text-ink">2. Enable Firestore</p>
            <p className="mt-1.5">
              Build → Firestore Database → Create database (start in production
              mode). Then open the Rules tab and paste:
            </p>
            <pre className="mt-3 overflow-x-auto rounded-xl border border-line bg-surface p-4 text-xs text-ink/90">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /projects/{projectId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}`}
            </pre>
          </li>
          <li>
            <p className="font-display text-base font-medium text-ink">3. Enable Email/Password sign-in</p>
            <p className="mt-1.5">
              Build → Authentication → Get started → Sign-in method → enable
              "Email/Password". Then go to the Users tab and add yourself as a
              user  this dashboard has no public sign-up screen on purpose.
            </p>
          </li>
          <li>
            <p className="font-display text-base font-medium text-ink">4. Get your web app config</p>
            <p className="mt-1.5">
              Project settings → General → Your apps → add a Web app → copy
              the config values.
            </p>
          </li>
          <li>
            <p className="font-display text-base font-medium text-ink">5. Create a free Cloudinary account</p>
            <p className="mt-1.5">
              Go to <span className="text-ink/90">cloudinary.com</span> → sign
              up → copy your Cloud Name from the dashboard. Then Settings →
              Upload → Upload presets → Add upload preset → set Signing Mode
              to <span className="text-ink/90">Unsigned</span> → save, and
              copy its name.
            </p>
          </li>
          <li>
            <p className="font-display text-base font-medium text-ink">6. Add the environment variables</p>
            <p className="mt-1.5">
              Create a <span className="text-ink/90">.env.local</span> file in
              the project root (see{' '}
              <span className="text-ink/90">.env.example</span>) with:
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {envVars.map((name) => (
                <code
                  key={name}
                  className="rounded-lg border border-line bg-surface px-2.5 py-1 text-xs text-ink/90"
                >
                  {name}
                </code>
              ))}
            </div>
            <p className="mt-3">
              Restart the dev server afterwards  then this page will send
              you straight to the login screen.
            </p>
          </li>
        </ol>

        <Link
          to="/"
          className="mt-12 inline-block rounded-full border border-line px-5 py-2.5 text-sm text-ink transition-colors hover:border-violet/60 hover:bg-violet/10"
        >
          Back to site
        </Link>
      </div>
    </div>
  )
}
