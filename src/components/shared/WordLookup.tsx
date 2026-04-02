"use client";
import { useState, useEffect, useRef } from "react";
import { X, BookMarked } from "lucide-react";

interface DictEntry {
  phonetic?: string;
  meanings?: {
    partOfSpeech: string;
    definitions: { definition: string; example?: string }[];
  }[];
}

interface EntryState {
  loading: boolean;
  error: boolean;
  data: DictEntry | null;
}

interface Props {
  word: string;
  x: number;
  y: number;
  onClose: () => void;
  onSave?: (word: string) => void;
}

export function WordLookup({ word, x, y, onClose, onSave }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [entry, setEntry] = useState<EntryState>({ loading: true, error: false, data: null });

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  // Fetch definition from Free Dictionary API
  useEffect(() => {
    let cancelled = false;
    setEntry({ loading: true, error: false, data: null });
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.toLowerCase())}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) {
          setEntry({ loading: false, error: false, data: data[0] as DictEntry });
        } else {
          setEntry({ loading: false, error: true, data: null });
        }
      })
      .catch(() => { if (!cancelled) setEntry({ loading: false, error: true, data: null }); });
    return () => { cancelled = true; };
  }, [word]);

  const top = Math.min(y + 12, window.innerHeight - 220);
  const left = Math.min(x, window.innerWidth - 280);

  const meaning = entry.data?.meanings?.[0];
  const def = meaning?.definitions?.[0];

  return (
    <div
      ref={ref}
      className="fixed z-50 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-4"
      style={{ top, left }}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="font-bold text-slate-900 text-base">{word}</span>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-700 ml-2 flex-shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>

      {entry.loading && <p className="text-xs text-slate-400">Đang tra cứu...</p>}

      {!entry.loading && (entry.error || !entry.data) && (
        <p className="text-xs text-slate-400">Không tìm thấy định nghĩa.</p>
      )}

      {!entry.loading && entry.data && (
        <div className="space-y-1">
          {entry.data.phonetic && (
            <p className="text-xs text-slate-400 font-mono">{entry.data.phonetic}</p>
          )}
          {meaning && (
            <p className="text-xs font-semibold text-primary-700 uppercase tracking-wide">
              {meaning.partOfSpeech}
            </p>
          )}
          {def && <p className="text-sm text-slate-700 leading-snug">{def.definition}</p>}
          {def?.example && (
            <p className="text-xs text-slate-500 italic mt-1">"{def.example}"</p>
          )}
        </div>
      )}

      {onSave && (
        <button
          onClick={() => { onSave(word); onClose(); }}
          className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-primary-700 border border-primary-200 rounded-lg py-1.5 hover:bg-primary-50 transition-colors"
        >
          <BookMarked className="w-3.5 h-3.5" /> Lưu vào từ vựng
        </button>
      )}
    </div>
  );
}
