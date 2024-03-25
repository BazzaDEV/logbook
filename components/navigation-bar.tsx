import { UserButton } from "@clerk/nextjs";

export default function NavigationBar() {
  return (
    <header className="flex justify-between">
      <span>bazza.dev / logbook</span>
      <UserButton />
    </header>
  );
}
