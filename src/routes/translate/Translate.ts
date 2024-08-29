import pkg from 'lodash';
const { findIndex } = pkg;

// const translate = require('google-translate-api');
// import pkg from 'google-translate-api';
// const translate = require('google-translate-free')
// import pkg from '@iamtraction/google-translate';
// const {translate} = pkg;

import translate from 'translate';
// translate.engine = 'deepl'; // 'libre';// 'google'//
translate.key = '0834516e-29b0-45d1-812e-b903d5962e12:fx'; //'203cca0d-8540-4d75-8c88-d69ac40b6d57:fx';//process.env.DEEPL_API_KEY;

import deepl_langs_list from '$lib/dict/deepl_lang_list.json';

export async function Translate_(text, from, to) {

  translate(text, {from: from, to: to})
    .then((res) => {
      // console.log(res);
      return res.text;
    })
    .catch((err) => {
      console.error(err);
    });
}

export async function Translate(text, from, to) {
    if (!text) return; // Return early if no text is provided

    text = text.replace(/\r\n/g, ''); // Remove carriage returns

    // Split text into sentences based on '.', '!', or '?' followed by a space or end of line
    const sentences = text.split(/([.!?]\s+|$)/);

    let translatedText = '';

    // Iterate through each sentence for translation
    for (let i = 0; i < sentences.length; i += 2) {
        let chunk = sentences[i].trim(); // The sentence part
        let punctuation = sentences[i + 1] || ''; // The punctuation part (if any)

        if (!chunk) continue;

        chunk = chunk.replace(/<</g, '<< ').replace(/>>/g, ' >>'); // Adjust formatting before translation
        
        let res;
        try {
            translate.engine = 'google'; // Set translation engine to Google
            res = await translate(chunk, to); // Attempt translation
        } catch (error) {
            console.error('Translation error:', error);
            continue; // Skip to next sentence in case of an error
        }

        // Adjust formatting after translation
        res = res.replace(/<<\s*(.*?)\s*>>/g, '<<$1>>');
        res = res.replace(/«\s*(.*?)\s*»/g, '<<$1>>');

        translatedText += res + punctuation; // Append translated sentence with original punctuation
    }

    return translatedText.trim(); // Return the final translated text
}

