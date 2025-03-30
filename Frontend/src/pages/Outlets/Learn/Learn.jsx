import React from "react";
import styles from "./Learn.module.css";

const sleepTips = [
  {
    image: "https://images.unsplash.com/photo-1531353826977-0941b4779a1c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Maintain a Consistent Sleep Schedule",
    description: "Going to bed and waking up at the same time every day helps regulate your body's internal clock.",
  },
  {
    image: "https://images.unsplash.com/photo-1552858725-2758b5fb1286?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Create a Dark, Quiet Environment",
    description: "A dark, quiet, and cool environment promotes better sleep. Consider blackout curtains and white noise machines.",
  },
  {
    image: "https://images.unsplash.com/photo-1487956382158-bb926046304a?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Exercise Regularly",
    description: "Regular physical activity can help you fall asleep faster, but avoid intense workouts right before bed.",
  },
  {
    image: "https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Limit Caffeine and Alcohol",
    description: "Avoid caffeine and alcohol several hours before bedtime, as they can disrupt sleep quality.",
  },
  {
    image: "https://plus.unsplash.com/premium_photo-1664284793211-0771739401c2?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Reduce Screen Time Before Bed",
    description: "Blue light from screens can suppress melatonin production, making it harder to fall asleep.",
  },
];

export default function Learn() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Better Sleep Tips</h1>

      <div className={styles.cards}>
        {sleepTips.map((tip, index) => (
          <div key={index} className={styles.card}>
            <img src={tip.image} alt={tip.title} className={styles.image} />
            <h2 className={styles.title}>{tip.title}</h2>
            <p className={styles.description}>{tip.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
