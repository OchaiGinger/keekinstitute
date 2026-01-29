# Authentication Flow Architecture

## Complete Auth State Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                     ROOT LAYOUT (layout.tsx)                        │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  ClerkProvider (with signInUrl, signUpUrl, afterSignOutUrl)  │  │
│  │  ├─ ConvexClientProvider                                    │  │
│  │  │  ├─ ToastProvider                                       │  │
│  │  │  ├─ Navbar (CLIENT COMPONENT - SignedIn/Out)            │  │
│  │  │  │  ├─ SignedIn:  [Dashboard Button] [UserButton]       │  │
│  │  │  │  └─ SignedOut: [Get Started Button]                  │  │
│  │  │  └─ main                                                 │  │
│  │  │     └─ children (pages/routes)                          │  │
│  │  └───────────────────────────────────────────────────────────┘  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                              ▼
              ┌──────────────────────────────┐
              │      Clerk Auth State        │
              │  ┌────────────────────────┐  │
              │  │ Token, User, Session   │  │
              │  └────────────────────────┘  │
              └──────────────────────────────┘
                              ▼
        ┌─────────────────────────────────────────────┐
        │     MIDDLEWARE (middleware.ts)              │
        │  Check if route is protected (/dashboard)  │
        │  If yes: await auth.protect()               │
        │  If no: Allow through                       │
        └─────────────────────────────────────────────┘
                              ▼
           ┌───────────────────────────────────┐
           │  ROOT PAGE (page.tsx)             │
           │                                   │
           │  if (userId) → /dashboard ✅     │
           │  else → show HeroContent          │
           └───────────────────────────────────┘
```

## Request Flow by User State

### Scenario 1: User NOT Logged In

```
Browser: GET /
    ↓
Root Layout Loads
    ↓ Clerk initializes
Navbar Component Renders
    ↓
<SignedOut> condition = TRUE
    ↓
Display: "Get Started" button (visible)
Display: UserButton (hidden)
    ↓
Click "Get Started" → handleGetStarted action
    ↓
No userId found
    ↓
Redirect to /signup
    ↓
SignUp Page
    ↓
User enters email/password
    ↓
Clerk creates session
    ↓
Page reload with new auth token
    ↓
Root Layout detects userId
    ↓
Navbar re-renders (SignedIn = TRUE)
    ↓
Redirect to /dashboard (automatic)
```

### Scenario 2: User Logged In

```
Browser: GET / (already has auth cookie)
    ↓
Root Layout Loads
    ↓ Clerk detects auth token
page.tsx (Home)
    ↓
auth().userId is NOT null
    ↓
redirect("/dashboard")
    ↓
NEVER shows HeroContent
    ↓
Middleware checks /dashboard
    ↓
Route is protected → auth.protect() passes ✅
    ↓
Dashboard Layout
    ↓
getSafeProfile() gets user from Convex
    ↓
Routes to role-based dashboard
    ↓
Navbar shows: Dashboard button + UserButton
    ↓
<SignedIn> condition = TRUE (auto-managed by Clerk)
```

### Scenario 3: User Tries Direct /dashboard Access Without Auth

```
Browser: GET /dashboard (no auth token)
    ↓
Middleware checks: Is /dashboard protected?
    ↓
Yes → await auth.protect()
    ↓
No auth token found
    ↓
Clerk redirects to sign-in modal
    ↓
User enters credentials
    ↓
New auth token created
    ↓
Redirected back to /dashboard ✅
```

### Scenario 4: User Clicks UserButton → Sign Out

```
Click UserButton (avatar)
    ↓
Clerk modal appears
    ↓
Click "Sign out"
    ↓
ClerkProvider configured: afterSignOutUrl="/"
    ↓
Redirect to /
    ↓
Auth token cleared
    ↓
Home Page checks auth()
    ↓
userId is null
    ↓
Display HeroContent (landing page)
    ↓
Navbar re-renders
    ↓
<SignedOut> condition = TRUE
    ↓
Display: "Get Started" button
    ↓
Cycle back to "User NOT Logged In" scenario
```

## Component State Management

### Navbar Component (NOW CLIENT-SIDE)

```tsx
const Navbar = () => {
  // Clerk's <SignedIn> and <SignedOut> automatically:
  // - Listen to Clerk auth state
  // - Update when auth changes
  // - No manual state management needed
  
  return (
    <SignedIn>
      {/* This entire block hidden if NOT authenticated */}
      <Dashboard Button />
      <UserButton /> {/* Avatar + Logout button */}
    </SignedIn>
    
    <SignedOut>
      {/* This entire block hidden if authenticated */}
      <Get Started Button />
    </SignedOut>
  );
}

// Clerk handles:
// 1. Checking auth state on mount
// 2. Subscribing to auth changes
// 3. Re-rendering on state changes
// 4. NO manual useState needed
```

## Cache & Revalidation Strategy

```
Layout (revalidate = 0)
    ↓
Always fresh on every request
    ↓ Ensures ClerkProvider initializes fresh
    
Home Page (revalidate = 0)
    ↓
Always fresh auth check
    ↓ Detects if user logged in and redirects
    
Signup Page (revalidate = 0)
    ↓
Always fresh auth check
    ↓ Detects if already logged in, redirects to /dashboard
    
Dashboard (revalidate = 0)
    ↓
Always fresh getSafeProfile call
    ↓ Gets latest user data from Convex
```

## Middleware Flow in Detail

```
Request comes in
    ↓
Middleware matches against config.matcher
    ↓
Is path /dashboard, /assessment, /api, or /trpc?
    ↓
├─ YES ──→ Check: Is it a protected route?
│          ↓
│          ├─ YES (/dashboard, /assessment)
│          │  ↓
│          │  await auth.protect()
│          │  ↓
│          │  ├─ Has auth token? → Continue
│          │  └─ No token? → Redirect to sign-in
│          │
│          └─ NO (/api, /trpc, etc)
│             ↓
│             Allow through
│
└─ NO ──→ Allow through (public route)
```

## Environment & Configuration

### Clerk Configuration in ClerkProvider

```tsx
<ClerkProvider
  afterSignOutUrl="/"           // After logout, go home
  signInUrl="/signup"           // Sign in page URL
  signUpUrl="/signup"           // Sign up page URL
>
  {children}
</ClerkProvider>

// These prevent:
// 1. Redirects to Clerk's hosted pages
// 2. Loops or infinite redirects
// 3. Users getting stuck on unknown pages
```

### Environment Variables

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...  # Public - OK to expose
CLERK_SECRET_KEY=sk_test_...                    # Secret - server-only
CLERK_JWT_ISSUER_DOMAIN=https://...             # Convex integration
```

## Debug Points

When things go wrong, check these in order:

```
1. Browser DevTools → Application → Cookies
   ├─ __clerk_db_jwt exists?
   └─ Valid domain/path?

2. Browser DevTools → Network tab
   ├─ Auth requests to clerk endpoints?
   ├─ Redirects working?
   └─ Status codes 200 or 3xx?

3. Browser Console
   ├─ [Home], [SignUpPage], [handleGetStarted] logs?
   ├─ Clerk initialization errors?
   └─ Navbar rendering logs?

4. Server Terminal (npm run dev)
   ├─ [DashboardLayout] logs?
   ├─ [getSafeProfile] logs?
   └─ Middleware logs?

5. Clerk Dashboard
   ├─ User created in Clerk?
   ├─ Session active?
   └─ JWT token valid?

6. Convex Dashboard
   ├─ User record created?
   ├─ Role assigned correctly?
   └─ Onboarding status set?
```

## Performance Implications

| Component | Before | After | Benefit |
|-----------|--------|-------|---------|
| Navbar | Async (slow) | Client (fast) | Instant state updates |
| Auth Check | Every render | Clerk cached | Reduced API calls |
| Redirect | Manual logic | Automatic | No bugs |
| Cache | Inconsistent | Explicit | Fresh data when needed |

## Testing Checklist

- [ ] Login → UserButton appears immediately
- [ ] Logout → Button disappears, redirects to home
- [ ] Direct /dashboard access without auth → forced login
- [ ] Page refresh while logged in → stays logged in
- [ ] Clear cookies → forced login on next nav
- [ ] Sign in twice → dashboard loads instantly
- [ ] Mobile view → buttons still appear/disappear correctly
- [ ] Multiple tabs → all update when one logs out
- [ ] Network tab → no redirect loops

---

**Key Insight:** The fix moves from "checking auth once" to "subscribing to auth changes". This is why the UserButton now works correctly - it's not a static check, it's a live listener.
