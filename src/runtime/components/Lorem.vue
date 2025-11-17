<template>
  <template v-for="(item, idx) in lorem" :key="idx">
    <component :is="props.type === 'paragraphs' ? 'p' : 'span'">
      {{ item }}
    </component>

    <template v-if="idx < ((lorem?.length ?? 0) - 1)">
      {{ '&#32;' }}
    </template>
  </template>
</template>

<script lang="ts">
  export interface LoremProps {
    type?: 'words' | 'sentences' | 'paragraphs';
    min?               : string | number;
    max?               : string | number;
    minParagraphCount? : string | number;
    maxParagraphCount? : string | number;
    minSentenceCount?  : string | number;
    maxSentenceCount?  : string | number;
    minWordCount?      : string | number;
    maxWordCount?      : string | number;
  }
</script>

<script setup lang="ts">
  import { useId, useState } from '#imports';
  import { computed } from 'vue';

  const props = withDefaults(
    defineProps<LoremProps>(),
    {
      type              : 'words',
      min               : undefined,
      max               : undefined,
      minParagraphCount : 1,
      maxParagraphCount : 4,
      minSentenceCount  : 1,
      maxSentenceCount  : 4,
      minWordCount      : 5,
      maxWordCount      : 25,
    },
  );


  const values = computed(() => {
    const { min, max, type } = props;

    const minWord = toInteger((type === 'words' && min), props.minWordCount) ?? 5;
    const maxWord = toInteger((type === 'words' && max), props.maxWordCount, minWord + 20) ?? 25;

    if (props.type === 'words') {
      return getWords(minWord, maxWord);
    }

    const minSent = toInteger((type === 'sentences' && min), props.minSentenceCount) ?? 1;
    const maxSent = toInteger((type === 'sentences' && max), props.maxSentenceCount, minSent + 3) ?? 4;

    if (props.type === 'sentences') {
      return getSentences(minSent, maxSent, minWord, maxWord);
    }

    const minPara = toInteger((type === 'paragraphs' && min), props.minParagraphCount) ?? 1
    const maxPara = toInteger((type === 'paragraphs' && max), props.maxParagraphCount, minPara + 3) ?? 4;

    if (props.type === 'paragraphs') {
      return getParagraphs(minPara, maxPara, minSent, maxSent, minWord, maxWord);
    }

    return [];
  });


  const lorem = useState(useId(), () => values);


  /**
   * The text of lorem ipsum, as an array. For the sake of size, each value only
   * appears once in this array. This means that each value has an equally likely
   * value of appearing in any given output, which makes for a slightly less
   * polished feeling fake language, but we're not trying to win any awards here.
   */
  const LoremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet, ', 'consectetur', 'adipiscing', 'elit', 'ut', 'aliquam, ', 'purus',
    'amet', 'luctus', 'venenatis, ', 'lectus', 'magna', 'fringilla', 'urna, ', 'porttitor', 'rhoncus', 'non', 'enim',
    'praesent', 'elementum', 'facilisis', 'leo, ', 'vel', 'est', 'ullamcorper', 'eget', 'nulla', 'facilisi', 'etiam',
    'dignissim', 'diam', 'quis', 'lobortis', 'scelerisque', 'fermentum', 'dui', 'faucibus', 'in', 'ornare', 'quam',
    'viverra', 'orci', 'sagittis', 'eu', 'volutpat', 'odio', 'mauris', 'massa', 'vitae', 'tortor', 'condimentum',
    'lacinia', 'eros', 'donec', 'ac', 'tempor', 'dapibus', 'ultrices', 'iaculis', 'nunc', 'sed', 'augue', 'lacus, ',
    'congue', 'eu, ', 'consequat', 'felis', 'et', 'pellentesque', 'commodo', 'egestas', 'phasellus', 'eleifend',
    'pretium', 'vulputate', 'sapien', 'nec', 'aliquam', 'malesuada', 'bibendum', 'arcu', 'curabitur', 'velit',
    'sodales', 'sem', 'integer', 'justo', 'vestibulum', 'risus', 'ultricies', 'tristique', 'aliquet', 'tortor, ',
    'at', 'auctor', 'urna', 'id', 'cursus', 'metus', 'mi', 'posuere', 'sollicitudin', 'orci, ', 'a', 'semper', 'duis',
    'tellus', 'mattis', 'nibh', 'proin', 'nisl, ', 'venenatis', 'a, ', 'habitant', 'morbi', 'senectus', 'netus',
    'fames', 'turpis', 'tempus, ', 'pharetra', 'pharetra, ', 'mi, ', 'hendrerit', 'gravida', 'blandit', 'hac',
    'habitasse', 'platea', 'dictumst', 'quisque', 'sagittis, ', 'consequat, ', 'nisi, ', 'suscipit', 'maecenas', 'cras',
    'aenean', 'placerat', 'vestibulum, ', 'eros, ', 'tincidunt', 'erat', 'imperdiet', 'euismod', 'nisi', 'porta',
    'mollis', 'leo', 'nisl', 'ipsum, ', 'nec, ', 'nullam', 'feugiat', 'fusce', 'suspendisse', 'potenti', 'vivamus',
    'dictum', 'varius', 'sapien, ', 'molestie', 'ac, ', 'massa, ', 'accumsan', 'vitae, ', 'arcu, ', 'vel, ', 'dolor, ',
    'enim, ', 'neque', 'convallis', 'neque, ', 'tempus', 'nam', 'pulvinar', 'laoreet', 'interdum', 'libero, ', 'est, ',
    'tempor, ', 'elementum, ', 'nunc, ', 'risus, ', 'cum', 'sociis', 'natoque', 'penatibus', 'magnis', 'dis',
    'parturient', 'montes, ', 'nascetur', 'ridiculus', 'mus', 'accumsan, ', 'lacus', 'volutpat, ', 'dui, ', 'ligula',
    'libero', 'justo, ', 'diam, ', 'rhoncus, ', 'felis, ', 'et, ', 'mauris, ', 'ante', 'metus, ', 'commodo, ',
    'velit, ', 'non, ', 'tellus, ', 'purus, ', 'rutrum', 'fermentum, ', 'pretium, ', 'elit, ', 'vehicula',
  ];


  /**
   * Generate a random number between two bounds.
   */
  function randomInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  /**
   * Given one or more arguments, return the first number.
   */
  function toInteger(...values: (string | number | undefined | false)[]) {
    for (const value of values) {
      if (value === undefined || value === false) {
        continue;
      }

      return typeof value === 'string' ? parseInt(value) : value;
    }

    return undefined;
  }


  /**
   * Generate an array of words whose length will be between `min` and `max`.
   */
  function getWords(min: number, max: number) {
    const result = [] as string[];
    const count  = randomInteger(min, max < min ? min : max);

    for (let i = 0; i < count; i += 1) {
      result.push(LoremWords[randomInteger(0, LoremWords.length - 1)] as string);
    }

    const lastIndex = result.length - 1;
    const lastWord  = result[lastIndex]?.trim();

    if (lastWord?.endsWith(',')) {
      result[lastIndex] = lastWord.slice(0, -1);
    }

    return result;
  }


  /**
   * Generate an array of sentences whose length will be between `min` and `max`. The
   * number of words in each sentence will vary between `minWord` and `maxWord`.
   */
  function getSentences(min: number, max: number, minWord: number, maxWord: number) {
    const result = [] as string[];
    const count  = randomInteger(min, max < min ? min : max);

    for (let i = 0; i < count; i += 1) {
      const words = getWords(minWord, maxWord).join(' ') + '.';
      result.push(words.charAt(0).toUpperCase() + words.slice(1));
    }

    return result;
  }


  /**
   * Generate an array of paragraphs whose length will be between `min` and `max`. The
   * number of sentences in each paragraph will vary between `minSent` and `maxSent`.
   * The number of words in each sentence will vary between `minWord` and `maxWord`.
   */
  function getParagraphs(min: number, max: number, minSent: number, maxSent: number, minWord: number, maxWord: number) {
    const result = [] as string[];
    const count  = randomInteger(min, max < min ? min : max);

      for (let i = 0; i < count; i += 1) {
        result.push(getSentences(minSent, maxSent, minWord, maxWord).join(' ') ?? '');
      }

      return result;
  }
</script>
