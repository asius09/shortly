import z from "zod";

export const errorHandler = (err: unknown): string => {
  if (err instanceof Error) {
    return err.message;
  }
  if (typeof err === "string") {
    return err;
  }
  if (
    typeof err === "object" &&
    err !== null &&
    "message" in err &&
    typeof (err as { message?: unknown }).message === "string"
  ) {
    return (err as { message: string }).message;
  }
  return "An unknown error occurred";
};

export const handleZodErros = (err: unknown): { [key: string]: string } => {
  // eslint-disable-next-line prefer-const
  let fieldErrors: { [key: string]: string } = {};
  if (err instanceof z.ZodError) {
    const errors = err.issues;
    for (const error of errors) {
      const key =
        typeof error.path[0] === "string"
          ? error.path[0]
          : String(error.path[0]);
      const value = error.message;
      fieldErrors[key] = value;
    }
    console.log("Array is more than 0");
  }
  return fieldErrors;
};
