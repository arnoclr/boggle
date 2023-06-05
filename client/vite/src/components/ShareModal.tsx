import { useRef } from "react";
import BlurredQR from "./BlurredQR";

export interface ShareModalProps {
  url: string;
}

export default function ShareModal({ url }: ShareModalProps) {
  const dialog = useRef<HTMLDialogElement>(null);

  function openDialog() {
    dialog.current?.showModal();
  }

  function shareWithNavigator() {
    navigator.share({
      title: window.location.hostname,
      url: url,
    });
  }

  return (
    <>
      <button className="tertiary" onClick={openDialog}>
        Partager
      </button>
      <dialog className="defaultDialog relative" ref={dialog}>
        <form method="dialog">
          <button
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              fontSize: "2rem",
            }}
            className="tertiary"
          >
            X
          </button>
        </form>
        <p style={{ paddingRight: "6rem" }}>
          Partagez le lien vers cette page.
        </p>
        <BlurredQR url={url}></BlurredQR>
        <button className="tertiary" onClick={shareWithNavigator}>
          Autres options de partage
        </button>
      </dialog>
    </>
  );
}
