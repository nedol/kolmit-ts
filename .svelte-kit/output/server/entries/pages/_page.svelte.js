import { s as subscribe, a as set_store_value, i as is_promise, n as noop, c as compute_rest_props } from "../../chunks/utils.js";
import { c as create_ssr_component, v as validate_component, e as escape, a as get_current_component, s as setContext, b as spread, d as escape_attribute_value, f as escape_object, h as add_attribute, g as getContext, i as each, o as onDestroy } from "../../chunks/ssr.js";
import "../../chunks/client.js";
import ISO6391 from "iso-google-locales";
import { T as Translate, a as TopAppBar, R as Row, S as Section$1, b as Title, P as Paper, C as Card, M as MediaContent, I as Item, c as Supporting, d as CommonLabel, e as IconButton, f as CommonIcon, g as Content, A as Accordion, h as Panel, H as Header$1, i as Checkbox } from "../../chunks/SelectionGroupIcon.js";
import { l as langs, d as dicts, e as editable, v as view, a as lesson, s as showBottomAppBar, m as muted, b as dc, u as users, c as call_but_status, f as click_call_func, p as posterst, g as msg, h as signal, o as operatorst, i as llang, j as dc_state, O as OnCheckQU, k as ice_conf } from "../../chunks/stores.js";
import { r as readable, w as writable } from "../../chunks/index2.js";
import { f as forwardEventsBuilder, c as classMap, e as exclude, p as prefixFilter, B as Button, T as Textfield } from "../../chunks/Textfield.js";
import { mdiEarHearing, mdiArrowLeft, mdiAccountConvertOutline, mdiArrowRight, mdiRepeat, mdiThumbUpOutline, mdiPlay, mdiMicrophoneOutline, mdiMicrophone, mdiShareVariant, mdiShuffle, mdiTextBoxCheckOutline, mdiAccountMultiple, mdiTextBoxOutline, mdiFileWordBoxOutline, mdiVolumeHigh, mdiVolumeOff, mdiAccountBox } from "@mdi/js";
import pkg from "lodash";
import "md5";
import "blueimp-load-image/js/load-image.js";
import "blueimp-load-image/js/load-image-scale.js";
import moment from "moment";
import EasySpeech from "easy-speech";
import "extendable-media-recorder";
import "translate";
import { T as Translate$1 } from "../../chunks/Translate.js";
const css$i = {
  code: "header.svelte-55ty7d{display:flex;justify-content:space-between;width:100%}.top-app-bar-container.svelte-55ty7d{top:0;border:1px solid\n      var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));margin:0 18px 18px 0;background-color:var(--mdc-theme-background, #fff);overflow:auto;display:inline-block}.lang_span.svelte-55ty7d{font-size:smaller;bottom:-15px;position:relative}.lang_list.svelte-55ty7d{position:absolute;top:50px;height:80vh;overflow:auto;justify-content:center;align-items:center;background-color:white}.sec_items.svelte-55ty7d{position:absolute;z-index:2;top:15%}@media(max-width: 480px){.top-app-bar-container.svelte-55ty7d{margin-right:0}}.flexor.svelte-55ty7d{display:inline-flex;flex-direction:column}.flexor-content.svelte-55ty7d{flex-basis:0;flex-grow:1;overflow:auto}@media screen and (max-width: 767px){.sec_items.svelte-55ty7d{position:absolute;left:35%;top:15%}}",
  map: null
};
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $langs, $$unsubscribe_langs;
  let $dicts, $$unsubscribe_dicts;
  let $editable, $$unsubscribe_editable;
  let $view, $$unsubscribe_view;
  let $$unsubscribe_lesson;
  let $$unsubscribe_showBottomAppBar;
  $$unsubscribe_langs = subscribe(langs, (value) => $langs = value);
  $$unsubscribe_dicts = subscribe(dicts, (value) => $dicts = value);
  $$unsubscribe_editable = subscribe(editable, (value) => $editable = value);
  $$unsubscribe_view = subscribe(view, (value) => $view = value);
  $$unsubscribe_lesson = subscribe(lesson, (value) => value);
  $$unsubscribe_showBottomAppBar = subscribe(showBottomAppBar, (value) => value);
  let topAppBar;
  $$result.css.add(css$i);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      if ($editable) {
        edited_display = $editable;
      }
    }
    {
      if ($dicts && !$dicts["CLASS"][$langs]) {
        (async () => {
          try {
            set_store_value(dicts, $dicts["CLASS"][$langs] = await Translate("CLASS", "en", $langs), $dicts);
          } catch (ex) {
            ISO6391.getName($langs);
          }
        })();
      }
    }
    {
      if ($dicts && !$dicts["LESSON"][$langs]) {
        (async () => {
          try {
            set_store_value(dicts, $dicts["LESSON"][$langs] = await Translate("LESSON", "en", $langs), $dicts);
          } catch (ex) {
            console.log(ex);
          }
        })();
      }
    }
    $$rendered = `${$dicts && $langs && $dicts["CLASS"][$langs] ? `<header class="svelte-55ty7d"><div class="top-app-bar-container flexor svelte-55ty7d">${validate_component(TopAppBar, "TopAppBar").$$render(
      $$result,
      {
        variant: "fixed",
        dense: true,
        this: topAppBar
      },
      {
        this: ($$value) => {
          topAppBar = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(Row, "Row").$$render($$result, {}, {}, {
            default: () => {
              return `<div class="sec_items svelte-55ty7d">${$view !== "login" ? `${validate_component(Section$1, "Section").$$render($$result, {}, {}, {
                default: () => {
                  return `${function(__value) {
                    if (is_promise(__value)) {
                      __value.then(null, noop);
                      return ``;
                    }
                    return function(data) {
                      return ` ${validate_component(Title, "Title").$$render($$result, {}, {}, {
                        default: () => {
                          return `${escape($dicts ? $dicts["CLASS"][$langs] : "CLASS")}`;
                        }
                      })} ${validate_component(Title, "Title").$$render($$result, {}, {}, {
                        default: () => {
                          return `${escape($dicts ? $dicts["LESSON"][$langs] : "LESSON")}`;
                        }
                      })} `;
                    }();
                  }(Translate("Quit the exercise?", "en", $langs))} `;
                }
              })}` : ``}</div> ${validate_component(Section$1, "Section").$$render($$result, { align: "end" }, {}, {
                default: () => {
                  return `<span class="lang_span svelte-55ty7d">${escape((() => {
                    return ISO6391.getNativeName($langs);
                  })())}</span> ${``}`;
                }
              })}`;
            }
          })}`;
        }
      }
    )} <div class="flexor-content svelte-55ty7d"></div></div></header>` : ``}`;
  } while (!$$settled);
  $$unsubscribe_langs();
  $$unsubscribe_dicts();
  $$unsubscribe_editable();
  $$unsubscribe_view();
  $$unsubscribe_lesson();
  $$unsubscribe_showBottomAppBar();
  return $$rendered;
});
const BottomAppBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["use", "class", "style", "color", "variant", "getPropStore", "getElement"]);
  let $colorStore, $$unsubscribe_colorStore;
  forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { style = "" } = $$props;
  let { color = "primary" } = $$props;
  let { variant = "standard" } = $$props;
  let element;
  let internalStyles = {};
  const colorStore = writable(color);
  $$unsubscribe_colorStore = subscribe(colorStore, (value) => $colorStore = value);
  let withFab = false;
  let adjustOffset = 0;
  setContext("SMUI:bottom-app-bar:color", colorStore);
  let propStoreSet;
  let propStore = readable({ withFab, adjustOffset, variant }, (set) => {
    propStoreSet = set;
  });
  function getPropStore() {
    return propStore;
  }
  function getElement() {
    return element;
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.style === void 0 && $$bindings.style && style !== void 0)
    $$bindings.style(style);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.variant === void 0 && $$bindings.variant && variant !== void 0)
    $$bindings.variant(variant);
  if ($$props.getPropStore === void 0 && $$bindings.getPropStore && getPropStore !== void 0)
    $$bindings.getPropStore(getPropStore);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  set_store_value(colorStore, $colorStore = color, $colorStore);
  {
    if (propStoreSet) {
      propStoreSet({ withFab, adjustOffset, variant });
    }
  }
  $$unsubscribe_colorStore();
  return ` <div${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [className]: true,
          "smui-bottom-app-bar": true,
          "smui-bottom-app-bar--standard": variant === "standard",
          "smui-bottom-app-bar--fixed": variant === "fixed"
        }))
      },
      {
        style: escape_attribute_value(Object.entries(internalStyles).map(([name, value]) => `${name}: ${value};`).concat([style]).join(" "))
      },
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", element, 0)}>${slots.default ? slots.default({}) : ``} </div>`;
});
const Section = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let usePass;
  let $$restProps = compute_rest_props($$props, ["use", "class", "fabInset", "getElement"]);
  let $color, $$unsubscribe_color;
  const forwardEvents = forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { fabInset = false } = $$props;
  let element;
  const color = getContext("SMUI:bottom-app-bar:color");
  $$unsubscribe_color = subscribe(color, (value) => $color = value);
  function getElement() {
    return element.getElement();
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.fabInset === void 0 && $$bindings.fabInset && fabInset !== void 0)
    $$bindings.fabInset(fabInset);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    usePass = [forwardEvents, ...use];
    $$rendered = `${validate_component(Paper, "Paper").$$render(
      $$result,
      Object.assign(
        {},
        { use: usePass },
        {
          class: classMap({
            [className]: true,
            "smui-bottom-app-bar__section": true,
            "smui-bottom-app-bar__section--fab-inset": fabInset
          })
        },
        { color: $color },
        { variant: "unelevated" },
        { square: true },
        $$restProps,
        { this: element }
      ),
      {
        this: ($$value) => {
          element = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${slots.default ? slots.default({}) : ``}`;
        }
      }
    )}`;
  } while (!$$settled);
  $$unsubscribe_color();
  return $$rendered;
});
const CircularProgress = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["use", "class", "indeterminate", "closed", "progress", "fourColor", "getElement"]);
  forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { indeterminate = false } = $$props;
  let { closed = false } = $$props;
  let { progress = 0 } = $$props;
  let { fourColor = false } = $$props;
  let element;
  let internalClasses = {};
  let internalAttrs = {};
  let determinateCircleAttrs = {};
  let determinateCircle;
  function getElement() {
    return element;
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.indeterminate === void 0 && $$bindings.indeterminate && indeterminate !== void 0)
    $$bindings.indeterminate(indeterminate);
  if ($$props.closed === void 0 && $$bindings.closed && closed !== void 0)
    $$bindings.closed(closed);
  if ($$props.progress === void 0 && $$bindings.progress && progress !== void 0)
    $$bindings.progress(progress);
  if ($$props.fourColor === void 0 && $$bindings.fourColor && fourColor !== void 0)
    $$bindings.fourColor(fourColor);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  return `<div${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [className]: true,
          "mdc-circular-progress": true,
          "mdc-circular-progress--indeterminate": indeterminate,
          "mdc-circular-progress--closed": closed,
          ...internalClasses
        }))
      },
      { role: "progressbar" },
      {
        "aria-valuemin": escape_attribute_value(0)
      },
      {
        "aria-valuemax": escape_attribute_value(1)
      },
      {
        "aria-valuenow": escape_attribute_value(indeterminate ? void 0 : progress)
      },
      escape_object(internalAttrs),
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", element, 0)}><div class="mdc-circular-progress__determinate-container"><svg class="mdc-circular-progress__determinate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><circle class="mdc-circular-progress__determinate-track" cx="24" cy="24" r="18" stroke-width="4"></circle><circle${spread(
    [
      {
        class: "mdc-circular-progress__determinate-circle"
      },
      { cx: "24" },
      { cy: "24" },
      { r: "18" },
      { "stroke-dasharray": "113.097" },
      { "stroke-dashoffset": "113.097" },
      { "stroke-width": "4" },
      escape_object(determinateCircleAttrs)
    ],
    {}
  )}${add_attribute("this", determinateCircle, 0)}></circle></svg></div> <div class="mdc-circular-progress__indeterminate-container">${each(fourColor ? [1, 2, 3, 4] : [1], (color) => {
    return `<div${add_attribute(
      "class",
      classMap({
        [className]: true,
        "mdc-circular-progress__spinner-layer": true,
        ["mdc-circular-progress__color-" + color]: fourColor
      }),
      0
    )}><div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left" data-svelte-h="svelte-1d4f91x"><svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549" stroke-width="4"></circle></svg></div> <div class="mdc-circular-progress__gap-patch" data-svelte-h="svelte-qvm4qv"><svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549" stroke-width="3.2"></circle></svg></div> <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-right" data-svelte-h="svelte-c3k2p4"><svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549" stroke-width="4"></circle></svg></div> </div>`;
  })}</div> </div>`;
});
const Media = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["use", "class", "aspectRatio", "getElement"]);
  forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { aspectRatio = void 0 } = $$props;
  let element;
  function getElement() {
    return element;
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.aspectRatio === void 0 && $$bindings.aspectRatio && aspectRatio !== void 0)
    $$bindings.aspectRatio(aspectRatio);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  return `<div${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [className]: true,
          "mdc-card__media": true,
          "mdc-card__media--square": aspectRatio === "square",
          "mdc-card__media--16-9": aspectRatio === "16x9"
        }))
      },
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", element, 0)}>${slots.default ? slots.default({}) : ``} </div>`;
});
const css$h = {
  code: ".card-container.svelte-hamr0z{position:relative;scale:1;top:10px;left:0px;height:70px;width:70px;margin:0 auto}video.svelte-hamr0z{display:block;margin-right:auto;margin-left:auto;margin-top:5px;max-height:70%}[status='call'].svelte-hamr0z{opacity:1}[status='talk'].svelte-hamr0z{opacity:1}[status='muted'].svelte-hamr0z{opacity:0.05}[status='inactive'].svelte-hamr0z{opacity:0.05}[status='active'].svelte-hamr0z{opacity:1}[status='busy'].svelte-hamr0z{opacity:0.05}",
  map: null
};
const Video_remote$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $muted, $$unsubscribe_muted;
  $$unsubscribe_muted = subscribe(muted, (value) => $muted = value);
  let { srcObject } = $$props;
  let { poster } = $$props;
  let { status } = $$props;
  let { video_element, card } = $$props;
  let { parent_div } = $$props;
  let { name, operator } = $$props;
  if ($$props.srcObject === void 0 && $$bindings.srcObject && srcObject !== void 0)
    $$bindings.srcObject(srcObject);
  if ($$props.poster === void 0 && $$bindings.poster && poster !== void 0)
    $$bindings.poster(poster);
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  if ($$props.video_element === void 0 && $$bindings.video_element && video_element !== void 0)
    $$bindings.video_element(video_element);
  if ($$props.card === void 0 && $$bindings.card && card !== void 0)
    $$bindings.card(card);
  if ($$props.parent_div === void 0 && $$bindings.parent_div && parent_div !== void 0)
    $$bindings.parent_div(parent_div);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.operator === void 0 && $$bindings.operator && operator !== void 0)
    $$bindings.operator(operator);
  $$result.css.add(css$h);
  {
    if (status) {
      console.log(status);
    }
  }
  {
    if (status === "talk") {
      set_store_value(muted, $muted = false, $muted);
    } else {
      set_store_value(muted, $muted = true, $muted);
    }
  }
  $$unsubscribe_muted();
  return `<div class="card-display"${add_attribute("this", parent_div, 0)}><div class="card-container svelte-hamr0z"${add_attribute("this", card, 0)}>${validate_component(Card, "Card").$$render($$result, { style: "min-width: 50px;" }, {}, {
    default: () => {
      return `${validate_component(Media, "Media").$$render(
        $$result,
        {
          class: "card-media-square",
          aspectRatio: "square"
        },
        {},
        {
          default: () => {
            return `${validate_component(MediaContent, "MediaContent").$$render($$result, {}, {}, {
              default: () => {
                return `<video class="user_video_remote svelte-hamr0z" ${$muted ? "muted" : ""}${add_attribute("status", status, 0)}${add_attribute("poster", poster, 0)} autoplay playsinline${add_attribute("this", video_element, 0)}><track kind="captions"></video>`;
              }
            })}`;
          }
        }
      )} `;
    }
  })}</div></div> ${slots.mute_button ? slots.mute_button({}) : ``}`;
});
const call = "/_app/immutable/assets/call.C8lmx5LD.mp3";
const Audio_local$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { paused = true } = $$props;
  let ls;
  if ($$props.paused === void 0 && $$bindings.paused && paused !== void 0)
    $$bindings.paused(paused);
  return `<audio loop${add_attribute("src", call, 0)}${add_attribute("this", ls, 0)} data-svelte-h="svelte-zfqvhd"><track kind="captions"></audio>`;
});
const User = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $dc, $$unsubscribe_dc;
  let $$unsubscribe_muted;
  let $users, $$unsubscribe_users;
  let $call_but_status, $$unsubscribe_call_but_status;
  let $click_call_func, $$unsubscribe_click_call_func;
  let $posterst, $$unsubscribe_posterst;
  let $msg, $$unsubscribe_msg;
  $$unsubscribe_dc = subscribe(dc, (value) => $dc = value);
  $$unsubscribe_muted = subscribe(muted, (value) => value);
  $$unsubscribe_users = subscribe(users, (value) => $users = value);
  $$unsubscribe_call_but_status = subscribe(call_but_status, (value) => $call_but_status = value);
  $$unsubscribe_click_call_func = subscribe(click_call_func, (value) => $click_call_func = value);
  $$unsubscribe_posterst = subscribe(posterst, (value) => $posterst = value);
  $$unsubscribe_msg = subscribe(msg, (value) => $msg = value);
  let { user_, group } = $$props;
  let name = user_.name;
  let operator = user_.operator;
  user_.abonent;
  user_.display = "none";
  let poster = user_.picture ? user_.picture : "/assets/operator.svg";
  set_store_value(click_call_func, $click_call_func = null, $click_call_func);
  let { rtc = "" } = $$props;
  let inter, status = "active", card;
  let video_element, parent_div;
  let local = {
    video: { display: "none", srcObject: "" },
    audio: { paused: true, src: "" }
  };
  let remote = {
    video: { display: "block", srcObject: "", poster }
  };
  getContext("operator");
  function OnMessage(data) {
    if (data.func === "talk") {
      set_store_value(call_but_status, $call_but_status = "talk", $call_but_status);
    }
    if (data.func === "offer" && status == "active" && $call_but_status == "active") {
      if (data.operators && data.operators[user_.operator]) {
        user_.display = "block";
      }
    } else {
      user_.display = "none";
    }
    local.audio.paused = true;
    if (data.func === "close") {
      if (data.operator === user_.operator) {
        rtc?.OnInactive();
        set_store_value(call_but_status, $call_but_status = "inactive", $call_but_status);
        parent_div.appendChild(card);
      }
    }
  }
  let res_talk;
  let OnClickCallButton = function(resolve) {
    res_talk = resolve;
    switch (status) {
      case "active":
        if ($call_but_status === "call" || $call_but_status === "talk")
          break;
        user_.display = "block";
        set_store_value(click_call_func, $click_call_func = OnClickCallButton, $click_call_func);
        (() => {
          set_store_value(posterst, $posterst = poster, $posterst);
          rtc.Call(operator);
          status = "call";
          video_element.load();
          window.scrollTo({ top: 0, behavior: "smooth" });
        })();
        break;
      case "call_":
        status = "inactive";
        user_.display = "none";
        local.audio.paused = true;
        local.video.display = "none";
        clearInterval(inter);
        rtc.OnInactive();
        set_store_value(click_call_func, $click_call_func = null, $click_call_func);
        break;
      case "talk_":
        status = "inactive";
        user_.display = "none";
        local.video.display = "none";
        rtc.OnInactive();
        set_store_value(click_call_func, $click_call_func = null, $click_call_func);
        video_element.poster = "";
        video_element.load();
        video_element.poster = remote.video?.poster;
        break;
      case "muted_":
        status = "inactive";
        user_.display = "none";
        set_store_value(click_call_func, $click_call_func = null, $click_call_func);
        break;
      case "busy_":
        if ($call_but_status === "talk") {
          status = "inactive";
          user_.display = "none";
          rtc.OnInactive();
        }
        break;
    }
  };
  set_store_value(users, $users[operator] = { OnClickCallButton }, $users);
  onDestroy(async () => {
    $dc?.SendDCClose(() => {
    });
    local.video.display = "none";
    remote.video.display = "none";
    console.log();
  });
  if ($$props.user_ === void 0 && $$bindings.user_ && user_ !== void 0)
    $$bindings.user_(user_);
  if ($$props.group === void 0 && $$bindings.group && group !== void 0)
    $$bindings.group(group);
  if ($$props.rtc === void 0 && $$bindings.rtc && rtc !== void 0)
    $$bindings.rtc(rtc);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      if ($msg) {
        OnMessage($msg);
      }
    }
    {
      switch ($call_but_status) {
        case "talk":
          if (typeof res_talk === "function")
            res_talk();
          break;
      }
    }
    $$rendered = `${validate_component(Video_remote$1, "VideoRemote").$$render(
      $$result,
      Object.assign({}, remote.video, { name }, { operator }, { parent_div }, { video_element }, { card }, { status }),
      {
        parent_div: ($$value) => {
          parent_div = $$value;
          $$settled = false;
        },
        video_element: ($$value) => {
          video_element = $$value;
          $$settled = false;
        },
        card: ($$value) => {
          card = $$value;
          $$settled = false;
        },
        status: ($$value) => {
          status = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${validate_component(Audio_local$1, "AudioLocal").$$render(
      $$result,
      Object.assign({}, local.audio, { paused: local.audio.paused }),
      {
        paused: ($$value) => {
          local.audio.paused = $$value;
          $$settled = false;
        }
      },
      {}
    )}`;
  } while (!$$settled);
  $$unsubscribe_dc();
  $$unsubscribe_muted();
  $$unsubscribe_users();
  $$unsubscribe_call_but_status();
  $$unsubscribe_click_call_func();
  $$unsubscribe_posterst();
  $$unsubscribe_msg();
  return $$rendered;
});
const css$g = {
  code: ".deps_div.svelte-1ne0ilq{overflow-y:scroll;margin-left:0px;margin-top:40px}.svelte-1ne0ilq::-webkit-scrollbar{display:none}.flexy-dad.svelte-1ne0ilq{display:flex;flex-wrap:wrap;margin-bottom:35px;justify-content:flex-start}.tutor.svelte-1ne0ilq{position:absolute;bottom:50px;display:flex;flex-wrap:wrap;justify-content:start}.flexy-boy.svelte-1ne0ilq{display:flex;justify-content:center;width:90px;height:100px;margin:0 0px 0px 0;scale:0.8}",
  map: null
};
function OnClickUpload() {
}
const Group = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $msg, $$unsubscribe_msg;
  let $call_but_status, $$unsubscribe_call_but_status;
  let $users, $$unsubscribe_users;
  let $signal, $$unsubscribe_signal;
  let $$unsubscribe_langs;
  $$unsubscribe_msg = subscribe(msg, (value) => $msg = value);
  $$unsubscribe_call_but_status = subscribe(call_but_status, (value) => $call_but_status = value);
  $$unsubscribe_users = subscribe(users, (value) => $users = value);
  $$unsubscribe_signal = subscribe(signal, (value) => $signal = value);
  $$unsubscribe_langs = subscribe(langs, (value) => value);
  const { mapValues, find } = pkg;
  let { rtc, oper_display } = $$props;
  let operator = getContext("operator");
  getContext("group_data");
  let { group = [] } = $$props;
  setContext("group", group);
  async function GetOperators(par) {
    $signal.SendMessage(par, (data) => {
      onMessage({ operators: data.resp });
    });
  }
  function onMessage(data) {
    console.log();
    if (data.operators) {
      Object.keys(data.operators).map((el) => {
        if (data.operators[el].status === "offer" && !find(group, { operator: el })) {
          group.push(data.operators[el]);
        } else {
          const ind = group.indexOf(data.operators[el]);
          if (ind !== -1)
            group.splice(ind, 1);
        }
      });
      group = group;
    }
    if (data.status === "offer" && $call_but_status === "active") {
      const el = {
        display: "block",
        abonent: data.abonent,
        operator: data.operator,
        name: data.name,
        uid: data.uid,
        picture: data.picture
      };
      if (!find(group, { operator: data.operator })) {
        group?.push(el);
        group = group;
      }
      set_store_value(msg, $msg = "", $msg);
    } else if (data.status === "close") {
      console.log();
      let el = find(group, { uid: data.operator });
      const ind = group.indexOf(el);
      group.splice(ind, 1);
      group = group;
      set_store_value(msg, $msg = "", $msg);
    }
  }
  if ($$props.rtc === void 0 && $$bindings.rtc && rtc !== void 0)
    $$bindings.rtc(rtc);
  if ($$props.oper_display === void 0 && $$bindings.oper_display && oper_display !== void 0)
    $$bindings.oper_display(oper_display);
  if ($$props.group === void 0 && $$bindings.group && group !== void 0)
    $$bindings.group(group);
  $$result.css.add(css$g);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      if ($msg) {
        onMessage($msg);
      }
    }
    {
      if ($call_but_status === "active") {
        GetOperators({
          type: "user",
          func: "operators",
          abonent: operator.abonent,
          operator: operator.operator
        });
      } else if ($call_but_status === "inactive") {
        group = group = [];
      }
    }
    {
      if (Object.keys($users).length > 0) {
        mapValues($users, function(o) {
          if (o.status !== "inactive" && o.status !== "busy")
            ;
        });
      }
    }
    $$rendered = ` <div class="deps_div svelte-1ne0ilq"> <div class="flexy-dad svelte-1ne0ilq">${each(group, (user, i) => {
      return `${user && user.operator !== operator.operator ? `<br class="svelte-1ne0ilq"> <div class="${"mdc-elevation--z" + escape(i + 1, true) + " flexy-boy svelte-1ne0ilq"}" style="display:block">${validate_component(Item, "Item").$$render($$result, { style: "text-align: center" }, {}, {
        default: () => {
          return `${validate_component(User, "User").$$render(
            $$result,
            { OnClickUpload, rtc, user_: user, group },
            {
              user_: ($$value) => {
                user = $$value;
                $$settled = false;
              },
              group: ($$value) => {
                group = $$value;
                $$settled = false;
              }
            },
            {}
          )} ${validate_component(Supporting, "Supporting").$$render($$result, {}, {}, {
            default: () => {
              return `${validate_component(CommonLabel, "Label").$$render($$result, {}, {}, {
                default: () => {
                  return `${escape(user.name)}`;
                }
              })} `;
            }
          })} `;
        }
      })} </div>` : ``}`;
    })}</div> ${``} </div> <div style="height:100px" class="svelte-1ne0ilq"></div>`;
  } while (!$$settled);
  $$unsubscribe_msg();
  $$unsubscribe_call_but_status();
  $$unsubscribe_users();
  $$unsubscribe_signal();
  $$unsubscribe_langs();
  return $$rendered;
});
operatorst.subscribe((data) => {
});
posterst.subscribe((data) => {
});
const css$f = {
  code: ".callButton.svelte-mw3tu7.svelte-mw3tu7{position:relative;top:-10px;right:10px;z-index:1}[status='call'].svelte-mw3tu7.svelte-mw3tu7{transform:rotate(0deg) !important;animation-iteration-count:infinite}[status='call'].svelte-mw3tu7 g.svelte-mw3tu7{fill:orange}[status='talk'].svelte-mw3tu7.svelte-mw3tu7{transform:rotate(0deg) !important}[status='talk'].svelte-mw3tu7 g.svelte-mw3tu7{fill:green}[status='muted'].svelte-mw3tu7.svelte-mw3tu7{transform:rotate(120deg) !important;color:#232323}[status='inactive'].svelte-mw3tu7.svelte-mw3tu7{color:#dea677;transform:rotate(120deg)}[status='inactive'].svelte-mw3tu7 g.svelte-mw3tu7{fill:grey}[status='active'].svelte-mw3tu7.svelte-mw3tu7{transform:rotate(120deg);color:black;opacity:1}[status='active'].svelte-mw3tu7 g.svelte-mw3tu7{fill:orange}[status='busy'].svelte-mw3tu7.svelte-mw3tu7{transform:rotate(120deg);opacity:0.3;color:indianred}@keyframes svelte-mw3tu7-shake{0%{transform:translate(1px, 1px) rotate(0deg)}10%{transform:translate(-1px, -2px) rotate(-1deg)}20%{transform:translate(-3px, 0px) rotate(1deg)}30%{transform:translate(3px, 2px) rotate(0deg)}40%{transform:translate(1px, -1px) rotate(1deg)}50%{transform:translate(-1px, 2px) rotate(-1deg)}60%{transform:translate(-3px, 1px) rotate(0deg)}70%{transform:translate(3px, 1px) rotate(-1deg)}80%{transform:translate(-1px, -1px) rotate(1deg)}90%{transform:translate(1px, 2px) rotate(0deg)}100%{transform:translate(1px, -2px) rotate(-1deg)}}",
  map: null
};
const CallButtonOperator = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $call_but_status, $$unsubscribe_call_but_status;
  $$unsubscribe_call_but_status = subscribe(call_but_status, (value) => $call_but_status = value);
  let status;
  $$result.css.add(css$f);
  {
    if ($call_but_status) {
      status = $call_but_status;
    }
  }
  $$unsubscribe_call_but_status();
  return `<div class="callObject" style="display: block;"> <svg class="callButton svelte-mw3tu7"${add_attribute("status", status, 0)} width="50" height="50"><g class="currentLayer svelte-mw3tu7" style="stroke:lightgrey; stroke-width:10px"><title>Layer 1</title><path d="M390.7 353.3c-120.30000000000001 69.5 63.19999999999999 413.59999999999997 194.90000000000003 337.59999999999997l122.10000000000002 211.39999999999998c-55.60000000000002 32.10000000000002-102.5 52.30000000000007-166.9000000000001 15.5-178.79999999999995-102.19999999999993-375.59999999999997-442.9-369.99999999999994-646.0999999999999 1.8999999999999773-70.60000000000005 43.599999999999994-98.30000000000004 97.89999999999998-129.70000000000005 23.30000000000001 40.400000000000006 98.60000000000002 170.8 122 211.3z m50.400000000000034-5.699999999999989c-13 7.5-29.700000000000045 3.099999999999966-37.30000000000001-10l-115-199.3c-7.5-13.000000000000014-3.1000000000000227-29.700000000000017 10-37.30000000000001l60.5-34.900000000000006c13-7.499999999999993 29.69999999999999-3.0999999999999943 37.30000000000001 10l115.09999999999997 199.29999999999998c7.500000000000057 13 3.099999999999966 29.700000000000045-10 37.200000000000045l-60.599999999999966 35z m314.4 544.5c-13 7.5-29.700000000000045 3.1000000000000227-37.299999999999955-10l-115-199.30000000000007c-7.5-13-3.1000000000000227-29.699999999999932 10-37.299999999999955l60.5-34.89999999999998c13-7.5 29.699999999999932-3.1000000000000227 37.299999999999955 10l115.10000000000002 199.29999999999995c7.5 13 3.1000000000000227 29.700000000000045-10 37.30000000000007l-60.60000000000002 34.89999999999998z" id="svg_1" class="selected" transform="scale(.04)"></path></g></svg>  </div>`;
});
const css$e = {
  code: "video.svelte-1cgyaki{display:block;margin-right:auto;margin-left:auto;margin-top:auto;max-width:40px;max-height:40px}",
  map: null
};
let display = "block";
const Video_local = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { srcObject = "" } = $$props;
  let lv, card, parent_div;
  const oper = getContext("operator");
  const poster = oper.picture;
  if ($$props.srcObject === void 0 && $$bindings.srcObject && srcObject !== void 0)
    $$bindings.srcObject(srcObject);
  $$result.css.add(css$e);
  return `<div class="card-display"${add_attribute("this", parent_div, 0)}><div class="card-container"${add_attribute("this", card, 0)}>${validate_component(Card, "Card").$$render($$result, { style: "min-width: 40px;" }, {}, {
    default: () => {
      return `${validate_component(Media, "Media").$$render(
        $$result,
        {
          class: "card-media-square",
          aspectRatio: "square"
        },
        {},
        {
          default: () => {
            return `${validate_component(MediaContent, "MediaContent").$$render($$result, {}, {}, {
              default: () => {
                return `<video class="oper_video_local svelte-1cgyaki"${add_attribute("poster", poster, 0)} autoplay playsinline style="${"display: " + escape(display, true)}"${add_attribute("this", lv, 0)}></video>`;
              }
            })}`;
          }
        }
      )}  <h3 class="mdc-typography--subtitle2" style="margin: 0; color: #888;font-size:smaller;text-align:center; z-index:1"></h3>`;
    }
  })}</div></div>  ${slots.footer ? slots.footer({}) : ``}`;
});
const css$d = {
  code: ".card-container.svelte-13c68d2{position:relative;left:-8px;scale:0.8;bottom:20px}video.svelte-13c68d2{display:block;margin-right:auto;margin-left:auto;margin-top:auto;max-width:50px;max-height:50px}.oper_video_remote.svelte-13c68d2{position:relative;top:7px}",
  map: null
};
const Video_remote = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $muted, $$unsubscribe_muted;
  $$unsubscribe_muted = subscribe(muted, (value) => $muted = value);
  let { display: display2 = "block" } = $$props;
  let { status } = $$props;
  let { isRemoteAudioMute = false } = $$props;
  let { card } = $$props;
  let { srcObject } = $$props;
  let { operator } = $$props;
  let { name } = $$props;
  let { poster } = $$props;
  let video;
  if ($$props.display === void 0 && $$bindings.display && display2 !== void 0)
    $$bindings.display(display2);
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  if ($$props.isRemoteAudioMute === void 0 && $$bindings.isRemoteAudioMute && isRemoteAudioMute !== void 0)
    $$bindings.isRemoteAudioMute(isRemoteAudioMute);
  if ($$props.card === void 0 && $$bindings.card && card !== void 0)
    $$bindings.card(card);
  if ($$props.srcObject === void 0 && $$bindings.srcObject && srcObject !== void 0)
    $$bindings.srcObject(srcObject);
  if ($$props.operator === void 0 && $$bindings.operator && operator !== void 0)
    $$bindings.operator(operator);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.poster === void 0 && $$bindings.poster && poster !== void 0)
    $$bindings.poster(poster);
  $$result.css.add(css$d);
  {
    if (status === "talk" && !isRemoteAudioMute) {
      set_store_value(muted, $muted = false, $muted);
    } else {
      set_store_value(muted, $muted = true, $muted);
    }
  }
  $$unsubscribe_muted();
  return ` <div class="card-display" style="${"display:" + escape(display2, true)}"${add_attribute("this", card, 0)}><div class="card-container svelte-13c68d2">${validate_component(Card, "Card").$$render($$result, { style: "min-width: 60px;" }, {}, {
    default: () => {
      return `${validate_component(Media, "Media").$$render(
        $$result,
        {
          class: "card-media-square",
          aspectRatio: "square"
        },
        {},
        {
          default: () => {
            return `${validate_component(MediaContent, "MediaContent").$$render($$result, {}, {}, {
              default: () => {
                return `<video class="oper_video_remote svelte-13c68d2"${add_attribute("status", status, 0)} ${$muted ? "muted" : ""} autoplay playsinline${add_attribute("poster", poster, 0)}${add_attribute("this", video, 0)}><track kind="captions"></video>`;
              }
            })}`;
          }
        }
      )}  `;
    }
  })}</div></div> `;
});
const ring = "/_app/immutable/assets/ring.C9X-rfjT.mp3";
const Audio_local = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { paused = true } = $$props;
  let ls;
  if ($$props.paused === void 0 && $$bindings.paused && paused !== void 0)
    $$bindings.paused(paused);
  return `<audio${add_attribute("src", ring, 0)} loop${add_attribute("this", ls, 0)} data-svelte-h="svelte-zjfzj1"><track kind="captions"></audio>`;
});
const Badge = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["use", "class", "square", "color", "position", "align", "getElement"]);
  forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { square = false } = $$props;
  let { color = "primary" } = $$props;
  let { position = "middle" } = $$props;
  let { align = "top-end" } = $$props;
  let element;
  function getElement() {
    return element;
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.square === void 0 && $$bindings.square && square !== void 0)
    $$bindings.square(square);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.position === void 0 && $$bindings.position && position !== void 0)
    $$bindings.position(position);
  if ($$props.align === void 0 && $$bindings.align && align !== void 0)
    $$bindings.align(align);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  return `<span${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [className]: true,
          "smui-badge": true,
          "smui-badge--rounded": !square,
          ["smui-badge--color-" + color]: true,
          ["smui-badge--position-" + position]: true,
          ["smui-badge--align-" + align]: true
        }))
      },
      { role: "status" },
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", element, 0)}>${slots.default ? slots.default({}) : ``} </span>`;
});
let counter = 0;
const FormField = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["use", "class", "align", "noWrap", "inputId", "label$use", "getElement"]);
  forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { align = "start" } = $$props;
  let { noWrap = false } = $$props;
  let { inputId = "SMUI-form-field-" + counter++ } = $$props;
  let { label$use = [] } = $$props;
  let element;
  let label;
  setContext("SMUI:generic:input:props", { id: inputId });
  function getElement() {
    return element;
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.align === void 0 && $$bindings.align && align !== void 0)
    $$bindings.align(align);
  if ($$props.noWrap === void 0 && $$bindings.noWrap && noWrap !== void 0)
    $$bindings.noWrap(noWrap);
  if ($$props.inputId === void 0 && $$bindings.inputId && inputId !== void 0)
    $$bindings.inputId(inputId);
  if ($$props.label$use === void 0 && $$bindings.label$use && label$use !== void 0)
    $$bindings.label$use(label$use);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  return `<div${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [className]: true,
          "mdc-form-field": true,
          "mdc-form-field--align-end": align === "end",
          "mdc-form-field--nowrap": noWrap
        }))
      },
      escape_object(exclude($$restProps, ["label$"]))
    ],
    {}
  )}${add_attribute("this", element, 0)}>${slots.default ? slots.default({}) : ``} <label${spread(
    [
      { for: escape_attribute_value(inputId) },
      escape_object(prefixFilter($$restProps, "label$"))
    ],
    {}
  )}${add_attribute("this", label, 0)}>${slots.label ? slots.label({}) : ``}</label> </div>`;
});
const css$c = {
  code: ".svelte-1qri6qe::selection{background:rgb(190, 201, 205)}.speaker-button.svelte-1qri6qe{display:inline-flex;float:right;font-size:large;border-radius:25px;margin-right:0px;margin-left:10px;z-index:2}",
  map: null
};
const Dialog_Context = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_llang;
  let $$unsubscribe_langs;
  let $dc_state, $$unsubscribe_dc_state;
  $$unsubscribe_llang = subscribe(llang, (value) => value);
  $$unsubscribe_langs = subscribe(langs, (value) => value);
  $$unsubscribe_dc_state = subscribe(dc_state, (value) => $dc_state = value);
  let { data, quiz, tts } = $$props;
  let playAutoColor = "currentColor";
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.quiz === void 0 && $$bindings.quiz && quiz !== void 0)
    $$bindings.quiz(quiz);
  if ($$props.tts === void 0 && $$bindings.tts && tts !== void 0)
    $$bindings.tts(tts);
  $$result.css.add(css$c);
  {
    {
      playAutoColor = "currentColor";
    }
  }
  $$unsubscribe_llang();
  $$unsubscribe_langs();
  $$unsubscribe_dc_state();
  return `<div style="height:300vh; overflow-y:auto;font-size:smaller;color:#2196f3" class="svelte-1qri6qe">${$dc_state === "close" ? `<div class="speaker-button svelte-1qri6qe">${validate_component(IconButton, "IconButton").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(CommonIcon, "Icon").$$render($$result, { tag: "svg", viewBox: "0 0 24 24" }, {}, {
        default: () => {
          return `<path${add_attribute("fill", playAutoColor, 0)}${add_attribute("d", mdiEarHearing, 0)} class="svelte-1qri6qe"></path>`;
        }
      })}`;
    }
  })}</div> <!-- HTML_TAG_START -->${data.html}<!-- HTML_TAG_END -->` : ``} </div>`;
});
function numberToDutchString(number) {
  const ones = [
    "",
    "een",
    "twee",
    "drie",
    "vier",
    "vijf",
    "zes",
    "zeven",
    "acht",
    "negen"
  ];
  const teens = [
    "tien",
    "elf",
    "twaalf",
    "dertien",
    "veertien",
    "vijftien",
    "zestien",
    "zeventien",
    "achttien",
    "negentien"
  ];
  const tens = [
    "",
    "",
    "twintig",
    "dertig",
    "veertig",
    "vijftig",
    "zestig",
    "zeventig",
    "tachtig",
    "negentig"
  ];
  function convertToWords(num) {
    if (num < 10)
      return ones[num];
    if (num < 20)
      return teens[num - 10];
    const ten = Math.floor(num / 10);
    const rest = num % 10;
    return rest === 0 ? tens[ten] : ones[rest] + "en" + tens[ten];
  }
  function convertGroup(num, unit) {
    const hundred = Math.floor(num / 100);
    const rest = num % 100;
    let result2 = "";
    if (hundred > 0) {
      result2 += ones[hundred] + "honderd";
      if (rest > 0)
        result2 += "en";
    }
    if (rest > 0) {
      result2 += convertToWords(rest);
    }
    if (unit) {
      result2 += unit;
    }
    return result2;
  }
  if (number === 0)
    return "nul";
  let result = "";
  let unitIndex = 0;
  while (number > 0) {
    const group = number % 1e3;
    if (group > 0) {
      const groupResult = convertGroup(
        group,
        unitIndex === 1 ? "duizend" : ""
      );
      result = groupResult + (result ? "en" : "") + result;
    }
    number = Math.floor(number / 1e3);
    unitIndex++;
  }
  return result.trim();
}
langs.subscribe((data) => {
});
EasySpeech.detect();
EasySpeech.init({ maxTimeout: 5e3, interval: 250 }).then(() => console.debug("load complete")).catch((e) => console.error(e));
function CollectGarbage() {
}
function Cancel() {
}
function Pause() {
}
function Resume() {
}
async function initSpeech() {
}
const Tts = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $langs, $$unsubscribe_langs;
  $$unsubscribe_langs = subscribe(langs, (value) => $langs = value);
  let audio;
  async function Speak_google(lang2, text, quiz, cb_end) {
    if (!audio || audio && text !== audio.text) {
      text = text.replace(/<[^>]+>.*?<\/[^>]+>/g, "");
      const par = {
        func: "tts",
        text,
        lang: lang2,
        //(lang=='nl'?lang+'-BE':lang)
        quiz
      };
      const response = await fetch("/speech/tts", {
        method: "POST",
        body: JSON.stringify({ par })
      });
      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }
      const url = await response.json();
      audio = new Audio(url.resp.audio);
      audio.type = "audio/mpeg";
      audio.text = text;
      audio.playbackRate = lang2 === $langs ? 1 : 0.9;
    }
    if (cb_end)
      audio.addEventListener("ended", function() {
        cb_end();
        audio = "";
      });
    audio.playbackRate = lang2 === $langs ? 1 : 0.9;
    audio.play();
  }
  async function Speak_server(lang2, text, quiz, cb_end) {
    async function onEnd(res) {
      if (cb_end)
        cb_end();
    }
    await Speak_google(lang2, text, quiz, onEnd);
  }
  onDestroy(() => {
    audio = "";
  });
  if ($$props.Speak_google === void 0 && $$bindings.Speak_google && Speak_google !== void 0)
    $$bindings.Speak_google(Speak_google);
  if ($$props.Speak_server === void 0 && $$bindings.Speak_server && Speak_server !== void 0)
    $$bindings.Speak_server(Speak_server);
  if ($$props.CollectGarbage === void 0 && $$bindings.CollectGarbage && CollectGarbage !== void 0)
    $$bindings.CollectGarbage(CollectGarbage);
  if ($$props.Cancel === void 0 && $$bindings.Cancel && Cancel !== void 0)
    $$bindings.Cancel(Cancel);
  if ($$props.Pause === void 0 && $$bindings.Pause && Pause !== void 0)
    $$bindings.Pause(Pause);
  if ($$props.Resume === void 0 && $$bindings.Resume && Resume !== void 0)
    $$bindings.Resume(Resume);
  if ($$props.initSpeech === void 0 && $$bindings.initSpeech && initSpeech !== void 0)
    $$bindings.initSpeech(initSpeech);
  $$unsubscribe_langs();
  return ``;
});
const css$b = {
  code: "audio.svelte-1wq1rn3{height:25px;margin:0 auto}",
  map: null
};
const threshold = 10;
const silenceDelay = 2e3;
async function sendLoadModel() {
  fetch("/speech/stt", {
    method: "POST",
    // mode: 'no-cors',
    body: JSON.stringify({ load: "model" }),
    headers: { "Content-Type": "application/json" }
    // Authorization: `Bearer ${token}`
  });
}
const Stt = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { SttResult, StopListening, display_audio } = $$props;
  let mediaRecorder, mediaStream, audioAnalyser, audioChunks = [], audioUrl, audioPlayer, isRecording = false, silenceTimer;
  let checkLoop = true;
  let from_lang = "en";
  let to_lang = "en";
  async function startAudioMonitoring(from, to) {
    from_lang = from;
    to_lang = to;
    try {
      startRecording();
      checkAudio();
    } catch (error) {
      console.error("Ошибка доступа к микрофону:", error);
    }
  }
  function checkAudio() {
    console.log("startRecording");
    const dataArray = new Uint8Array(audioAnalyser.frequencyBinCount);
    const checkSilence = () => {
      audioAnalyser.getByteFrequencyData(dataArray);
      const sum = dataArray.reduce((a, b) => a + b, 0);
      const average = sum / dataArray.length;
      console.log("average:", average);
      if (average > threshold) {
        console.log("threshold:", average);
        clearTimeout(silenceTimer);
        silenceTimer = "";
        console.log("silenceTimer after:", silenceTimer);
      } else if (average <= threshold && isRecording) {
        if (!silenceTimer)
          silenceTimer = setTimeout(
            () => {
              MediaRecorderStop();
              console.log("stopRecording:", average);
            },
            silenceDelay
          );
      }
      if (checkLoop) {
        requestAnimationFrame(checkSilence);
      }
    };
    checkSilence();
  }
  function SendRecognition() {
    const len = audioChunks.length;
    sendAudioToRecognition(audioChunks[len - 1]);
  }
  function MediaRecorderStop() {
    isRecording = false;
    silenceTimer = "";
    checkLoop = false;
    clearTimeout(silenceTimer);
    mediaRecorder.stop();
  }
  function startRecording() {
    if (Array.isArray(audioChunks) && audioChunks.length > 0) {
      audioChunks.splice(0, 1);
    }
    mediaRecorder.start();
    isRecording = true;
    checkLoop = true;
    mediaStream.enable = false;
  }
  async function sendAudioToRecognition(blob) {
    try {
      const headers = { "Content-Type": "application/json" };
      const formData = new FormData();
      formData.append("file", blob, "audio.wav");
      formData.append("from_lang", from_lang);
      formData.append("to_lang", to_lang);
      fetch("/speech/stt", {
        method: "POST",
        // mode: 'no-cors',
        body: formData,
        headers: { headers }
      }).then((response) => response.json()).then((data) => {
        SttResult(data.resp);
      }).catch((error) => {
        console.log(error);
        return [];
      });
    } catch (error) {
      console.log("Ошибка отправки аудио:", error);
    }
  }
  onDestroy(() => {
    mediaRecorder = "";
    mediaStream = "";
    audioAnalyser = "";
    audioUrl = "";
    audioPlayer = "";
    audioChunks = "";
    clearTimeout(silenceTimer);
  });
  if ($$props.SttResult === void 0 && $$bindings.SttResult && SttResult !== void 0)
    $$bindings.SttResult(SttResult);
  if ($$props.StopListening === void 0 && $$bindings.StopListening && StopListening !== void 0)
    $$bindings.StopListening(StopListening);
  if ($$props.display_audio === void 0 && $$bindings.display_audio && display_audio !== void 0)
    $$bindings.display_audio(display_audio);
  if ($$props.startAudioMonitoring === void 0 && $$bindings.startAudioMonitoring && startAudioMonitoring !== void 0)
    $$bindings.startAudioMonitoring(startAudioMonitoring);
  if ($$props.SendRecognition === void 0 && $$bindings.SendRecognition && SendRecognition !== void 0)
    $$bindings.SendRecognition(SendRecognition);
  if ($$props.MediaRecorderStop === void 0 && $$bindings.MediaRecorderStop && MediaRecorderStop !== void 0)
    $$bindings.MediaRecorderStop(MediaRecorderStop);
  if ($$props.sendLoadModel === void 0 && $$bindings.sendLoadModel && sendLoadModel !== void 0)
    $$bindings.sendLoadModel(sendLoadModel);
  if ($$props.sendAudioToRecognition === void 0 && $$bindings.sendAudioToRecognition && sendAudioToRecognition !== void 0)
    $$bindings.sendAudioToRecognition(sendAudioToRecognition);
  $$result.css.add(css$b);
  return `<audio${add_attribute("src", audioUrl, 0)} controls style="${"display:" + escape(display_audio, true)}" class="svelte-1wq1rn3"${add_attribute("this", audioPlayer, 0)}></audio> `;
});
const css$a = {
  code: "main_dlg.svelte-1e5of7v.svelte-1e5of7v{transition:transform 0.3s ease-in-out;width:100vw;margin:0 auto;position:relative;transform-style:preserve-3d;transition:transform 0.5s;height:120vh}.repeat_alert.svelte-1e5of7v.svelte-1e5of7v{position:absolute;left:30px;z-index:2}.thumb_alert.svelte-1e5of7v.svelte-1e5of7v{position:absolute;width:30px;z-index:2;right:40px}.container.svelte-1e5of7v.svelte-1e5of7v{display:flex;top:5px;margin-bottom:30px;position:relative;justify-content:space-between;align-items:center}.repeat_but.svelte-1e5of7v.svelte-1e5of7v{display:inline-flex;color:grey;margin-left:15px;font-size:smaller;top:0px;z-index:2;scale:1}.thumb_but.svelte-1e5of7v.svelte-1e5of7v{display:inline-flex;color:grey;margin-right:15px;font-size:smaller;top:0px;z-index:2;scale:1}.top-app-bar-container.svelte-1e5of7v.svelte-1e5of7v{position:relative;top:30px;border:1px solid\n      var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));margin:0 18px 18px 0;background-color:var(--mdc-theme-background, #fff)}.margins.svelte-1e5of7v.svelte-1e5of7v{top:10px;position:relative;margin-right:10px;margin-left:10px}.margins.svelte-1e5of7v>.svelte-1e5of7v{margin-right:10px}.button_shared_true.svelte-1e5of7v.svelte-1e5of7v{position:relative;font-size:1.5em;color:blue;border:none;border-radius:5px;cursor:pointer}.button_shared_false.svelte-1e5of7v.svelte-1e5of7v{position:relative;font-size:1.5em;color:grey;border:none;border-radius:5px;cursor:pointer}.flip_button.svelte-1e5of7v.svelte-1e5of7v{position:relative;font-size:1.5em;text-align:center;color:grey;border:none;border-radius:5px;cursor:pointer;width:50px}.speaker-button.svelte-1e5of7v.svelte-1e5of7v{display:inline-flex;float:right;font-size:large;border-radius:25px;margin-right:0px;margin-left:10px;z-index:2}.html_data.svelte-1e5of7v.svelte-1e5of7v{display:grid;width:100vw;position:relative;overflow-y:auto;height:100vh;margin:0 auto;margin-top:30px;border:0}.counter.svelte-1e5of7v.svelte-1e5of7v{background-color:#f0f0f0;padding:0px;border-radius:25px;width:30px;height:30px;top:-10px;left:-6px;box-shadow:0 2px 4px rgba(0, 0, 0, 0.1);text-align:center}.counter.svelte-1e5of7v p.svelte-1e5of7v{margin:0;font-size:15px;color:#333}.counter.svelte-1e5of7v span.svelte-1e5of7v{font-weight:700;font-size:15px;color:#ff5733}.cnt.svelte-1e5of7v.svelte-1e5of7v{position:absolute;text-align:left;left:15px;top:-2px;z-index:2;font-size:1em;margin-bottom:10px;color:#501d94}.title.svelte-1e5of7v.svelte-1e5of7v{width:fit-content;margin:5px auto;margin-top:15px;color:coral;line-height:normal;text-align:center;font-size:0.8em;background-color:ghostwhite}.user1.svelte-1e5of7v.svelte-1e5of7v{position:relative;text-align:center;line-height:normal;font-size:0.8em;margin-bottom:0px;color:#333;z-index:-1}.user2.svelte-1e5of7v.svelte-1e5of7v{position:relative;top:10px;text-align:center;color:#2196f3;margin-left:10px;margin-right:10px}.user2_tr.svelte-1e5of7v.svelte-1e5of7v{text-align:center;line-height:normal;font-size:0.8em;margin-bottom:0px;color:#333;z-index:-1}.tip.svelte-1e5of7v.svelte-1e5of7v{position:relative;top:0px;text-align:center;line-height:normal;font-size:1em;margin-bottom:0px;color:#2196f3}.arrow-button.svelte-1e5of7v.svelte-1e5of7v{position:relative;top:0px;font-weight:600;background-color:white;color:#101c88;border:1px solid;border-radius:5px;cursor:pointer}.arrow-button-left.svelte-1e5of7v.svelte-1e5of7v{transform:translateY(-50%)}.arrow-button-right.svelte-1e5of7v.svelte-1e5of7v{transform:translateY(-50%)}.hint-button.svelte-1e5of7v.svelte-1e5of7v{border:0px;color:white;background-color:#2196f3;border-radius:3px;padding:2px 10px}.card.svelte-1e5of7v.svelte-1e5of7v{transition:transform 0.3s ease-in-out;transform-style:preserve-3d;transition:transform 0.5s;top:80px;overflow-y:auto;border-radius:5px;margin:0 auto;position:relative;height:calc(100vh - 80px);margin-left:10px;margin-right:10px}.words_div.svelte-1e5of7v.svelte-1e5of7v{position:relative;text-align:center;overflow-y:auto}.hint_button.svelte-1e5of7v.svelte-1e5of7v{display:inline-block;border:solid 0.1em #9f3f3f;border-radius:5px;text-align:center;width:50px;padding-left:8px;margin:5px;background-color:transparent}.hidden-text.svelte-1e5of7v.svelte-1e5of7v{opacity:1}p.svelte-1e5of7v.svelte-1e5of7v{cursor:pointer;user-select:text}.highlight.svelte-1e5of7v.svelte-1e5of7v{background-color:yellow}",
  map: null
};
function compareStrings(str1, str2) {
  function levenshteinDistance(s, t) {
    const d2 = [];
    for (let i = 0; i <= s.length; i++) {
      d2[i] = [i];
    }
    for (let j = 0; j <= t.length; j++) {
      d2[0][j] = j;
    }
    for (let j = 1; j <= t.length; j++) {
      for (let i = 1; i <= s.length; i++) {
        if (s.charAt(i - 1) === t.charAt(j - 1)) {
          d2[i][j] = d2[i - 1][j - 1];
        } else {
          d2[i][j] = Math.min(
            d2[i - 1][j] + 1,
            // удаление
            d2[i][j - 1] + 1,
            // вставка
            d2[i - 1][j - 1] + 1
          );
        }
      }
    }
    return d2[s.length][t.length];
  }
  const len1 = str1.length;
  const len2 = str2.length;
  const maxLength = Math.max(len1, len2);
  const distance = levenshteinDistance(str1, str2);
  const similarity = (1 - distance / maxLength) * 100;
  console.log("similarityPercentage", similarity);
  return similarity;
}
const Dialog_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $showBottomAppBar, $$unsubscribe_showBottomAppBar;
  let $lesson, $$unsubscribe_lesson;
  let $langs, $$unsubscribe_langs;
  let $llang, $$unsubscribe_llang;
  let $dc, $$unsubscribe_dc;
  let $msg, $$unsubscribe_msg;
  let $OnCheckQU, $$unsubscribe_OnCheckQU;
  let $call_but_status, $$unsubscribe_call_but_status;
  let $dicts, $$unsubscribe_dicts;
  let $dc_state, $$unsubscribe_dc_state;
  $$unsubscribe_showBottomAppBar = subscribe(showBottomAppBar, (value) => $showBottomAppBar = value);
  $$unsubscribe_lesson = subscribe(lesson, (value) => $lesson = value);
  $$unsubscribe_langs = subscribe(langs, (value) => $langs = value);
  $$unsubscribe_llang = subscribe(llang, (value) => $llang = value);
  $$unsubscribe_dc = subscribe(dc, (value) => $dc = value);
  $$unsubscribe_msg = subscribe(msg, (value) => $msg = value);
  $$unsubscribe_OnCheckQU = subscribe(OnCheckQU, (value) => $OnCheckQU = value);
  $$unsubscribe_call_but_status = subscribe(call_but_status, (value) => $call_but_status = value);
  $$unsubscribe_dicts = subscribe(dicts, (value) => $dicts = value);
  $$unsubscribe_dc_state = subscribe(dc_state, (value) => $dc_state = value);
  const dict = $dicts;
  const operator = getContext("operator");
  let stt, tts;
  let dialog_data;
  let isFlipped = false;
  let isRepeat = false, isThumb = false;
  let playAutoColor = "currentColor";
  const visibility = ["visible", "hidden", "hidden"];
  let topAppBar;
  let share_mode = false;
  let { data } = $$props;
  if (data.name) {
    if (data.quiz !== "dialog.client")
      init();
  }
  let tip_hidden_text = "hidden-text";
  let cur_html2 = 0;
  let cur_qa = 0;
  let q, q_shfl, a_shfl, a;
  let display_audio = "none";
  let stt_text = "";
  let isListening = false;
  let total_cnt = 0;
  if (data.func) {
    onChangeUserClick();
  }
  function flipCard() {
    isFlipped = !isFlipped;
    Dialog();
  }
  async function init() {
    fetch(`./lesson?dialog=${data.name}&owner=${operator.abonent}&level=${data.level}`).then((response) => response.json()).then((dlg_data) => {
      dialog_data = dlg_data.data.dialog;
      total_cnt = dialog_data.content.length;
      if (dlg_data.data.html) {
        dialog_data.html = dlg_data.data.html;
      }
      dialog_data.name = data.name;
      Dialog();
    }).catch((error) => {
      console.log(error);
      return [];
    });
  }
  function Dialog() {
    if (!dialog_data.content[0]) {
      return;
    }
    return new Promise(async (resolve, reject) => {
      let qa = dialog_data.content[cur_qa];
      if (!qa) {
        cur_qa = 0;
        qa = dialog_data.content[cur_qa];
        cur_html2++;
        if (dialog_data.html && !dialog_data.html[cur_html2]) {
          cur_html2 = 0;
        }
        setTimeout(
          () => {
            onChangeUserClick();
          },
          0
        );
        return;
      }
      q = isFlipped ? qa.user2 : qa.user1;
      if (!q[$langs])
        q[$langs] = await Translate(q[$llang], $llang, $langs);
      q[$llang] = q[$llang]?.replace("${user1_name}", $dc ? "user_name" : "Kolmit");
      q[$langs] = q[$langs]?.replace("${user1_name}", $dc ? "user_name" : "Kolmit");
      q[$llang] = q[$llang]?.replace("${user2_name}", operator.name);
      q[$langs] = q[$langs]?.replace("${user2_name}", operator.name);
      q_shfl = q[$llang].slice(0);
      $dc?.dc.readyState === "open" ? $dc : "";
      q_shfl.toLowerCase().replaceAll("?", "").replaceAll(",", " ").split(" ");
      a = isFlipped ? qa.user1 : qa.user2;
      if (!a[$langs])
        a[$langs] = await Translate(a[$llang], $llang, $langs);
      a[$llang] = a[$llang]?.replace("${user2_name}", operator.name);
      a[$langs] = a[$langs]?.replace("${user2_name}", operator.name);
      a[$llang] = a[$llang]?.replace("${user1_name}", $dc ? "user_name" : "Kolmit");
      a[$langs] = a[$langs]?.replace("${user1_name}", $dc ? "user_name" : "Kolmit");
      a.hints;
      dialog_data.hints = a.hints;
      a_shfl = a[$llang].slice(0);
      a_shfl.toLowerCase().replaceAll("?", "").replaceAll(",", " ").split(" ");
      resolve();
    });
  }
  async function onNextQA() {
    cur_qa++;
    visibility[1] = "hidden";
    visibility[2] = "hidden";
    display_audio = "none";
    tip_hidden_text = "";
    selectedSentence = "";
    setTimeout(
      () => {
        tip_hidden_text = "hidden-text";
      },
      50
    );
    SendData();
    stt_text = "";
    return Dialog();
  }
  function onShare() {
    share_mode = true;
    selectedSentence = "";
    Dialog();
    SendData();
  }
  async function SendData() {
    const dc2 = $dc?.dc.readyState === "open" ? $dc : "";
    if (share_mode && dc2) {
      dialog_data.content[cur_qa].user2["a_shfl"] = a_shfl;
      set_store_value(msg, $msg = set_store_value(msg, $msg = null, $msg), $msg);
      await dc2.SendData(
        {
          lesson: {
            quiz: "dialog",
            llang: $llang,
            level: data.level,
            name: dialog_data.name,
            html: dialog_data.html ? dialog_data.html[cur_html2] : null,
            dialog_data,
            cur_qa,
            isFlipped
          }
        },
        (ex) => {
          console.log(dc2);
        }
      );
    }
  }
  function onChangeUserClick() {
    flipCard();
    data = {
      llang: $llang,
      html: dialog_data.html ? dialog_data.html[cur_html2] : "",
      user1: dialog_data.content[cur_qa].user1,
      user2: dialog_data.content[cur_qa].user2,
      a_shfl,
      quiz: data.quiz
    };
    data.quiz = data.quiz === "dialog.client" ? "dialog" : "dialog.client";
    data.quiz === "dialog.client" ? "dialog" : "dialog.client";
    const dc2 = $dc?.dc.readyState === "open" ? $dc : "";
    dialog_data.content[cur_qa].user2["a_shfl"] = a_shfl;
    if (dc2 && share_mode)
      SendData();
  }
  function StopListening() {
    isListening = false;
  }
  function SttResult(text) {
    stt_text = text[$llang];
    const numbers = dialog_data.content[cur_qa].user2[$llang].match(/\b\d+\b/g);
    if (numbers)
      dialog_data.content[cur_qa].user2[$llang] = dialog_data.content[cur_qa].user2[$llang].replace(/\b\d+\b/g, numberToDutchString(numbers[0]));
    if (stt_text) {
      const similarity = compareStrings(dialog_data.content[cur_qa].user2[$llang].toLowerCase().trim().replace(/[^\w\s]|_/g, ""), stt_text.toLowerCase().trim().replace(/[^\w\s]|_/g, ""));
      stt_text += ` (${similarity.toFixed(0)}%)`;
      if (similarity > 75) {
        setTimeout(
          () => {
          },
          3e3
        );
      }
    }
  }
  function SendCommand(cmd, ev) {
    setTimeout(
      () => {
      },
      1e3
    );
    if (ev)
      ev.target.style.color = "red";
    const dc2 = $dc?.dc.readyState === "open" ? $dc : "";
    if (dc2) {
      return new Promise((resolve) => {
        dc2.SendData({ command: cmd }, () => {
          console.log();
          resolve();
        });
      });
    }
  }
  let selectedSentence = "";
  onDestroy(async () => {
    set_store_value(lesson, $lesson.data = { quiz: "" }, $lesson);
    dialog_data = "";
    data = "";
    stt_text = "";
    stt = "";
    tts = "";
    set_store_value(showBottomAppBar, $showBottomAppBar = true, $showBottomAppBar);
    await SendCommand("quit", null);
  });
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css$a);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      {
        playAutoColor = "currentColor";
      }
    }
    {
      if ($msg) {
        if ($msg.lesson?.quiz === "dialog") {
          dialog_data = $msg.lesson.dialog_data;
          isFlipped = !$msg.lesson.isFlipped;
          cur_qa = $msg.lesson.cur_qa;
          visibility[1] = "hidden";
          visibility[2] = "hidden";
          Dialog();
          $OnCheckQU(null, "dialog", dialog_data.name);
        }
        if ($msg.command === "repeat") {
          isRepeat = true;
          setTimeout(
            () => {
              isRepeat = false;
            },
            2e3
          );
        } else if ($msg.command === "thumb") {
          isThumb = true;
          setTimeout(
            () => {
              isThumb = false;
              if (!isFlipped) {
                onNextQA();
              }
            },
            2e3
          );
        } else if ($msg.command === "quit") {
          set_store_value(msg, $msg.command = "", $msg);
          setTimeout(
            () => {
              set_store_value(lesson, $lesson.data = { quiz: "" }, $lesson);
            },
            100
          );
        }
      }
    }
    {
      if ($msg) {
        if ($msg.lesson?.quiz === "dialog") {
          dialog_data = $msg.lesson.dialog_data;
          isFlipped = !$msg.lesson.isFlipped;
          cur_qa = $msg.lesson.cur_qa;
          visibility[1] = "hidden";
          visibility[2] = "hidden";
          Dialog();
          $OnCheckQU(null, "dialog", dialog_data.name);
        }
        if ($msg.command === "repeat") {
          isRepeat = true;
          setTimeout(
            () => {
              isRepeat = false;
            },
            2e3
          );
        } else if ($msg.command === "thumb") {
          isThumb = true;
          setTimeout(
            () => {
              isThumb = false;
            },
            2e3
          );
        } else if ($msg.command === "quit") {
          set_store_value(msg, $msg.command = "", $msg);
          setTimeout(
            () => {
              set_store_value(lesson, $lesson.data = { quiz: "" }, $lesson);
            },
            100
          );
        }
      }
    }
    {
      switch ($call_but_status) {
        case "talk":
          break;
        case "inactive":
          if (share_mode)
            set_store_value(lesson, $lesson.data = { quiz: "" }, $lesson);
          break;
        default:
          share_mode = false;
          break;
      }
    }
    {
      if (data.html) {
        share_mode = true;
      }
    }
    {
      if (dialog_data && $call_but_status === "talk") {
        if (!share_mode)
          onShare();
      }
    }
    {
      if ($msg?.msg || $msg?.msg) {
        (async () => {
          alert(await Translate($msg?.msg || $msg?.msg, "ru", $langs));
        })();
      }
    }
    {
      if (q && !q[$langs]) {
        (async () => {
          q[$langs] = await Translate(q[$llang], $llang, $langs);
        })();
      }
    }
    {
      if (a && !a[$langs]) {
        (async () => {
          a[$langs] = await Translate(a[$llang], $llang, $langs);
        })();
      }
    }
    $$rendered = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"> ${validate_component(Tts, "Tts").$$render(
      $$result,
      { this: tts },
      {
        this: ($$value) => {
          tts = $$value;
          $$settled = false;
        }
      },
      {}
    )}   <main_dlg class="svelte-1e5of7v"><div class="top-app-bar-container flexor svelte-1e5of7v">${validate_component(TopAppBar, "TopAppBar").$$render(
      $$result,
      { variant: "fixed", this: topAppBar },
      {
        this: ($$value) => {
          topAppBar = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(Row, "Row").$$render($$result, {}, {}, {
            default: () => {
              return `${validate_component(Section$1, "Section").$$render($$result, { align: "start" }, {}, {
                default: () => {
                  return `${!isFlipped ? `${cur_qa > 0 ? `${validate_component(CommonIcon, "Icon").$$render(
                    $$result,
                    {
                      tag: "svg",
                      viewBox: "0 0 24 24",
                      style: "margin-top:0px; scale:.5;width:50px"
                    },
                    {},
                    {
                      default: () => {
                        return `<path fill="white"${add_attribute("d", mdiArrowLeft, 0)}></path>`;
                      }
                    }
                  )}` : `${validate_component(CommonIcon, "Icon").$$render(
                    $$result,
                    {
                      tag: "svg",
                      viewBox: "0 0 24 24",
                      style: "visibility:hidden;margin-top:0px; scale:.5;width:50px"
                    },
                    {},
                    {
                      default: () => {
                        return `<path fill=""${add_attribute("d", mdiArrowLeft, 0)}></path>`;
                      }
                    }
                  )}`}` : ``}`;
                }
              })} ${validate_component(Section$1, "Section").$$render($$result, { align: "start" }, {}, {
                default: () => {
                  return `${$dc_state === "close" ? `${validate_component(IconButton, "IconButton").$$render($$result, {}, {}, {
                    default: () => {
                      return `${validate_component(CommonIcon, "Icon").$$render($$result, { tag: "svg", viewBox: "0 0 24 24" }, {}, {
                        default: () => {
                          return `<path${add_attribute("fill", playAutoColor, 0)}${add_attribute("d", mdiEarHearing, 0)}></path>`;
                        }
                      })}`;
                    }
                  })}` : ``}`;
                }
              })} ${validate_component(Section$1, "Section").$$render($$result, { align: "start" }, {}, {
                default: () => {
                  return `<div class="flip_button svelte-1e5of7v">${validate_component(IconButton, "IconButton").$$render($$result, {}, {}, {
                    default: () => {
                      return `${validate_component(CommonIcon, "Icon").$$render($$result, { tag: "svg", viewBox: "0 0 24 24" }, {}, {
                        default: () => {
                          return `<path fill="currentColor"${add_attribute("d", mdiAccountConvertOutline, 0)}></path>`;
                        }
                      })} ${!isFlipped ? `${validate_component(Badge, "Badge").$$render(
                        $$result,
                        {
                          position: "middle",
                          align: "bottom-end - bottom-middle",
                          "aria-label": "unread count",
                          style: "scale:.8"
                        },
                        {},
                        {
                          default: () => {
                            return `A`;
                          }
                        }
                      )}` : `${validate_component(Badge, "Badge").$$render(
                        $$result,
                        {
                          color: "secondary",
                          position: "middle",
                          align: "bottom-end - bottom-middle",
                          "aria-label": "unread count",
                          style: "scale:.8"
                        },
                        {},
                        {
                          default: () => {
                            return `B`;
                          }
                        }
                      )}`}`;
                    }
                  })}</div>`;
                }
              })} ${validate_component(Section$1, "Section").$$render($$result, { align: "start" }, {}, {
                default: () => {
                  return `<div class="counter svelte-1e5of7v"><p class="svelte-1e5of7v"><span class="mdc-typography--overline svelte-1e5of7v" style="position:relative">${escape(cur_qa + 1)} ${validate_component(Badge, "Badge").$$render(
                    $$result,
                    {
                      position: "middle",
                      align: "bottom-end - bottom-middle",
                      "aria-label": "unread count",
                      style: "margin-right:-10px;scale:.8"
                    },
                    {},
                    {
                      default: () => {
                        return `${escape(total_cnt)}`;
                      }
                    }
                  )}</span></p></div>`;
                }
              })} ${validate_component(Section$1, "Section").$$render($$result, { align: "end" }, {}, {
                default: () => {
                  return `<button class="hint-button svelte-1e5of7v" data-svelte-h="svelte-x1dsua"><span class="material-symbols-outlined">?</span></button>`;
                }
              })} ${validate_component(Section$1, "Section").$$render($$result, { align: "end" }, {}, {
                default: () => {
                  return `${!isFlipped ? `${validate_component(CommonIcon, "Icon").$$render(
                    $$result,
                    {
                      tag: "svg",
                      viewBox: "0 0 24 24",
                      style: "margin-top:0px; scale:.5; width:50px"
                    },
                    {},
                    {
                      default: () => {
                        return `<path fill="white"${add_attribute("d", mdiArrowRight, 0)}></path>`;
                      }
                    }
                  )}` : ``}`;
                }
              })}`;
            }
          })}`;
        }
      }
    )}</div>  <div class="card svelte-1e5of7v"><span style="display:block;position:relative;color: lightgray;font-style: italic;font-size:smaller;font-family: serif;">${escape(dialog_data?.name)}</span> ${q || a ? `${!isFlipped ? `<div class="container svelte-1e5of7v">${$call_but_status == "talk" ? `<div class="repeat_but svelte-1e5of7v">${validate_component(IconButton, "IconButton").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(CommonIcon, "Icon").$$render(
          $$result,
          {
            tag: "svg",
            color: "secondary",
            viewBox: "0 0 24 24"
          },
          {},
          {
            default: () => {
              return `<path fill="currentColor"${add_attribute("d", mdiRepeat, 0)}></path>`;
            }
          }
        )}`;
      }
    })}</div>` : ``}  ${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ``;
      }
      return function(data2) {
        return ` <div class="title svelte-1e5of7v">${escape(data2)}:</div> `;
      }(__value);
    }(Translate("Послушай вопрос", "ru", $langs))} ${$call_but_status == "talk" ? `<div class="thumb_but svelte-1e5of7v">${validate_component(IconButton, "IconButton").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(CommonIcon, "Icon").$$render(
          $$result,
          {
            tag: "svg",
            color: "secondary",
            viewBox: "0 0 24 24"
          },
          {},
          {
            default: () => {
              return `<path fill="currentColor"${add_attribute("d", mdiThumbUpOutline, 0)}></path>`;
            }
          }
        )}`;
      }
    })}</div>` : ``}</div> <div class="${"tip mdc-typography--headline6 " + escape(tip_hidden_text, true) + " svelte-1e5of7v"}">${selectedSentence ? `<p class="svelte-1e5of7v"><span class="highlight svelte-1e5of7v">${escape(selectedSentence)}</span></p>` : `<!-- HTML_TAG_START -->${q[$llang].replace(/"([^"]*)"/g, "$1")}<!-- HTML_TAG_END -->`} <div style="display: inline-flex; float: right; margin-right: 10px;}" class="svelte-1e5of7v"><br>  <div class="speaker-button svelte-1e5of7v">${validate_component(IconButton, "IconButton").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(CommonIcon, "Icon").$$render($$result, { tag: "svg", viewBox: "0 0 24 24" }, {}, {
          default: () => {
            return `<path fill="currentColor"${add_attribute("d", mdiPlay, 0)}></path>`;
          }
        })}`;
      }
    })}</div> </div></div> <div style="text-align: center;"><div class="user1 svelte-1e5of7v" style="${"visibility:" + escape(visibility[1], true)}"><span>${!q[$langs] ? `${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ``;
      }
      return function(data2) {
        return ` <!-- HTML_TAG_START -->${data2}<!-- HTML_TAG_END --> `;
      }(__value);
    }(Translate(q["ru"].replace(/"([^"]*)"/g, "$1"), "ru", $langs))}` : `<!-- HTML_TAG_START -->${q[$langs].replace(/"([^"]*)"/g, "$1")}<!-- HTML_TAG_END -->`}</span></div></div> ${isThumb ? `<div class="thumb_alert svelte-1e5of7v">${validate_component(CommonIcon, "Icon").$$render(
      $$result,
      {
        tag: "svg",
        color: "green",
        viewBox: "0 0 24 24"
      },
      {},
      {
        default: () => {
          return `<path fill="currentColor"${add_attribute("d", mdiThumbUpOutline, 0)}></path>`;
        }
      }
    )}</div>` : ``} ${isRepeat ? `<div class="repeat_alert svelte-1e5of7v">${validate_component(Button, "Button").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(CommonLabel, "Label").$$render($$result, {}, {}, {
          default: () => {
            return `${escape(dict["Repeat"][$langs])}`;
          }
        })}`;
      }
    })}</div>` : ``} ${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ``;
      }
      return function(data2) {
        return ` <div class="title svelte-1e5of7v">${escape(data2)}:</div> `;
      }(__value);
    }(Translate("Ответь", "ru", $langs))} <div class="user2 svelte-1e5of7v">${a && visibility[2] === "hidden" ? `<!-- HTML_TAG_START -->${a[$llang].replace(new RegExp('(?<!")\\b\\p{L}+(?<!\\s)(?!")', "gu"), (match) => {
      return `<span class="span_hidden" onclick="(this.style.color='#2196f3')" 
                style="display:inline-block; margin: 5px 0px; padding: 1px 5px;border:1px;border-style:groove;border-color:lightblue;
                color:transparent;">${match}</span>`;
    })}<!-- HTML_TAG_END -->` : `${visibility[2] === "visible" ? `<!-- HTML_TAG_START -->${a[$llang].replace(new RegExp('(?<!")\\b\\p{L}+(?<!\\s)(?!")', "gu"), (match) => {
      return `<span class="span_hidden"  
                style="display:inline-block; margin: 5px 0px; padding: 1px 5px;border:1px;border-style:groove;border-color:lightblue;
                color:#2196f3">${match}</span>`;
    })}<!-- HTML_TAG_END -->` : ``}`} <div class="user2_tr svelte-1e5of7v">${a && visibility[0] === "visible" ? `${!a[$langs] ? `${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ``;
      }
      return function(data2) {
        return ` ${escape(data2)} `;
      }(__value);
    }(Translate(a["ru"].replace(/"([^"]*)"/g, "$1"), "ru", $langs))}` : `<!-- HTML_TAG_START -->${a[$langs].replace(/"([^"]*)"/g, "$1")}<!-- HTML_TAG_END -->`}` : ``}</div> <div class="speaker-button svelte-1e5of7v">${validate_component(IconButton, "IconButton").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(CommonIcon, "Icon").$$render($$result, { tag: "svg", viewBox: "0 0 24 24" }, {}, {
          default: () => {
            return `<path fill="currentColor"${add_attribute("d", mdiPlay, 0)}></path>`;
          }
        })}`;
      }
    })}</div> ${!share_mode ? `<div class="margins svelte-1e5of7v" style="text-align: center; display: flex; align-items: center; justify-content: space-between;"><div class="svelte-1e5of7v">${validate_component(IconButton, "IconButton").$$render(
      $$result,
      {
        class: "material-icons",
        "aria-label": "Back"
      },
      {},
      {
        default: () => {
          return `${validate_component(CommonIcon, "Icon").$$render($$result, { tag: "svg", viewBox: "0 0 24 24" }, {}, {
            default: () => {
              return `${isListening ? `<path fill="currentColor"${add_attribute("d", mdiMicrophone, 0)}></path>` : `<path fill="currentColor"${add_attribute("d", mdiMicrophoneOutline, 0)}></path>`}`;
            }
          })}`;
        }
      }
    )} ${isListening ? `${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ``;
      }
      return function(data2) {
        return ` <span>${escape(data2)}</span> `;
      }(__value);
    }(Translate("говори", "ru", $llang))}` : ``}</div> ${validate_component(Stt, "Stt").$$render(
      $$result,
      {
        SttResult,
        StopListening,
        this: stt,
        display_audio
      },
      {
        this: ($$value) => {
          stt = $$value;
          $$settled = false;
        },
        display_audio: ($$value) => {
          display_audio = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div>` : ``}</div> <div style="text-align: center; margin-top: 10px;"><span style="color: darkgreen;"><!-- HTML_TAG_START -->${stt_text}<!-- HTML_TAG_END --></span></div>` : `${isThumb ? `<div class="thumb_alert svelte-1e5of7v">${validate_component(CommonIcon, "Icon").$$render(
      $$result,
      {
        tag: "svg",
        color: "green",
        viewBox: "0 0 24 24"
      },
      {},
      {
        default: () => {
          return `<path fill="currentColor"${add_attribute("d", mdiThumbUpOutline, 0)}></path>`;
        }
      }
    )}</div>` : ``} ${isRepeat ? `<div class="repeat_alert svelte-1e5of7v">${validate_component(Button, "Button").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(CommonLabel, "Label").$$render($$result, {}, {}, {
          default: () => {
            return `${escape(dict["Repeat"][$langs])}`;
          }
        })}`;
      }
    })}</div>` : ``} ${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ``;
      }
      return function(data2) {
        return ` <div class="title svelte-1e5of7v">${escape(data2)}:</div> `;
      }(__value);
    }(Translate("Спроси", "ru", $langs))} <div class="user2_tr svelte-1e5of7v">${a ? `${!a[$langs] ? `${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ``;
      }
      return function(data2) {
        return ` ${escape(data2)} `;
      }(__value);
    }(Translate(a[$llang], $llang, $langs))}` : `<!-- HTML_TAG_START -->${a[$langs]}<!-- HTML_TAG_END -->`}` : ``}</div> <div class="user2 svelte-1e5of7v">${a && visibility[1] === "hidden" ? `<!-- HTML_TAG_START -->${a[$llang].replace(/(?<!")\b[\p{L}\p{M}]+\b(?!")/gu, (match) => {
      return `<span class="span_hidden" onclick="(this.style.color='#2196f3')" 
                style="display:inline-block;margin: 5px 0px;border:1px;border-style:groove;border-color:light-blue;
                color:transparent;">${match}</span>`;
    })}<!-- HTML_TAG_END -->` : `${visibility[1] === "visible" ? `<!-- HTML_TAG_START -->${a[$llang].replace(/(?<!")\b[\p{L}\p{M}]+\b(?!")/gu, (match) => {
      return `<span class="span_hidden"  
                style="display:inline-block;margin: 5px 0px;border:1px;border-style:groove;border-color:light-blue;
                color:#2196f3">${match}</span>`;
    })}<!-- HTML_TAG_END -->` : ``}`} <div class="speaker-button svelte-1e5of7v">${validate_component(IconButton, "IconButton").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(CommonIcon, "Icon").$$render($$result, { tag: "svg", viewBox: "0 0 24 24" }, {}, {
          default: () => {
            return `<path fill="currentColor"${add_attribute("d", mdiPlay, 0)}></path>`;
          }
        })}`;
      }
    })}</div> ${!share_mode ? `<div class="margins svelte-1e5of7v" style="text-align: center; display: flex; align-items: center; justify-content: space-between;"><div class="svelte-1e5of7v">${validate_component(IconButton, "IconButton").$$render(
      $$result,
      {
        class: "material-icons",
        "aria-label": "Back"
      },
      {},
      {
        default: () => {
          return `${validate_component(CommonIcon, "Icon").$$render($$result, { tag: "svg", viewBox: "0 0 24 24" }, {}, {
            default: () => {
              return `${isListening ? `<path fill="currentColor"${add_attribute("d", mdiMicrophone, 0)}></path>` : `<path fill="currentColor"${add_attribute("d", mdiMicrophoneOutline, 0)}></path>`}`;
            }
          })}`;
        }
      }
    )}</div> ${validate_component(Stt, "Stt").$$render(
      $$result,
      {
        SttResult,
        StopListening,
        this: stt,
        display_audio
      },
      {
        this: ($$value) => {
          stt = $$value;
          $$settled = false;
        },
        display_audio: ($$value) => {
          display_audio = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div>` : ``}</div> <div style="text-align: center; margin-top: 10px; "><span style="color: darkgreen;"><!-- HTML_TAG_START -->${stt_text}<!-- HTML_TAG_END --></span></div> <div class="container svelte-1e5of7v">${$call_but_status == "talk" ? `<div class="repeat_but svelte-1e5of7v">${validate_component(IconButton, "IconButton").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(CommonIcon, "Icon").$$render(
          $$result,
          {
            tag: "svg",
            color: "secondary",
            viewBox: "0 0 24 24"
          },
          {},
          {
            default: () => {
              return `<path fill="currentColor"${add_attribute("d", mdiRepeat, 0)}></path>`;
            }
          }
        )}`;
      }
    })}</div>` : ``} ${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ``;
      }
      return function(data2) {
        return ` <div class="title svelte-1e5of7v">${escape(data2)}:</div> `;
      }(__value);
    }(Translate("Послушай ответ", "ru", $langs))} ${$call_but_status == "talk" ? `<div class="thumb_but svelte-1e5of7v">${validate_component(IconButton, "IconButton").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(CommonIcon, "Icon").$$render(
          $$result,
          {
            tag: "svg",
            color: "secondary",
            viewBox: "0 0 24 24"
          },
          {},
          {
            default: () => {
              return `<path fill="currentColor"${add_attribute("d", mdiThumbUpOutline, 0)}></path>`;
            }
          }
        )}`;
      }
    })}</div>` : ``}</div> <div class="tip mdc-typography--headline6 svelte-1e5of7v"><!-- HTML_TAG_START -->${q[$llang]}<!-- HTML_TAG_END --></div> <div style="text-align: center;"><div class="user1 svelte-1e5of7v" style="${"visibility:" + escape(visibility[2], true)}">${!dialog_data.content[cur_qa].user1[$langs] ? `${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ``;
      }
      return function(data2) {
        return ` ${escape(data2)} `;
      }(__value);
    }(Translate(q[$llang], $llang, $langs))}` : `<!-- HTML_TAG_START -->${q[$langs]}<!-- HTML_TAG_END -->`} <div class="margins svelte-1e5of7v" style="text-align: center; display: flex; align-items: center; justify-content: space-between;" data-svelte-h="svelte-82ky8a"><br class="svelte-1e5of7v"></div>  <div class="speaker-button svelte-1e5of7v">${validate_component(IconButton, "IconButton").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(CommonIcon, "Icon").$$render($$result, { tag: "svg", viewBox: "0 0 24 24" }, {}, {
          default: () => {
            return `<path fill="currentColor"${add_attribute("d", mdiPlay, 0)}></path>`;
          }
        })}`;
      }
    })}</div> </div></div>`} <br> ${dialog_data.html ? `${validate_component(Dialog_Context, "ConText").$$render($$result, { data: dialog_data, tts }, {}, {})}` : ``}` : `<div style="text-align:center"><span class="material-symbols-outlined" style="font-size: 20px; color: blue; scale:1.5;">${validate_component(CircularProgress, "CircularProgress").$$render(
      $$result,
      {
        style: "top: 100px;height: 50px; width: 50px;",
        indeterminate: true
      },
      {},
      {}
    )}</span></div>`} <div style="height:200px"></div></div> </main_dlg>`;
  } while (!$$settled);
  $$unsubscribe_showBottomAppBar();
  $$unsubscribe_lesson();
  $$unsubscribe_langs();
  $$unsubscribe_llang();
  $$unsubscribe_dc();
  $$unsubscribe_msg();
  $$unsubscribe_OnCheckQU();
  $$unsubscribe_call_but_status();
  $$unsubscribe_dicts();
  $$unsubscribe_dc_state();
  return $$rendered;
});
const css$9 = {
  code: "main.svelte-7fmt0b.svelte-7fmt0b{text-align:center;margin-top:40px}.hint-button.svelte-7fmt0b.svelte-7fmt0b{display:inline-block;position:relative;top:4px;height:44px;color:white;background-color:#2196f3;border-radius:3px}button.svelte-7fmt0b.svelte-7fmt0b{margin-top:10px;padding:8px 16px;font-size:16px;cursor:pointer}.input.svelte-7fmt0b.svelte-7fmt0b{display:inline-block;padding:8px;width:50vw;font-size:24px;margin-top:10px;margin-left:auto;margin-right:auto}main.svelte-7fmt0b>div.svelte-7fmt0b{margin-bottom:20px}",
  map: null
};
let cur_html$2 = 0;
const Listen = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $dc, $$unsubscribe_dc;
  let $$unsubscribe_lesson;
  let $llang, $$unsubscribe_llang;
  let $dc_state, $$unsubscribe_dc_state;
  let $dicts, $$unsubscribe_dicts;
  let $langs, $$unsubscribe_langs;
  $$unsubscribe_dc = subscribe(dc, (value) => $dc = value);
  $$unsubscribe_lesson = subscribe(lesson, (value) => value);
  $$unsubscribe_llang = subscribe(llang, (value) => $llang = value);
  $$unsubscribe_dc_state = subscribe(dc_state, (value) => $dc_state = value);
  $$unsubscribe_dicts = subscribe(dicts, (value) => $dicts = value);
  $$unsubscribe_langs = subscribe(langs, (value) => $langs = value);
  moment.locale("nl-be");
  let tts;
  const operator = getContext("operator");
  let dict = $dicts;
  let share_button = false;
  let style_button_non_shared = `position: relative;
		padding: 10px;
		font-size: 1.5em;
		background-color: white;
		color: grey;
		border: none;
		border-radius: 5px;
		cursor: pointer;`;
  let style_button_shared = `position: relative;
		padding: 10px;
		font-size: 1.5em;
		background-color: #2196f3;
		color: #fff;
		border: none;
		border-radius: 5px;
		cursor: pointer;`;
  let style_button = style_button_non_shared;
  let { data } = $$props;
  if (data.func) {
    onChangeClick();
  }
  data.name;
  let userContent;
  let inputStyle;
  let q, a;
  let div_input;
  let listen_data;
  let currentWordIndex = 0;
  fetch(`./lesson?listen=${data.name}&owner=${operator.abonent}&lang=${$llang}`).then((response) => response.json()).then((res) => {
    listen_data = res.data.data;
  }).catch((error) => {
    console.log(error);
    return [];
  });
  function onChangeClick() {
    data = { question: q, answer: a, quiz: data.quiz };
    if (data.html)
      data.html = data.html[cur_html$2];
    data.quiz = data.quiz === "dialog.client" ? "dialog" : "dialog.client";
    data.quiz === "dialog.client" ? "dialog" : "dialog.client";
    $dc?.SendData({ lesson: data }, () => {
      console.log();
    });
  }
  onDestroy(() => {
  });
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css$9);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      if (data) {
        if (data.html) {
          style_button = style_button_shared;
        }
      }
    }
    {
      if ($dc_state) {
        switch ($dc_state) {
          case "open":
            share_button = true;
            break;
          case "closed":
            share_button = false;
            style_button = style_button_non_shared;
            break;
        }
      }
    }
    {
      if ($dc_state) {
        share_button = true;
      }
    }
    {
      if (listen_data)
        listen_data[currentWordIndex];
    }
    $$rendered = ` ${validate_component(Tts, "TTS").$$render(
      $$result,
      { this: tts },
      {
        this: ($$value) => {
          tts = $$value;
          $$settled = false;
        }
      },
      {}
    )}  ${share_button ? `${validate_component(IconButton, "IconButton").$$render(
      $$result,
      {
        class: "material-icons",
        style: style_button
      },
      {},
      {
        default: () => {
          return `${validate_component(CommonIcon, "Icon").$$render($$result, { tag: "svg", viewBox: "0 0 24 24" }, {}, {
            default: () => {
              return `<path fill="currentColor"${add_attribute("d", mdiShareVariant, 0)}></path>`;
            }
          })}`;
        }
      }
    )}` : ``} <main class="svelte-7fmt0b"><div class="svelte-7fmt0b"><p>${escape(dict["Послушай и напиши"][$langs])}:</p> ${`<button class="svelte-7fmt0b">${escape(dict["Старт"][$langs])}</button>`}</div> <div class="svelte-7fmt0b"> <div contenteditable="true" class="input svelte-7fmt0b"${add_attribute("style", inputStyle, 0)}${add_attribute("this", div_input, 0)}>${/* @__PURE__ */ (($$value) => $$value === void 0 ? `` : $$value)(userContent)}</div> ${``} </div> </main>`;
  } while (!$$settled);
  $$unsubscribe_dc();
  $$unsubscribe_lesson();
  $$unsubscribe_llang();
  $$unsubscribe_dc_state();
  $$unsubscribe_dicts();
  $$unsubscribe_langs();
  return $$rendered;
});
const css$8 = {
  code: ".q.svelte-11aoiyk{color:gray;border:0;background-color:transparent;font:1.2em sans-serif}.toggleButton.svelte-11aoiyk{position:absolute;right:25px;top:170px}",
  map: null
};
const Speak = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $lesson, $$unsubscribe_lesson;
  let $dc, $$unsubscribe_dc;
  $$unsubscribe_lesson = subscribe(lesson, (value) => $lesson = value);
  $$unsubscribe_dc = subscribe(dc, (value) => $dc = value);
  let { data } = $$props;
  let q_visibility = "hidden";
  let a_visibility = "hidden";
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css$8);
  {
    if ($dc && $dc.dc) {
      set_store_value(
        dc,
        $dc.dc.onmessage = (event) => {
          console.log(event.data);
        },
        $dc
      );
    }
  }
  {
    if (data.question) {
      q_visibility = "hidden";
    }
  }
  {
    if (data.answer) {
      a_visibility = "hidden";
    }
  }
  {
    {
      console.log($lesson.visible);
    }
  }
  $$unsubscribe_lesson();
  $$unsubscribe_dc();
  return `<div style="display: flex;"><div style="margin:0 auto"><div class="q svelte-11aoiyk" id="question" style="${"visibility:" + escape(q_visibility, true)}"><div><!-- HTML_TAG_START -->${data.question}<!-- HTML_TAG_END --></div></div> <div class="q svelte-11aoiyk" id="answer" style="${"visibility:" + escape(a_visibility, true)}"><div><!-- HTML_TAG_START -->${data.answer}<!-- HTML_TAG_END --></div></div> <button class="toggleButton svelte-11aoiyk" data-svelte-h="svelte-15jvgde">?</button></div></div> ${data.html ? `<div><!-- HTML_TAG_START -->${data.html}<!-- HTML_TAG_END --></div>` : ``} `;
});
const css$7 = {
  code: "main.svelte-1yecohh.svelte-1yecohh{text-align:center;margin-top:40px}.hint-button.svelte-1yecohh.svelte-1yecohh{display:inline-block;position:relative;top:-2px;height:44px;color:white;background-color:#2196f3;border-radius:3px}button.svelte-1yecohh.svelte-1yecohh{margin-top:10px;padding:8px 16px;font-size:16px;cursor:pointer}#userTime.svelte-1yecohh.svelte-1yecohh{width:80px;font-size:x-large;text-align:center;border:1px solid grey;background-color:rgb(220, 228, 228)}.input.svelte-1yecohh.svelte-1yecohh{display:inline-block;padding:8px;width:120px;font-size:24px;margin-top:10px;margin-left:auto;margin-right:auto}main.svelte-1yecohh>div.svelte-1yecohh{margin-bottom:20px}",
  map: null
};
let cur_html$1 = 0;
const Numbers = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $dc, $$unsubscribe_dc;
  let $$unsubscribe_lesson;
  let $$unsubscribe_llang;
  let $dc_state, $$unsubscribe_dc_state;
  let $dicts, $$unsubscribe_dicts;
  let $langs, $$unsubscribe_langs;
  $$unsubscribe_dc = subscribe(dc, (value) => $dc = value);
  $$unsubscribe_lesson = subscribe(lesson, (value) => value);
  $$unsubscribe_llang = subscribe(llang, (value) => value);
  $$unsubscribe_dc_state = subscribe(dc_state, (value) => $dc_state = value);
  $$unsubscribe_dicts = subscribe(dicts, (value) => $dicts = value);
  $$unsubscribe_langs = subscribe(langs, (value) => $langs = value);
  moment.locale("nl-be");
  let tts;
  let dict = $dicts;
  let share_button = false;
  let style_button_non_shared = `position: relative;
		padding: 10px;
		font-size: 1.5em;
		background-color: white;
		color: grey;
		border: none;
		border-radius: 5px;
		cursor: pointer;`;
  let style_button_shared = `position: relative;
		padding: 10px;
		font-size: 1.5em;
		background-color: #2196f3;
		color: #fff;
		border: none;
		border-radius: 5px;
		cursor: pointer;`;
  let style_button = style_button_non_shared;
  let { data } = $$props;
  if (data.func) {
    onChangeClick();
  }
  let name = data.name;
  let userContent;
  let inputStyle;
  let result = "";
  let q, a;
  let div_input;
  function onChangeClick() {
    data = { question: q, answer: a, quiz: data.quiz };
    if (data.html)
      data.html = data.html[cur_html$1];
    data.quiz = data.quiz === "dialog.client" ? "dialog" : "dialog.client";
    data.quiz === "dialog.client" ? "dialog" : "dialog.client";
    if ($dc)
      $dc.SendData({ lesson: data }, () => {
        console.log();
      });
  }
  onDestroy(() => {
  });
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css$7);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      if (data) {
        if (data.html) {
          style_button = style_button_shared;
        }
      }
    }
    {
      if ($dc_state) {
        switch ($dc_state) {
          case "open":
            share_button = true;
            break;
          case "closed":
            share_button = false;
            style_button = style_button_non_shared;
            break;
        }
      }
    }
    {
      if ($dc_state) {
        share_button = true;
      }
    }
    $$rendered = ` ${validate_component(Tts, "TTS").$$render(
      $$result,
      { this: tts },
      {
        this: ($$value) => {
          tts = $$value;
          $$settled = false;
        }
      },
      {}
    )}  ${share_button ? `${validate_component(IconButton, "IconButton").$$render(
      $$result,
      {
        class: "material-icons",
        style: style_button
      },
      {},
      {
        default: () => {
          return `${validate_component(CommonIcon, "Icon").$$render($$result, { tag: "svg", viewBox: "0 0 24 24" }, {}, {
            default: () => {
              return `<path fill="currentColor"${add_attribute("d", mdiShareVariant, 0)}></path>`;
            }
          })}`;
        }
      }
    )}` : ``} <main class="svelte-1yecohh">${data.quiz == "listen" ? `<div class="svelte-1yecohh"><p>${escape(dict["Послушай и напиши"][$langs])}:</p> ${`<button class="svelte-1yecohh">${escape(dict["Старт"][$langs])}</button>`}</div> <div class="svelte-1yecohh"> ${name === "Nummers" ? `<div class="input svelte-1yecohh" contenteditable="true"${add_attribute("style", inputStyle, 0)}${add_attribute("this", div_input, 0)}>${(($$value) => $$value === void 0 ? `<!-- HTML_TAG_START -->${result}<!-- HTML_TAG_END -->` : $$value)(userContent)}</div>` : `${name === "Tijd" ? `<div contenteditable="true" id="userTime" class="input svelte-1yecohh" placeholder="hh:mm"${add_attribute("this", div_input, 0)}>${/* @__PURE__ */ (($$value) => $$value === void 0 ? `` : $$value)(userContent)}</div>` : `${name === "Alphabet" ? `<div contenteditable="true" id="userTime" class="input svelte-1yecohh"${add_attribute("this", div_input, 0)}>${/* @__PURE__ */ (($$value) => $$value === void 0 ? `` : $$value)(userContent)}</div>` : ``}`}`} ${``} </div>` : `${data.quiz == "dialog.client" ? `${validate_component(Speak, "Speak").$$render($$result, { data }, {}, {})}` : ``}`} </main>`;
  } while (!$$settled);
  $$unsubscribe_dc();
  $$unsubscribe_lesson();
  $$unsubscribe_llang();
  $$unsubscribe_dc_state();
  $$unsubscribe_dicts();
  $$unsubscribe_langs();
  return $$rendered;
});
const css$6 = {
  code: "main.svelte-1yecohh.svelte-1yecohh{text-align:center;margin-top:40px}.hint-button.svelte-1yecohh.svelte-1yecohh{display:inline-block;position:relative;top:-2px;height:44px;color:white;background-color:#2196f3;border-radius:3px}button.svelte-1yecohh.svelte-1yecohh{margin-top:10px;padding:8px 16px;font-size:16px;cursor:pointer}#userTime.svelte-1yecohh.svelte-1yecohh{width:80px;font-size:x-large;text-align:center;border:1px solid grey;background-color:rgb(220, 228, 228)}.input.svelte-1yecohh.svelte-1yecohh{display:inline-block;padding:8px;width:120px;font-size:24px;margin-top:10px;margin-left:auto;margin-right:auto}main.svelte-1yecohh>div.svelte-1yecohh{margin-bottom:20px}",
  map: null
};
let cur_html = 0;
const Time = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $dc, $$unsubscribe_dc;
  let $$unsubscribe_lesson;
  let $$unsubscribe_llang;
  let $dc_state, $$unsubscribe_dc_state;
  let $dicts, $$unsubscribe_dicts;
  let $langs, $$unsubscribe_langs;
  $$unsubscribe_dc = subscribe(dc, (value) => $dc = value);
  $$unsubscribe_lesson = subscribe(lesson, (value) => value);
  $$unsubscribe_llang = subscribe(llang, (value) => value);
  $$unsubscribe_dc_state = subscribe(dc_state, (value) => $dc_state = value);
  $$unsubscribe_dicts = subscribe(dicts, (value) => $dicts = value);
  $$unsubscribe_langs = subscribe(langs, (value) => $langs = value);
  moment.locale("nl-be");
  let tts;
  let dict = $dicts;
  let share_button = false;
  let style_button_non_shared = `position: relative;
		padding: 10px;
		font-size: 1.5em;
		background-color: white;
		color: grey;
		border: none;
		border-radius: 5px;
		cursor: pointer;`;
  let style_button_shared = `position: relative;
		padding: 10px;
		font-size: 1.5em;
		background-color: #2196f3;
		color: #fff;
		border: none;
		border-radius: 5px;
		cursor: pointer;`;
  let style_button = style_button_non_shared;
  let { data } = $$props;
  if (data.func) {
    onChangeClick();
  }
  let name = data.name;
  let userContent;
  let inputStyle;
  let result = "";
  let q, a;
  let div_input;
  function onChangeClick() {
    data = { question: q, answer: a, quiz: data.quiz };
    if (data.html)
      data.html = data.html[cur_html];
    data.quiz = data.quiz === "dialog.client" ? "dialog" : "dialog.client";
    data.quiz === "dialog.client" ? "dialog" : "dialog.client";
    $dc?.SendData({ lesson: data }, () => {
      console.log();
    });
  }
  onDestroy(() => {
  });
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css$6);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      if (data) {
        if (data.html) {
          style_button = style_button_shared;
        }
      }
    }
    {
      if ($dc_state) {
        switch ($dc_state) {
          case "open":
            share_button = true;
            break;
          case "closed":
            share_button = false;
            style_button = style_button_non_shared;
            break;
        }
      }
    }
    {
      if ($dc_state) {
        share_button = true;
      }
    }
    $$rendered = ` ${validate_component(Tts, "TTS").$$render(
      $$result,
      { this: tts },
      {
        this: ($$value) => {
          tts = $$value;
          $$settled = false;
        }
      },
      {}
    )}  ${share_button ? `${validate_component(IconButton, "IconButton").$$render(
      $$result,
      {
        class: "material-icons",
        style: style_button
      },
      {},
      {
        default: () => {
          return `${validate_component(CommonIcon, "Icon").$$render($$result, { tag: "svg", viewBox: "0 0 24 24" }, {}, {
            default: () => {
              return `<path fill="currentColor"${add_attribute("d", mdiShareVariant, 0)}></path>`;
            }
          })}`;
        }
      }
    )}` : ``} <main class="svelte-1yecohh">${data.quiz == "listen" ? `<div class="svelte-1yecohh"><p>${escape(dict["Послушай и напиши"][$langs])}:</p> ${`<button class="svelte-1yecohh">${escape(dict["Старт"][$langs])}</button>`}</div> <div class="svelte-1yecohh"> ${name === "Nummers" ? `<div class="input svelte-1yecohh" contenteditable="true"${add_attribute("style", inputStyle, 0)}${add_attribute("this", div_input, 0)}>${(($$value) => $$value === void 0 ? `<!-- HTML_TAG_START -->${result}<!-- HTML_TAG_END -->` : $$value)(userContent)}</div>` : `${name === "Tijd" ? `<div contenteditable="true" id="userTime" class="input svelte-1yecohh" placeholder="hh:mm"${add_attribute("this", div_input, 0)}>${/* @__PURE__ */ (($$value) => $$value === void 0 ? `` : $$value)(userContent)}</div>` : `${name === "Alphabet" ? `<div contenteditable="true" id="userTime" class="input svelte-1yecohh"${add_attribute("this", div_input, 0)}>${/* @__PURE__ */ (($$value) => $$value === void 0 ? `` : $$value)(userContent)}</div>` : ``}`}`} ${``} </div>` : `${data.quiz == "dialog.client" ? `${validate_component(Speak, "Speak").$$render($$result, { data }, {}, {})}` : ``}`} </main>`;
  } while (!$$settled);
  $$unsubscribe_dc();
  $$unsubscribe_lesson();
  $$unsubscribe_llang();
  $$unsubscribe_dc_state();
  $$unsubscribe_dicts();
  $$unsubscribe_langs();
  return $$rendered;
});
const css$5 = {
  code: "main.svelte-1sqog5b.svelte-1sqog5b{display:inline-grid;transition:transform 0.3s ease-in-out;margin:0 auto;position:relative;transition:transform 0.5s;margin-top:30px}.flexor.svelte-1sqog5b.svelte-1sqog5b{position:relative}.title.svelte-1sqog5b.svelte-1sqog5b{color:coral;position:relative;text-align:center;margin-top:60px}.hint_button.svelte-1sqog5b.svelte-1sqog5b{display:inline-block;border:solid 0.1em #80777791;border-radius:5px;text-align:center;width:auto;padding-left:8px;margin:5px;color:#2196e6;background-color:transparent}.word.svelte-1sqog5b.svelte-1sqog5b{font-size:0.8em;flex-direction:column;align-items:center;margin:2px;text-align:center;line-height:17px}p.svelte-1sqog5b.svelte-1sqog5b{position:relative;transition:opacity 0.5s ease;text-align:center;font-size:xx-large;margin:0}.speaker-button.svelte-1sqog5b.svelte-1sqog5b{display:inline-flex;position:relative;float:right;margin-right:10px;font-size:large;border-radius:25px;transform:translate(50%, 0%);font-size:large;z-index:2 !important}.input-container.svelte-1sqog5b.svelte-1sqog5b{display:inline-block;font-size:1em;position:relative;color:#2196f3;width:95vw;margin:0 auto;text-align:center}.words_div.svelte-1sqog5b.svelte-1sqog5b{position:relative;text-align:center;overflow-y:auto;height:70vh}.input.svelte-1sqog5b.svelte-1sqog5b{position:relative;height:18px;display:inline-table;outline:none;border:none;background:rgba(0, 0, 0, 0.12);text-align:center}.input.svelte-1sqog5b.svelte-1sqog5b:focus{outline:none}.material-symbols-outlined.svelte-1sqog5b.svelte-1sqog5b{font-size:15px;scale:1.5;font-variation-settings:'FILL' 0,\n      'wght' 400,\n      'GRAD' 0,\n      'opsz' 24}.hint-button.svelte-1sqog5b.svelte-1sqog5b{border:0px;color:white;background-color:#2196f3;border-radius:3px;padding:8px 10px}.counter.svelte-1sqog5b.svelte-1sqog5b{background-color:#f0f0f0;padding:0px;border-radius:25px;width:30px;height:30px;top:-10px;left:-6px;box-shadow:0 2px 4px rgba(0, 0, 0, 0.1);text-align:center}.counter.svelte-1sqog5b p.svelte-1sqog5b{margin:0;font-size:15px;color:#333}.counter.svelte-1sqog5b span.svelte-1sqog5b{font-weight:700;font-size:15px;color:#ff5733}.lang_span.svelte-1sqog5b.svelte-1sqog5b{font-size:large}.lang_list.svelte-1sqog5b.svelte-1sqog5b{position:absolute;top:50px;height:80vh;overflow:auto;justify-content:center;align-items:center;background-color:white}",
  map: null
};
function extractWords$1(text) {
  const regex = /<<(.*?)>>/g;
  let result = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    result.push(match[1]);
  }
  return result;
}
function replaceWordWithInput$1(text, targetWord) {
  return text.replace(/<<([^>]*)>>/g, `<span  value="$1" class="sentence_span" style="position: relative;width:20px;  left: 0px;" onclick=OnClickInput></span>`);
}
function getTextWidth$1(text, font) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width + 5;
}
function shuffle$1(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
const Word = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $lesson, $$unsubscribe_lesson;
  let $llang, $$unsubscribe_llang;
  let $langs, $$unsubscribe_langs;
  let $$unsubscribe_dicts;
  let $dc, $$unsubscribe_dc;
  $$unsubscribe_lesson = subscribe(lesson, (value) => $lesson = value);
  $$unsubscribe_llang = subscribe(llang, (value) => $llang = value);
  $$unsubscribe_langs = subscribe(langs, (value) => $langs = value);
  $$unsubscribe_dicts = subscribe(dicts, (value) => value);
  $$unsubscribe_dc = subscribe(dc, (value) => $dc = value);
  let playAutoColor = "currentColor";
  let tts;
  let { data } = $$props;
  const abonent = getContext("abonent");
  let words = [], example;
  let hints;
  let currentWordIndex = 0;
  let currentWord;
  data.highlight ? data.highlight.split(",") : [];
  let _llang = $llang;
  let userContent = [];
  let div_input = [];
  let result = "&nbsp;";
  let resultElement;
  let resultElementWidth = [];
  data.name?.split(",");
  fetch(`./lesson?words=theme&theme=${data.theme}&name=${data.name}&owner=${abonent}&level=${data.level}`).then((response) => response.json()).then((data2) => {
    words = data2.data.data;
    if (!words[0])
      return;
    currentWord = words[currentWordIndex];
    makeExample();
  }).catch((error) => {
    console.log(error);
    return [];
  });
  let topAppBar;
  function makeExample() {
    if (!currentWord)
      return;
    return new Promise(async (resolve, reject) => {
      if (currentWord?.example[$langs]) {
        example = currentWord.example[$langs];
      } else if (currentWord.example[$llang]) {
        example = await Translate(currentWord.example[$llang], $llang, $langs);
      }
      currentWord.example[$langs] = example;
      const regex = /(<<\w+>>)\s+(<<\w+>>)/;
      const match = currentWord?.example[$llang] ? currentWord?.example[$llang].match(regex) : "";
      if (match) {
        `${match[0]} ${match[1]}`;
      }
      resultElement = replaceWordWithInput$1(
        currentWord?.example[$llang] ? currentWord?.example[$llang] : currentWord.example[$llang] = await Translate(currentWord.example["ru"], "ru", $llang)
      );
      if (example.includes("<<") && example.includes(">>")) {
        example = example?.replace(/<<([^<>]+)>>/gu, !data.level.includes("C1") ? '<span style="color:green" onclick=OnClickInput><b>$1</b></span>' : "$1");
      } else if (example.includes('"')) {
        example = example?.replace(/"([^"]+)"/gu, !data.level.includes("C1") ? '<span style="color:green" onclick=OnClickInput><b>$1</b></span>' : "$1");
      }
      setTimeout(
        () => {
          const wAr = extractWords$1(currentWord?.example[$llang]);
          const spanElements = document.querySelectorAll(".sentence_span");
          spanElements.forEach((spanElement, i) => {
            if (div_input)
              div_input[i].style.display = "";
            spanElement.appendChild(div_input[i]);
            resultElementWidth[i] = getTextWidth$1(wAr[i], "20px Arial");
          });
        },
        0
      );
      function getSubArray(arr, index) {
        const totalElements = 10;
        const halfRange = Math.floor(totalElements / 2);
        let startIndex = index - halfRange;
        let endIndex = index + halfRange;
        if (startIndex < 0) {
          endIndex += Math.abs(startIndex);
          startIndex = 0;
        }
        if (endIndex >= arr.length) {
          startIndex -= endIndex - arr.length + 1;
          endIndex = arr.length - 1;
        }
        startIndex = Math.max(startIndex, 0);
        return arr.slice(startIndex, endIndex + 1);
      }
      hints = getSubArray([...words], currentWordIndex);
      shuffle$1(hints);
      resolve();
    });
  }
  onDestroy(() => {
    set_store_value(llang, $llang = _llang, $llang);
    set_store_value(lesson, $lesson.data = { quiz: "" }, $lesson);
  });
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.extractWords === void 0 && $$bindings.extractWords && extractWords$1 !== void 0)
    $$bindings.extractWords(extractWords$1);
  $$result.css.add(css$5);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      {
        playAutoColor = "currentColor";
      }
    }
    {
      if ($langs) {
        makeExample();
      }
    }
    $$rendered = ` ${validate_component(Tts, "TTS").$$render(
      $$result,
      { this: tts },
      {
        this: ($$value) => {
          tts = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${words?.length < 1 ? `<div style="text-align:center"><span class="material-symbols-outlined svelte-1sqog5b" style="font-size: 20px; color: blue; scale:1.5;">${validate_component(CircularProgress, "CircularProgress").$$render(
      $$result,
      {
        style: "height: 50px; width: 50px;",
        indeterminate: true
      },
      {},
      {}
    )}</span></div>` : ``} ${words ? `<main class="svelte-1sqog5b"><div class="top-app-bar-container flexor svelte-1sqog5b">${validate_component(TopAppBar, "TopAppBar").$$render(
      $$result,
      { variant: "fixed", this: topAppBar },
      {
        this: ($$value) => {
          topAppBar = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(Row, "Row").$$render($$result, {}, {}, {
            default: () => {
              return `${validate_component(Section$1, "Section").$$render($$result, { align: "start" }, {}, {
                default: () => {
                  return `${``}`;
                }
              })} ${validate_component(Section$1, "Section").$$render($$result, { align: "start" }, {}, {
                default: () => {
                  return `<button class="hint-button svelte-1sqog5b" data-svelte-h="svelte-197iwd0"><span class="material-symbols-outlined svelte-1sqog5b">?</span></button>`;
                }
              })} ${validate_component(Section$1, "Section").$$render($$result, {}, {}, {
                default: () => {
                  return `${!$dc ? `${validate_component(IconButton, "IconButton").$$render($$result, {}, {}, {
                    default: () => {
                      return `${validate_component(CommonIcon, "Icon").$$render($$result, { tag: "svg", viewBox: "0 0 24 24" }, {}, {
                        default: () => {
                          return `<path${add_attribute("fill", playAutoColor, 0)}${add_attribute("d", mdiEarHearing, 0)}></path>`;
                        }
                      })}`;
                    }
                  })}` : ``}`;
                }
              })} ${validate_component(Section$1, "Section").$$render($$result, { align: "end" }, {}, {
                default: () => {
                  return `<div class="counter svelte-1sqog5b"><p class="svelte-1sqog5b"><span class="mdc-typography--overline svelte-1sqog5b" style="position:relative">${escape(currentWordIndex)} ${validate_component(Badge, "Badge").$$render(
                    $$result,
                    {
                      position: "middle",
                      align: "bottom-end - bottom-middle",
                      "aria-label": "unread count",
                      style: "margin-right:-10px;scale:.8"
                    },
                    {},
                    {
                      default: () => {
                        return `${escape(words.length)}`;
                      }
                    }
                  )}</span></p></div>`;
                }
              })} ${validate_component(Section$1, "Section").$$render($$result, { align: "end" }, {}, {
                default: () => {
                  return `${`${validate_component(CommonIcon, "Icon").$$render(
                    $$result,
                    {
                      tag: "svg",
                      viewBox: "0 0 24 24",
                      style: "margin-top:0px; scale:.5; width:50px"
                    },
                    {},
                    {
                      default: () => {
                        return `<path fill="white"${add_attribute("d", mdiShuffle, 0)}></path>`;
                      }
                    }
                  )}`}`;
                }
              })} ${validate_component(Section$1, "Section").$$render($$result, { align: "end" }, {}, {
                default: () => {
                  return `<span class="lang_span svelte-1sqog5b">${escape(/* @__PURE__ */ (() => {
                    return $llang;
                  })())}</span> ${``}`;
                }
              })} ${validate_component(Section$1, "Section").$$render($$result, { align: "end" }, {}, {
                default: () => {
                  return `${`${validate_component(CommonIcon, "Icon").$$render(
                    $$result,
                    {
                      tag: "svg",
                      viewBox: "0 0 24 24",
                      style: "visibility:hidden;margin-top:0px; scale:.5; width:50px"
                    },
                    {},
                    {
                      default: () => {
                        return `<path fill="white"${add_attribute("d", mdiTextBoxCheckOutline, 0)}></path>`;
                      }
                    }
                  )}`}`;
                }
              })}`;
            }
          })}`;
        }
      }
    )}</div> <span style="display:block;position:relative;top: 60px;color: lightgray;font-style: italic;font-size:smaller;font-family: serif;">${escape(data.name)}</span> ${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ``;
      }
      return function(data2) {
        return ` <div class="title svelte-1sqog5b">${escape(data2)}:</div> `;
      }(__value);
    }(Translate("Заполнить пропуски", "ru", $langs))} <div class="word svelte-1sqog5b">${example ? `<!-- HTML_TAG_START -->${example}<!-- HTML_TAG_END -->` : `${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ``;
      }
      return function(data2) {
        return ` <!-- HTML_TAG_START -->${data2}<!-- HTML_TAG_END --> `;
      }(__value);
    }(Translate(example, "ru", $langs))}`}</div> <div class="input-container svelte-1sqog5b">${resultElement ? `<!-- HTML_TAG_START -->${resultElement}<!-- HTML_TAG_END -->` : ``} <div class="input svelte-1sqog5b" contenteditable="true" style="${"display:none;width: " + escape(resultElementWidth[0], true) + "px"}"${add_attribute("this", div_input[0], 0)}>${(($$value) => $$value === void 0 ? `<!-- HTML_TAG_START -->${result}<!-- HTML_TAG_END -->` : $$value)(userContent[0])}</div> <div class="input svelte-1sqog5b" contenteditable="true" style="${"display:none;width: " + escape(resultElementWidth[1], true) + "px"}"${add_attribute("this", div_input[1], 0)}>${(($$value) => $$value === void 0 ? `<!-- HTML_TAG_START -->${result}<!-- HTML_TAG_END -->` : $$value)(userContent[1])}</div> <div class="speaker-button svelte-1sqog5b">${validate_component(IconButton, "IconButton").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(CommonIcon, "Icon").$$render($$result, { tag: "svg", viewBox: "0 0 24 24" }, {}, {
          default: () => {
            return `<path fill="currentColor"${add_attribute("d", mdiPlay, 0)}></path>`;
          }
        })}`;
      }
    })}</div></div>   <div class="words_div accordion-container svelte-1sqog5b">${hints?.length > 0 ? `${validate_component(Content, "Content").$$render(
      $$result,
      {
        style: "line-height: 2.0; overflow-y:auto;"
      },
      {},
      {
        default: () => {
          return `${each(hints, (hint, i) => {
            return `${hint?.example[$llang] ? `<span class="hint_button svelte-1sqog5b"><!-- HTML_TAG_START -->${extractWords$1(hint?.example[$llang]).join(" ") + "&nbsp;&nbsp;"}<!-- HTML_TAG_END --> </span>` : `${function(__value) {
              if (is_promise(__value)) {
                __value.then(null, noop);
                return ``;
              }
              return function(data2) {
                return ` <span class="hint_button svelte-1sqog5b"><!-- HTML_TAG_START -->${extractWords$1(data2).join(" ") + "&nbsp;&nbsp;"}<!-- HTML_TAG_END --></span> `;
              }(__value);
            }(Translate(hint?.example["ru"], "ru", $llang))}`}`;
          })} <div style="height:80px"></div>`;
        }
      }
    )}` : ``}</div> <div style="height:300px"></div></main>` : ``}`;
  } while (!$$settled);
  $$unsubscribe_lesson();
  $$unsubscribe_llang();
  $$unsubscribe_langs();
  $$unsubscribe_dicts();
  $$unsubscribe_dc();
  return $$rendered;
});
const css$4 = {
  code: "main.svelte-17r0iu4.svelte-17r0iu4{margin:0 auto;position:relative;transition:transform 0.5s;top:30px}.flexor.svelte-17r0iu4.svelte-17r0iu4{position:relative}.title.svelte-17r0iu4.svelte-17r0iu4{color:coral;position:relative;text-align:center;margin-top:0px;top:60px}.hint_button.svelte-17r0iu4.svelte-17r0iu4{display:inline-block;border:solid 0.1em #9f3f3f;border-radius:5px;text-align:center;width:auto;padding-left:8px;margin:5px;background-color:transparent}.hint_example.svelte-17r0iu4.svelte-17r0iu4{position:relative;top:60px;border-radius:5px;text-align:center;width:auto;padding-left:5px;margin:5px;background-color:transparent}.disabled.svelte-17r0iu4.svelte-17r0iu4{visibility:hidden}.word.svelte-17r0iu4.svelte-17r0iu4{position:relative;top:60px;font-size:larger;flex-direction:column;align-items:center;margin:2px;text-align:center}.example.svelte-17r0iu4.svelte-17r0iu4{color:#2196f3}.hidden.svelte-17r0iu4.svelte-17r0iu4{opacity:0;pointer-events:none}p.svelte-17r0iu4.svelte-17r0iu4{position:relative;transition:opacity 0.5s ease;text-align:center;font-size:xx-large;margin:0}.speaker-button.svelte-17r0iu4.svelte-17r0iu4{position:relative;top:0px;right:10px;transform:translate(50%, 0%);font-size:large;z-index:1}.input-container.svelte-17r0iu4.svelte-17r0iu4{display:inline-block;top:60px;font-size:larger;position:relative;color:#2196f3;width:95vw;margin:0 auto;text-align:center}.words_div.svelte-17r0iu4.svelte-17r0iu4{position:relative;text-align:center;overflow-y:auto;top:80px}.input.svelte-17r0iu4.svelte-17r0iu4{position:relative;height:18px;display:inline-table;outline:none;border:none;background:rgba(0, 0, 0, 0.12);text-align:center}.input.svelte-17r0iu4.svelte-17r0iu4:focus{outline:none}.next10-button.svelte-17r0iu4.svelte-17r0iu4,.shuffle-button.svelte-17r0iu4.svelte-17r0iu4,.prev-button.svelte-17r0iu4.svelte-17r0iu4,.check-button.svelte-17r0iu4.svelte-17r0iu4,.next-button.svelte-17r0iu4.svelte-17r0iu4{padding:8px 10px;font-size:16px;font-weight:500;border-color:#2196f3;border-radius:5px;cursor:pointer;color:#2196f3}.material-symbols-outlined.svelte-17r0iu4.svelte-17r0iu4{font-size:15px;scale:1.5;font-variation-settings:'FILL' 0,\n      'wght' 400,\n      'GRAD' 0,\n      'opsz' 24}.hint-button.svelte-17r0iu4.svelte-17r0iu4{border:0px;color:white;background-color:#2196f3;border-radius:3px;padding:8px 10px}.counter.svelte-17r0iu4.svelte-17r0iu4{background-color:#f0f0f0;padding:0px;border-radius:25px;width:50px;height:30px;top:-10px;left:-6px;box-shadow:0 2px 4px rgba(0, 0, 0, 0.1);text-align:center}.counter.svelte-17r0iu4 p.svelte-17r0iu4{margin:0;font-size:15px;color:#333}.counter.svelte-17r0iu4 span.svelte-17r0iu4{font-weight:700;font-size:15px;color:#ff5733}.lang_span.svelte-17r0iu4.svelte-17r0iu4{font-size:large}.lang_list.svelte-17r0iu4.svelte-17r0iu4{position:absolute;top:50px;height:80vh;overflow:auto;justify-content:center;align-items:center;background-color:white}.selected.svelte-17r0iu4.svelte-17r0iu4{background-color:coral}",
  map: null
};
function extractWords(text) {
  const regex = /<<(.*?)>>/g;
  let result = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    result.push(match[1]);
  }
  return result;
}
function replaceWordWithInput(text, targetWord) {
  return text.replace(/<<([^>]*)>>/g, `<span  value="$1" class="sentence_span" style="position: relative;width:20px;  left: 0px; color:green; font-weight:bold"  onclick=OnClickInput></span>`);
}
function getTextWidth(text, font) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width + 20;
}
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
const WordGame = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $showBottomAppBar, $$unsubscribe_showBottomAppBar;
  let $lesson, $$unsubscribe_lesson;
  let $llang, $$unsubscribe_llang;
  let $dc, $$unsubscribe_dc;
  let $langs, $$unsubscribe_langs;
  let $msg, $$unsubscribe_msg;
  let $OnCheckQU, $$unsubscribe_OnCheckQU;
  let $call_but_status, $$unsubscribe_call_but_status;
  let $$unsubscribe_dicts;
  $$unsubscribe_showBottomAppBar = subscribe(showBottomAppBar, (value) => $showBottomAppBar = value);
  $$unsubscribe_lesson = subscribe(lesson, (value) => $lesson = value);
  $$unsubscribe_llang = subscribe(llang, (value) => $llang = value);
  $$unsubscribe_dc = subscribe(dc, (value) => $dc = value);
  $$unsubscribe_langs = subscribe(langs, (value) => $langs = value);
  $$unsubscribe_msg = subscribe(msg, (value) => $msg = value);
  $$unsubscribe_OnCheckQU = subscribe(OnCheckQU, (value) => $OnCheckQU = value);
  $$unsubscribe_call_but_status = subscribe(call_but_status, (value) => $call_but_status = value);
  $$unsubscribe_dicts = subscribe(dicts, (value) => value);
  let tts;
  let { data } = $$props;
  const abonent = getContext("abonent");
  let words = [], example = "&nbsp;";
  let hints = {};
  let currentWordIndex = 0;
  let currentWord;
  let doneWords = 0;
  let doneWords_2 = 0;
  let userContent = [];
  let div_input = [];
  let result = "&nbsp;";
  let resultElement;
  let showHints = {};
  let _llang = $llang;
  let resultElementWidth = [];
  let level = data.level;
  let share_mode = false;
  let isFlipped = false;
  let hint_example = "";
  let label = {};
  label[true] = "Ожидай вопрос";
  label[false] = "Выбери слово";
  data.name?.split(",");
  if (data.theme && data.name && level)
    fetch(`./lesson?words=theme&theme=${data.theme}&name=${data.name}&owner=${abonent}&level=${level}`).then((response) => response.json()).then((data2) => {
      words = data2.data.data || [];
      if (!words[0])
        return;
      hints[false] = JSON.parse(JSON.stringify(words));
      hints[true] = JSON.parse(JSON.stringify(words));
      showHints[isFlipped] = true;
      if ($call_but_status !== "active" && !isFlipped) {
        onShare();
      }
    }).catch(
      (error) => {
        console.log(error);
        return [];
      }
    );
  function onShare() {
    share_mode = true;
    const lesson2 = {
      lesson: {
        quiz: "word",
        name: data.name,
        llang: $llang,
        level,
        words_data: words,
        isFlipped
      }
    };
    SendData(lesson2);
  }
  let topAppBar;
  async function makeExample() {
    if (!currentWord)
      return;
    resultElement = "";
    example = "";
    if (currentWord.example[$langs]) {
      example = currentWord["example"][$langs];
    } else if (currentWord.example[$llang]) {
      example = await Translate(currentWord["example"][$llang], $llang, $langs);
    }
    const regex = /(<<\w+>>)\s+(<<\w+>>)/;
    const match = example.match(regex);
    if (match) {
      `${match[0]} ${match[1]}`;
    }
    resultElement = replaceWordWithInput(
      currentWord?.example[$llang] ? currentWord?.example[$llang] : await Translate(currentWord.example["ru"], "ru", $llang)
    );
    if (example.includes("<<") && example.includes(">>")) {
      example = example?.replace(/<<([^<>]+)>>/gu, level.includes("A1") ? '<span style="color:green" onclick=OnClickInput><b>$1</b></span>' : "$1");
    } else if (example.includes('"')) {
      example = example?.replace(/"([^"]+)"/gu, level.includes("A1") ? '<span style="color:green" onclick=OnClickInput><b>$1</b></span>' : "$1");
    }
    setTimeout(
      () => {
        const wAr = extractWords(currentWord?.example[$llang]);
        const spanElements = document.querySelectorAll(".sentence_span");
        spanElements.forEach((spanElement, i) => {
          div_input[i].style.display = "";
          spanElement.appendChild(div_input[i]);
          resultElementWidth[i] = getTextWidth(wAr[i], "20px Arial");
        });
      },
      0
    );
    function getSubArray(arr, index) {
      const totalElements = 10;
      const halfRange = Math.floor(totalElements / 2);
      let startIndex = index - halfRange;
      let endIndex = index + halfRange;
      if (startIndex < 0) {
        endIndex += Math.abs(startIndex);
        startIndex = 0;
      }
      if (endIndex >= arr.length) {
        startIndex -= endIndex - arr.length + 1;
        endIndex = arr.length - 1;
      }
      startIndex = Math.max(startIndex, 0);
      return arr.slice(startIndex, endIndex + 1);
    }
    if (isFlipped) {
      hints[isFlipped] = getSubArray([...words], currentWordIndex);
      shuffle(hints[isFlipped]);
    }
  }
  async function SendData(data2) {
    if (share_mode && $dc) {
      await $dc?.SendData(data2, (ex) => {
        console.log(ex);
      });
    }
  }
  onDestroy(() => {
    set_store_value(llang, $llang = _llang, $llang);
    set_store_value(lesson, $lesson.data.quiz = "", $lesson);
    set_store_value(showBottomAppBar, $showBottomAppBar = true, $showBottomAppBar);
  });
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.extractWords === void 0 && $$bindings.extractWords && extractWords !== void 0)
    $$bindings.extractWords(extractWords);
  $$result.css.add(css$4);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      switch ($call_but_status) {
        case "talk":
          break;
        default:
          share_mode = false;
          break;
      }
    }
    {
      if ($langs) {
        makeExample();
      }
    }
    {
      if ($llang) {
        makeExample();
      }
    }
    {
      if ($msg?.lesson?.quiz === "word" && !$msg.lesson.isFlipped) {
        try {
          if ($msg.lesson.words_data) {
            words = $msg.lesson.words_data;
            hints[false] = JSON.parse(JSON.stringify(words));
            hints[true] = JSON.parse(JSON.stringify(words));
            isFlipped = !$msg.lesson.isFlipped;
            level = $msg.lesson.level;
            share_mode = true;
            showHints[isFlipped] = false;
            $OnCheckQU(null, "word", $msg.lesson.name);
          } else if (($msg.lesson.word_correct || $msg.lesson.word_correct == 0) && hints) {
            hints[isFlipped][$msg.lesson.word_correct].disabled = "disabled";
            hint_example = "";
            doneWords_2 = $msg.lesson.done_words;
          } else if (($msg.lesson.word_error || $msg.lesson.word_error == 0) && hints) {
            hint_example = "";
          } else if ($msg.lesson.word_index || $msg.lesson.word_index == 0) {
            currentWord = words[$msg.lesson.word_index];
            currentWordIndex = $msg.lesson.word_index;
            showHints[isFlipped] = true;
            label[true] = "Заполни пропуски";
            label[false] = "Твой ход. Выбери слово";
            level = $msg.lesson.level;
            makeExample();
            setTimeout(
              () => {
                set_store_value(msg, $msg = "", $msg);
              },
              10
            );
          } else if ($msg?.lesson.word_flip) {
            isFlipped = $msg.lesson.word_flip;
            set_store_value(msg, $msg.lesson.word_flip = null, $msg);
            hints[isFlipped] = hints[isFlipped];
            showHints[isFlipped] = false;
            label[true] = "Ожидай вопрос";
            resultElement = "";
            result = "";
            hint_example = "";
            example = "";
          }
        } catch (ex) {
          console.log(ex);
        }
      }
    }
    {
      if ($msg?.lesson?.quiz === "word" && $msg.lesson.isFlipped) {
        if ($msg.lesson.word_index || $msg.lesson.word_index == 0) {
          currentWord = words[$msg.lesson.word_index];
          currentWordIndex = $msg.lesson.word_index;
          label[true] = "Заполни пропуски";
          label[false] = "Твой ход. Выбери слово";
          showHints[isFlipped] = true;
          level = $msg.lesson.level;
          makeExample();
        } else if ($msg?.lesson.words_data) {
          words = $msg.lesson.words_data;
          hints[false] = JSON.parse(JSON.stringify(words));
          hints[true] = JSON.parse(JSON.stringify(words));
          level = $msg.lesson.level;
          share_mode = true;
          isFlipped = !$msg.lesson.isFlipped;
          showHints[isFlipped] = false;
          $OnCheckQU(null, "word", $msg.lesson.name);
        } else if (($msg.lesson.word_correct || $msg.lesson.word_correct == 0) && hints) {
          hints[isFlipped][$msg.lesson.word_correct].disabled = "disabled";
          hint_example = "";
          doneWords_2 = $msg.lesson.done_words;
        } else if (($msg.lesson.word_error || $msg.lesson.word_error == 0) && hints) {
          hint_example = "";
        } else if ($msg.lesson.word_flip) {
          isFlipped = $msg.lesson.word_flip;
          hints[isFlipped] = hints[isFlipped];
          set_store_value(msg, $msg.lesson.word_flip = null, $msg);
          showHints[isFlipped] = false;
          label[true] = "Ожидай вопрос";
          resultElement = "";
          result = "";
          hint_example = "";
          example = "";
        }
      }
    }
    {
      if ($msg?.msg) {
        (async () => {
          alert(await Translate($msg?.msg, "ru", $langs));
          if ($msg)
            set_store_value(msg, $msg.msg = "", $msg);
        })();
      }
    }
    $$rendered = ` ${validate_component(Tts, "TTS").$$render(
      $$result,
      { this: tts },
      {
        this: ($$value) => {
          tts = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${words.length === 0 ? `<div style="text-align:center"><span class="material-symbols-outlined svelte-17r0iu4" style="font-size: 20px; color: blue; scale:1.5;">${validate_component(CircularProgress, "CircularProgress").$$render(
      $$result,
      {
        style: "height: 50px; width: 50px;",
        indeterminate: true
      },
      {},
      {}
    )}</span></div>` : `<main class="svelte-17r0iu4"><div class="top-app-bar-container flexor svelte-17r0iu4">${validate_component(TopAppBar, "TopAppBar").$$render(
      $$result,
      { variant: "fixed", this: topAppBar },
      {
        this: ($$value) => {
          topAppBar = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(Row, "Row").$$render($$result, {}, {}, {
            default: () => {
              return `${validate_component(Section$1, "Section").$$render($$result, {}, {}, {})} ${validate_component(Section$1, "Section").$$render($$result, {}, {}, {
                default: () => {
                  return ` `;
                }
              })} ${validate_component(Section$1, "Section").$$render($$result, {}, {}, {
                default: () => {
                  return `<button class="hint-button svelte-17r0iu4" data-svelte-h="svelte-197iwd0"><span class="material-symbols-outlined svelte-17r0iu4">?</span></button>`;
                }
              })} ${validate_component(Section$1, "Section").$$render($$result, {}, {}, {
                default: () => {
                  return `<div class="counter svelte-17r0iu4" style="display:inline"><p class="svelte-17r0iu4"><span class="mdc-typography--overline svelte-17r0iu4" style="position:relative">${escape(doneWords)}:${escape(doneWords_2)} ${validate_component(Badge, "Badge").$$render(
                    $$result,
                    {
                      position: "middle",
                      align: "bottom-end - bottom-middle",
                      "aria-label": "unread count",
                      style: "margin-right:-15px;scale:.8"
                    },
                    {},
                    {
                      default: () => {
                        return `${escape(words.length)}`;
                      }
                    }
                  )}</span></p></div>`;
                }
              })} ${validate_component(Section$1, "Section").$$render($$result, { align: "end" }, {}, {
                default: () => {
                  return `<span class="lang_span svelte-17r0iu4">${escape(/* @__PURE__ */ (() => {
                    return $llang;
                  })())}</span> ${``}`;
                }
              })} ${validate_component(Section$1, "Section").$$render($$result, { align: "end" }, {}, {
                default: () => {
                  return `${isFlipped ? `${`${``}`}` : ``}`;
                }
              })}`;
            }
          })}`;
        }
      }
    )}</div> ${isFlipped ? `<div class="word svelte-17r0iu4"><!-- HTML_TAG_START -->${example}<!-- HTML_TAG_END --></div> <div class="input-container svelte-17r0iu4">${resultElement ? `<!-- HTML_TAG_START -->${resultElement}<!-- HTML_TAG_END -->` : ``} <div class="input svelte-17r0iu4" contenteditable="true" style="${"display:none;width: " + escape(resultElementWidth[0], true) + "px"}"${add_attribute("this", div_input[0], 0)}>${(($$value) => $$value === void 0 ? `<!-- HTML_TAG_START -->${result}<!-- HTML_TAG_END -->` : $$value)(userContent[0])}</div> <div class="input svelte-17r0iu4" contenteditable="true" style="${"display:none;width: " + escape(resultElementWidth[1], true) + "px"}"${add_attribute("this", div_input[1], 0)}>${(($$value) => $$value === void 0 ? `<!-- HTML_TAG_START -->${result}<!-- HTML_TAG_END -->` : $$value)(userContent[1])}</div></div>  ${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ``;
      }
      return function(data2) {
        return ` <div class="title svelte-17r0iu4">${escape(data2)}</div> `;
      }(__value);
    }(Translate(label[isFlipped], "ru", $langs))}` : `${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ``;
      }
      return function(data2) {
        return ` <div class="title svelte-17r0iu4">${escape(data2)}:</div> `;
      }(__value);
    }(Translate(label[isFlipped], "ru", $langs))} ${showHints[isFlipped] ? `<div class="hint_example svelte-17r0iu4"><!-- HTML_TAG_START -->${hint_example}<!-- HTML_TAG_END --></div>` : ``}`} <div class="words_div accordion-container svelte-17r0iu4">${isFlipped ? `${hints[isFlipped]?.length > 0 && showHints[isFlipped] ? `${validate_component(Content, "Content").$$render(
      $$result,
      {
        style: "line-height: 2.0; overflow-y:auto; height:70vh"
      },
      {},
      {
        default: () => {
          return `${each(hints[isFlipped], (hint, i) => {
            return ` ${hint?.example[$llang] ? ` <span class="${"hint_button " + escape(hint.disabled, true) + " svelte-17r0iu4"}"><!-- HTML_TAG_START -->${extractWords(hint.example[$llang]).join(" ") + "&nbsp;&nbsp;"}<!-- HTML_TAG_END --></span> ` : `${function(__value) {
              if (is_promise(__value)) {
                __value.then(null, noop);
                return ``;
              }
              return function(data2) {
                return ` <span class="${"hint_button " + escape(hint.disabled, true) + " svelte-17r0iu4"}"><!-- HTML_TAG_START -->${extractWords(data2).join(" ") + "&nbsp;&nbsp;"}<!-- HTML_TAG_END --></span> `;
              }(__value);
            }(Translate(hint?.example["ru"], "ru", $llang))}`}`;
          })} <div style="height:50px"></div>`;
        }
      }
    )}` : ``}` : `${hints[isFlipped]?.length > 0 ? `${validate_component(Content, "Content").$$render(
      $$result,
      {
        style: "line-height: 2.0; overflow-y:auto; height:70vh"
      },
      {},
      {
        default: () => {
          return `${each(hints[isFlipped], (hint, i) => {
            return ` ${hint?.example[$langs] ? ` <span class="${"hint_button " + escape(hint.disabled, true) + " svelte-17r0iu4"}"><!-- HTML_TAG_START -->${extractWords(hint?.example[$langs]).join(" ") + "&nbsp;&nbsp;"}<!-- HTML_TAG_END --></span> ` : `${function(__value) {
              if (is_promise(__value)) {
                __value.then(null, noop);
                return ``;
              }
              return function(data2) {
                return ` <span class="${"hint_button " + escape(hint.disabled, true) + " svelte-17r0iu4"}"><!-- HTML_TAG_START -->${extractWords(data2).join(" ") + "&nbsp;&nbsp;"}<!-- HTML_TAG_END --></span> `;
              }(__value);
            }(Translate(hint?.example["ru"], "ru", $langs))}`}`;
          })} <div style="height:50px"></div>`;
        }
      }
    )}` : ``}`}</div></main>`}`;
  } while (!$$settled);
  $$unsubscribe_showBottomAppBar();
  $$unsubscribe_lesson();
  $$unsubscribe_llang();
  $$unsubscribe_dc();
  $$unsubscribe_langs();
  $$unsubscribe_msg();
  $$unsubscribe_OnCheckQU();
  $$unsubscribe_call_but_status();
  $$unsubscribe_dicts();
  return $$rendered;
});
const Quiz = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $call_but_status, $$unsubscribe_call_but_status;
  $$unsubscribe_call_but_status = subscribe(call_but_status, (value) => $call_but_status = value);
  let { data } = $$props;
  let quiz = data.quiz;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$unsubscribe_call_but_status();
  return `<div></div>  ${quiz ? `${quiz.includes("dialog") ? `${validate_component(Dialog_1, "Dialog").$$render($$result, { data }, {}, {})}` : `${quiz.includes("listen") ? `${data.name === "Nummers" ? `${validate_component(Numbers, "Numbers").$$render($$result, { data }, {}, {})}` : `${data.name === "Tijd" ? `${validate_component(Time, "Time").$$render($$result, { data }, {}, {})}` : `${validate_component(Listen, "Listen").$$render($$result, { data }, {}, {})}`}`}` : `${quiz === "word" ? `${$call_but_status === "talk" ? `${validate_component(WordGame, "WordGame").$$render($$result, { data }, {}, {})}` : `${$call_but_status === "inactive" || $call_but_status === "active" ? `${validate_component(Word, "Word").$$render($$result, { data }, {}, {})}` : `<div style="text-align:center"><span class="material-symbols-outlined" style="position: relative;font-size: 20px; top:20vh; color: blue; scale:1.5;">${validate_component(CircularProgress, "CircularProgress").$$render(
    $$result,
    {
      style: "height: 50px; width: 50px;",
      indeterminate: true
    },
    {},
    {}
  )}</span></div>`}`}` : ``}`}`}` : ``}`;
});
const css$3 = {
  code: "main.svelte-ld5htn{position:fixed;top:20px;left:0;height:100vh;overflow-y:auto;width:100vw;margin:0 auto;background-color:#fff}.module_level.svelte-ld5htn{position:fixed;color:white;background-color:rgba(225, 55, 55, 0.8);top:60px;left:10px;transform:translate(-50%, -50%);z-index:1}.user-cards.svelte-ld5htn{display:flex;justify-content:flex-end}.lesson-container.svelte-ld5htn{overflow-y:auto;overflow-x:hidden;max-width:100%;padding-top:10px;scrollbar-width:none;-ms-overflow-style:none}.quiz-container.svelte-ld5htn{display:flex;position:relative;justify-content:start;align-items:center;padding:0px}.form-field-container.svelte-ld5htn{display:flex;justify-content:flex-end;align-items:right;z-index:2}",
  map: null
};
async function fetchLesson(owner, operator2) {
  try {
    const response = await fetch(`./lesson?lesson=${operator2}&owner=${owner}`);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data2 = await response.json();
    return data2;
  } catch (error) {
    console.error(error);
    return [];
  }
}
const Module = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $langs, $$unsubscribe_langs;
  let $llang, $$unsubscribe_llang;
  let $dc, $$unsubscribe_dc;
  let $$unsubscribe_users;
  let $signal, $$unsubscribe_signal;
  let $msg, $$unsubscribe_msg;
  let $OnCheckQU, $$unsubscribe_OnCheckQU;
  let $$unsubscribe_showBottomAppBar;
  let $lesson, $$unsubscribe_lesson;
  let $call_but_status, $$unsubscribe_call_but_status;
  $$unsubscribe_langs = subscribe(langs, (value) => $langs = value);
  $$unsubscribe_llang = subscribe(llang, (value) => $llang = value);
  $$unsubscribe_dc = subscribe(dc, (value) => $dc = value);
  $$unsubscribe_users = subscribe(users, (value) => value);
  $$unsubscribe_signal = subscribe(signal, (value) => $signal = value);
  $$unsubscribe_msg = subscribe(msg, (value) => $msg = value);
  $$unsubscribe_OnCheckQU = subscribe(OnCheckQU, (value) => $OnCheckQU = value);
  $$unsubscribe_showBottomAppBar = subscribe(showBottomAppBar, (value) => value);
  $$unsubscribe_lesson = subscribe(lesson, (value) => $lesson = value);
  $$unsubscribe_call_but_status = subscribe(call_but_status, (value) => $call_but_status = value);
  moment.locale("nl-be");
  const { find, findIndex, remove } = pkg;
  let lesson_data;
  let { group } = $$props;
  const operator = getContext("operator");
  function findPic(operator2) {
    const oper = find(group, { operator: operator2 });
    return oper.picture || "/assets/operator.svg";
  }
  let usersPic = group.map((item) => ({
    operator: item.operator,
    src: findPic(item.operator),
    name: item.name,
    status: item.status
  }));
  let disabled = [true, true, true, true, true, true, true, true, true, true, true, true, true];
  let { data } = $$props;
  let module;
  let checked = { dialog: {}, word: {} };
  let quiz_users = { dialog: {}, word: {} };
  set_store_value(
    OnCheckQU,
    $OnCheckQU = function(node, type_, name_) {
      const name = name_ || node.currentTarget.attributes["name"].value;
      const type = type_ || node.currentTarget.attributes["type"].value;
      let par = {};
      par.proj = "kolmit";
      par.func = "quiz_users";
      par.abonent = operator.abonent;
      par.quiz = name;
      par.type = type;
      if (checked[type][name] === false || checked[type][name] === null) {
        par.add = operator.operator;
      } else {
        par.rem = operator.operator;
      }
      $signal.SendMessage(par, (data2) => {
        console.log(data2.resp);
      });
    },
    $OnCheckQU
  );
  let RemoveQuizUser = function(user, type, quiz) {
    try {
      let obj = find(quiz_users[type][quiz], { operator: user });
      obj.type = $msg.type;
      remove(quiz_users[type][quiz], obj);
      quiz_users = quiz_users;
      set_store_value(msg, $msg.rem = "", $msg);
    } catch (ex) {
    }
  };
  function BuildQuizUsers(quiz, user, type) {
    let obj = find(usersPic, { operator: user });
    if (obj)
      obj.type = type;
    if (obj && !find(quiz_users[type][quiz], obj)) {
      quiz_users[type][quiz].push(obj);
      quiz_users[type][quiz] = quiz_users[type][quiz];
      quiz_users = quiz_users;
    }
  }
  function SendDataDC(data2, cb) {
    if ($dc?.dc.readyState === "open") {
      $dc.SendData(data2, (res) => {
        if (cb)
          cb(res);
      });
    }
  }
  onDestroy(() => {
    data = "";
    lesson_data = "";
    module = "";
    quiz_users = "";
  });
  async function OnThemeNameInput(theme) {
    theme.name = await Translate(theme.name[$llang], $llang, $langs);
    module = module;
  }
  if ($$props.group === void 0 && $$bindings.group && group !== void 0)
    $$bindings.group(group);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.fetchLesson === void 0 && $$bindings.fetchLesson && fetchLesson !== void 0)
    $$bindings.fetchLesson(fetchLesson);
  $$result.css.add(css$3);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      if ($lesson.data) {
        if ($lesson.data.quiz == "" && data.quiz) {
          SendDataDC({
            msg: "Собеседник вышел из упражнения"
          });
          data = $lesson.data;
        }
        data = $lesson.data;
      }
    }
    {
      if (Array.isArray($msg)) {
        try {
          $msg.map((el) => {
            if (el.add) {
              BuildQuizUsers(el.quiz, el.add, el.type);
              set_store_value(msg, $msg = "", $msg);
            } else if (el.rem) {
              RemoveQuizUser(el.rem, el.type, el.quiz);
            }
          });
        } catch (ex) {
        }
      }
    }
    $$rendered = `<main class="svelte-ld5htn">${data.quiz ? ` ${validate_component(Quiz, "Quiz").$$render($$result, { data }, {}, {})}` : `${module ? `<div class="lesson-container svelte-ld5htn"><div class="module_level svelte-ld5htn"><div class="mdc-typography--caption">${escape(lesson_data.level)}</div></div> ${each(module.themes, (theme, t) => {
      return `<br> <div class="accordion-container">${validate_component(Accordion, "Accordion").$$render($$result, { multiple: true }, {}, {
        default: () => {
          return `${validate_component(Panel, "Panel").$$render(
            $$result,
            {
              class: "panel",
              disabled: disabled[parseInt(t)]
            },
            {},
            {
              default: () => {
                return `${function(__value) {
                  if (is_promise(__value)) {
                    __value.then(null, noop);
                    return ``;
                  }
                  return function(data2) {
                    return ` ${validate_component(Header$1, "Header").$$render(
                      $$result,
                      {
                        ":use": theme.name[$llang] ? theme.name[$llang] : (() => {
                          OnThemeNameInput(theme);
                        })()
                      },
                      {},
                      {
                        default: () => {
                          return `<div class="mdc-typography--subtitle2">${escape(theme.name[$llang])}<br><small>(${escape(data2)})</small> </div>`;
                        }
                      }
                    )}`;
                  }(__value);
                }(Translate(theme.name[$llang], $llang, $langs))} ${validate_component(Content, "Content").$$render($$result, {}, {}, {
                  default: () => {
                    return `${theme.lessons ? ` ${each(theme.lessons, (lesson2) => {
                      return ` ${lesson2.quizes ? `${each(lesson2.quizes, (quiz) => {
                        return ` ${quiz.name[$llang] && quiz.published ? `<div class="quiz-container mdc-typography--caption svelte-ld5htn"${add_attribute("type", quiz.type, 0)}${add_attribute("name", quiz.name[$llang], 0)}>${quiz.type === "dialog" ? `${validate_component(CommonIcon, "Icon").$$render(
                          $$result,
                          {
                            tag: "svg",
                            viewBox: "0 0 24 24",
                            width: "30px",
                            height: "30px"
                          },
                          {},
                          {
                            default: () => {
                              return `<path fill="grey"${add_attribute("d", mdiAccountMultiple, 0)}></path> `;
                            }
                          }
                        )}` : `${quiz.type === "text" ? `${validate_component(CommonIcon, "Icon").$$render(
                          $$result,
                          {
                            tag: "svg",
                            viewBox: "0 0 24 24",
                            width: "30px",
                            height: "30px"
                          },
                          {},
                          {
                            default: () => {
                              return `<path fill="grey"${add_attribute("d", mdiTextBoxOutline, 0)}></path> `;
                            }
                          }
                        )}` : `${quiz.type === "word" ? `${validate_component(CommonIcon, "Icon").$$render(
                          $$result,
                          {
                            tag: "svg",
                            viewBox: "0 0 24 24",
                            width: "30px",
                            height: "30px"
                          },
                          {},
                          {
                            default: () => {
                              return `<path fill="grey"${add_attribute("d", mdiFileWordBoxOutline, 0)}></path> `;
                            }
                          }
                        )}` : `${quiz.type === "listen" ? `${validate_component(CommonIcon, "Icon").$$render(
                          $$result,
                          {
                            tag: "svg",
                            viewBox: "0 0 24 24",
                            width: "30px",
                            height: "30px"
                          },
                          {},
                          {
                            default: () => {
                              return `<path fill="grey"${add_attribute("d", mdiEarHearing, 0)}></path> `;
                            }
                          }
                        )}` : ``}`}`}`} <a href="#" style="width:100%"${add_attribute("t", t, 0)}${add_attribute("type", quiz.type, 0)}${add_attribute("name", quiz.name[$llang], 0)}${add_attribute("level", module.level, 0)}${add_attribute("theme", theme.name[$llang], 0)}${add_attribute("title", quiz.title, 0)}${add_attribute("highlight", quiz.highlight || "", 0)}>${escape(quiz.name[$llang])} </a><span></span> ${quiz.type === "dialog" || quiz.type === "word" ? `<span style="position: absolute; right:90vw;color:red; top:-2px;">${escape(Date.now() - new Date(quiz.published).getTime() < 10 * 24 * 60 * 60 * 1e3 ? "new" : "")}</span> <div class="form-field-container svelte-ld5htn">${validate_component(FormField, "FormField").$$render($$result, {}, {}, {
                          default: () => {
                            return `${validate_component(Checkbox, "Checkbox").$$render(
                              $$result,
                              {
                                name: quiz.name[$llang],
                                type: quiz.type,
                                touch: true,
                                checked: checked[quiz.type][quiz.name[$llang]]
                              },
                              {
                                checked: ($$value) => {
                                  checked[quiz.type][quiz.name[$llang]] = $$value;
                                  $$settled = false;
                                }
                              },
                              {}
                            )} `;
                          }
                        })} </div>` : ``}</div> ${$call_but_status !== "inactive" && quiz_users[quiz.type] && quiz_users[quiz.type][quiz.name[$llang]] ? `<div class="user-cards svelte-ld5htn">${each(quiz_users[quiz.type][quiz.name[$llang]], (qu, q) => {
                          return `${qu.operator !== operator.operator && find(group, { operator: qu.operator }) ? `<div${add_attribute("operator", qu.operator, 0)}${add_attribute("t", t, 0)}>${validate_component(Card, "Card").$$render($$result, { style: "width:30px;  margin-right:15px" }, {}, {
                            default: () => {
                              return `${validate_component(Media, "Media").$$render(
                                $$result,
                                {
                                  class: "card-media-square",
                                  aspectRatio: "square"
                                },
                                {},
                                {
                                  default: () => {
                                    return `${validate_component(MediaContent, "MediaContent").$$render($$result, {}, {}, {
                                      default: () => {
                                        return `<img${add_attribute("src", qu.src, 0)} alt="" width="22px" style="position:relative; left:3px"> `;
                                      }
                                    })} `;
                                  }
                                }
                              )}  <h3 class="mdc-typography--subtitle2" style="margin: -7px; color: #888;font-size:x-small;text-align:center;z-index:1">${qu.name ? `${escape(qu.name.slice(0, 8))}` : `${escape(qu.operator.slice(0, 8))}`}</h3> `;
                            }
                          })} </div>` : ``}`;
                        })} </div>` : ``}` : ``}`;
                      })}` : ``}`;
                    })}` : ``} `;
                  }
                })} `;
              }
            }
          )} `;
        }
      })} </div>`;
    })}</div> <div style="height:100px"></div>` : ``}`} </main>`;
  } while (!$$settled);
  $$unsubscribe_langs();
  $$unsubscribe_llang();
  $$unsubscribe_dc();
  $$unsubscribe_users();
  $$unsubscribe_signal();
  $$unsubscribe_msg();
  $$unsubscribe_OnCheckQU();
  $$unsubscribe_showBottomAppBar();
  $$unsubscribe_lesson();
  $$unsubscribe_call_but_status();
  return $$rendered;
});
const css$2 = {
  code: ".chat-container.svelte-8yelu5{display:flex;flex-direction:column-reverse;position:absolute;width:100dvw;height:70vh;background-color:#f4f4f8;border-radius:10px;box-shadow:0 0 10px rgba(0, 0, 0, 0.1)}.userMessage.svelte-8yelu5{margin:5px;padding:5px;border-radius:5px;user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.userMessage.question.svelte-8yelu5{width:88%;background-color:#cce5ff;float:left}.userMessage.answer.svelte-8yelu5{width:88%;background-color:#e0e0e0;float:right}.input-container.svelte-8yelu5{display:flex;position:fixed;flex-direction:row;justify-content:space-between;bottom:60px;padding:0 10px;width:95vw}.speaker-button.svelte-8yelu5{position:relative;top:5px}.original.svelte-8yelu5{font-size:x-small;color:rgb(40, 72, 113)}button.svelte-8yelu5{position:relative;bottom:0px}.textarea-container.svelte-8yelu5{position:relative;display:inline-block;width:96vw;margin-left:2vw;bottom:-3px}.mic-button.svelte-8yelu5{position:absolute;top:50%;right:10px;transform:translateY(-50%);background:transparent;border:none;font-size:20px;cursor:pointer}.hint-button.svelte-8yelu5{color:white;background-color:#2196f3;border-radius:3px;padding:8px 20px}",
  map: null
};
const UD0uA1hat = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $llang, $$unsubscribe_llang;
  let $$unsubscribe_dc;
  let $langs, $$unsubscribe_langs;
  let $msg, $$unsubscribe_msg;
  $$unsubscribe_llang = subscribe(llang, (value) => $llang = value);
  $$unsubscribe_dc = subscribe(dc, (value) => value);
  $$unsubscribe_langs = subscribe(langs, (value) => $langs = value);
  $$unsubscribe_msg = subscribe(msg, (value) => $msg = value);
  set_store_value(llang, $llang = "nl", $llang);
  let userInput = {};
  let messages = [];
  let isListening = false;
  let display_audio = "none";
  let stt;
  let variant = "outlined";
  let showHint;
  function StopListening() {
    isListening = false;
    display_audio = false;
  }
  function SttResult(data) {
    if (data[$llang])
      userInput = data;
    userInput[$llang] = userInput[$llang].slice(0, 500);
    messages.unshift({ text: userInput, isQuestion: "question" });
    messages = messages;
    isListening = false;
  }
  $$result.css.add(css$2);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      if ($msg || $msg) {
        const msg2 = $msg || $msg;
        if (msg2.func === "chat") {
          messages.unshift({ text: msg2.text, isQuestion: "answer" });
          messages = messages;
        }
      }
    }
    $$rendered = `<div class="chat-container svelte-8yelu5" style="overflow-y: auto;">${each(messages, ({ text, isQuestion }, index) => {
      return `<div style="display:inline-flex"><div class="${"userMessage " + escape(isQuestion, true) + " svelte-8yelu5"}"${add_attribute("key", index, 0)}>${escape(text[$llang])} ${text[$langs] && showHint === index ? `${function(__value) {
        if (is_promise(__value)) {
          __value.then(null, noop);
          return ``;
        }
        return function(data) {
          return ` <div class="original svelte-8yelu5">${escape(data)}</div> `;
        }(__value);
      }(Translate(text[$llang], $llang, $langs))}` : `<button class="hint-button svelte-8yelu5" data-svelte-h="svelte-1cd2e1n"><span class="material-symbols-outlined">?</span>  </button>`}</div> <div class="speaker-button svelte-8yelu5">${validate_component(IconButton, "IconButton").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(CommonIcon, "Icon").$$render($$result, { tag: "svg", viewBox: "0 0 24 24" }, {}, {
            default: () => {
              return `<path fill="currentColor"${add_attribute("d", mdiPlay, 0)}></path> `;
            }
          })} `;
        }
      })}</div> </div>`;
    })}</div> <br>  <div class="input-container svelte-8yelu5"><span style="position: absolute; font-weight: bold; top: 8px; left: 26px; font-size: x-small">${escape(dc ? $langs : $llang)}</span> ${validate_component(IconButton, "IconButton").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(CommonIcon, "Icon").$$render($$result, { tag: "svg", viewBox: "0 0 24 24" }, {}, {
          default: () => {
            return `${isListening ? `<path fill="currentColor"${add_attribute("d", mdiMicrophone, 0)}></path>` : `<path fill="currentColor"${add_attribute("d", mdiMicrophoneOutline, 0)}></path>`}`;
          }
        })}`;
      }
    })} ${validate_component(Stt, "Stt").$$render(
      $$result,
      {
        SttResult,
        StopListening,
        this: stt,
        display_audio
      },
      {
        this: ($$value) => {
          stt = $$value;
          $$settled = false;
        },
        display_audio: ($$value) => {
          display_audio = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ``;
      }
      return function(data) {
        return ` ${validate_component(Button, "Button").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(CommonLabel, "Label").$$render($$result, {}, {}, {
              default: () => {
                return `${escape(data)}`;
              }
            })}`;
          }
        })} `;
      }(__value);
    }(Translate("Отправить", "ru", $langs))} ${dc ? `<div class="repeat_but">${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ``;
      }
      return function(data) {
        return ` ${validate_component(Button, "Button").$$render($$result, { variant }, {}, {
          default: () => {
            return `${validate_component(CommonLabel, "Label").$$render($$result, {}, {}, {
              default: () => {
                return `${escape(data)}`;
              }
            })}`;
          }
        })} `;
      }(__value);
    }(Translate("Повторить", "ru", $langs))}</div>` : ``}</div>   `;
  } while (!$$settled);
  $$unsubscribe_llang();
  $$unsubscribe_dc();
  $$unsubscribe_langs();
  $$unsubscribe_msg();
  return $$rendered;
});
const css$1 = {
  code: '@charset "UTF-8";.bottom-app-bar-wrapper.svelte-x7w9an{position:fixed;bottom:0;width:100%;transform:translateY(0);transition:transform 0.7s ease}.hide.svelte-x7w9an{transform:translateY(100px);transition:transform 0.7s ease}.dialog.svelte-x7w9an{position:fixed;background-color:aliceblue;top:50px;width:100vw;height:90vh;right:0vw;margin:0px auto;z-index:2}.remote_msg.svelte-x7w9an{position:relative;font-size:0.7em;white-space:nowrap;color:black;margin:auto;text-align:center;top:-10px;z-index:1}.user_placeholder.svelte-x7w9an{position:relative;bottom:30px;scale:0.8;left:-20px}.speaker-button.svelte-x7w9an{position:absolute;left:83px;bottom:20px;color:black}.video.svelte-x7w9an{position:relative;top:5px;margin:auto;max-height:50px}.videolocal_div.svelte-x7w9an{position:relative;width:45px;bottom:10px}@media screen and (max-width: 400px){.video.svelte-x7w9an{top:0px}}',
  map: null
};
const Operator = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_muted;
  let $lesson, $$unsubscribe_lesson;
  let $view, $$unsubscribe_view;
  let $call_but_status, $$unsubscribe_call_but_status;
  let $click_call_func, $$unsubscribe_click_call_func;
  let $showBottomAppBar, $$unsubscribe_showBottomAppBar;
  let $dc_state, $$unsubscribe_dc_state;
  let $$unsubscribe_users;
  let $posterst, $$unsubscribe_posterst;
  let $$unsubscribe_signal;
  let $$unsubscribe_editable;
  let $msg, $$unsubscribe_msg;
  let $langs, $$unsubscribe_langs;
  $$unsubscribe_muted = subscribe(muted, (value) => value);
  $$unsubscribe_lesson = subscribe(lesson, (value) => $lesson = value);
  $$unsubscribe_view = subscribe(view, (value) => $view = value);
  $$unsubscribe_call_but_status = subscribe(call_but_status, (value) => $call_but_status = value);
  $$unsubscribe_click_call_func = subscribe(click_call_func, (value) => $click_call_func = value);
  $$unsubscribe_showBottomAppBar = subscribe(showBottomAppBar, (value) => $showBottomAppBar = value);
  $$unsubscribe_dc_state = subscribe(dc_state, (value) => $dc_state = value);
  $$unsubscribe_users = subscribe(users, (value) => value);
  $$unsubscribe_posterst = subscribe(posterst, (value) => $posterst = value);
  $$unsubscribe_signal = subscribe(signal, (value) => value);
  $$unsubscribe_editable = subscribe(editable, (value) => value);
  $$unsubscribe_msg = subscribe(msg, (value) => $msg = value);
  $$unsubscribe_langs = subscribe(langs, (value) => $langs = value);
  let group_data = getContext("group_data");
  let group = [];
  let dlg_display = "none";
  function SetDlgDisplay() {
    set_store_value(view, $view = "chat", $view);
  }
  setContext("SetDlgDisplay", SetDlgDisplay);
  set_store_value(posterst, $posterst = "assets/operator.svg", $posterst);
  let rtc;
  let bottomAppBar;
  let video_button_display = false;
  let isRemoteAudioMute = false;
  let rtcSupportText = "";
  set_store_value(call_but_status, $call_but_status = "inactive", $call_but_status);
  let operator = getContext("operator");
  operator.type = "operator";
  const abonent = operator.abonent;
  operator.name;
  operator.operator;
  let container;
  let isHidden = false;
  function handleVisibilityChange() {
    isHidden = document.hidden;
    if (isHidden) {
      console.log("Страница ушла в фоновый режим");
      location.reload();
    } else {
      console.log("Страница активна");
    }
  }
  let local = {
    video: {
      display: "none",
      srcObject: "",
      poster: ""
    },
    audio: { paused: true, src: "" }
  };
  let remote = {
    text: {
      display: "none",
      msg: "",
      name: "",
      email: ""
    },
    video: {
      display: "none",
      srcObject: "",
      poster: "/assets/operator.svg"
    }
  };
  if (operator.operator === abonent) {
    operator.role = "admin";
  } else {
    operator.role = "user";
  }
  function OnMessage(data, resolve) {
    if (data.func === "close") {
      set_store_value(call_but_status, $call_but_status = "inactive", $call_but_status);
      remote.video.display = "none";
      local.audio.paused = true;
    }
    if (data.call || data.func === "call") {
      set_store_value(showBottomAppBar, $showBottomAppBar = true, $showBottomAppBar);
      set_store_value(call_but_status, $call_but_status = "call", $call_but_status);
      remote.text.display = "block";
      video_button_display = false;
      local.audio.paused = false;
      if (data.profile) {
        if (data.profile.img)
          remote.video.display = "block";
        remote.text.name = data.profile.name;
        remote.text.email = data.profile.email;
      }
      if ($click_call_func)
        rtc.OnCall();
    }
    if (data.func === "talk") {
      set_store_value(call_but_status, $call_but_status = "talk", $call_but_status);
      local.audio.paused = true;
      video_button_display = true;
      remote.text.display = "none";
    }
    if (data.camera) {
      local.video.src = that.localStream;
    }
    if (data.lesson) {
      set_store_value(view, $view = "lesson", $view);
      set_store_value(lesson, $lesson.data = data.lesson, $lesson);
    }
  }
  onDestroy(() => {
    group = "";
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  });
  $$result.css.add(css$1);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      if ($msg) {
        OnMessage($msg);
      }
    }
    {
      if ($view === "chat")
        dlg_display = "block";
      else
        dlg_display = "none";
    }
    {
      if ($click_call_func) {
        console.log();
      }
    }
    {
      switch ($dc_state) {
        case "open":
          set_store_value(call_but_status, $call_but_status = "call", $call_but_status);
          local.audio.paused = false;
          break;
      }
    }
    {
      if ($call_but_status) {
        console.log($call_but_status);
      }
    }
    $$rendered = `  ${validate_component(Group, "Group").$$render(
      $$result,
      { rtc, group },
      {
        group: ($$value) => {
          group = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${$view === "lesson" ? `${validate_component(Module, "Module").$$render(
      $$result,
      { data: group_data, group },
      {
        group: ($$value) => {
          group = $$value;
          $$settled = false;
        }
      },
      {}
    )}` : ``} <div class="dialog svelte-x7w9an" style="${"display: " + escape(dlg_display, true) + ";"}">${validate_component(UD0uA1hat, "Chat").$$render($$result, {}, {}, {})}</div> <div class="${["bottom-app-bar-wrapper svelte-x7w9an", !$showBottomAppBar ? "hide" : ""].join(" ").trim()}">${validate_component(BottomAppBar, "BottomAppBar").$$render(
      $$result,
      {
        variant: "static",
        slot: "oper",
        this: bottomAppBar
      },
      {
        this: ($$value) => {
          bottomAppBar = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(Section, "Section").$$render($$result, {}, {}, {
            default: () => {
              return `<div class="remote_div"><div class="user_placeholder svelte-x7w9an"></div> ${validate_component(Video_remote, "VideoRemote").$$render(
                $$result,
                Object.assign({}, remote.video, { name: remote.text.name }, { operator: operator.operator }, { isRemoteAudioMute }),
                {
                  isRemoteAudioMute: ($$value) => {
                    isRemoteAudioMute = $$value;
                    $$settled = false;
                  }
                },
                {}
              )} ${$call_but_status === "talk" ? `<div class="speaker-button svelte-x7w9an">${validate_component(IconButton, "IconButton").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(CommonIcon, "Icon").$$render($$result, { tag: "svg", viewBox: "0 0 24 24" }, {}, {
                    default: () => {
                      return `${!isRemoteAudioMute ? `<path fill="currentColor"${add_attribute("d", mdiVolumeHigh, 0)}></path>` : `<path fill="currentColor"${add_attribute("d", mdiVolumeOff, 0)}></path>`}`;
                    }
                  })}`;
                }
              })}</div>` : ``}</div>`;
            }
          })} ${validate_component(Section, "Section").$$render($$result, {}, {}, {
            default: () => {
              return `${remote.text.display && remote.text.name ? `<div class="remote_text_display" style="${"display:" + escape(remote.text.display, true) + ";"}">${function(__value) {
                if (is_promise(__value)) {
                  __value.then(null, noop);
                  return ``;
                }
                return function(data) {
                  return ` <p class="remote_msg svelte-x7w9an">${escape(data)} ${escape(remote.text.name)}</p> `;
                }(__value);
              }(Translate$1("Тебя вызывает - ", "ru", $langs))}</div>` : ``}`;
            }
          })} ${validate_component(Section, "Section").$$render($$result, {}, {}, {})} ${validate_component(Section, "Section").$$render($$result, { align: "end" }, {}, {
            default: () => {
              return `${validate_component(CallButtonOperator, "CallButton").$$render($$result, {}, {}, {
                default: () => {
                  return `<b class="call_cnt" style="display:none;position: relative;left:22px;top:10px;color:#0e0cff;font-size: 12px;" data-svelte-h="svelte-1iw71ga">100</b> <span class="badge badge-primary badge-pill call-queue" style="display:none;position: relative;right:0px;bottom:0px;color:#0e0cff;font-size: 12px;opacity:1" data-svelte-h="svelte-ecfdsv">0</span>`;
                }
              })} <div class="video svelte-x7w9an">${video_button_display ? `${validate_component(CommonIcon, "Icon").$$render($$result, { tag: "svg", viewBox: "0 0 24 24" }, {}, {
                default: () => {
                  return `<path fill="currentColor" style="color:grey"${add_attribute("d", mdiAccountBox, 0)}></path>`;
                }
              })} ` : ``} ${``}</div> <div class="videolocal_div svelte-x7w9an">${validate_component(Video_local, "VideoLocal").$$render($$result, Object.assign({}, local.video), {}, {
                footer: () => {
                  return `<div${add_attribute("this", container, 0)}></div>`;
                }
              })}</div>`;
            }
          })}`;
        }
      }
    )} ${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ``;
      }
      return function(data) {
        return ` <span style="position:fixed;bottom:0;font-size:smaller;color:red">${escape(data)}</span> `;
      }(__value);
    }(Translate$1(rtcSupportText, "ru", $langs))}  ${validate_component(Audio_local, "AudioLocal").$$render(
      $$result,
      Object.assign({}, local.audio, { paused: local.audio.paused }),
      {
        paused: ($$value) => {
          local.audio.paused = $$value;
          $$settled = false;
        }
      },
      {}
    )}  </div>`;
  } while (!$$settled);
  $$unsubscribe_muted();
  $$unsubscribe_lesson();
  $$unsubscribe_view();
  $$unsubscribe_call_but_status();
  $$unsubscribe_click_call_func();
  $$unsubscribe_showBottomAppBar();
  $$unsubscribe_dc_state();
  $$unsubscribe_users();
  $$unsubscribe_posterst();
  $$unsubscribe_signal();
  $$unsubscribe_editable();
  $$unsubscribe_msg();
  $$unsubscribe_langs();
  return $$rendered;
});
const css = {
  code: "@media screen and (min-width: 768px){input.svelte-1wt0mbk{padding:8px;font-size:14px}}@media screen and (max-width: 767px){input.svelte-1wt0mbk{padding:8px;font-size:14px}}form.svelte-1wt0mbk{display:flex;flex-direction:column;align-items:center;max-width:400px;margin:0 auto;padding:20px;border:1px solid #ccc;border-radius:5px;background-color:#fff}img.svelte-1wt0mbk{display:block;margin-left:auto;margin-right:auto}input[type='file'].svelte-1wt0mbk{display:none}#oper_pic.svelte-1wt0mbk{max-width:100px;max-height:100px;border-radius:50%;cursor:pointer}",
  map: null
};
let lang = "en";
const Login = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $dicts, $$unsubscribe_dicts;
  $$unsubscribe_dicts = subscribe(dicts, (value) => $dicts = value);
  let formData = {
    name: "",
    //'WH',//
    email: "",
    //,'white@house.usa'
    psw: "",
    //'test',
    confirmPassword: "",
    //'test',
    picture: "",
    lang: "ru"
    //'en'
  };
  if (!formData.picture) {
    formData.picture = "/assets/operator.svg";
  }
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      {
        formData.lang = lang;
      }
    }
    $$rendered = `<form class="svelte-1wt0mbk"><div class="columns margins"><input name="lang"${add_attribute("value", formData.lang, 0)} hidden class="svelte-1wt0mbk"> <div>${validate_component(Textfield, "Textfield").$$render(
      $$result,
      {
        name: "email",
        label: $dicts["Email"][lang] + ":",
        required: true,
        value: formData.email
      },
      {
        value: ($$value) => {
          formData.email = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div> <div>${validate_component(Textfield, "Textfield").$$render(
      $$result,
      {
        type: "text",
        name: "name",
        label: $dicts["Имя"][lang] + ":",
        required: true,
        value: formData.name
      },
      {
        value: ($$value) => {
          formData.name = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div> <div>${validate_component(Textfield, "Textfield").$$render(
      $$result,
      {
        type: "password",
        name: "psw",
        label: $dicts["Пароль"][lang] + ":",
        required: true,
        value: formData.psw
      },
      {
        value: ($$value) => {
          formData.psw = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div> <div>${validate_component(Textfield, "Textfield").$$render(
      $$result,
      {
        type: "password",
        name: "confirmPassword",
        label: $dicts["Повторить пароль"][lang] + ":",
        required: true,
        value: formData.confirmPassword
      },
      {
        value: ($$value) => {
          formData.confirmPassword = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div> <div style="padding-top: 20px"><input type="file" id="pic" accept="image/png, image/jpeg" class="svelte-1wt0mbk"> <img type="image" id="oper_pic"${add_attribute("src", formData.picture, 0)} class="svelte-1wt0mbk"></div> <div>${validate_component(Button, "Button").$$render($$result, { class: "upload-button" }, {}, {
      default: () => {
        return `${escape($dicts["Зарегистрироваться"][lang])}`;
      }
    })}</div></div></form>  ${``}`;
  } while (!$$settled);
  $$unsubscribe_dicts();
  return $$rendered;
});
class SignalingChannel {
  constructor(operator) {
    this.msg = msg;
    this.operator = operator;
    this.isOpen = false;
    this.socketUrl = //'wss://kolmit-server.onrender.com';
    window.location.hostname === "localhost" ? "ws://localhost:3000" : "wss://kolmit-server.onrender.com";
    this.socket = null;
    this.messageQueue = [];
    this.initializeWebSocket();
  }
  initializeWebSocket() {
    this.socket = new WebSocket(this.socketUrl);
    this.isOpen = true;
    this.socket.onopen = () => {
      console.log("WebSocket соединение установлено");
      this.processQueue();
    };
    this.socket.onmessage = (event) => {
      console.log("Получено сообщение:", event.data);
      const data = JSON.parse(event.data);
      if (this.callback)
        this.callback(data);
      setTimeout(() => {
        this.msg.set(data);
      }, 10);
    };
    this.socket.onclose = () => {
      console.log("WebSocket соединение закрыто");
      if (this.isOpen)
        setTimeout(() => this.initializeWebSocket(), 1e3);
    };
    this.socket.onerror = (error) => {
      console.error("WebSocket ошибка:", error);
    };
  }
  SendMessage(par, cb) {
    this.callback = cb;
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ par }));
    } else {
      console.log(
        "Соединение с WebSocket не установлено, добавление сообщения в очередь"
      );
      this.messageQueue.push(par);
      if (!this.socket || this.socket.readyState >= WebSocket.CLOSING) {
        this.initializeWebSocket();
      }
    }
    if (par.status === "close") {
      this.closeConnection();
    } else if (par.status === "open" && !this.isOpen) {
      this.initializeWebSocket();
    }
  }
  closeConnection() {
    this.isOpen = false;
    if (this.socket && this.socket.readyState !== 0) {
      this.socket.close();
    }
  }
  processQueue() {
    while (this.messageQueue.length > 0 && this.socket && this.socket.readyState === WebSocket.OPEN) {
      const par = this.messageQueue.shift();
      this.socket.send(JSON.stringify({ par }));
    }
  }
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $view, $$unsubscribe_view;
  let $ice_conf, $$unsubscribe_ice_conf;
  let $langs, $$unsubscribe_langs;
  let $signal, $$unsubscribe_signal;
  let $dicts, $$unsubscribe_dicts;
  $$unsubscribe_view = subscribe(view, (value) => $view = value);
  $$unsubscribe_ice_conf = subscribe(ice_conf, (value) => $ice_conf = value);
  $$unsubscribe_langs = subscribe(langs, (value) => $langs = value);
  $$unsubscribe_signal = subscribe(signal, (value) => $signal = value);
  $$unsubscribe_dicts = subscribe(dicts, (value) => $dicts = value);
  let { data } = $$props;
  let operator, abonent, name, user_pic;
  set_store_value(dicts, $dicts = data.dict[0], $dicts);
  function Init() {
    setContext("group_data", data.group);
    setContext("operator", data.operator[0]);
    setContext("abonent", data.abonent);
    operator = data.operator[0].operator, abonent = data.operator[0].abonent, name = data.operator[0].name, user_pic = data.operator ? data.operator[0].picture : "";
    set_store_value(signal, $signal = new SignalingChannel(operator), $signal);
    set_store_value(
      langs,
      $langs = data.cookies ? JSON.parse(data.cookies).lang : data.operator[0].lang,
      $langs
    );
    set_store_value(ice_conf, $ice_conf = data.ice_conf, $ice_conf);
  }
  if (data.operator) {
    Init();
  }
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$unsubscribe_view();
  $$unsubscribe_ice_conf();
  $$unsubscribe_langs();
  $$unsubscribe_signal();
  $$unsubscribe_dicts();
  return `${validate_component(Header, "Header").$$render($$result, {}, {}, {})} ${operator && data?.group?.length > 0 ? `${validate_component(Operator, "Operator").$$render($$result, { operator, abonent, name }, {}, {})}` : `${$view === "login" ? `${validate_component(Login, "Login").$$render($$result, { operator, abonent, user_pic }, {}, {})}` : ``}`}`;
});
export {
  Page as default
};
