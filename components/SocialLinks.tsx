import { Mail, Phone, Instagram } from "lucide-react"

// Simple TikTok icon SVG since Lucide doesn't have a direct TikTok one sometimes
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
)

export function SocialLinks({ config, iconColor = "currentColor" }: { config?: any, iconColor?: string }) {
  if (!config) return null;

  return (
    <div className="flex items-center gap-4">
      {config.instagramUrl && (
        <a
          href={config.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-70 transition-opacity"
          style={{ color: iconColor }}
          aria-label="Instagram"
        >
          <Instagram className="w-5 h-5" />
        </a>
      )}
      {config.tiktokUrl && (
        <a
          href={config.tiktokUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-70 transition-opacity"
          style={{ color: iconColor }}
          aria-label="TikTok"
        >
          <TikTokIcon className="w-5 h-5" />
        </a>
      )}
      {config.contactPhone && (
        <a
          href={`https://wa.me/${config.contactPhone.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-70 transition-opacity"
          style={{ color: iconColor }}
          aria-label="WhatsApp"
        >
          {/* using Phone icon as WhatsApp representation or simple SVG */}
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
        </a>
      )}
      {config.contactEmail && (
        <a
          href={`mailto:${config.contactEmail}`}
          className="hover:opacity-70 transition-opacity"
          style={{ color: iconColor }}
          aria-label="Email"
        >
          <Mail className="w-5 h-5" />
        </a>
      )}
    </div>
  )
}
