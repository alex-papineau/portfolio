---
title: "Theme Stylesheet & Typography Guide"
description: "A comprehensive overview of the global stylesheet, typography, and default HTML element styles used throughout this theme."
pubDate: "Apr 17 2026"
heroImage: "/blog-placeholder-2.jpg"
---

When building or updating your content for this theme, it's helpful to know exactly how standard HTML elements will render. Below is an overview of the CSS styles, typography variables, and layout elements defined in our `global.css`.

## Core Typography Configuration

The theme runs on the **Atkinson** font family, with both `400` (Regular) and `700` (Bold) weights heavily utilized.

The document body is configured as follows to ensure optimal readability:
- **Base Font Size:** `20px` (Scaling down to `18px` on smaller screens)
- **Line Height:** `1.7`
- **Text Color:** Grey-Dark (`rgb(220, 220, 220)`) 
- **Background Color:** Black (`#000`)

---

## Heading Levels

Our headings (`<h1>` through `<h6>`) are stripped of their default margins, featuring a subtle margin-bottom of `0.5rem`, a tighter line-height (`1.2`), and are rendered in the stark white (`rgb(255, 255, 255)`) accenting.

# Heading 1 (3.052em)
## Heading 2 (2.441em)
### Heading 3 (1.953em)
#### Heading 4 (1.563em)
##### Heading 5 (1.25em)
###### Heading 6 (Base Size)

---

## Paragraph Text

Our base paragraphs are styled with a `1em` bottom margin to ensure ample breathing room between blocks of text. When you enclose your content within an article's `.prose` container (like this blog post), that spacing kindly doubles to `2em`.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in odio id magna egestas rhoncus. Integer sit amet velit eu sapien ullamcorper egestas. 

This is the second paragraph inside the prose layout. As you can see, there is sufficient spacing between this paragraph and the previous one.

---

## Links and Interactive Elements

By default, hypertext links take on the global `--accent` color. Notice how [standalone links](#) blend perfectly into the stark, monochromatic aesthetic of the dark theme.

You will also find standard HTML form elements neatly accounted for.

*   `<input>` and `<textarea>` components default to `16px` to prevent automatic zooming on iOS devices.
*   The `<strong>` and `<b>` tags default to a bold weight of `700`.

---

## Blockquotes

Blockquotes are fantastic for highlighting important ideas or quoting authors. They feature a left accent border aligned with our global `--accent` variable and are boosted to a `1.333em` font size.

> “This is a blockquote. It spans multiple lines to show off the generous left border and the increased font sizing used for emphasis.”

---

## Code Elements

Whether you're embedding simple inline statements or entire scripts, the code blocks are styled for visibility atop our black background.

### Inline Code
This is a standard sentence featuring an `inline code snippet` that is slightly padded with a light-gray background.

### Preformatted Code Blocks
The overarching `<pre>` block has a large `1.5em` padding layout with an `8px` rounded border. 

```javascript
// Example JavaScript block
function greetUser(username) {
  console.log(`Hello, ${username}! Ready to code?`);
}

greetUser('Developer');
```

---

## Dividers (`hr` Elements)

Need to separate your thoughts? A standard `<hr />` element creates a distinct but subtle `1px` high border that relies on the `--gray-light` CSS variable.

---

## Images

Globally, the `<img>` tag is built to be responsive. A subtle `8px` border-radius is automatically applied to images unless overwritten by deeper styles.

![Placeholder Image showing border radius](/blog-placeholder-about.jpg)

This concludes our global styles overview! Use this as a reference point for creating beautiful, perfectly-styled markdown posts.
