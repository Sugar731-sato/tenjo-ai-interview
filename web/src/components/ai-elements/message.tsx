import type { UIMessage } from "ai";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, HTMLAttributes } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  from: UIMessage["role"];
};

export const Message = ({ className, from, ...props }: MessageProps) => (
  <div
    className={cn(
      "group flex w-full items-end justify-end gap-2 py-4",
      from === "user" ? "is-user" : "is-assistant justify-end",
      className
    )}
    {...props}
  />
);

const messageContentVariants = cva(
  "is-user:dark flex flex-col gap-2 overflow-hidden text-sm",
  {
    variants: {
      variant: {
        contained: [
          "max-w-[80%] rounded-lg px-4 py-3",
          "group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground",
          "group-[.is-assistant]:bg-secondary group-[.is-assistant]:text-foreground",
        ],
        // TENJO の吹き出し: 話し手側の上の角だけ小さくする
        flat: [
          "px-4 py-2",
          "group-[.is-user]:max-w-[80%] group-[.is-user]:rounded-[16px_4px_16px_16px] group-[.is-user]:border group-[.is-user]:border-tenjo-rule group-[.is-user]:bg-tenjo-paper group-[.is-user]:text-foreground",
          "group-[.is-assistant]:min-w-0 group-[.is-assistant]:rounded-[4px_16px_16px_16px] group-[.is-assistant]:bg-tenjo-bubble group-[.is-assistant]:text-foreground",
        ],
      },
    },
    defaultVariants: {
      variant: "contained",
    },
  }
);

export type MessageContentProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof messageContentVariants>;

export const MessageContent = ({
  children,
  className,
  variant,
  ...props
}: MessageContentProps) => (
  <div
    className={cn(messageContentVariants({ variant, className }))}
    {...props}
  >
    {children}
  </div>
);

/** AI 側の吹き出しに添える、丸い「AI」アバター */
export const MessageAiAvatar = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    role="img"
    aria-label="AI"
    className={cn(
      "flex size-8 shrink-0 items-center justify-center rounded-full bg-tenjo-base font-lexend text-[10px] font-bold text-tenjo-cream",
      className
    )}
    {...props}
  >
    AI
  </div>
);

export type MessageAvatarProps = ComponentProps<typeof Avatar> & {
  src: string;
  name?: string;
};

export const MessageAvatar = ({
  src,
  name,
  className,
  ...props
}: MessageAvatarProps) => (
  <Avatar className={cn("size-8 ring-1 ring-border", className)} {...props}>
    <AvatarImage alt="" className="mt-0 mb-0" src={src} />
    <AvatarFallback>{name?.slice(0, 2) || "ME"}</AvatarFallback>
  </Avatar>
);
