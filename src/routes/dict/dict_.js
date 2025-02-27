import translate from 'translate';
translate.engine ="google"
translate.from = 'ru';
import { llang, langs } from '$lib/stores.ts';

export class Dict {
  constructor(dict) {
    this.dict = dict;
    llang.subscribe((data) => {
      this.llang = data;

    });
    langs.subscribe((data) => {
      this.lang = data;
    });
    // return new Proxy(this, {
    //   get: function (target, prop) {
    //     if (prop in target) {
    //       return target[prop];
    //     } else {
    //       return target.get(prop);
    //     }
    //   },
    // });
  }

  async get(val) {
      // Вставьте здесь вашу функцию перевода
       return  await translate(val, this.lang);      
  }
  
}
