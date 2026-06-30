"use client";

import { Loader2, Search } from "lucide-react";
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

function SuggestionInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  suggestions,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  suggestions: string[];
}) {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const visibleSuggestions = useMemo(() => {
    const normalizedValue = value.trim().toLowerCase();
    return suggestions
      .filter((suggestion) => !normalizedValue || suggestion.toLowerCase().includes(normalizedValue))
      .slice(0, 8);
  }, [suggestions, value]);

  function handleFocus() {
    if (inputRef.current) setRect(inputRef.current.getBoundingClientRect());
    setOpen(true);
  }

  // Keep rect in sync on scroll/resize while open
  useEffect(() => {
    if (!open) return;
    function update() {
      if (inputRef.current) setRect(inputRef.current.getBoundingClientRect());
    }
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  const dropdown = open && visibleSuggestions.length > 0 && rect ? createPortal(
    <div
      style={{
        position: "fixed",
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-strong"
    >
      {visibleSuggestions.map((suggestion) => (
        <button
          key={suggestion}
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            onChange(suggestion);
            setOpen(false);
          }}
          className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm font-bold text-slate-700 transition hover:bg-sky/10 hover:text-slate-950"
        >
          {suggestion}
        </button>
      ))}
    </div>,
    document.body
  ) : null;

  return (
    <label className="grid gap-2 text-sm font-black text-slate-700">
      {label}
      <input
        ref={inputRef}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={handleFocus}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        className="field"
        placeholder={placeholder}
        autoComplete="off"
      />
      {dropdown}
    </label>
  );
}

export function PostingsSearchForm({
  roleSuggestions,
  locationSuggestions,
  defaultQuery,
  defaultLocation,
  locationPlaceholder,
  remoteFilter,
  minFit,
}: {
  roleSuggestions: string[];
  locationSuggestions: string[];
  defaultQuery: string;
  defaultLocation: string;
  locationPlaceholder: string;
  remoteFilter: string;
  minFit: number;
}) {
  const [query, setQuery] = useState(defaultQuery);
  const [location, setLocation] = useState(defaultLocation);
  const [loading, setLoading] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const sortInput = form.elements.namedItem("sort") as HTMLInputElement | null;
    if (sortInput) sortInput.value = "newest";
    setLoading(true);
  }

  return (
    <form onSubmit={handleSubmit} className="card mt-8 grid gap-4 p-5 lg:grid-cols-[1.15fr_1fr_0.75fr_0.75fr_auto]">
      <input type="hidden" name="sort" value="newest" />
      <SuggestionInput label="Role or keyword" name="q" value={query} onChange={setQuery} placeholder="Data science intern" suggestions={roleSuggestions} />
      <SuggestionInput label="Location" name="location" value={location} onChange={setLocation} placeholder={locationPlaceholder} suggestions={locationSuggestions} />
      <label className="grid gap-2 text-sm font-black text-slate-700">
        Work mode
        <select name="remote" defaultValue={remoteFilter} className="field">
          <option value="all">All roles</option>
          <option value="remote">Remote only</option>
          <option value="hybrid">Hybrid only</option>
          <option value="onsite">On-site only</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm font-black text-slate-700">
        Minimum fit
        <select name="minFit" defaultValue={minFit.toString()} className="field">
          <option value="0">Any fit</option>
          <option value="60">60%+</option>
          <option value="70">70%+</option>
          <option value="80">80%+</option>
        </select>
      </label>
      <button type="submit" disabled={loading} className="primary-button self-end disabled:opacity-70">
        {loading ? <Loader2 className="mr-2 animate-spin" size={18} /> : <Search className="mr-2" size={18} />}
        {loading ? "Searching…" : "Search"}
      </button>
    </form>
  );
}
