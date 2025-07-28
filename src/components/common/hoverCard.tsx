"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui"

interface AppHoverCardProps {
  trigger: React.ReactNode;
  avatarSrc?: string;
  avatarFallback?: string;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  content?: React.ReactNode;
  className?: string;
}

export function AppHoverCard({
  trigger,
  avatarSrc,
  avatarFallback = "NA",
  title,
  description,
  footer,
  content,
  className = "w-80"
}: AppHoverCardProps) {
  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger asChild>
        {trigger}
      </HoverCardTrigger>
      <HoverCardContent className={className}>
        {content ? (
          content
        ) : (
          <div className="flex justify-between gap-4">
            {(avatarSrc || avatarFallback) && (
              <Avatar>
                {avatarSrc && <AvatarImage src={avatarSrc} />}
                <AvatarFallback>{avatarFallback}</AvatarFallback>
              </Avatar>
            )}
            <div className="space-y-1">
              {title && <h4 className="text-sm font-semibold">{title}</h4>}
              {description && (
                <p className="text-sm">
                  {description}
                </p>
              )}
              {footer && (
                <div className="text-muted-foreground text-xs">
                  {footer}
                </div>
              )}
            </div>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  )
}
