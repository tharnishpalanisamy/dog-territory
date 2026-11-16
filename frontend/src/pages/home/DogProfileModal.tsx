import { useEffect } from "react";
import type { MouseEvent } from "react";
import "./DogProfileModal.css";

export interface DogProfile {
  dog_code: string;
  area: string;
  status: string;
  tags: string[];
  image: string | null;
}

interface DogProfileModalProps {
  dog: DogProfile;
  fallbackImage: string;
  onClose: () => void;
}

function DogProfileModal({ dog, fallbackImage, onClose }: DogProfileModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("dog-profile-modal-open");
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("dog-profile-modal-open");
    };
  }, [onClose]);

  const stopPropagation = (event: MouseEvent<HTMLElement>) => event.stopPropagation();

  return (
    <div className="dog-modal-backdrop" onMouseDown={onClose}>
      <section className="dog-modal" role="dialog" aria-modal="true" aria-labelledby="dog-modal-title" onMouseDown={stopPropagation}>
        <div className="dog-modal-photo">
          <img src={dog.image || fallbackImage} alt={`${dog.dog_code}, a community street dog`} />
          <span className="dog-modal-photo-label">COMMUNITY DOG PROFILE</span>
          <button className="dog-modal-close" type="button" onClick={onClose} aria-label="Close dog profile">×</button>
        </div>
        <div className="dog-modal-content">
          <div className="dog-modal-heading">
            <div><span className="dog-modal-kicker">MEET YOUR NEIGHBOUR</span><h2 id="dog-modal-title">{dog.dog_code}</h2></div>
            <span className="dog-modal-status"><span />{dog.status}</span>
          </div>
          <div className="dog-modal-details">
            <article className="dog-detail-card"><span className="dog-detail-icon" aria-hidden="true">⌖</span><div><small>LAST KNOWN AREA</small><strong>{dog.area}</strong></div></article>
            <article className="dog-detail-card"><span className="dog-detail-icon dog-detail-paw" aria-hidden="true">♡</span><div><small>COMMUNITY NOTES</small><strong>Known in the neighbourhood</strong></div></article>
          </div>
          <div className="dog-modal-tags"><h3>At a glance</h3><div className="dog-modal-tag-list">{dog.tags.length ? dog.tags.map((tag) => <span key={tag}>{tag}</span>) : <p>No community notes have been added yet.</p>}</div></div>
          <div className="dog-modal-note"><span aria-hidden="true">✳</span><p>Every profile helps neighbours share what they know and make care easier to coordinate.</p></div>
          <button className="dog-modal-done" type="button" onClick={onClose}>Done</button>
        </div>
      </section>
    </div>
  );
}

export default DogProfileModal;
