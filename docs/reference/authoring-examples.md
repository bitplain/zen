---
icon: lucide/book-open
---

# Authoring examples

Use these snippets as a quick reference while writing content. Copy, paste, and adapt them in your pages.

## Admonitions

> Documentation: https://zensical.org/docs/authoring/admonitions/

!!! note

    This is a **note** admonition. Use it to provide helpful information.

!!! warning

    This is a **warning** admonition. Be careful!

## Details

> Documentation: https://zensical.org/docs/authoring/admonitions/#collapsible-blocks

??? info "Click to expand for more info"
    
    This content is hidden until you click to expand it.
    Great for FAQs or long explanations.

## Code blocks

> Documentation: https://zensical.org/docs/authoring/code-blocks/

``` python hl_lines="2" title="Code blocks"
def greet(name):
    print(f"Hello, {name}!") # (1)!

greet("Python")
```

1.  > Documentation: https://zensical.org/docs/authoring/code-blocks/#code-annotations

    Code annotations allow you to attach notes to lines of code.

Code can also be highlighted inline: `#!python print("Hello, Python!")`.

## Content tabs

> Documentation: https://zensical.org/docs/authoring/content-tabs/

=== "Python"

    ``` python
    print("Hello from Python!")
    ```

=== "Rust"

    ``` rs
    println!("Hello from Rust!");
    ```

## Diagrams

> Documentation: https://zensical.org/docs/authoring/diagrams/

``` mermaid
graph LR
  A[Start] --> B{Error?};
  B -->|Yes| C[Hmm...];
  C --> D[Debug];
  D --> B;
  B ---->|No| E[Yay!];
```

> Diagram source files live in [`docs/assets/diagram-sources`](../assets/diagram-sources/README.md).

## Footnotes

> Documentation: https://zensical.org/docs/authoring/footnotes/

Here's a sentence with a footnote.[^1]

Hover it to see a tooltip.

[^1]: This is the footnote.

## Formatting

> Documentation: https://zensical.org/docs/authoring/formatting/

- ==This was marked (highlight)==
- ^^This was inserted (underline)^^
- ~~This was deleted (strikethrough)~~
- H~2~O
- A^T^A
- ++ctrl+alt+del++

## Icons and emojis

> Documentation: https://zensical.org/docs/authoring/icons-emojis/

- :sparkles: `:sparkles:`
- :rocket: `:rocket:`
- :tada: `:tada:`
- :memo: `:memo:`
- :eyes: `:eyes:`

## Maths

> Documentation: https://zensical.org/docs/authoring/math/

$$
\cos x=\sum_{k=0}^{\infty}\frac{(-1)^k}{(2k)!}x^{2k}
$$

!!! warning "Needs configuration"
    MathJax is included via a `script` tag on pages that use math.
    Configure it globally if you plan to render equations across the site.

## Task lists

> Documentation: https://zensical.org/docs/authoring/lists/#using-task-lists

- [x] Install Zensical
- [x] Configure `zensical.toml`
- [x] Write amazing documentation
- [ ] Deploy anywhere

## Tooltips

> Documentation: https://zensical.org/docs/authoring/tooltips/

[Hover me](https://example.com "I'm a tooltip!")
