<template>
  <div class="prose-layout-container">
    <h1 class="h1 mb-4">Typography (Heading Level 1)</h1>
    <p class="p note">
      The content of this page is contained within a <code class="code">.prose-container</code>
      which keeps everything in a narrow column which is easier to read.
    </p>
  </div>

  <div class="prose-container">
    <h1 class="hero text-accent-color">Hero Heading Level 1</h1>
    <p class="hero">This is a paragraph of hero text.</p>

    <hr>

    <h2>Heading Level 2</h2>
    <UiLorem type="paragraphs" min="1" max="1" />

    <h3>Heading Level 3</h3>
    <UiLorem type="paragraphs" min="1" max="1" />

    <h4>Heading Level 4</h4>
    <UiLorem type="paragraphs" min="1" max="1" />

    <h5>Heading Level 5</h5>
    <UiLorem type="paragraphs" min="1" max="1" />

    <h6>Heading Level 6</h6>
    <UiLorem type="paragraphs" min="1" max="1" />

    <h6>Blockquote</h6>
    <blockquote>
      “Love looks not with the eyes, but with the mind; And therefore is wing'd Cupid
      painted blind. Nor hath love's mind of any judgment taste; Wings and no eyes figure
      unheedy haste: And therefore is love said to be a child, Because in choice he is so
      oft beguil'd.”
    </blockquote>

    <h6>Code</h6>
    <pre>const foo = {
  bar: '1',
  baz: true,
};</pre>
  </div>
</template>
