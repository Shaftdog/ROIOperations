"use client";

import { useState } from "react";
import type { OrderNote } from "@/types/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";

interface NotesPanelProps {
  notes: OrderNote[];
  onAddNote?: (note: { content: string; isInternal: boolean }) => Promise<void> | void;
}

export function NotesPanel({ notes, onAddNote }: NotesPanelProps) {
  const [note, setNote] = useState("");
  const [internal, setInternal] = useState(true);

  const handleSubmit = async () => {
    if (!note) return;
    await onAddNote?.({ content: note, isInternal: internal });
    setNote("");
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Notes & communication</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea placeholder="Add a note" value={note} onChange={(event) => setNote(event.target.value)} />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Switch checked={internal} onCheckedChange={setInternal} id="internal-note" />
              <label htmlFor="internal-note">Internal note</label>
            </div>
            <Button size="sm" onClick={handleSubmit} disabled={!note}>
              Add note
            </Button>
          </div>
        </div>
        <div className="space-y-3">
          {notes.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{item.is_internal ? "Internal" : "External"}</span>
                <span>{format(new Date(item.created_at), "MMM d, yyyy h:mma")}</span>
              </div>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-100">{item.note}</p>
              <p className="mt-1 text-xs text-slate-500">By {item.created_by}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
