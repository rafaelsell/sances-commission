import { Popover, Box, Button } from "@chakra-ui/react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import { LuCalendar } from "react-icons/lu";
import "react-day-picker/dist/style.css"; // We might need to override styles or use a custom CSS module if Chakra styles don't bleed well, but let's start with default and wrapper.
import { useState } from "react";

// Custom styles to make DayPicker look better with Chakra
const css = `
  .rdp {
    --rdp-cell-size: 40px;
    --rdp-accent-color: #00bcd4; /* Brand cyan approximation */
    --rdp-background-color: #e0f7fa;
    margin: 0;
  }
  .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
    background-color: var(--rdp-background-color);
  }
`;

interface DatePickerProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  placeholder?: string;
}

export const DatePicker = ({
  selected,
  onSelect,
  placeholder = "Selecione uma data",
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover.Root open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
      <Popover.Trigger asChild>
        <Button
          variant="outline"
          size="sm"
          fontWeight="normal"
          justifyContent="start"
          color={selected ? "gray.800" : "gray.400"}
          width="auto"
          minW="150px"
        >
          <LuCalendar style={{ marginRight: "8px" }} />
          {selected
            ? format(selected, "dd/MM/yyyy", { locale: ptBR })
            : placeholder}
        </Button>
      </Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content width="auto" p={0}>
          <style>{css}</style>
          <Box p={4} bgColor="white" rounded="md" shadow="lg">
            <DayPicker
              mode="single"
              selected={selected}
              onSelect={(date) => {
                onSelect?.(date);
                setIsOpen(false);
              }}
              locale={ptBR}
              showOutsideDays
            />
          </Box>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  );
};
