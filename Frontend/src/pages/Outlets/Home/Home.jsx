import { useAuth } from "../../../auth/UserAuth";
import styles from "./Home.module.css";

export default function Home() {
  const { user } = useAuth(); // Retrieves the logged-in user info

  return (
    <div className={styles.container}>
      <h1>Welcome, {user?.name || "Guest"}!</h1>

      {/* Widgets Section */}
      <div className={styles.widgets}>

        {/* User Info Widget */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Your Profile</h2>
          <p className={styles.cardContent}>Name: {user.username || "Unknown"}</p>
        </div>

        {/* Future Widget: Activity Tracker (Placeholder) */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Recent Activity</h2>
          <p className={styles.cardContent}>No activity yet.</p>
        </div>

        {/* Future Widget: Achievements (Placeholder) */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Achievements</h2>
          <p className={styles.cardContent}>You haven’t unlocked any achievements yet.</p>
        </div>

      </div>
    </div>
  );
}
