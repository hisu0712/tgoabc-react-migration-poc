import { InfoIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      richColors
      className="toaster group"
      toastOptions={{ classNames: { toast: "!p-3" } }}
      icons={{
        info: <InfoIcon className="fill-muted-foreground size-5 text-white" />,
      }}
      style={
        {
          "--border-radius": "var(--radius)",

          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",

          "--info-bg": "var(--popover)",
          "--info-text": "var(--muted-foreground)",
          "--info-border": "var(--muted)",

          "--success-bg": "color-mix(in oklab, var(--primary) 80%, white)",
          "--success-text": "var(--primary-foreground)",
          "--success-border": "color-mix(in oklab, var(--primary) 80%, white)",

          "--error-bg": "color-mix(in oklab, var(--destructive) 80%, white)",
          "--error-text": "var(--destructive-foreground)",
          "--error-border":
            "color-mix(in oklab, var(--destructive) 80%, white)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
