import translate from "translate";
import { i as llang, l as langs } from "./stores.js";
translate.engine = "google";
translate.from = "ru";
class Dict {
  constructor(dict) {
    this.dict = dict;
    llang.subscribe((data) => {
      this.llang = data;
    });
    langs.subscribe((data) => {
      this.lang = data;
    });
  }
  async get(val) {
    return await translate(val, this.lang);
  }
}
export {
  Dict as D
};
