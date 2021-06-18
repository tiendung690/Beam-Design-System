import { css, Global } from "@emotion/react";
import { Palette } from "src/Css";

/**
 * Applies a CSS Reset that is based on modern-normalize + TW customizations.
 */
export function CssReset() {
  return <Global styles={[modernNormalizeReset, tailwindPreflightReset, ourReset]} />;
}

// Certain `a` tags in the app we want to opt-out of the default `a` / `a:visited` look
// & feel and always be the same non-visited blue (or whatever color they want).
// The is primarily for navigation, like breadcrumb links or tab links.
export const navLink = "navLink";

const ourReset = css`
  a:not(.${navLink}) { color: ${Palette.LightBlue700} },
  a:visited:not(.${navLink}) { color: ${Palette.LightBlue500} },
`;

// Copy/pasted from TW which uses this as their base reset.
const modernNormalizeReset = css`
  /*! modern-normalize v1.0.0 | MIT License | https://github.com/sindresorhus/modern-normalize */

  /*
Document
========
*/

  /**
Use a better box model (opinionated).
*/

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  /**
Use a more readable tab size (opinionated).
*/

  :root {
    -moz-tab-size: 4;
    -o-tab-size: 4;
    tab-size: 4;
  }

  /**
1. Correct the line height in all browsers.
2. Prevent adjustments of font size after orientation changes in iOS.
*/

  html {
    line-height: 1.15; /* 1 */
    -webkit-text-size-adjust: 100%; /* 2 */
  }

  /*
Sections
========
*/

  /**
Remove the margin in all browsers.
*/

  body {
    margin: 0;
  }

  /**
Improve consistency of default fonts in all browsers. (https://github.com/sindresorhus/modern-normalize/issues/3)
*/

  body {
    font-family: system-ui, -apple-system, /* Firefox supports this but not yet system-ui */ "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  }

  /*
Grouping content
================
*/

  /**
1. Add the correct height in Firefox.
2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
*/

  hr {
    height: 0; /* 1 */
    color: inherit; /* 2 */
  }

  /*
Text-level semantics
====================
*/

  /**
Add the correct text decoration in Chrome, Edge, and Safari.
*/

  abbr[title] {
    -webkit-text-decoration: underline dotted;
    text-decoration: underline dotted;
  }

  /**
Add the correct font weight in Edge and Safari.
*/

  b,
  strong {
    font-weight: bolder;
  }

  /**
1. Improve consistency of default fonts in all browsers. (https://github.com/sindresorhus/modern-normalize/issues/3)
2. Correct the odd 'em' font sizing in all browsers.
*/

  code,
  kbd,
  samp,
  pre {
    font-family: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace; /* 1 */
    font-size: 1em; /* 2 */
  }

  /**
Add the correct font size in all browsers.
*/

  small {
    font-size: 80%;
  }

  /**
Prevent 'sub' and 'sup' elements from affecting the line height in all browsers.
*/

  sub,
  sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }

  sub {
    bottom: -0.25em;
  }

  sup {
    top: -0.5em;
  }

  /*
Tabular data
============
*/

  /**
1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
*/

  table {
    text-indent: 0; /* 1 */
    border-color: inherit; /* 2 */
  }

  /*
Forms
=====
*/

  /**
1. Change the font styles in all browsers.
2. Remove the margin in Firefox and Safari.
*/

  button,
  input,
  optgroup,
  select,
  textarea {
    font-family: inherit; /* 1 */
    font-size: 100%; /* 1 */
    line-height: 1.15; /* 1 */
    margin: 0; /* 2 */
  }

  /**
Remove the inheritance of text transform in Edge and Firefox.
1. Remove the inheritance of text transform in Firefox.
*/

  button,
  select {
    /* 1 */
    text-transform: none;
  }

  /**
   Correct the inability to style clickable types in iOS and Safari.
   */

  button,
  [type="button"],
  [type="submit"] {
    -webkit-appearance: button;
  }

  /**
Remove the inner border and padding in Firefox.
*/

  /**
Restore the focus styles unset by the previous rule.
*/

  /**
Remove the additional ':invalid' styles in Firefox.
See: https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737
*/

  /**
Remove the padding so developers are not caught out when they zero out 'fieldset' elements in all browsers.
*/

  legend {
    padding: 0;
  }

  /**
Add the correct vertical alignment in Chrome and Firefox.
*/

  progress {
    vertical-align: baseline;
  }

  /**
Correct the cursor style of increment and decrement buttons in Safari.
*/

  /**
1. Correct the odd appearance in Chrome and Safari.
2. Correct the outline style in Safari.
*/

  [type="search"] {
    -webkit-appearance: textfield; /* 1 */
    outline-offset: -2px; /* 2 */
  }

  /**
Remove the inner padding in Chrome and Safari on macOS.
*/

  /**
1. Correct the inability to style clickable types in iOS and Safari.
2. Change font properties to 'inherit' in Safari.
*/

  /*
Interactive
===========
*/

  /*
Add the correct display in Chrome and Safari.
*/

  summary {
    display: list-item;
  }

  /**
 * Manually forked from SUIT CSS Base: https://github.com/suitcss/base
 * A thin layer on top of normalize.css that provides a starting point more
 * suitable for web applications.
 */

  /**
 * Removes the default spacing and border for appropriate elements.
 */

  blockquote,
  dl,
  dd,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  hr,
  figure,
  p,
  pre {
    margin: 0;
  }

  button {
    background-color: transparent;
    background-image: none;
  }

  /**
 * Work around a Firefox/IE bug where the transparent button background
 * results in a loss of the default button focus styles.
 */
  fieldset {
    margin: 0;
    padding: 0;
  }
`;

// See https://tailwindcss.com/docs/preflight
const tailwindPreflightReset = css`
  /**
 * Tailwind custom reset styles
 */

  /**
 * 1. Use the user's configured sans font-family (with Tailwind's default
 *    sans-serif font stack as a fallback) as a sane default.
 * 2. Use Tailwind's default "normal" line-height so the user isn't forced
 *    to override it to ensure consistency even when using the default theme.
 */
  html {
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
      "Noto Color Emoji"; /* 1 */
    line-height: 1.5; /* 2 */
  }

  /**
 * Inherit font-family and line-height from html so users can set them as
 * a class directly on the html element.
 */

  body {
    font-family: inherit;
    line-height: inherit;
  }

  /**
 * 1. Prevent padding and border from affecting element width.
 *
 *    We used to set this in the html element and inherit from
 *    the parent element for everything else. This caused issues
 *    in shadow-dom-enhanced elements like details where the content
 *    is wrapped by a div with box-sizing set to content-box.
 *
 *    https://github.com/mozdevs/cssremedy/issues/4
 *
 * 2. Setting border width to 0 removes the default border from elements
 *    like the button and fieldset
 */

  *,
  ::before,
  ::after {
    box-sizing: border-box; /* 1 */
    border-width: 0; /* 2 */
  }

  /*
 * Ensure horizontal rules are visible by default
 */

  hr {
    border-top-width: 1px;
  }

  /**
 * Undo the border-style: none reset that Normalize applies to images so that
 * our border-{width} utilities have the expected effect.
 *
 * The Normalize reset is unnecessary for us since we default the border-width
 * to 0 on all elements.
 *
 * https://github.com/tailwindcss/tailwindcss/issues/362
 */

  img {
    border-style: solid;
  }

  textarea {
    resize: vertical;
  }

  input::-moz-placeholder,
  textarea::-moz-placeholder {
    color: #9ca3af;
  }

  input:-ms-input-placeholder,
  textarea:-ms-input-placeholder {
    color: #9ca3af;
  }

  input::placeholder,
  textarea::placeholder {
    color: #9ca3af;
  }

  button,
  [role="button"] {
    cursor: pointer;
  }

  table {
    border-collapse: collapse;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: inherit;
    font-weight: inherit;
  }

  /**
 * Reset links to optimize for opt-in styling instead of
 * opt-out.
 */

  a {
    color: inherit;
    text-decoration: inherit;
  }

  /**
 * Reset form element properties that are easy to forget to
 * style explicitly so you don't inadvertently introduce
 * styles that deviate from your design system. These styles
 * supplement a partial reset that is already applied by
 * normalize.css.
 */

  button,
  input,
  optgroup,
  select,
  textarea {
    padding: 0;
    line-height: inherit;
    color: inherit;
  }

  /**
 * Use the configured 'mono' font family for elements that
 * are expected to be rendered with a monospace font, falling
 * back to the system monospace stack if there is no configured
 * 'mono' font family.
 */

  pre,
  code,
  kbd,
  samp {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  }

  /**
 * Make replaced elements display: block by default as that's
 * the behavior you want almost all of the time. Inspired by
 * CSS Remedy, with svg added as well.
 *
 * https://github.com/mozdevs/cssremedy/issues/14
 */

  img,
  svg,
  video,
  canvas,
  audio,
  iframe,
  embed,
  object {
    display: block;
    vertical-align: middle;
  }

  /**
 * Constrain images and videos to the parent width and preserve
 * their instrinsic aspect ratio.
 *
 * https://github.com/mozdevs/cssremedy/issues/14
 */

  img,
  video {
    max-width: 100%;
    height: auto;
  }
`;

// We don't technically use these b/c we assume it interferes with MUI/etc
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const tailwindFormResets = css`
  [type="text"],
  [type="email"],
  [type="url"],
  [type="password"],
  [type="number"],
  [type="date"],
  [type="month"],
  [type="search"],
  [type="tel"],
  [type="time"],
  [multiple],
  textarea,
  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: #fff;
    border-color: #6b7280;
    border-width: 1px;
    border-radius: 0px;
    padding-top: 0.5rem;
    padding-right: 0.75rem;
    padding-bottom: 0.5rem;
    padding-left: 0.75rem;
    font-size: 1rem;
    line-height: 1.5rem;
  }

  [type="text"]:focus,
  [type="email"]:focus,
  [type="url"]:focus,
  [type="password"]:focus,
  [type="number"]:focus,
  [type="date"]:focus,
  [type="month"]:focus,
  [type="search"]:focus,
  [type="tel"]:focus,
  [type="time"]:focus,
  [multiple]:focus,
  textarea:focus,
  select:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    --tw-ring-inset: var(--tw-empty, /*!*/ /*!*/);
    --tw-ring-offset-width: 0px;
    --tw-ring-offset-color: #fff;
    --tw-ring-color: #2563eb;
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
    border-color: #2563eb;
  }

  input::-moz-placeholder,
  textarea::-moz-placeholder {
    color: #6b7280;
    opacity: 1;
  }

  input:-ms-input-placeholder,
  textarea:-ms-input-placeholder {
    color: #6b7280;
    opacity: 1;
  }

  input::placeholder,
  textarea::placeholder {
    color: #6b7280;
    opacity: 1;
  }

  select {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem;
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
  }

  [multiple] {
    background-image: initial;
    background-position: initial;
    background-repeat: unset;
    background-size: initial;
    padding-right: 0.75rem;
    -webkit-print-color-adjust: unset;
    color-adjust: unset;
  }

  [type="checkbox"],
  [type="radio"] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    padding: 0;
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
    display: inline-block;
    vertical-align: middle;
    background-origin: border-box;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    flex-shrink: 0;
    height: 1rem;
    width: 1rem;
    color: #2563eb;
    background-color: #fff;
    border-color: #6b7280;
    border-width: 1px;
  }

  [type="checkbox"] {
    border-radius: 0px;
  }

  [type="radio"] {
    border-radius: 100%;
  }

  [type="checkbox"]:focus,
  [type="radio"]:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    --tw-ring-inset: var(--tw-empty, /*!*/ /*!*/);
    --tw-ring-offset-width: 2px;
    --tw-ring-offset-color: #fff;
    --tw-ring-color: #2563eb;
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
  }

  [type="checkbox"]:checked,
  [type="radio"]:checked {
    border-color: transparent;
    background-color: currentColor;
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
  }

  [type="checkbox"]:checked {
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
  }

  [type="radio"]:checked {
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='3'/%3e%3c/svg%3e");
  }

  [type="checkbox"]:checked:hover,
  [type="checkbox"]:checked:focus,
  [type="radio"]:checked:hover,
  [type="radio"]:checked:focus {
    border-color: transparent;
    background-color: currentColor;
  }

  [type="checkbox"]:indeterminate {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 16'%3e%3cpath stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 8h8'/%3e%3c/svg%3e");
    border-color: transparent;
    background-color: currentColor;
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
  }

  [type="checkbox"]:indeterminate:hover,
  [type="checkbox"]:indeterminate:focus {
    border-color: transparent;
    background-color: currentColor;
  }

  [type="file"] {
    background: unset;
    border-color: inherit;
    border-width: 0;
    border-radius: 0;
    padding: 0;
    font-size: unset;
    line-height: inherit;
  }

  [type="file"]:focus {
    outline: 1px auto -webkit-focus-ring-color;
  }
`;
