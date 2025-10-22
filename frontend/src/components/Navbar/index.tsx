import styles from "./styles.module.scss";
import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <div className={styles.container}>
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? `${styles.link} ${styles.active}` : styles.link
        }
        end
      >
        Trang chủ
      </NavLink>

      <NavLink
        to="/posts"
        className={({ isActive }) =>
          isActive ? `${styles.link} ${styles.active}` : styles.link
        }
      >
        Bài viết
      </NavLink>
    </div>
  );
}
