<template>
  <div class="prose">
    <p class="text-global-foreground-accent">
      From the English language
      <a href="https://en.wikipedia.org/wiki/Table_of_contents" target="_blank">Wikipedia entry</a>
      about the topic.
    </p>

    <div class="grid md:grid-cols-[20rem_1fr] gap-4">
      <div>
        <UiScrollPinnedContainer :disabled="isTabletOrSmaller">
          <UiTableOfContents :toc="toc?.tableOfContents" />
        </UiScrollPinnedContainer>
      </div>

      <div ref="originalContent">
        <p>
          A <b>table of contents</b> (or simply <b>contents</b>, abbreviated as <b>TOC</b>), is a list usually
          part of the front matter preceding the main text of a book or other written work containing the
          titles of the text's sections, sometimes with descriptions.
        </p>

        <div>
          <UiButton text="Toggle Query Param" @click="queryParams.toggle = !queryParams.toggle" />
        </div>

        <h2>History</h2>

        <p>
          Pliny the Elder credits Quintus Valerius Soranus (d. 82 BC) as the first author to provide a table of
          contents to help readers navigate a lengthy work.
        </p>

        <h3>Classical Origins</h3>

        <p>
          The Roman writer <b>Quintus Valerius Soranus</b> (d. 82 BCE) is credited as the first to attach a list
          of contents to a written work, according to the Roman historian <b>Pliny the Elder</b>. In his
          <i>Natural History</i>, Pliny writes: "Soranus was the first to include a list of his book’s chapters
          to help the reader understand its content."
        </p>

        <h3>In Indian and Chinese Civilizations</h3>

        <p>
          In ancient Sanskrit literature, works such as the <i>Sushruta Samhita</i> and the <i>Charaka
          Samhita</i> (1st century BCE) were systematically divided into books and chapters, which
          were often listed at the beginning.
          In China, during the Han to Tang dynasties (206 BCE – 907 CE), classification catalogues began
          to appear in official records. One example is the <i>Hanshu</i> (Book of Han), which organized works
          by topic and included early content tables.
        </p>

        <h3>Byzantine and Early Christian Contributions</h3>

        <p>
          Early Christian tradition employed reference tables known as <i>Canon Tables</i>, compiled by
          <b>Eusebius of Caesarea</b> in the 4th century CE. These helped readers navigate between the four
          Gospels and are considered among the earliest tools resembling tables of contents.
        </p>

        <h3>In Islamic civilization</h3>
        <p>
          With the flourishing of writing and scholarship during the Abbasid era (9th century CE), Muslim
          scholars began dividing their books into chapters and sections, often listed in the preface or at
          the beginning of each chapter. Notable examples include works by Avicenna, al-Jahiz, and Ibn al-Nadim
          in his encyclopedic <i>Al-Fihrist</i>. Taha Hussein referred to this structure as a precursor to the
          modern table of contents: "Al-Jahiz would often include tentative headings for his chapters, offering
          readers a glimpse into the discussion—a primitive form of the contents page."
        </p>

        <h3>Influence on Europe</h3>

        <p>
          The transmission of knowledge during the Islamic Golden Age, particularly through Al-Andalus and Sicily,
          exposed Latin Europe to Arab methods of organizing texts. Historian George Saliba notes that Europeans
          not only translated scientific content but also adopted Arab formatting and presentation methods.
        </p>

        <h3>Europe After the Printing Press</h3>

        <p>
          After the invention of the printing press by Johannes Gutenberg in the 15th century, organizing printed
          texts with clear tables of contents became increasingly necessary, which then became standard in the
          following centuries.
        </p>

        <p>
          As printing technology expanded beyond Europe, the structural organization of books—including the use of
          tables of contents—was transmitted through colonial, commercial, and intellectual exchanges.
        </p>

        <h2>Form</h2>

        <p>
          The depth of detail in tables of contents depends on the length, complexity, and type of work. For books
          and most other large written works, tables of contents come after the title page, copyright page, and
          if appropriate, dedication and epigraph pages. Although they include everything after it, tables of
          contents never include anything before it. Depending on the complexity or length of the text, the table
          of contents will include the parts (groups of chapters), if applicable, chapters or section headings, and
          sometimes chapter or section subheadings.
        </p>

        <p>
          Formal reports (ten or more pages and being too long to put into a memo or letter) also have a table
          of contents. Within an English-language book, the table of contents usually appears after the title
          page, copyright notices, and, in technical journals, the abstract; and before any lists of tables or
          figures, the foreword, and the preface.
        </p>

        <p>
          Printed tables of contents indicate page numbers where each part starts, while digital ones offer links
          to go to each part. The format and location of the page numbers is a matter of style for the publisher.
          If the page numbers appear after the heading text, they might be preceded by characters called <i>leaders</i>,
          usually dots or periods, that run from the chapter or section titles on the opposite side of the page,
          or the page numbers might remain closer to the titles. In some cases, the page number appears before the
          text.
        </p>

        <p>
          In the case of anthologies or other compilations of works by different authors, each section's contributors
          are usually listed along with the title of the section.
        </p>

        <p>
          Matter preceding the table of contents is generally not listed there. However, all pages except the
          outside cover are counted, and the table of contents is often numbered with a lowercase Roman numeral
          page number.
        </p>

        <h2>In electronic documents</h2>

        <p>
          Many popular word processors, such as LibreOffice Writer, Microsoft Word and WordPerfect are capable
          of automatically generating a table of contents if the author of the text uses specific styles for
          chapters, sections, subsections, etc.
        </p>

        <p>TOCs in digital books and documents can be created using bookmarks.</p>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
  import { generateTableOfContents } from '@resee-movies/utilities/dom/generate-table-of-contents';
  import UiTableOfContents from '#resee-ux/components/TableOfContents.vue';
  import UiScrollPinnedContainer from '#resee-ux/components/ScrollPinnedContainer.vue';
  import { computed, ref } from 'vue';

  definePageMeta({
    heading: 'Table of Contents',
  });

  const isTabletOrSmaller = useReseeBreakpoints().smallerOrEqual('md');

  const originalContent = ref<HTMLElement>();

  const toc = computed(() => {
    return originalContent.value
      ? generateTableOfContents(originalContent.value)
      : undefined;
  });

  const queryParams = useQueryParameters({
    toggle: { type: Boolean },
  });
</script>
