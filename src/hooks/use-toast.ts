import { toast as sonnerToast } from "sonner";

export function useToast() {
  const toast = (props: {
    title?: string;
    description?: string;
    variant?: "default" | "destructive";
  }) => {
    const { title, description, variant } = props;
    const message = description || title;

    if (variant === "destructive") {
      sonnerToast.error(message || "Error");
    } else {
      sonnerToast.success(message || "Success");
    }
  };

  return { toast };
}
