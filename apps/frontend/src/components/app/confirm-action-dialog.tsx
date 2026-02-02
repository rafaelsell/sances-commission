import { Button, Text } from "@chakra-ui/react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export interface ConfirmActionDialogProps {
  open: boolean;
  onOpenChange: (details: { open: boolean }) => void;
  title?: string;
  description?: React.ReactNode;
  onConfirm: () => Promise<void> | void;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "info" | "neutral";
  trigger?: React.ReactNode;
}

export const ConfirmActionDialog = ({
  open,
  onOpenChange,
  title = "Confirmar ação",
  description,
  onConfirm,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "danger",
  trigger,
}: ConfirmActionDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
      onOpenChange({ open: false });
    } finally {
      setIsLoading(false);
    }
  };

  const getConfirmButtonColor = () => {
    switch (type) {
      case "danger":
        return "red.600";
      case "info":
        return "brand.cyan";
      case "neutral":
        return "gray.600";
      default:
        return "red.600";
    }
  };

  const getConfirmButtonHoverColor = () => {
    return { filter: "brightness(0.94)" };
  };

  return (
    <DialogRoot
      open={open}
      onOpenChange={(e) => onOpenChange({ open: e.open })}
    >
      {trigger && <DialogTrigger>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          {typeof description === "string" ? (
            <Text>{description}</Text>
          ) : (
            description
          )}
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button borderRadius={"lg"} variant="subtle" disabled={isLoading}>
              {cancelText}
            </Button>
          </DialogActionTrigger>
          <Button
            borderRadius={"lg"}
            bg={getConfirmButtonColor()}
            color="white"
            _hover={getConfirmButtonHoverColor()}
            loading={isLoading}
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};
