export type Metadata = {
  title?: string | { default?: string; template?: string };
  description?: string;
  alternates?: { canonical?: string };
  [key: string]: any;
};
