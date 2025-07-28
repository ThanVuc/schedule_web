"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { useState } from "react"

interface AppClickCardProps {
  trigger: React.ReactNode;
  avatarSrc?: string;
  avatarFallback?: string;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  content?: React.ReactNode;
  className?: string;
}

export function AppClickCard({
  trigger,
  avatarSrc,
  avatarFallback = "NA",
  title,
  description,
  footer,
  content,
  className = "w-80"
}: AppClickCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        asChild
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen((prev) => !prev)}
      >
        <div>{trigger}</div>
      </PopoverTrigger>

      <PopoverContent
        className={className}
        sideOffset={8}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
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
                <p className="text-sm">{description}</p>
              )}
              {footer && (
                <div className="text-muted-foreground text-xs">
                  {footer}
                </div>
              )}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
