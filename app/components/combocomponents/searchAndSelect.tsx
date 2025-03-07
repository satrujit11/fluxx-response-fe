import { Check, ChevronsUpDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import { cn } from "~/lib/utils"
import { Controller } from "react-hook-form"
import { useState } from "react"

export function ComboboxDemo({
  frameworks,
  name,
  control,
}: {
  frameworks: { value: string; label: string }[],
  name: string,
  control: any, // Control from react-hook-form
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full sm:w-[200px] justify-between"
        >
          <Controller
            control={control}
            name={name}
            render={({ field }) => (
              <>
                {field.value
                  ? frameworks.find((framework) => framework.value === field.value)?.label
                  : `Select ${name}`}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </>
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${name}...`} />
          <CommandList>
            <CommandEmpty>No {name} found.</CommandEmpty>
            <CommandGroup>
              <Controller
                control={control}
                name={name}
                render={({ field }) => (
                  <>
                    {frameworks.map((framework) => (
                      <CommandItem
                        key={framework.value}
                        value={framework.value}
                        onSelect={(currentValue) => {
                          // Update form state using the field's onChange
                          field.onChange(currentValue === field.value ? "" : currentValue)
                          setOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === framework.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {framework.label}
                      </CommandItem>
                    ))}
                  </>
                )}
              />
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

