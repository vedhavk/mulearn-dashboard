"use client";

import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUserInfo } from "@/features/auth";
import { DiscordConnectDialog } from "@/features/connect";
import { useUIStore } from "@/stores/ui-store";
import { Spinner } from "../ui/spinner";

export function ConnectAccountsBanner() {
  const pathname = usePathname();
  const isConnectBannerDismissed = useUIStore(
    (state) => state.isConnectBannerDismissed,
  );
  const dismissConnectBanner = useUIStore(
    (state) => state.dismissConnectBanner,
  );
  const user = useUserInfo();
  const [isDiscordDialogOpen, setIsDiscordDialogOpen] = useState(false);
  const ALLOWED_ROUTES = [
    "/dashboard/profile",
    "/dashboard/mujourney",
    "/dashboard/courses",
  ];
  const isAllowedRoute = ALLOWED_ROUTES.includes(pathname);
  if (!isAllowedRoute) return null;
  if (isConnectBannerDismissed) return null;
  if (user.isLoading) {
    return <Spinner className="h-8 w-8" />;
  }
  const discordConnected = user.data?.exist_in_guild === true;
  const shouldShow = !discordConnected;
  if (!shouldShow) return null;

  return (
    <>
      <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 pointer-events-none">
        <div className="relative flex w-full max-w-xl flex-col items-center justify-center gap-4 rounded-4xl bg-background/80 p-5 shadow-lg backdrop-blur lg:flex-row lg:px-8 pointer-events-auto">
          {/* Left Side: Text */}
          <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
            <p className="text-sm font-medium">Complete your setup</p>
            <p className="text-xs text-muted-foreground">
              Link your accounts to continue.
            </p>
          </div>

          {/* Center: Button */}
          <div className="flex flex-none justify-center w-full lg:w-auto">
            {!discordConnected && (
              <Button
                variant="default"
                className="h-9 w-full lg:w-auto lg:px-8 text-xs md:text-sm"
                onClick={() => setIsDiscordDialogOpen(true)}
              >
                Connect Discord
              </Button>
            )}
          </div>

          {/* Right Side: Spacer/Close on Desktop */}
          <div className="hidden lg:flex flex-1 justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dismissConnectBanner()}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dismissConnectBanner()}
            className="absolute right-3 top-3 h-8 w-8 text-muted-foreground hover:text-foreground lg:hidden"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <DiscordConnectDialog
        open={isDiscordDialogOpen}
        onOpenChange={setIsDiscordDialogOpen}
      />
    </>
  );
}
