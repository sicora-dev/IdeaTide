"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { PanelLeft, Home, Lightbulb, LineChart } from "lucide-react";
import { Logo } from "@/components/ui/shared/Logo";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <SheetTitle className="sr-only">Main menu</SheetTitle>
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="/"
            onClick={handleClose}
            className="group flex shrink-0 items-center justify-start gap-2 rounded-full text-lg font-semibold text-primary-foreground md:text-base"
          >
            <Logo variant="horizontal" width={100} />
            <span className="sr-only">Home</span>
          </Link>
          <Link
            href="/dashboard"
            onClick={handleClose}
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Home className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/ideas"
            onClick={handleClose}
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Lightbulb className="h-5 w-5" />
            My Ideas
          </Link>
          <Link
            href="#"
            onClick={handleClose}
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <LineChart className="h-5 w-5" />
            Settings
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}