"use client";
import { Form } from "~/app/_components/ui/form";
import React from "react";
import { DefaultValues, FormState, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/app/_components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";

import AutoFormObject from "./fields/object";
import { Dependency, FieldConfig, SubmitOptions } from "./types";
import {
  ZodObjectOrWrapped,
  getDefaultValues,
  getObjectFormSchema,
} from "./utils";

export function AutoFormSubmit({
  children,
  className,
  disabled,
}: {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex w-full justify-end">
      <Button type="submit" disabled={disabled} className={className}>
        {children ?? "Submit"}
      </Button>
    </div>
  );
}

function AutoForm<SchemaType extends ZodObjectOrWrapped>({
  formSchema,
  values: valuesProp,
  onValuesChange: onValuesChangeProp,
  onParsedValuesChange,
  onSubmit: onSubmitProp,
  fieldConfig,
  children,
  className,
  dependencies,
}: {
  formSchema: SchemaType;
  values?: Partial<z.infer<SchemaType>>;
  onValuesChange?: (values: Partial<z.infer<SchemaType>>) => void;
  onParsedValuesChange?: (values: Partial<z.infer<SchemaType>>) => void;
  onSubmit?: (
    values: z.infer<SchemaType>,
    options: SubmitOptions<z.infer<SchemaType>>,
  ) => void;
  fieldConfig?: FieldConfig<z.infer<SchemaType>>;
  children?:
    | React.ReactNode
    | ((formState: FormState<z.infer<SchemaType>>) => React.ReactNode);
  className?: string;
  dependencies?: Dependency<z.infer<SchemaType>>[];
}) {
  const objectFormSchema = getObjectFormSchema(formSchema);
  const defaultValues: DefaultValues<z.infer<typeof objectFormSchema>> | null =
    getDefaultValues(objectFormSchema, fieldConfig);

  const form = useForm<z.infer<typeof objectFormSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues ?? undefined,
    values: valuesProp,
    mode: "onChange",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const parsedValues = formSchema.safeParse(values);
    if (parsedValues.success) {
      onSubmitProp?.(parsedValues.data, {
        setError: form.setError,
      });
    }
  }

  React.useEffect(() => {
    const subscription = form.watch((values) => {
      onValuesChangeProp?.(values);
      const parsedValues = formSchema.safeParse(values);
      if (parsedValues.success) {
        onParsedValuesChange?.(parsedValues.data);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, formSchema, onValuesChangeProp, onParsedValuesChange]);

  const renderChildren =
    typeof children === "function"
      ? children(form.formState as FormState<z.infer<SchemaType>>)
      : children;

  return (
    <div className="w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={"space-y-5 px-1"}
        >
          <AutoFormObject
            className={className}
            schema={objectFormSchema}
            form={form}
            dependencies={dependencies}
            fieldConfig={fieldConfig}
          />

          {renderChildren}
        </form>
      </Form>
    </div>
  );
}

export default AutoForm;
