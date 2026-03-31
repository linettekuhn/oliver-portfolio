export type BackendError = {
  message: string;
  details?: {
    formErrors: string[];
    fieldErrors: Record<string, string[] | undefined>;
  };
};
