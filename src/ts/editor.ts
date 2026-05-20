import type { EditorOptions, ToolbarItem } from "../types/editor";
class Editor {
  options: EditorOptions;
  sourceElement: HTMLElement | null;
  parent: HTMLElement | null;
  private rootElement: HTMLDivElement | null = null;
  private textarea: HTMLTextAreaElement | null = null;
  private toolbarElement: HTMLDivElement | null = null;
  private mounted = false;

  ToolBarOptions = {
    bold: {
      label: "Bold",
      action: () => this.toggleBold(),
      icon: "",
    },
    italic: {
      label: "Italic",
      action: () => this.toggleItalic(),
      icon: "",
    },
    heading: {
      label: "Headings",
      action: () => this.toggleHeading(),
      icon: "",
    },
    list: {
      label: "List",
      action: () => this.toggleList(),
      icon: "",
    },
    link: {
      label: "Link",
      action: () => this.toggleLink(),
      icon: "",
    },
    code: {
      label: "Code",
      action: () => this.toggleCode(),
      icon: "",
    },
  };
  constructor(options: EditorOptions) {
    this.options = options;
    this.sourceElement = null;
    this.parent = null;
  }

  init() {
    if (this.mounted) return;

    const element = this.resolveElement(this.options.element);
    if (!element) {
      throw new Error("mark-to-down: target element not found");
    }

    this.sourceElement = element;
    this.render();
    this.mounted = true;
  }

  private resolveElement(element: HTMLElement | string): HTMLElement | null {
    if (typeof element === "string") {
      return document.querySelector(element);
    }

    return element;
  }

  destroy() {
    if (!this.mounted) return;

    this.textarea?.removeEventListener("input", this.handleInput);
    this.rootElement?.remove();
    this.sourceElement?.classList.remove("mtd-hidden");

    this.rootElement = null;
    this.textarea = null;
    this.sourceElement = null;
    this.mounted = false;
  }

  private render() {
    if (!this.sourceElement) return;

    this.sourceElement.classList.add("mtd-hidden");

    const root = document.createElement("div");
    const toolbar = document.createElement("div");
    const textarea = document.createElement("textarea");

    root.classList.add("mtd-editor");
    toolbar.classList.add("mtd-toolbar");
    textarea.classList.add("mtd-textarea");

    textarea.value = this.getInitialValue();
    textarea.addEventListener("input", this.handleInput);

    root.appendChild(toolbar);
    root.appendChild(textarea);

    this.sourceElement.parentElement?.insertBefore(
      root,
      this.sourceElement.nextSibling,
    );

    this.rootElement = root;
    this.toolbarElement = toolbar;
    this.textarea = textarea;

    this.renderToolbar();
  }

  private getInitialValue() {
    return this.options?.value ?? "";
  }

  getValue(): string {
    return this.textarea?.value ?? "";
  }

  setValue(value: string): void {
    if (!this.textarea) return;

    this.textarea.value = value;
    this.options.onChange?.(value);
  }

  private renderToolbar() {
    if (!this.toolbarElement) return;

    const toolbarItems = this.options.toolbar ?? [
      "bold",
      "italic",
      "heading",
      "list",
      "link",
      "code",
    ];

    for (const item of toolbarItems) {
      if (!(item in this.ToolBarOptions)) continue;

      const toolbarItem = item as keyof typeof this.ToolBarOptions;
      const toolbarOption = this.ToolBarOptions[toolbarItem];
      const button = document.createElement("button");

      button.type = "button";
      button.textContent = toolbarOption.label;
      button.addEventListener("click", toolbarOption.action);

      this.toolbarElement.appendChild(button);
    }
  }

  private wrapSelection(prefix: string, suffix = prefix) {
    if (!this.textarea) return;

    const start = this.textarea.selectionStart;
    const end = this.textarea.selectionEnd;
    const value = this.textarea.value;
    const selectedText = value.slice(start, end);
    const textToWrap = selectedText;
    const wrappedText = `${prefix}${textToWrap}${suffix}`;

    this.textarea.value =
      value.slice(0, start) + wrappedText + value.slice(end);

    const selectionStart = start + prefix.length;
    const selectionEnd = selectionStart + textToWrap.length;

    this.textarea.focus();
    this.textarea.setSelectionRange(selectionStart, selectionEnd);
    this.options.onChange?.(this.textarea.value);
  }

  private handleInput = () => {
    this.options.onChange?.(this.getValue());
  };

  private toggleBold() {
    this.wrapSelection("**", "**");
  }
  private toggleHeading() {}
  private toggleItalic() {}
  private toggleList() {}
  private toggleLink() {}
  private toggleCode() {}
}

export default Editor;
