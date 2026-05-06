import { FormCore } from "@tanstack/form-core";
import { z } from "zod";

const schema = z.object({ email: z.string().email() });
const form = new FormCore({
  defaultValues: { email: "" },
  validators: { onChange: schema },
});
const field = form.Field({ name: "email" });

console.log("Initial isTouched:", field.state.meta.isTouched);
console.log("Initial errors:", field.state.meta.errors);

await form.handleSubmit();
console.log("After submit isTouched:", field.state.meta.isTouched);
console.log("After submit errors:", field.state.meta.errors);
