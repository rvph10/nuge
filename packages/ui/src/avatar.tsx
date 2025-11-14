import { clsx } from "clsx";

export type AvatarProps = {
  /**
   * URL to the user's profile picture
   */
  avatarUrl?: string | null;
  /**
   * User's full name (used for generating initials)
   */
  fullName?: string | null;
  /**
   * User's email (used as fallback for generating initials if fullName is not available)
   */
  email?: string | null;
  /**
   * Size of the avatar in pixels (default: 40)
   */
  size?: number;
  /**
   * Optional CSS class name
   */
  className?: string;
  /**
   * Background color for the initials (default: "#0D101A")
   */
  backgroundColor?: string;
  /**
   * Text color for the initials (default: "#F2F2F2")
   */
  textColor?: string;
};

/**
 * Avatar component that displays a user's profile picture or initials.
 *
 * @param avatarUrl - URL to the user's profile picture
 * @param fullName - User's full name (used for generating initials)
 * @param email - User's email (used as fallback for generating initials)
 * @param size - Size of the avatar in pixels (default: 40)
 * @param className - Optional CSS class name
 * @param backgroundColor - Background color for the initials (default: "#0D101A")
 * @param textColor - Text color for the initials (default: "#F2F2F2")
 */
export function Avatar({
  avatarUrl,
  fullName,
  email,
  size = 40,
  className,
  backgroundColor = "#0D101A",
  textColor = "#F2F2F2",
}: AvatarProps) {
  // Generate initials from full name or email
  const getInitials = (): string => {
    if (fullName) {
      const parts = fullName.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return fullName.substring(0, 2).toUpperCase();
    }
    if (email) {
      const username = email.split("@")[0];
      return username.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const initials = getInitials();

  // Calculate font size based on avatar size
  const fontSize = Math.max(size * 0.4, 12);

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={fullName || email || "User avatar"}
        className={clsx("rounded-full object-cover", className)}
        style={{
          width: size,
          height: size,
        }}
      />
    );
  }

  return (
    <div
      className={clsx(
        "rounded-full flex items-center justify-center font-semibold shrink-0",
        className
      )}
      style={{
        width: size,
        height: size,
        backgroundColor,
        color: textColor,
        fontSize,
      }}
    >
      {initials}
    </div>
  );
}
