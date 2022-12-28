import Head from "next/head";
// import Image from "next/image";
// import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import { useState } from "react";

interface Event {
  id: string;
  date: Date;
  title: string;
  description: string;
}

type Schedule = Map<string, Map<string, Event>>;

export default function Home() {
  const [date, setDate] = useState<Date>(() => new Date());
  const [schedule, setSchedule] = useState<Schedule>(() => new Map());

  const currentDate = new Date();
  const currentDay = `${currentDate.getFullYear()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getDate()}`;

  const handleMonthChange = (offset: number) => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + offset);
    setDate(newDate);
  };

  const handleNewEvent = (key: string) => {
    const newSchedule = new Map(schedule);

    if (!newSchedule.has(key)) {
      newSchedule.set(key, new Map());
    }

    const day = newSchedule.get(key);
    const id = String(Date.now());
    const title = window.prompt("Name of the event");
    if (!title) return;
    const description = window.prompt("description");

    day?.set(id, {
      id,
      title,
      description,
      date: new Date(),
    });

    setSchedule(newSchedule);
  };

  const handleDeleteEvent = (key: string, id: string) => {
    const newSchedule = new Map(schedule);
    const day = newSchedule.get(key);

    day?.delete(id);
    setSchedule(newSchedule);
  };

  return (
    <>
      <Head>
        <title>Calendar</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <nav className={styles.nav}>
          <div className={styles.nav_buttons}>
            <button onClick={() => handleMonthChange(-1)}>←</button>
            {date.toLocaleString("es-UR", { month: "long", year: "numeric" })}
            <button onClick={() => handleMonthChange(1)}>→</button>
          </div>
          <button className={styles.current_day_button} onClick={() => setDate(new Date())}>Today</button>
        </nav>
        <div className={styles.calendar}>
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} className={styles.weekday}>
              <p>
                {new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  i + 1
                ).toLocaleString("es-UR", { weekday: "long" })}
              </p>
            </div>
          ))}
          {Array.from(
            {
              length: new Date(
                date.getFullYear(),
                date.getMonth() + 1,
                0
              ).getDate(),
            },
            (_, i) => {
              const key = `${date.getFullYear()}/${date.getMonth()}/${i + 1}`;
              const events = schedule.get(key);
              return (
                <div
                  onClick={() => handleNewEvent(key)}
                  key={i}
                  className={`${
                    `${date.getFullYear()}/${date.getMonth() + 1}/${i + 1}` ===
                    currentDay
                      ? `${styles.current_day}`
                      : `${styles.day}`
                  }`}
                >
                  <div className={styles.p_number}>
                    <p>{i + 1}</p>
                  </div>
                  {events && (
                    <div className={styles.events_per_day}>
                      {Array.from(events.values()).map((event) => (
                        <div
                          className={styles.event}
                          key={event.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEvent(key, event.id);
                          }}
                        >
                          <p>{event.title}</p>
                          <p className={styles.description}>
                            {event.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
      </main>
    </>
  );
}
