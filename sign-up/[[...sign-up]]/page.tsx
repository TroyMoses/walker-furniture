import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-amber-50/50 to-white">
      <SignUp />
    </div>
  );
}
