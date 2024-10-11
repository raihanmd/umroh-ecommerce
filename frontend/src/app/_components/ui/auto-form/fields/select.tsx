import { FormControl, FormItem, FormMessage } from "~/app/_components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/app/_components/ui/select";
import { AutoFormInputComponentProps } from "../types";
import AutoFormLabel from "../common/label";
import AutoFormTooltip from "../common/tooltip";

export default function AutoFormSelect({
  label,
  isRequired,
  field,
  fieldConfigItem,
  fieldProps,
}: AutoFormInputComponentProps) {
  const options = fieldConfigItem.options || [];

  function findItem(value: string | number | undefined) {
    return options.find((item) => item.value.toString() === value?.toString());
  }

  const currentValue =
    field.value || fieldConfigItem.inputProps?.defaultValue?.toString();

  const selectedItemLabel = currentValue
    ? findItem(currentValue)?.label
    : undefined;

  return (
    <FormItem>
      <AutoFormLabel
        label={fieldConfigItem?.label || label}
        isRequired={isRequired}
      />
      <FormControl>
        <Select
          onValueChange={field.onChange}
          defaultValue={currentValue}
          {...fieldProps}
        >
          <SelectTrigger className={fieldProps.className}>
            <SelectValue placeholder={fieldConfigItem.inputProps?.placeholder}>
              {selectedItemLabel || "Select an option"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {options.length > 0 ? (
              options.map(({ value, label }) => (
                <SelectItem value={value.toString()} key={value}>
                  {label}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>
                Loading
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </FormControl>
      <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
      <FormMessage />
    </FormItem>
  );
}
