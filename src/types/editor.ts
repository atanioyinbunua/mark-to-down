export type ToolbarItem =
  | "heading"
  | "bold"
  | "italic"
  | "list"
  | "orderedList"
  | "link"
  | "image"
  | "quote"
  | "code"
  | "codeBlock"
  | "preview";

export type EditorOptions = {
  element: HTMLElement | string;
  value?: string;
  toolbar?: ToolbarItem[];
  placeholder?: string;
  className?: string;
  onChange?: (value: string) => void;
};

