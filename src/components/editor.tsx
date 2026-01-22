"use client";

import { Textarea } from "@/components/ui/textarea";

interface EditorProps {
  onChange: (value: string) => void;
  value: string;
}

export const Editor = ({
  onChange,
  value,
}: EditorProps) => {
  return (
    <Textarea
      placeholder="Enter course description..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="min-h-64"
    />
  );
};
