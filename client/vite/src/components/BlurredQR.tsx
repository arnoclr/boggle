import { useState } from "react";

export interface BlurredQRProps {
  url: string;
}

export default function BlurredQR({ url }: BlurredQRProps) {
  const [blurred, setBlurred] = useState(true);

  function toggleBlurred(): void {
    setBlurred(!blurred);
  }

  function getDomain(url: string): string {
    const urlObj = new URL(url);
    return urlObj.hostname;
  }

  function QRLink(url: string): string {
    return `https://api.qrserver.com/v1/create-qr-code/?data=${url}`;
  }

  return (
    <div className="BlurredQR">
      <button className="tertiary" onClick={toggleBlurred}>
        {blurred ? "Afficher le QR Code" : "Masquer le QR Code"}
      </button>
      <div style={{ position: "relative", width: "fit-content" }}>
        <img
          width={200}
          height={200}
          src={QRLink(url)}
          alt={"QR Code vers" + getDomain(url)}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.01)",
            backdropFilter: blurred ? "blur(10px)" : "none",
          }}
        ></div>
      </div>
    </div>
  );
}
