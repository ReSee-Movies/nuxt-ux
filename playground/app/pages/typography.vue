<template>
  <div class="prose-container">
    <p class="note">
      The content of this page is contained within a <code class="code">.prose-container</code>
      which keeps everything in a narrow column which is easier to read.
    </p>

    <NuxtLink class="a" :to="{ name: 'layout' }">
      Go to Layout
    </NuxtLink>

    <h1 class="hero text-accent-color">Hero Heading Level 1</h1>
    <p class="hero">This is a paragraph of hero text.</p>

    <hr>

    <h2 id="level-2">Heading Level 2</h2>
    <UiLorem type="paragraphs" min="1" max="1" />

    <h3>Heading Level 3</h3>
    <UiLorem type="paragraphs" min="1" max="1" />

    <h4>Heading Level 4</h4>
    <UiLorem type="paragraphs" min="1" max="1" />

    <h5>Heading Level 5</h5>
    <UiLorem type="paragraphs" min="1" max="1" />

    <h6>Heading Level 6</h6>
    <UiLorem type="paragraphs" min="1" max="1" />

    <h2 id="lists">Lists</h2>
    <ol>
      <li>Item A</li>
      <li>
        Item B
        <ol>
          <li>Item B.1</li>
          <li>
            Item B.2
            <ol>
              <li>Item B.2.1</li>
            </ol>
          </li>
        </ol>
      </li>
      <li>Item C</li>
      <li>Item D</li>
      <li>
        Item E
        <ol>
          <li>Item E.1</li>
          <li>Item E.2</li>
        </ol>
      </li>
      <li>
        Item F
        <ol>
          <li>Item F.1</li>
          <li>Item F.2</li>
          <li>Item F.3</li>
          <li>Item F.4</li>
        </ol>
      </li>
      <li>
        Item G
        <ol>
          <li>Item G.1</li>
        </ol>
      </li>
    </ol>

    <h2 id="tables">Tables</h2>

    <table>
      <thead>
        <tr>
          <th colspan="2">Columns 1 - 2</th>
          <th>Column 3</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <th scope="row">Row 1</th>
          <td><UiLorem /></td>
          <td><UiLorem />
            <ul>
              <li><UiLorem /></li>
              <li><UiLorem /></li>
              <li><UiLorem /></li>
            </ul>
          </td>
        </tr>
        <tr>
          <th scope="row">Row 2</th>
          <td><UiLorem /></td>
          <td><UiLorem type="paragraphs" /></td>
        </tr>
        <tr>
          <th>Row 3</th>
          <td><UiLorem /></td>
          <td><UiLorem type="paragraphs" /></td>
        </tr>
      </tbody>
    </table>

    <h2>Blockquote</h2>
    <blockquote>
      “Love looks not with the eyes, but with the mind; And therefore is wing'd Cupid
      painted blind. Nor hath love's mind of any judgment taste; Wings and no eyes figure
      unheedy haste: And therefore is love said to be a child, Because in choice he is so
      oft beguil'd.”
    </blockquote>

    <h2>Figure</h2>
    <figure style="width: 100%; max-width: 337.5px;">
      <img
        src="https://api.reseemovies.com/assets/6f94b9e4-e3cb-4d79-87c6-3c17152013fb/IMG_9748.JPG"
        alt="A snapshot from our cinesonic launch event. Guests are gathered by the bar to listen to our guest techno DJs."
        height="1600"
        width="1200"
        loading="lazy"
        style="max-height: initial;"
      >
      <figcaption>
        <p>
          <span>Nothing makes me prouder than seeing repeat guests strike up conversations with familiar faces.
            Picture from our </span><a href="https://www.reseemovies.com/film-series/cinesonic" target="_blank" rel="noopener noreferrer nofollow">cinesonic</a><span>
          launch event featuring </span><span class="italic">The Matrix</span><span> and a Matrix-inspired dance party.</span>
        </p>
      </figcaption>
    </figure>

    <h2>Code</h2>
    <pre>const foo = {
  bar: '1',
  baz: true,
};</pre>
  </div>
</template>


<script setup lang="ts">
  import { useGlobalHeaderState } from '#resee-ux/composables/use-global-header-state';

  definePageMeta({
    heading: 'Typography',
  });

  useGlobalHeaderState({
    tableOfContents: [
      { text: 'Level 2 Heading', slug: 'level-2' },
      { text: 'Lists', slug: 'lists' },
      { text: 'Tables', slug: 'tables' },
    ],
  });
</script>
