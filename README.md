## Personal Portfolio

This repository contains the source code for my personal portfolio site.  
It is a single–page, content‑focused profile that showcases my background.

### Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript + React
- **Styling**:
  - Tailwind CSS via the new `@import "tailwindcss";` pipeline
  - A small set of handcrafted utility classes in `app/globals.css` for layout primitives (hero, sections, skills grid, etc.)
- **Icons**:
  - `react-icons` for social links and the location badge
- **Images**:
  - `next/image` for the profile photo and header banner

There is intentionally **no backend** and no database. All content (education, skills, projects, GitHub section) is defined directly in React components so that deployment stays simple and fast.

### Layout & Design Language

The site follows a clean, flat layout inspired by modern profile pages:

- **Single centered column**
  - The main content is wrapped in a fixed‑width column with left/right borders, giving it a card‑like feel on large screens.
  - Navigation is kept minimal: a top `Navbar` with just `home` and `gallery`.

- **LinkedIn‑style hero header**
  - Full‑width banner image at the top of the column.
  - Circular profile photo overlapping the lower edge of the banner, with a subtle white ring (stroke) around the image.
  - Name (`Gagah Athallah Fatha`) on the left.
  - Subtitle and a three‑paragraph bio beneath the name, tuned for small type sizes to emphasize hierarchy instead of loud typography.

- **Visual style**
  - **Colors**: neutral grayscale palette (white background, dark text, soft gray borders) to keep attention on content, not decoration.
  - **Typography**: Plus Jakarta Sans for all headings and body text; headings use medium weight, body uses regular.
  - **Shapes**: mostly sharp corners, with selective rounded corners on the banner and pills to soften the layout.
  - **No gradients, glassmorphism, or neon** – everything is flat and minimal on purpose.

- **Sections**
  - **Education**: concise school and date range on a single line.
  - **Tech Stack**: inline pill badges with dashed borders using a dedicated `.skills-grid` and `.skill-badge` style.
  - **Projects & GitHub Activity**: structured as rows that feel like a list in a dashboard, with subtle hover feedback but no heavy shadows.

### Component Structure

- `app/page.tsx` – wires the page together (`Navbar`, `Hero`, `Education`, `Skills`, `Projects`, `GitHubActivity`, `Footer`).
- `app/components/Hero.tsx` – banner, avatar, name, location pill, subtitle, and short bio.
- `app/components/*` – small, focused presentational components for each content block.
- `app/globals.css` – design tokens and layout classes:
  - Section spacing and headers
  - Hero layout and typography
  - Skills grid, project rows, and scroll‑hiding helpers

The CSS is intentionally modest: just enough custom rules to capture the layout and spacing that Tailwind alone doesn’t express cleanly, while still leaning on a utility‑first mindset.

### Running the Project

```bash
# install dependencies
npm install

# run the dev server
npm run dev

# then open the app in your browser
http://localhost:3000
```

The project is designed to be easy to tweak. If you want to change copy, skills, or projects, you usually only need to touch the corresponding component in `app/components`.

### License

This project is released under the **MIT License**.  
See the `LICENSE` file in the root of the repository for the full text.
