import React from "react";
import styles from "./Learn.module.css";

const sleepTips = [
  {
    image: "https://images.unsplash.com/photo-1531353826977-0941b4779a1c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Maintain a Consistent Sleep Schedule",
    description: "Going to bed and waking up at the same time every day helps regulate your body's internal clock.",
    details: "Maintaining a consistent sleep schedule—going to bed and waking up at the same time every day—has major benefits for your mental and physical health, alertness, stress management, and heart health.",
    tips: [
      "Prioritize sleep – Make it a non-negotiable part of your daily routine.",
      "Use reminders and alarms – Set bedtime alerts and wake-up alarms to stay consistent.",
      "Create a wind-down routine – Engage in calming activities like reading or meditating before bed."
    ],
    extra: "If you’re not getting enough sleep, you may build up 'sleep debt,' but you can help repay it by sleeping 1–2 extra hours on weekends or taking short naps."
  },
    
  {
    image: "https://images.unsplash.com/photo-1552858725-2758b5fb1286?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Create a Dark, Quiet Environment",
    description: "A dark, quiet, and cool environment promotes better sleep. Consider blackout curtains and white noise machines.",
    details: "Creating a dark and quiet sleep environment is key to improving sleep quality. Light and noise can disrupt your ability to fall and stay asleep, even at low levels, so it’s important to control both.",
    tips: [
      "Use room-darkening shades, heavy curtains, or light-blocking linings to cover windows.",
      "Block light from under doorways with draft stoppers and turn off hall lights.",
      "Avoid bright lights from electronics like phones, TVs, or clocks.",
      "Wear an eye mask if needed, but keep it on throughout sleep.",
      "Use a dim red nightlight for nighttime bathroom trips.",
      "Keep your bedroom as quiet as possible by blocking outside sounds.",
      "Use white noise machines or fans to mask disruptive sounds.",
      "Try soothing music or ambient sounds to help relax.",
      "Consider noise-blocking curtains for extra sound insulation."
    ],
    extra: "Together, darkness and quietness create an ideal setting for deeper, more restorative sleep."
  },

  {
    image: "https://images.unsplash.com/photo-1487956382158-bb926046304a?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Exercise Regularly",
    description: "Regular physical activity can help you fall asleep faster, but avoid intense workouts right before bed.",
    details: "Exercise can significantly improve sleep quality by helping you fall asleep faster and increasing deep (slow wave) sleep. Moderate aerobic activity, even for just 30 minutes, can show benefits the same night. It also helps regulate mood and calm the mind, making it easier to transition into sleep.",
    tips: [
      "Aim for at least 30 minutes of moderate aerobic activity most days of the week.",
      "Notice how your body responds to evening workouts—some people are more sensitive to late exercise.",
      "If you're affected, try finishing workouts at least 1–2 hours before bed.",
      "Choose activities you enjoy to stay consistent and make it part of your routine."
    ],
    extra: "The best time to exercise depends on your body’s rhythms. Consistency and enjoyment matter more than perfect timing."
    },
    
  {
    image: "https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Limit Caffeine and Alcohol",
    description: "Avoid caffeine and alcohol several hours before bedtime, as they can disrupt sleep quality.",
    details: "Caffeine can affect sleep quality long after its stimulating effects wear off, potentially disrupting sleep stages even if you fall asleep easily. Alcohol, while initially sedating, can interfere with staying asleep. Water intake close to bedtime can also disrupt sleep by causing nighttime awakenings.",
    tips: [
      "Avoid caffeine at least 8 hours before your planned bedtime.",
      "Limit caffeine sources like coffee, tea, energy drinks, and dark chocolate in the afternoon and evening.",
      "Avoid alcohol at least 3 hours before sleep to reduce nighttime disruptions.",
      "Drink most of your water earlier in the day to stay hydrated without interrupting sleep.",
      "Limit water intake to about 12 ounces or less in the final 1–2 hours before bed."
    ],
    extra: "Small changes in timing caffeine, alcohol, and water can make a noticeable difference in how well and deeply you sleep."
    },

  {
    image: "https://plus.unsplash.com/premium_photo-1664284793211-0771739401c2?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Reduce Screen Time Before Bed",
    description: "Blue light from screens can suppress melatonin production, making it harder to fall asleep.",
    details: "Using your smartphone before bed can negatively impact your sleep quality in several ways: it mentally stimulates your brain, exposes you to blue light, and can trigger emotional responses that delay sleep.",
    tips: [
      "Avoid active phone use (texting, social media) 1–2 hours before bedtime.",
      "Reduce blue light exposure by enabling night mode or using blue light filters.",
      "Limit emotionally intense content before bed to stay calm and relaxed.",
      "Engage in calming activities like reading, journaling, or meditation instead.",
      "Put your phone on 'Do Not Disturb' or keep it out of reach to reduce distractions."
    ],
    extra: "Passive tech use like soft music or light TV is less disruptive than active use, but screen-free wind-down routines are best for quality sleep."
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

            {tip.details && (
              <p className={styles.details}>
                <strong>Why it matters:</strong> {tip.details}
              </p>
            )}

            {tip.tips && (
              <ul className={styles.tips}>
                {tip.tips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            )}

            {tip.extra && (
              <p className={styles.extra}>
                <strong>Extra:</strong> {tip.extra}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
