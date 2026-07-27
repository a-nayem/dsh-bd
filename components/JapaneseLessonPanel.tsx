"use client";

import { useEffect, useMemo, useState } from "react";
import { SENTENCES, type Sentence } from "@/data/japanese-sentences";

type Direction = "jp-en" | "en-jp";
type Stats = { correct: number; total: number; streak: number; bestStreak: number };

const STORAGE_KEY = "empire-dashboard-jp-stats";

function loadStats(): Stats {
  if (typeof window === "undefined") return { correct: 0, total: 0, streak: 0, bestStreak: 0 };
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : { correct: 0, total: 0, streak: 0, bestStreak: 0 };
}

function pickCard(prevJp?: string): { sentence: Sentence; direction: Direction } {
  let sentence: Sentence;
  do {
    sentence = SENTENCES[Math.floor(Math.random() * SENTENCES.length)];
  } while (SENTENCES.length > 1 && sentence.jp === prevJp);
  const direction: Direction = Math.random() < 0.5 ? "jp-en" : "en-jp";
  return { sentence, direction };
}

function speak(text: string, lang: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  utter.rate = 0.85;
  window.speechSynthesis.speak(utter);
}

export default function JapaneseLessonPanel() {
  const [card, setCard] = useState<{ sentence: Sentence; direction: Direction } | null>(null);
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [stats, setStats] = useState<Stats>({ correct: 0, total: 0, streak: 0, bestStreak: 0 });
  const [voicesReady, setVoicesReady] = useState(false);

  useEffect(() => {
    setCard(pickCard());
    setStats(loadStats());
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => setVoicesReady(true);
      setVoicesReady(window.speechSynthesis.getVoices().length > 0);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  const prompt = useMemo(() => {
    if (!card) return null;
    return card.direction === "jp-en" ? card.sentence.jp : card.sentence.en;
  }, [card]);

  function nextCard() {
    setCard((prev) => pickCard(prev?.sentence.jp));
    setAnswer("");
    setRevealed(false);
  }

  function grade(correct: boolean) {
    setStats((s) => {
      const streak = correct ? s.streak + 1 : 0;
      return {
        correct: s.correct + (correct ? 1 : 0),
        total: s.total + 1,
        streak,
        bestStreak: Math.max(s.bestStreak, streak),
      };
    });
    nextCard();
  }

  if (!card) {
    return (
      <div className="panel">
        <div className="panel-label">日本語 — Japanese Lesson</div>
        <div className="loading">loading...</div>
      </div>
    );
  }

  const accuracy = stats.total ? Math.round((stats.correct / stats.total) * 100) : 0;

  return (
    <div className="panel">
      <div className="panel-label">
        日本語 — Japanese Lesson
        <span className="jp-category">{card.sentence.category}</span>
      </div>

      <div className="jp-stats">
        <span>{stats.correct}/{stats.total} correct</span>
        <span>{accuracy}% accuracy</span>
        <span>streak {stats.streak} (best {stats.bestStreak})</span>
      </div>

      <div className="jp-direction">{card.direction === "jp-en" ? "Translate: JP → EN" : "Translate: EN → JP"}</div>

      <div className="jp-prompt">
        {prompt}
        <button className="jp-speak" onClick={() => speak(card.sentence.jp, "ja-JP")} title="Hear pronunciation">
          🔊
        </button>
      </div>

      {/* Pronunciation is always shown — the whole point of the exercise */}
      <div className="jp-romaji">
        <span className="jp-romaji-label">pronunciation:</span> {card.sentence.romaji}
      </div>

      <input
        className="task-input"
        placeholder="Type your translation, then reveal to self-check..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        style={{ marginTop: 10, width: "100%" }}
      />

      {!revealed && (
        <button className="jp-reveal" onClick={() => setRevealed(true)}>Reveal Answer</button>
      )}

      {revealed && (
        <div className="jp-answer">
          <div className="jp-answer-main">{card.direction === "jp-en" ? card.sentence.en : card.sentence.jp}</div>
          <div className="jp-grade-row">
            <button className="jp-grade wrong" onClick={() => grade(false)}>Missed it</button>
            <button className="jp-grade right" onClick={() => grade(true)}>Got it</button>
          </div>
        </div>
      )}

      {!voicesReady && (
        <div className="loading" style={{ marginTop: 8 }}>
          Note: pronunciation audio uses your browser's built-in voices — quality/availability of a
          native ja-JP voice varies by OS and browser (Chrome/Edge on desktop tend to have the best one).
        </div>
      )}
    </div>
  );
}
