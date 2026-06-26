"use client";

import { Search } from "lucide-react";
import { type FormEvent } from "react";

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
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const sortInput = form.elements.namedItem("sort") as HTMLInputElement | null;

    if (sortInput) {
      sortInput.value = "fit";
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card mt-8 grid gap-4 p-5 lg:grid-cols-[1.15fr_1fr_0.75fr_0.75fr_auto]">
      <input type="hidden" name="sort" value="fit" />
      <label className="grid gap-2 text-sm font-black text-slate-300">
        Role or keyword
        <input name="q" list="role-keyword-examples" defaultValue={defaultQuery} className="field" placeholder="Data science intern" />
        <datalist id="role-keyword-examples">
          {roleSuggestions.map((example) => (
            <option key={example} value={example} />
          ))}
        </datalist>
      </label>
      <label className="grid gap-2 text-sm font-black text-slate-300">
        Location
        <input name="location" list="location-examples" defaultValue={defaultLocation} className="field" placeholder={locationPlaceholder} />
        <datalist id="location-examples">
          {locationSuggestions.map((example) => (
            <option key={example} value={example} />
          ))}
        </datalist>
      </label>
      <label className="grid gap-2 text-sm font-black text-slate-300">
        Work mode
        <select name="remote" defaultValue={remoteFilter} className="field">
          <option value="all">All roles</option>
          <option value="remote">Remote only</option>
          <option value="hybrid">Hybrid only</option>
          <option value="onsite">On-site only</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm font-black text-slate-300">
        Minimum fit
        <select name="minFit" defaultValue={minFit.toString()} className="field">
          <option value="0">Any fit</option>
          <option value="60">60%+</option>
          <option value="70">70%+</option>
          <option value="80">80%+</option>
        </select>
      </label>
      <button type="submit" className="primary-button self-end">
        <Search className="mr-2" size={18} /> Search
      </button>
    </form>
  );
}
