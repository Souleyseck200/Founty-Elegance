/**
 * LookbookAlbum — Layout 3 colonnes éditorial
 * Les images s'affichent intégralement à leur ratio naturel.
 * Chaque photo est cliquable pour l'ouvrir en grand.
 */

type LookbookPhoto = { id: string; image_url: string };

interface LookbookAlbumProps {
  photos: LookbookPhoto[];
}

const GAP = 8;
const RADIUS = "18px";

export function LookbookAlbum({ photos }: LookbookAlbumProps) {
  // Distribute up to 6 photos across 3 columns
  const col1 = [photos[0], photos[3]].filter(Boolean);
  const col2 = [photos[1], photos[4]].filter(Boolean);
  const col3 = [photos[2], photos[5]].filter(Boolean);

  const columns = [col1, col2, col3].filter((c) => c.length > 0);

  return (
    <div
      style={{
        display: "flex",
        gap: GAP,
        alignItems: "flex-start",
        borderRadius: RADIUS,
        overflow: "hidden",
      }}
    >
      {columns.map((col, ci) => (
        <div
          key={ci}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: GAP,
          }}
        >
          {col.map((photo, pi) => (
            <a
              key={photo.id}
              href={photo.image_url}
              target="_blank"
              rel="noreferrer"
              title="Voir en grand"
              style={{
                display: "block",
                position: "relative",
                cursor: "zoom-in",
                overflow: "hidden",
                borderRadius: 0,
                lineHeight: 0,
              }}
              className="lookbook-item"
            >
              <img
                src={photo.image_url}
                alt={`Lookbook Founty ${ci + 1}-${pi + 1}`}
                loading="lazy"
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  transition: "transform 500ms cubic-bezier(0.25, 1, 0.5, 1)",
                }}
                className="lookbook-img"
              />
              {/* Overlay on hover */}
              <div
                className="lookbook-overlay"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(61, 43, 31, 0.18)",
                  opacity: 0,
                  transition: "opacity 300ms ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    color: "#D4B982",
                    fontFamily: "serif",
                    fontSize: "0.75rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    background: "rgba(0,0,0,0.5)",
                    padding: "6px 14px",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  Voir
                </span>
              </div>
            </a>
          ))}
        </div>
      ))}
    </div>
  );
}
