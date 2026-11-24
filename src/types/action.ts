import type { FieldErrors } from "@/lib/validations/form";

export interface ActionResult<Field extends string = never> {
  success: boolean;
  data: null;
  error: string | null;
  fieldErrors?: FieldErrors<Field>;
}
