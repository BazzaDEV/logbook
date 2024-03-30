import { SignInButton } from "@clerk/nextjs";

export default function Page() {
  return (
    <div>
      <h1>Home</h1>
      <SignInButton afterSignInUrl="/dashboard" afterSignUpUrl="/dashboard" />
    </div>
  );
}
