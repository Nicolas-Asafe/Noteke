import styles from "@/styles/sidebar.module.css"; 
import Link from "next/link";
import { Trash2, Home, Plug, BookCopy } from "lucide-react";
export default function Sidebar({ allItems, handleItemClick, handleDelete }) {
  return (
    <div className={styles.sidebar}>
      <header>
        <h1>Noteke</h1>
      </header>

      <section>
        <div className={styles["nav-links"]}>
          <Link href="/home" className={styles["nav-link"]}>
            Go Home
            <Home size={30} className={styles.icon} />
          </Link>
          <Link href="/docs" className={styles["nav-link"]}>
            Documents
            <BookCopy size={30} className={styles.icon} />
          </Link>
        </div>

        <div className={styles["org-list"]}>
          <p>Your Orgs:</p>
          <ul>
            {allItems.map(item => (
              <li
                onClick={() => handleItemClick(item.id, item.type)}
                key={item.id}
              >
                <span>
                  {item.title || "Untitled"}
                  <span className={styles.subtype}>
                    ({item.type.charAt(0).toUpperCase() + item.type.slice(1)})
                  </span>
                </span>
                <Trash2
                  color="white"
                  size={36}
                  className={styles["trash-button"]}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id, item.type);
                  }}
                />
              </li>
            ))}
            {allItems.length === 0 && (
              <p className={styles["no-orgs"]}>No orgs found.</p>
            )}
          </ul>
        </div>
      </section>

      <p className={styles.credits}>
        Made by <Link href="https://github.com/Nicolas-Asafe">Nicolas Asafe</Link>
      </p>
    </div>
  );
}
