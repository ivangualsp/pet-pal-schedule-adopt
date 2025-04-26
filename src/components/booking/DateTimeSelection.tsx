
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TimeSlot } from "../admin/AdminAppointments";

interface DateTimeSelectionProps {
  selectedDate: Date | undefined;
  selectedTime: string;
  availableTimes: TimeSlot[];
  bookedTimeSlots: string[];
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
}

export const DateTimeSelection = ({
  selectedDate,
  selectedTime,
  availableTimes,
  bookedTimeSlots,
  onDateChange,
  onTimeChange,
}: DateTimeSelectionProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Data</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : <span>Selecione uma data</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateChange}
              initialFocus
              disabled={(date) => date < new Date()}
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Horário</label>
        <Select value={selectedTime} onValueChange={onTimeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um horário" />
          </SelectTrigger>
          <SelectContent>
            {availableTimes
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((slot) => {
                const isBooked = bookedTimeSlots.includes(slot.time);
                return (
                  <SelectItem 
                    key={slot.id} 
                    value={slot.time} 
                    disabled={isBooked}
                    className={isBooked ? "text-gray-400" : ""}
                  >
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      {slot.time} {isBooked && " (Indisponível)"}
                    </div>
                  </SelectItem>
                );
              })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
