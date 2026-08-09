// JobScout logo mark — uses the actual logo image
import Image from "next/image";

export function CoMark({ size = 28 }: { size?: number }) {
  return (
    <Image
      src="/jobscout-logo.png"
      alt="JobScout"
      width={size * 3.2}
      height={size}
      className="shrink-0 object-contain"
      style={{ height: size, width: "auto" }}
      priority
    />
  );
}
