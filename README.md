# Personal Student Website — ICT251 Web Technologies

Live site: **https://activity-2-web-technologies-webpage.onrender.com**

Personal website of **Achizima Marvelous Mpashi** (Student Number **202511543**), a Data Science
student at Mulungushi University. This is the Activity 3 submission: it builds on the Activity 2
static page by adding hand-written JavaScript, a projects section, an accessible responsive
navigation, a light/dark theme, and a validated contact form that never sends data anywhere.

## Contents

```
index.html          The whole page (header, nav, main sections, footer)
css/styles.css      External stylesheet with CSS variables, hover/focus states and media queries
js/script.js        All JavaScript behaviour (loaded with defer)
images/             photo1.jpg, photo2.jpg, photo3.jpg
videos/             intro.mp4 (video) and voice.mp3 (audio)
```

Sections: About Me, My Hobbies, My Learning Plan (3 steps + weekly table), **Projects & Skills**,
My Photos, My Media, Contact.

## The four JavaScript features

1. **Contact form validation and preview (compulsory).**
   The form is labelled *"Browser demonstration only — no message is sent."* Submitting checks that
   the name and message are not whitespace-only and that the email matches a sensible pattern
   (`name@example.com`). Errors appear under each field with `textContent`, the first invalid field
   receives the keyboard focus, and `event.preventDefault()` stops the page reloading. When the
   input is valid, an on-page summary is shown stating that the data was **validated**, not sent.
2. **Projects filter with reset and a "no matches" message.**
   Category buttons (All / Web / Programming / Data) plus a search box filter the six project cards.
   **Reset** restores everything and returns focus to the search box; a search with no results shows
   *"No projects match your filter…"* and the status line reads *Showing 0 of 6 projects.*
3. **Light / dark theme switch** in the navigation bar. The choice is stored in `localStorage`
   (wrapped in `try`/`catch` so private browsing cannot break it) and the button reports its state
   with `aria-pressed`.
4. **Mobile navigation toggle.** Below 820px the menu collapses behind a **Menu** button that
   updates `aria-expanded`, closes when a link is chosen, when **Escape** is pressed, or when the
   window is resized back to desktop width. Without JavaScript the menu still renders normally.
5. **Expandable content.** The *Read more* button under About Me expands and collapses extra
   paragraphs using the `hidden` attribute and `aria-expanded`.

## How to test the features

Open `index.html` with **Live Server** (or any static server) and open the browser Console — it
should stay empty.

| Feature | Test |
| --- | --- |
| Form validation | Submit the empty form → name/message errors. Enter `   ` in Name → *"Spaces alone are not accepted."* Enter `bob@@example` → invalid email error. Enter `jane@example.com` with a message → preview appears and says the data was **validated**, not sent. |
| Projects filter | Click **Data** → 2 cards remain. Type `zzz` in Search → *"No projects match your filter"* appears. Click **Reset** → all 6 cards return. |
| Theme switch | Click **Dark theme** in the nav → colours change; reload → the choice is remembered. |
| Mobile nav | Narrow the window below 820px → **Menu** button appears; open it, press Escape → it closes. |
| Expandable content | Click **Read more** → extra paragraphs appear; click **Show less** → they collapse. |
| Media | Press play on the video and the audio clip, then pause — neither autoplays. |
| Keyboard focus | Press **Tab**: the skip link, hero button, nav links and form controls all show a visible outline. |
| Responsive | Check at 375px and 1280px: no sideways page scrolling (the study table scrolls inside its own box only). |

## Sources

- [MDN Web Docs — HTML, CSS and JavaScript references](https://developer.mozilla.org/en-US/)
- [MDN Learn Web Development](https://developer.mozilla.org/en-US/docs/Learn) (linked from the nav)
- [W3C Markup Validation Service](https://validator.w3.org/) and [W3C CSS Validation Service](https://jigsaw.w3.org/css-validator/)
- [WebAIM WCAG Quick Reference — contrast and focus](https://www.w3.org/WAI/WCAG21/quickref/)
- Course lecture notes and activities from ICT251 Web Technologies, Mulungushi University.

Photos, video and audio were created by the author for coursework.

## Author

Achizima Marvelous Mpashi — [GitHub](https://github.com/Archi-xima) — mpashiachie@gmail.com
