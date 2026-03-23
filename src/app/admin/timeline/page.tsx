"use client";

import { useState, useEffect, FormEvent } from "react";
import { TimelineEvent } from "@/types";

export default function AdminTimeline() {
  const [secret, setSecret] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // New event form
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<TimelineEvent["type"]>("milestone");
  const [link, setLink] = useState("");

  // Build headers fresh each call so secret is never stale
  function getHeaders(currentSecret: string) {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${currentSecret}`,
    };
  }

  async function fetchEvents(overrideSecret?: string) {
    const s = overrideSecret ?? secret;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/timeline", {
        headers: getHeaders(s),
      });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setEvents(data.events);
      setAuthenticated(true);
      setMessage("");
    } catch {
      setMessage("Authentication failed. Check your secret and ensure ADMIN_SECRET is set in Vercel env vars.");
      setAuthenticated(false);
    }
    setLoading(false);
  }

  async function seedEvents() {
    setLoading(true);
    const res = await fetch("/api/admin/timeline", {
      method: "POST",
      headers: getHeaders(secret),
      body: JSON.stringify({ action: "seed" }),
    });
    const data = await res.json();
    setMessage(`Seeded ${data.count} events`);
    await fetchEvents();
    setLoading(false);
  }

  async function addEvent(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const event: TimelineEvent = {
      date,
      title,
      description,
      type,
      ...(link ? { link } : {}),
    };
    const res = await fetch("/api/admin/timeline", {
      method: "POST",
      headers: getHeaders(secret),
      body: JSON.stringify({ event }),
    });
    const data = await res.json();
    if (data.events) {
      setEvents(data.events);
      setMessage("Event added!");
      setDate("");
      setTitle("");
      setDescription("");
      setType("milestone");
      setLink("");
    } else {
      setMessage(data.error || "Failed to add event");
    }
    setLoading(false);
  }

  async function deleteEvent(date: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    setLoading(true);
    const res = await fetch("/api/admin/timeline", {
      method: "DELETE",
      headers: getHeaders(secret),
      body: JSON.stringify({ date, title }),
    });
    const data = await res.json();
    if (data.events) {
      setEvents(data.events);
      setMessage("Event deleted");
    }
    setLoading(false);
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <h1 className="text-2xl font-bold text-[#FAFAFA] text-center">
            Timeline Admin
          </h1>
          <input
            type="password"
            placeholder="Enter admin secret"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchEvents(secret)}
            className="w-full px-4 py-3 rounded-lg bg-[#1A1A1A] border border-[#333333] text-[#FAFAFA] placeholder-[#666]"
          />
          <button
            onClick={() => fetchEvents(secret)}
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#FF6B00] text-white font-semibold hover:bg-[#ff8c3a] transition-colors disabled:opacity-50"
          >
            {loading ? "Loading..." : "Login"}
          </button>
          {message && (
            <p className="text-red-400 text-sm text-center">{message}</p>
          )}
        </div>
      </div>
    );
  }

  const sorted = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#FAFAFA]">
            Timeline Admin
          </h1>
          <div className="flex gap-2">
            <button
              onClick={seedEvents}
              disabled={loading}
              className="px-4 py-2 rounded-lg border border-[#333333] text-[#888888] text-sm hover:text-[#FAFAFA] hover:border-[#666] transition-colors disabled:opacity-50"
            >
              Seed from static
            </button>
            <button
              onClick={() => fetchEvents()}
              disabled={loading}
              className="px-4 py-2 rounded-lg border border-[#333333] text-[#888888] text-sm hover:text-[#FAFAFA] hover:border-[#666] transition-colors disabled:opacity-50"
            >
              Refresh
            </button>
          </div>
        </div>

        {message && (
          <div className="px-4 py-2 rounded-lg bg-[#1A1A1A] border border-[#333333] text-[#FF6B00] text-sm">
            {message}
          </div>
        )}

        {/* Add event form */}
        <form
          onSubmit={addEvent}
          className="rounded-xl border border-[#333333] bg-[#1A1A1A] p-6 space-y-4"
        >
          <h2 className="text-lg font-bold text-[#FAFAFA]">Add New Event</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="px-4 py-2 rounded-lg bg-[#0A0A0A] border border-[#333333] text-[#FAFAFA]"
            />
            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value as TimelineEvent["type"])
              }
              className="px-4 py-2 rounded-lg bg-[#0A0A0A] border border-[#333333] text-[#FAFAFA]"
            >
              <option value="milestone">Milestone</option>
              <option value="policy">Policy</option>
              <option value="quote">Quote</option>
              <option value="event">Event</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Satirical headline / title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-[#0A0A0A] border border-[#333333] text-[#FAFAFA] placeholder-[#666]"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            className="w-full px-4 py-2 rounded-lg bg-[#0A0A0A] border border-[#333333] text-[#FAFAFA] placeholder-[#666] resize-none"
          />
          <input
            type="url"
            placeholder="Article link (optional)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-[#0A0A0A] border border-[#333333] text-[#FAFAFA] placeholder-[#666]"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-lg bg-[#FF6B00] text-white font-semibold hover:bg-[#ff8c3a] transition-colors disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Event"}
          </button>
        </form>

        {/* Event list */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-[#FAFAFA]">
            Events ({events.length})
          </h2>
          {sorted.map((event, i) => (
            <div
              key={i}
              className="rounded-xl border border-[#333333] bg-[#1A1A1A] p-4 flex items-start justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-[#888888]">
                    {event.date}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#0A0A0A] text-[#888888] border border-[#333333]">
                    {event.type}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#FAFAFA] truncate">
                  {event.title}
                </h3>
                <p className="text-xs text-[#888888] mt-0.5 line-clamp-2">
                  {event.description}
                </p>
              </div>
              <button
                onClick={() => deleteEvent(event.date, event.title)}
                className="shrink-0 px-3 py-1.5 rounded-lg border border-red-800 text-red-400 text-xs hover:bg-red-900/30 transition-colors"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
