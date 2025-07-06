import { signOut } from "~/server/auth";
import { Button } from "./ui/button";

function SignOut() {
  const handleSignOut = async () => {
    "use server";
    await signOut({ redirectTo: "/" });
  };

  return (
    <form action={handleSignOut}>
      <Button variant="link" type="submit">
        Sign Out
      </Button>
    </form>
  );
}

export default SignOut;
