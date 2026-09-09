# GraphQL Inspector docs

The documentation at [the-guild.dev/graphql/inspector](https://the-guild.dev/graphql/inspector) is
authored here and rendered by [the-guild-org/website](https://github.com/the-guild-org/website),
which fetches this folder at build time. Nothing in this folder is built or deployed on its own.

## Layout

| Path            | What it is                                                                                               |
| --------------- | -------------------------------------------------------------------------------------------------------- |
| `content/docs/` | The documentation. Folder order and titles come from each folder's `meta.json`.                          |
| `assets/`       | Images referenced from pages as `/assets/...` (`assets/img/...`), and the logo used for social previews. |

## Writing pages

- Frontmatter: `title` (required) and `description`. The site renders the title as the page heading,
  so pages do not start with an `# H1`. Use `sidebarTitle` when the sidebar should show a shorter
  label.
- Ordering: each folder's `meta.json` lists `pages` in display order; a folder's `title` is its
  sidebar label. Pages not listed are built but hidden from the sidebar.
- Components available without importing: `Callout`, `Tabs` / `Tabs.Tab`, `Cards`, `FileTree`. Name
  code blocks with ` ```yaml title=".github/workflows/schema.yml" `, and use ` ```sh npm2yarn ` for
  install commands.
- Links between pages are root-relative to this product: `/docs/commands/diff`.

## Previewing changes

Every same-repository pull request that touches this folder gets a preview at
`https://inspector-pr-<number>.guild-dev-website.pages.dev/graphql/inspector` (linked in a PR
comment within about ten minutes). Merges to `master` redeploy the live docs automatically.
