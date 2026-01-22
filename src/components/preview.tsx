"use client";

interface PreviewProps {
    value: string;
}

export const Preview = ({
    value
}: PreviewProps) => {
    return (
        <div className="bg-white dark:bg-slate-700 p-4 rounded-md border border-slate-200 dark:border-slate-600 text-sm whitespace-pre-wrap">
            {value || <span className="text-slate-500 italic">No description yet</span>}
        </div>
    );
}