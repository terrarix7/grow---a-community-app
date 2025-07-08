import { LogOut } from "lucide-react";
import { signOut } from "~/server/auth";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

function SignOut() {
  const handleSignOut = async () => {
    "use server";
    await signOut({ redirectTo: "/" });
  };

  return (
    <form action={handleSignOut}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="hover:cursor-pointer"
            variant="link"
            type="submit"
            size="icon"
          >
            <LogOut className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Sign out</TooltipContent>
      </Tooltip>
    </form>
  );
}

export default SignOut;
