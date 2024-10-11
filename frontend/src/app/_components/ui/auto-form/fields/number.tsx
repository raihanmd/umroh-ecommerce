import { FormControl, FormItem, FormMessage } from "~/app/_components/ui/form";
import { Input } from "~/app/_components/ui/input";
import AutoFormLabel from "../common/label";
import AutoFormTooltip from "../common/tooltip";
import { AutoFormInputNumberProps } from "../types";
import { useCallback } from "react";

export default function AutoFormNumber({
  label,
  isRequired,
  fieldConfigItem,
  fieldProps,
}: AutoFormInputNumberProps) {
  const { showLabel: _showLabel, ...fieldPropsWithoutShowLabel } = fieldProps;
  const showLabel = _showLabel === undefined ? true : _showLabel;

  const formatRupiah = useCallback((value: number | string): string => {
    const numericValue =
      typeof value === "string"
        ? parseFloat(value.replace(/[^\d]/g, ""))
        : value;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericValue);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (fieldConfigItem.isRupiah) {
      const numericValue = parseFloat(inputValue.replace(/[^\d]/g, ""));
      fieldPropsWithoutShowLabel.onChange(numericValue);
    } else {
      fieldPropsWithoutShowLabel.onChange(inputValue);
    }
  };

  return (
    <FormItem>
      {showLabel && (
        <AutoFormLabel
          label={fieldConfigItem?.label || label}
          isRequired={isRequired}
        />
      )}
      <FormControl>
        <Input
          {...fieldPropsWithoutShowLabel}
          value={
            fieldConfigItem.isRupiah
              ? formatRupiah(fieldPropsWithoutShowLabel.value || 0)
              : fieldPropsWithoutShowLabel.value
          }
          onChange={handleChange}
          type={fieldConfigItem.isRupiah ? "text" : "number"}
        />
      </FormControl>
      <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
      <FormMessage />
    </FormItem>
  );
}
