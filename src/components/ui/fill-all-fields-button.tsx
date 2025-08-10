import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { toast } from "sonner";

interface FillAllFieldsButtonProps {
  onFill: () => void;
  disabled?: boolean;
}

export default function FillAllFieldsButton({
  onFill,
  disabled = false,
}: FillAllFieldsButtonProps) {
  const handleFillAll = () => {
    onFill();
    toast.success("All fields filled with sample data for testing");
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleFillAll}
      disabled={disabled}
      className="flex items-center gap-2"
    >
      <Wand2 className="h-4 w-4" />
      Fill All Fields
    </Button>
  );
}
