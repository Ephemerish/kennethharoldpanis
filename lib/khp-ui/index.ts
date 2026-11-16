/**
 * khp-ui: the site's theme and the components every page is built from
 * (KHP §4.9). Pages, features and layouts compose these; raw HTML lives only
 * here (`pnpm check:composition`). The catalogue is AGENTS.md. React islands
 * import from `@ui/components/<group>/<Name>`, not this barrel.
 */

// Layout: where things sit.
export { default as Box } from "./components/layout/Box.astro";
export { default as Stack } from "./components/layout/Stack.astro";
export { default as NoScript } from "./components/layout/NoScript.astro";
export { default as Row } from "./components/layout/Row.astro";
export { default as Grid } from "./components/layout/Grid.astro";
export { default as Frame } from "./components/layout/Frame.astro";
export { default as PageSection } from "./components/layout/PageSection.astro";
export { default as Marquee } from "./components/layout/Marquee.astro";

// Type: words.
export { default as Heading } from "./components/type/Heading.astro";
export { default as Accent } from "./components/type/Accent.astro";
export { default as Text } from "./components/type/Text.astro";
export { default as Label } from "./components/type/Label.astro";
export { default as Link } from "./components/type/Link.astro";
export { default as List } from "./components/type/List.astro";
export { default as ListItem } from "./components/type/ListItem.astro";
export { default as VisuallyHidden } from "./components/type/VisuallyHidden.astro";
export { default as SkipLink } from "./components/type/SkipLink.astro";
export { default as Facts } from "./components/type/Facts.astro";
export { default as Fact } from "./components/type/Fact.astro";
export { default as Prose } from "./components/type/Prose.astro";
export { default as PageHeader } from "./components/type/PageHeader.astro";
export { default as SectionHeader } from "./components/type/SectionHeader.astro";

// Media.
export { default as Image } from "./components/media/Image.astro";
export { default as Logo } from "./components/media/Logo.astro";

// Surfaces: things with a background.
export { default as Card } from "./components/surface/Card.astro";
export { default as Chip } from "./components/surface/Chip.astro";
export { default as StatusPill } from "./components/surface/StatusPill.astro";
export { default as Panel } from "./components/surface/Panel.astro";
export { default as PanelSection } from "./components/surface/PanelSection.astro";
export { default as AccordionItem } from "./components/surface/AccordionItem.astro";

// Forms and actions.
export { buttonVariants, type ButtonVariants } from "./components/form/button";
export { default as Button } from "./components/form/Button.astro";
export { default as ButtonLink } from "./components/form/ButtonLink.astro";
export { default as Form } from "./components/form/Form.astro";
export { default as Field } from "./components/form/Field.astro";
export { default as Input } from "./components/form/Input.astro";
export { default as Textarea } from "./components/form/Textarea.astro";
export { default as NativeSelect } from "./components/form/NativeSelect.astro";
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from "./components/form/Select";

// Overlays.
export { default as Drawer } from "./components/overlay/Drawer.astro";
export { default as Disclosure } from "./components/overlay/Disclosure.astro";
export { default as FloatingButton } from "./components/overlay/FloatingButton.astro";
export { Toaster } from "./components/overlay/Toaster";

export { cn } from "./utils/cn";
