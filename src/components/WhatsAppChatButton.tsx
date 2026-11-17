export interface WhatsAppChatButtonProps {
  className?: string;
  size?: "small" | "medium" | "large";
  theme?: "green" | "white";
  href?: string;
}

export const ARCHE_WHATSAPP_LINK = "https://Wa.me/+917995937536";

export function WhatsAppChatButton({
  className = "",
  size = "medium",
  theme = "green",
  href = ARCHE_WHATSAPP_LINK,
}: WhatsAppChatButtonProps) {
  const sizeSuffix = size === "small" ? "Small" : size === "large" ? "Large" : "Medium";
  const themeName = theme === "white" ? "White" : "Green";
  const src = `/whatsapp-buttons/${theme === "white" ? "WhiteTheme/" : ""}WhatsAppButton${themeName}${sizeSuffix}.svg`;

  const heightClass =
    size === "small" ? "h-[34px]" : size === "large" ? "h-[48px]" : "h-[40px]";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="CHAT"
      className={`inline-flex items-center transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] focus:outline-none ${className}`}
      title="Chat on WhatsApp with Arche Creative Studios"
      aria-label="Chat on WhatsApp with Arche Creative Studios"
    >
      <img
        src={src}
        alt="Chat on WhatsApp"
        className={`${heightClass} w-auto object-contain drop-shadow-sm select-none`}
        loading="lazy"
      />
    </a>
  );
}
