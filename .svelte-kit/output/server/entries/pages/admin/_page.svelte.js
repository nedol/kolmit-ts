import { c as compute_rest_props, s as subscribe, i as is_promise, n as noop, b as null_to_empty, a as set_store_value } from "../../../chunks/utils.js";
import { c as create_ssr_component, a as get_current_component, g as getContext, s as setContext, o as onDestroy, v as validate_component, m as missing_component, b as spread, d as escape_attribute_value, f as escape_object, h as add_attribute, e as escape, i as each } from "../../../chunks/ssr.js";
import { j as dispatch, a as TopAppBar, R as Row, S as Section, b as Title, d as CommonLabel, A as Accordion, h as Panel, H as Header$1, g as Content, C as Card, I as Item$1, k as Image, c as Supporting, T as Translate, P as Paper, l as Text, e as IconButton, f as CommonIcon, i as Checkbox } from "../../../chunks/SelectionGroupIcon.js";
import { l as langs, d as dicts, v as view, a as lesson, i as llang, j as dc_state, c as call_but_status, n as nlang } from "../../../chunks/stores.js";
import ISO6391 from "iso-google-locales";
import translate from "translate";
import "../../../chunks/client.js";
import { f as forwardEventsBuilder, c as classMap, S as SmuiElement, R as Ripple, g as globals, T as Textfield, B as Button, e as exclude, p as prefixFilter } from "../../../chunks/Textfield.js";
import { D as Dict } from "../../../chunks/dict2.js";
import pkg from "lodash";
import "sortablejs";
import { mdiChevronDownCircleOutline, mdiAccountMultiple, mdiTextBoxOutline, mdiFileWordBoxOutline, mdiEarHearing } from "@mdi/js";
import { MDCFadingTabIndicatorFoundation, MDCSlidingTabIndicatorFoundation } from "@material/tab-indicator";
const List = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, [
    "use",
    "class",
    "nonInteractive",
    "dense",
    "textualList",
    "avatarList",
    "iconList",
    "imageList",
    "thumbnailList",
    "videoList",
    "twoLine",
    "threeLine",
    "vertical",
    "wrapFocus",
    "singleSelection",
    "disabledItemsFocusable",
    "selectedIndex",
    "radioList",
    "checkList",
    "hasTypeahead",
    "component",
    "tag",
    "layout",
    "setEnabled",
    "getTypeaheadInProgress",
    "getSelectedIndex",
    "getFocusedItemIndex",
    "focusItemAtIndex",
    "getElement"
  ]);
  var _a;
  const forwardEvents = forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { nonInteractive = false } = $$props;
  let { dense = false } = $$props;
  let { textualList = false } = $$props;
  let { avatarList = false } = $$props;
  let { iconList = false } = $$props;
  let { imageList = false } = $$props;
  let { thumbnailList = false } = $$props;
  let { videoList = false } = $$props;
  let { twoLine = false } = $$props;
  let { threeLine = false } = $$props;
  let { vertical = true } = $$props;
  let { wrapFocus = (_a = getContext("SMUI:list:wrapFocus")) !== null && _a !== void 0 ? _a : false } = $$props;
  let { singleSelection = false } = $$props;
  let { disabledItemsFocusable = false } = $$props;
  let { selectedIndex = -1 } = $$props;
  let { radioList = false } = $$props;
  let { checkList = false } = $$props;
  let { hasTypeahead = false } = $$props;
  let element;
  let instance;
  let role = getContext("SMUI:list:role");
  let nav = getContext("SMUI:list:nav");
  const itemAccessorMap = /* @__PURE__ */ new WeakMap();
  let selectionDialog = getContext("SMUI:dialog:selection");
  let addLayoutListener = getContext("SMUI:addLayoutListener");
  let removeLayoutListener;
  let { component = SmuiElement } = $$props;
  let { tag = component === SmuiElement ? nav ? "nav" : "ul" : void 0 } = $$props;
  setContext("SMUI:list:nonInteractive", nonInteractive);
  setContext("SMUI:separator:context", "list");
  if (!role) {
    if (singleSelection) {
      role = "listbox";
      setContext("SMUI:list:item:role", "option");
    } else if (radioList) {
      role = "radiogroup";
      setContext("SMUI:list:item:role", "radio");
    } else if (checkList) {
      role = "group";
      setContext("SMUI:list:item:role", "checkbox");
    } else {
      role = "list";
      setContext("SMUI:list:item:role", void 0);
    }
  }
  if (addLayoutListener) {
    removeLayoutListener = addLayoutListener(layout);
  }
  onDestroy(() => {
    if (removeLayoutListener) {
      removeLayoutListener();
    }
  });
  function getOrderedList() {
    if (element == null) {
      return [];
    }
    return [...getElement().children].map((element2) => itemAccessorMap.get(element2)).filter((accessor) => accessor && accessor._smui_list_item_accessor);
  }
  function layout() {
    return instance.layout();
  }
  function setEnabled(itemIndex, isEnabled) {
    return instance.setEnabled(itemIndex, isEnabled);
  }
  function getTypeaheadInProgress() {
    return instance.isTypeaheadInProgress();
  }
  function getSelectedIndex() {
    return instance.getSelectedIndex();
  }
  function getFocusedItemIndex() {
    return instance.getFocusedItemIndex();
  }
  function focusItemAtIndex(index) {
    const accessor = getOrderedList()[index];
    accessor && "focus" in accessor.element && accessor.element.focus();
  }
  function getElement() {
    return element.getElement();
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.nonInteractive === void 0 && $$bindings.nonInteractive && nonInteractive !== void 0)
    $$bindings.nonInteractive(nonInteractive);
  if ($$props.dense === void 0 && $$bindings.dense && dense !== void 0)
    $$bindings.dense(dense);
  if ($$props.textualList === void 0 && $$bindings.textualList && textualList !== void 0)
    $$bindings.textualList(textualList);
  if ($$props.avatarList === void 0 && $$bindings.avatarList && avatarList !== void 0)
    $$bindings.avatarList(avatarList);
  if ($$props.iconList === void 0 && $$bindings.iconList && iconList !== void 0)
    $$bindings.iconList(iconList);
  if ($$props.imageList === void 0 && $$bindings.imageList && imageList !== void 0)
    $$bindings.imageList(imageList);
  if ($$props.thumbnailList === void 0 && $$bindings.thumbnailList && thumbnailList !== void 0)
    $$bindings.thumbnailList(thumbnailList);
  if ($$props.videoList === void 0 && $$bindings.videoList && videoList !== void 0)
    $$bindings.videoList(videoList);
  if ($$props.twoLine === void 0 && $$bindings.twoLine && twoLine !== void 0)
    $$bindings.twoLine(twoLine);
  if ($$props.threeLine === void 0 && $$bindings.threeLine && threeLine !== void 0)
    $$bindings.threeLine(threeLine);
  if ($$props.vertical === void 0 && $$bindings.vertical && vertical !== void 0)
    $$bindings.vertical(vertical);
  if ($$props.wrapFocus === void 0 && $$bindings.wrapFocus && wrapFocus !== void 0)
    $$bindings.wrapFocus(wrapFocus);
  if ($$props.singleSelection === void 0 && $$bindings.singleSelection && singleSelection !== void 0)
    $$bindings.singleSelection(singleSelection);
  if ($$props.disabledItemsFocusable === void 0 && $$bindings.disabledItemsFocusable && disabledItemsFocusable !== void 0)
    $$bindings.disabledItemsFocusable(disabledItemsFocusable);
  if ($$props.selectedIndex === void 0 && $$bindings.selectedIndex && selectedIndex !== void 0)
    $$bindings.selectedIndex(selectedIndex);
  if ($$props.radioList === void 0 && $$bindings.radioList && radioList !== void 0)
    $$bindings.radioList(radioList);
  if ($$props.checkList === void 0 && $$bindings.checkList && checkList !== void 0)
    $$bindings.checkList(checkList);
  if ($$props.hasTypeahead === void 0 && $$bindings.hasTypeahead && hasTypeahead !== void 0)
    $$bindings.hasTypeahead(hasTypeahead);
  if ($$props.component === void 0 && $$bindings.component && component !== void 0)
    $$bindings.component(component);
  if ($$props.tag === void 0 && $$bindings.tag && tag !== void 0)
    $$bindings.tag(tag);
  if ($$props.layout === void 0 && $$bindings.layout && layout !== void 0)
    $$bindings.layout(layout);
  if ($$props.setEnabled === void 0 && $$bindings.setEnabled && setEnabled !== void 0)
    $$bindings.setEnabled(setEnabled);
  if ($$props.getTypeaheadInProgress === void 0 && $$bindings.getTypeaheadInProgress && getTypeaheadInProgress !== void 0)
    $$bindings.getTypeaheadInProgress(getTypeaheadInProgress);
  if ($$props.getSelectedIndex === void 0 && $$bindings.getSelectedIndex && getSelectedIndex !== void 0)
    $$bindings.getSelectedIndex(getSelectedIndex);
  if ($$props.getFocusedItemIndex === void 0 && $$bindings.getFocusedItemIndex && getFocusedItemIndex !== void 0)
    $$bindings.getFocusedItemIndex(getFocusedItemIndex);
  if ($$props.focusItemAtIndex === void 0 && $$bindings.focusItemAtIndex && focusItemAtIndex !== void 0)
    $$bindings.focusItemAtIndex(focusItemAtIndex);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${validate_component(component || missing_component, "svelte:component").$$render(
      $$result,
      Object.assign(
        {},
        { tag },
        { use: [forwardEvents, ...use] },
        {
          class: classMap({
            [className]: true,
            "mdc-deprecated-list": true,
            "mdc-deprecated-list--non-interactive": nonInteractive,
            "mdc-deprecated-list--dense": dense,
            "mdc-deprecated-list--textual-list": textualList,
            "mdc-deprecated-list--avatar-list": avatarList || selectionDialog,
            "mdc-deprecated-list--icon-list": iconList,
            "mdc-deprecated-list--image-list": imageList,
            "mdc-deprecated-list--thumbnail-list": thumbnailList,
            "mdc-deprecated-list--video-list": videoList,
            "mdc-deprecated-list--two-line": twoLine,
            "smui-list--three-line": threeLine && !twoLine
          })
        },
        { role },
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
  return $$rendered;
});
const { Object: Object_1$2 } = globals;
let counter = 0;
const Item = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let tabindex;
  let $$restProps = compute_rest_props($$props, [
    "use",
    "class",
    "style",
    "color",
    "nonInteractive",
    "ripple",
    "wrapper",
    "activated",
    "role",
    "selected",
    "disabled",
    "skipRestoreFocus",
    "tabindex",
    "inputId",
    "href",
    "component",
    "tag",
    "action",
    "getPrimaryText",
    "getElement"
  ]);
  var _a;
  const forwardEvents = forwardEventsBuilder(get_current_component());
  let uninitializedValue = () => {
  };
  function isUninitializedValue(value) {
    return value === uninitializedValue;
  }
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { style = "" } = $$props;
  let { color = void 0 } = $$props;
  let { nonInteractive = (_a = getContext("SMUI:list:nonInteractive")) !== null && _a !== void 0 ? _a : false } = $$props;
  setContext("SMUI:list:nonInteractive", void 0);
  let { ripple = !nonInteractive } = $$props;
  let { wrapper = false } = $$props;
  let { activated = false } = $$props;
  let { role = wrapper ? "presentation" : getContext("SMUI:list:item:role") } = $$props;
  setContext("SMUI:list:item:role", void 0);
  let { selected = false } = $$props;
  let { disabled = false } = $$props;
  let { skipRestoreFocus = false } = $$props;
  let { tabindex: tabindexProp = uninitializedValue } = $$props;
  let { inputId = "SMUI-form-field-list-" + counter++ } = $$props;
  let { href = void 0 } = $$props;
  let element;
  let internalClasses = {};
  let internalStyles = {};
  let internalAttrs = {};
  let input;
  let nav = getContext("SMUI:list:item:nav");
  let { component = SmuiElement } = $$props;
  let { tag = component === SmuiElement ? nav ? href ? "a" : "span" : "li" : void 0 } = $$props;
  setContext("SMUI:generic:input:props", { id: inputId });
  setContext("SMUI:separator:context", void 0);
  onDestroy(() => {
  });
  function addClass(className2) {
    if (!internalClasses[className2]) {
      internalClasses[className2] = true;
    }
  }
  function removeClass(className2) {
    if (!(className2 in internalClasses) || internalClasses[className2]) {
      internalClasses[className2] = false;
    }
  }
  function addStyle(name, value) {
    if (internalStyles[name] != value) {
      if (value === "" || value == null) {
        delete internalStyles[name];
        internalStyles = internalStyles;
      } else {
        internalStyles[name] = value;
      }
    }
  }
  function action(e) {
    if (!disabled) {
      dispatch(getElement(), "SMUI:action", e);
    }
  }
  function getPrimaryText() {
    var _a2, _b, _c;
    const element2 = getElement();
    const primaryText = element2.querySelector(".mdc-deprecated-list-item__primary-text");
    if (primaryText) {
      return (_a2 = primaryText.textContent) !== null && _a2 !== void 0 ? _a2 : "";
    }
    const text = element2.querySelector(".mdc-deprecated-list-item__text");
    if (text) {
      return (_b = text.textContent) !== null && _b !== void 0 ? _b : "";
    }
    return (_c = element2.textContent) !== null && _c !== void 0 ? _c : "";
  }
  function getElement() {
    return element.getElement();
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.style === void 0 && $$bindings.style && style !== void 0)
    $$bindings.style(style);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.nonInteractive === void 0 && $$bindings.nonInteractive && nonInteractive !== void 0)
    $$bindings.nonInteractive(nonInteractive);
  if ($$props.ripple === void 0 && $$bindings.ripple && ripple !== void 0)
    $$bindings.ripple(ripple);
  if ($$props.wrapper === void 0 && $$bindings.wrapper && wrapper !== void 0)
    $$bindings.wrapper(wrapper);
  if ($$props.activated === void 0 && $$bindings.activated && activated !== void 0)
    $$bindings.activated(activated);
  if ($$props.role === void 0 && $$bindings.role && role !== void 0)
    $$bindings.role(role);
  if ($$props.selected === void 0 && $$bindings.selected && selected !== void 0)
    $$bindings.selected(selected);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.skipRestoreFocus === void 0 && $$bindings.skipRestoreFocus && skipRestoreFocus !== void 0)
    $$bindings.skipRestoreFocus(skipRestoreFocus);
  if ($$props.tabindex === void 0 && $$bindings.tabindex && tabindexProp !== void 0)
    $$bindings.tabindex(tabindexProp);
  if ($$props.inputId === void 0 && $$bindings.inputId && inputId !== void 0)
    $$bindings.inputId(inputId);
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  if ($$props.component === void 0 && $$bindings.component && component !== void 0)
    $$bindings.component(component);
  if ($$props.tag === void 0 && $$bindings.tag && tag !== void 0)
    $$bindings.tag(tag);
  if ($$props.action === void 0 && $$bindings.action && action !== void 0)
    $$bindings.action(action);
  if ($$props.getPrimaryText === void 0 && $$bindings.getPrimaryText && getPrimaryText !== void 0)
    $$bindings.getPrimaryText(getPrimaryText);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    tabindex = isUninitializedValue(tabindexProp) ? !nonInteractive && !disabled && (selected || input) ? 0 : -1 : tabindexProp;
    $$rendered = `${validate_component(component || missing_component, "svelte:component").$$render(
      $$result,
      Object_1$2.assign(
        {},
        { tag },
        {
          use: [
            ...nonInteractive ? [] : [
              [
                Ripple,
                {
                  ripple: !input,
                  unbounded: false,
                  color: (activated || selected) && color == null ? "primary" : color,
                  disabled,
                  addClass,
                  removeClass,
                  addStyle
                }
              ]
            ],
            forwardEvents,
            ...use
          ]
        },
        {
          class: classMap({
            [className]: true,
            "mdc-deprecated-list-item": !wrapper,
            "mdc-deprecated-list-item__wrapper": wrapper,
            "mdc-deprecated-list-item--activated": activated,
            "mdc-deprecated-list-item--selected": selected,
            "mdc-deprecated-list-item--disabled": disabled,
            "mdc-menu-item--selected": !nav && role === "menuitem" && selected,
            "smui-menu-item--non-interactive": nonInteractive,
            ...internalClasses
          })
        },
        {
          style: Object.entries(internalStyles).map(([name, value]) => `${name}: ${value};`).concat([style]).join(" ")
        },
        nav && activated ? { "aria-current": "page" } : {},
        !nav || wrapper ? { role } : {},
        !nav && role === "option" ? {
          "aria-selected": selected ? "true" : "false"
        } : {},
        !nav && (role === "radio" || role === "checkbox") ? {
          "aria-checked": "false"
        } : {},
        !nav ? {
          "aria-disabled": disabled ? "true" : "false"
        } : {},
        {
          "data-menu-item-skip-restore-focus": skipRestoreFocus || void 0
        },
        { tabindex },
        { href },
        internalAttrs,
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
          return `${ripple ? `<span class="mdc-deprecated-list-item__ripple"></span>` : ``}${slots.default ? slots.default({}) : ``}`;
        }
      }
    )}`;
  } while (!$$settled);
  return $$rendered;
});
const Actions = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["use", "class", "fullBleed", "getElement"]);
  forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { fullBleed = false } = $$props;
  let element;
  setContext("SMUI:button:context", "card:action");
  setContext("SMUI:icon-button:context", "card:action");
  function getElement() {
    return element;
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.fullBleed === void 0 && $$bindings.fullBleed && fullBleed !== void 0)
    $$bindings.fullBleed(fullBleed);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  return `<div${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [className]: true,
          "mdc-card__actions": true,
          "mdc-card__actions--full-bleed": fullBleed
        }))
      },
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", element, 0)}>${slots.default ? slots.default({}) : ``} </div>`;
});
const MenuSurface = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, [
    "use",
    "class",
    "style",
    "static",
    "anchor",
    "fixed",
    "open",
    "managed",
    "fullWidth",
    "quickOpen",
    "anchorElement",
    "anchorCorner",
    "anchorMargin",
    "maxHeight",
    "horizontallyCenteredOnViewport",
    "openBottomBias",
    "neverRestoreFocus",
    "isOpen",
    "setOpen",
    "setAbsolutePosition",
    "setIsHoisted",
    "isFixed",
    "getElement"
  ]);
  forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { style = "" } = $$props;
  let { static: isStatic = false } = $$props;
  let { anchor = true } = $$props;
  let { fixed = false } = $$props;
  let { open = isStatic } = $$props;
  let { managed = false } = $$props;
  let { fullWidth = false } = $$props;
  let { quickOpen = false } = $$props;
  let { anchorElement = void 0 } = $$props;
  let { anchorCorner = void 0 } = $$props;
  let { anchorMargin = { top: 0, right: 0, bottom: 0, left: 0 } } = $$props;
  let { maxHeight = 0 } = $$props;
  let { horizontallyCenteredOnViewport = false } = $$props;
  let { openBottomBias = 0 } = $$props;
  let { neverRestoreFocus = false } = $$props;
  let element;
  let instance;
  let internalClasses = {};
  let internalStyles = {};
  setContext("SMUI:list:role", "menu");
  setContext("SMUI:list:item:role", "menuitem");
  onDestroy(() => {
  });
  function isOpen() {
    return open;
  }
  function setOpen(value) {
    open = value;
  }
  function setAbsolutePosition(x, y) {
    return instance.setAbsolutePosition(x, y);
  }
  function setIsHoisted(isHoisted) {
    return instance.setIsHoisted(isHoisted);
  }
  function isFixed() {
    return instance.isFixed();
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
  if ($$props.static === void 0 && $$bindings.static && isStatic !== void 0)
    $$bindings.static(isStatic);
  if ($$props.anchor === void 0 && $$bindings.anchor && anchor !== void 0)
    $$bindings.anchor(anchor);
  if ($$props.fixed === void 0 && $$bindings.fixed && fixed !== void 0)
    $$bindings.fixed(fixed);
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  if ($$props.managed === void 0 && $$bindings.managed && managed !== void 0)
    $$bindings.managed(managed);
  if ($$props.fullWidth === void 0 && $$bindings.fullWidth && fullWidth !== void 0)
    $$bindings.fullWidth(fullWidth);
  if ($$props.quickOpen === void 0 && $$bindings.quickOpen && quickOpen !== void 0)
    $$bindings.quickOpen(quickOpen);
  if ($$props.anchorElement === void 0 && $$bindings.anchorElement && anchorElement !== void 0)
    $$bindings.anchorElement(anchorElement);
  if ($$props.anchorCorner === void 0 && $$bindings.anchorCorner && anchorCorner !== void 0)
    $$bindings.anchorCorner(anchorCorner);
  if ($$props.anchorMargin === void 0 && $$bindings.anchorMargin && anchorMargin !== void 0)
    $$bindings.anchorMargin(anchorMargin);
  if ($$props.maxHeight === void 0 && $$bindings.maxHeight && maxHeight !== void 0)
    $$bindings.maxHeight(maxHeight);
  if ($$props.horizontallyCenteredOnViewport === void 0 && $$bindings.horizontallyCenteredOnViewport && horizontallyCenteredOnViewport !== void 0)
    $$bindings.horizontallyCenteredOnViewport(horizontallyCenteredOnViewport);
  if ($$props.openBottomBias === void 0 && $$bindings.openBottomBias && openBottomBias !== void 0)
    $$bindings.openBottomBias(openBottomBias);
  if ($$props.neverRestoreFocus === void 0 && $$bindings.neverRestoreFocus && neverRestoreFocus !== void 0)
    $$bindings.neverRestoreFocus(neverRestoreFocus);
  if ($$props.isOpen === void 0 && $$bindings.isOpen && isOpen !== void 0)
    $$bindings.isOpen(isOpen);
  if ($$props.setOpen === void 0 && $$bindings.setOpen && setOpen !== void 0)
    $$bindings.setOpen(setOpen);
  if ($$props.setAbsolutePosition === void 0 && $$bindings.setAbsolutePosition && setAbsolutePosition !== void 0)
    $$bindings.setAbsolutePosition(setAbsolutePosition);
  if ($$props.setIsHoisted === void 0 && $$bindings.setIsHoisted && setIsHoisted !== void 0)
    $$bindings.setIsHoisted(setIsHoisted);
  if ($$props.isFixed === void 0 && $$bindings.isFixed && isFixed !== void 0)
    $$bindings.isFixed(isFixed);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  return ` <div${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [className]: true,
          "mdc-menu-surface": true,
          "mdc-menu-surface--fixed": fixed,
          "mdc-menu-surface--open": isStatic,
          "smui-menu-surface--static": isStatic,
          "mdc-menu-surface--fullwidth": fullWidth,
          ...internalClasses
        }))
      },
      {
        style: escape_attribute_value(Object.entries(internalStyles).map(([name, value]) => `${name}: ${value};`).concat([style]).join(" "))
      },
      { role: "dialog" },
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", element, 0)}>${slots.default ? slots.default({}) : ``} </div>`;
});
const Menu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let usePass;
  let $$restProps = compute_rest_props($$props, [
    "use",
    "class",
    "open",
    "isOpen",
    "setOpen",
    "setDefaultFocusState",
    "getSelectedIndex",
    "getMenuSurface",
    "getElement"
  ]);
  const forwardEvents = forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { open = false } = $$props;
  let element;
  let instance;
  function isOpen() {
    return open;
  }
  function setOpen(value) {
    open = value;
  }
  function setDefaultFocusState(focusState) {
    instance.setDefaultFocusState(focusState);
  }
  function getSelectedIndex() {
    return instance.getSelectedIndex();
  }
  function getMenuSurface() {
    return element;
  }
  function getElement() {
    return element.getElement();
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  if ($$props.isOpen === void 0 && $$bindings.isOpen && isOpen !== void 0)
    $$bindings.isOpen(isOpen);
  if ($$props.setOpen === void 0 && $$bindings.setOpen && setOpen !== void 0)
    $$bindings.setOpen(setOpen);
  if ($$props.setDefaultFocusState === void 0 && $$bindings.setDefaultFocusState && setDefaultFocusState !== void 0)
    $$bindings.setDefaultFocusState(setDefaultFocusState);
  if ($$props.getSelectedIndex === void 0 && $$bindings.getSelectedIndex && getSelectedIndex !== void 0)
    $$bindings.getSelectedIndex(getSelectedIndex);
  if ($$props.getMenuSurface === void 0 && $$bindings.getMenuSurface && getMenuSurface !== void 0)
    $$bindings.getMenuSurface(getMenuSurface);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    usePass = [forwardEvents, ...use];
    $$rendered = `${validate_component(MenuSurface, "MenuSurface").$$render(
      $$result,
      Object.assign(
        {},
        { use: usePass },
        {
          class: classMap({ [className]: true, "mdc-menu": true })
        },
        $$restProps,
        { this: element },
        { open }
      ),
      {
        this: ($$value) => {
          element = $$value;
          $$settled = false;
        },
        open: ($$value) => {
          open = $$value;
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
  return $$rendered;
});
const css$7 = {
  code: "header.svelte-ql5em8{position:absolute;display:flex;justify-content:space-between;top:0;width:100%}.top-app-bar-container.svelte-ql5em8{border:1px solid\n      var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));margin:0 18px 18px 0;background-color:var(--mdc-theme-background, #fff);overflow:auto;display:inline-block}.lang_span.svelte-ql5em8{font-size:smaller;bottom:-15px;position:relative}.lang_list.svelte-ql5em8{position:absolute;top:50px;height:75vh;overflow:auto;justify-content:center;align-items:center;background-color:darkturquoise}",
  map: null
};
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $langs, $$unsubscribe_langs;
  let $dicts, $$unsubscribe_dicts;
  let $view, $$unsubscribe_view;
  let $$unsubscribe_lesson;
  $$unsubscribe_langs = subscribe(langs, (value) => $langs = value);
  $$unsubscribe_dicts = subscribe(dicts, (value) => $dicts = value);
  $$unsubscribe_view = subscribe(view, (value) => $view = value);
  $$unsubscribe_lesson = subscribe(lesson, (value) => value);
  let topAppBar;
  async function Translate2(text, from_lang, to_lang) {
    try {
      translate.from = from_lang;
      return $dicts[text] && $dicts[text][$langs] || await translate(text.trim(), to_lang);
    } catch (error) {
      console.error("Translation error:", error);
      return text;
    }
  }
  $$result.css.add(css$7);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = ` <header class="svelte-ql5em8"><div class="top-app-bar-container flexor svelte-ql5em8">${validate_component(TopAppBar, "TopAppBar").$$render(
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
              return `<div class="sec_items">${$view !== "login" ? `${validate_component(Section, "Section").$$render($$result, {}, {}, {
                default: () => {
                  return `${function(__value) {
                    if (is_promise(__value)) {
                      __value.then(null, noop);
                      return ``;
                    }
                    return function(data) {
                      return ` ${validate_component(Title, "Title").$$render($$result, {}, {}, {
                        default: () => {
                          return `${escape(data)}`;
                        }
                      })} `;
                    }(__value);
                  }(Translate2("GROUP", "en", $langs))} ${function(__value) {
                    if (is_promise(__value)) {
                      __value.then(null, noop);
                      return ``;
                    }
                    return function(data) {
                      return ` ${validate_component(Title, "Title").$$render($$result, {}, {}, {
                        default: () => {
                          return `${escape(data)}`;
                        }
                      })} `;
                    }(__value);
                  }(Translate2("LESSON", "en", $langs))} `;
                }
              })}` : ``}</div> ${validate_component(Section, "Section").$$render($$result, { align: "end" }, {}, {
                default: () => {
                  return `<span class="lang_span svelte-ql5em8">${escape((() => {
                    return ISO6391.getNativeName($langs);
                  })())}</span> ${``}`;
                }
              })}`;
            }
          })}`;
        }
      }
    )} <div class="flexor-content"></div></div></header> `;
  } while (!$$settled);
  $$unsubscribe_langs();
  $$unsubscribe_dicts();
  $$unsubscribe_view();
  $$unsubscribe_lesson();
  return $$rendered;
});
const css$6 = {
  code: "@media screen and (min-width: 768px){}@media screen and (max-width: 767px){}form.svelte-1oy5700{display:flex;flex-direction:column;align-items:center;max-width:400px;margin:0 auto;padding:20px;border:1px solid #ccc;border-radius:5px;background-color:#fff}",
  map: null
};
const Login = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $langs, $$unsubscribe_langs;
  let $dicts, $$unsubscribe_dicts;
  $$unsubscribe_langs = subscribe(langs, (value) => $langs = value);
  $$unsubscribe_dicts = subscribe(dicts, (value) => $dicts = value);
  let { email, abonent } = $$props;
  let formData = {
    func: "",
    name: "",
    email: "",
    psw: "",
    confirmPassword: "",
    picture: "",
    lang: $langs
  };
  if (!formData.picture) {
    formData.picture = "/assets/operator.svg";
  }
  if ($$props.email === void 0 && $$bindings.email && email !== void 0)
    $$bindings.email(email);
  if ($$props.abonent === void 0 && $$bindings.abonent && abonent !== void 0)
    $$bindings.abonent(abonent);
  $$result.css.add(css$6);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = ` <form class="svelte-1oy5700"><div class="columns margins"><div>${validate_component(Textfield, "Textfield").$$render(
      $$result,
      {
        label: $dicts[$langs] + ":",
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
        label: $dicts["Имя"][$langs] + ":",
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
        label: $dicts["Пароль"][$langs] + ":",
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
        label: $dicts["Повторить пароль"][$langs] + ":",
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
    )}</div> <div>${validate_component(Button, "Button").$$render($$result, { class: "upload-button" }, {}, {
      default: () => {
        return `${escape($dicts["Sign In"][$langs])}`;
      }
    })}</div></div></form> ${``}`;
  } while (!$$settled);
  $$unsubscribe_langs();
  $$unsubscribe_dicts();
  return $$rendered;
});
const css$5 = {
  code: ".flexy-dad.svelte-x9i0f{display:flex;flex-wrap:wrap}.flexy-boy.svelte-x9i0f{display:flex;justify-content:center;align-items:center;width:100px;height:100px;margin:0 30px 30px 0}.card-container.svelte-x9i0f{display:inline-flex;align-items:center;min-height:200px;width:70%;overflow-x:auto;background-color:var(--mdc-theme-background, #f8f8f8);border:1px solid\n      var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));padding:20px;margin-right:20px;margin-bottom:20px}.save.svelte-x9i0f{width:100px}.deps_div.svelte-x9i0f{overflow-y:scroll;margin-left:0px;margin-top:20px}.svelte-x9i0f::-webkit-scrollbar{display:none}.add_user.svelte-x9i0f{position:relative}",
  map: null
};
const GroupEditor = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $langs, $$unsubscribe_langs;
  let $dicts, $$unsubscribe_dicts;
  $$unsubscribe_langs = subscribe(langs, (value) => $langs = value);
  $$unsubscribe_dicts = subscribe(dicts, (value) => $dicts = value);
  let { data } = $$props;
  let groups = data.groups;
  data.abonent;
  let card_display = "";
  let name = "", email = "";
  translate.engine = "google";
  let user_lang = "en";
  async function Translate2(text, from_lang, to_lang) {
    try {
      translate.from = from_lang;
      return $dicts[text] && $dicts[text][$langs] || await translate(text.trim(), to_lang);
    } catch (error) {
      console.error("Translation error:", error);
      return text;
    }
  }
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css$5);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `<div style="margin-top:50px" class="svelte-x9i0f">${each(groups, (item) => {
      return `<div class="accordion-container svelte-x9i0f">${validate_component(Accordion, "Accordion").$$render($$result, { multiple: true }, {}, {
        default: () => {
          return `${validate_component(Panel, "Panel").$$render($$result, { class: "panel" }, {}, {
            default: () => {
              return `${validate_component(Header$1, "Header").$$render($$result, {}, {}, {
                default: () => {
                  return `<b class="svelte-x9i0f">${escape(item.name)}</b>`;
                }
              })} ${validate_component(Content, "Content").$$render($$result, {}, {}, {
                default: () => {
                  return `${card_display === item.name ? `<div class="card-container svelte-x9i0f"> ${validate_component(Card, "Card").$$render($$result, { style: "width:100%" }, {}, {
                    default: () => {
                      return `<div style="display:inline-flex" class="svelte-x9i0f"><div style="display:block;" class="svelte-x9i0f">${validate_component(Content, "Content").$$render($$result, {}, {}, {
                        default: () => {
                          return `${function(__value) {
                            if (is_promise(__value)) {
                              __value.then(null, noop);
                              return ``;
                            }
                            return function(data2) {
                              return ` ${validate_component(Textfield, "Textfield").$$render(
                                $$result,
                                {
                                  class: "shaped-filled",
                                  variant: "filled",
                                  label: data2,
                                  value: user_lang
                                },
                                {
                                  value: ($$value) => {
                                    user_lang = $$value;
                                    $$settled = false;
                                  }
                                },
                                {}
                              )} `;
                            }(__value);
                          }(Translate2("Language", "en", $langs))} `;
                        }
                      })} ${validate_component(Content, "Content").$$render($$result, {}, {}, {
                        default: () => {
                          return `${function(__value) {
                            if (is_promise(__value)) {
                              __value.then(null, noop);
                              return ``;
                            }
                            return function(data2) {
                              return ` ${validate_component(Textfield, "Textfield").$$render(
                                $$result,
                                {
                                  class: "shaped-filled",
                                  variant: "filled",
                                  label: data2,
                                  value: name
                                },
                                {
                                  value: ($$value) => {
                                    name = $$value;
                                    $$settled = false;
                                  }
                                },
                                {}
                              )} `;
                            }(__value);
                          }(Translate2("Name", "en", $langs))} `;
                        }
                      })} ${validate_component(Content, "Content").$$render($$result, {}, {}, {
                        default: () => {
                          return `${validate_component(Textfield, "Textfield").$$render(
                            $$result,
                            {
                              class: "shaped-filled",
                              variant: "filled",
                              label: "E-mail",
                              value: email
                            },
                            {
                              value: ($$value) => {
                                email = $$value;
                                $$settled = false;
                              }
                            },
                            {}
                          )} `;
                        }
                      })}</div> ${``}</div> ${validate_component(Actions, "Actions").$$render($$result, {}, {}, {
                        default: () => {
                          return `${validate_component(Button, "Button").$$render($$result, {}, {}, {
                            default: () => {
                              return `${validate_component(CommonLabel, "Label").$$render($$result, {}, {}, {
                                default: () => {
                                  return `${escape(data.dict[0]["Save and Close"][$langs])}`;
                                }
                              })} `;
                            }
                          })} ${validate_component(Button, "Button").$$render($$result, {}, {}, {
                            default: () => {
                              return `${validate_component(CommonLabel, "Label").$$render($$result, {}, {}, {
                                default: () => {
                                  return `${escape(data.dict[0]["Remove"][$langs])}`;
                                }
                              })} `;
                            }
                          })} ${validate_component(Button, "Button").$$render($$result, {}, {}, {
                            default: () => {
                              return `${validate_component(CommonLabel, "Label").$$render($$result, {}, {}, {
                                default: () => {
                                  return `${escape(data.dict[0]["Close"][$langs])}`;
                                }
                              })} `;
                            }
                          })} `;
                        }
                      })} `;
                    }
                  })} </div>` : `${validate_component(Button, "Button").$$render($$result, { variant: "outlined", class: "save" }, {}, {
                    default: () => {
                      return `${function(__value) {
                        if (is_promise(__value)) {
                          __value.then(null, noop);
                          return ``;
                        }
                        return function(data2) {
                          return ` ${validate_component(CommonLabel, "Label").$$render($$result, {}, {}, {
                            default: () => {
                              return `${escape(data2)}`;
                            }
                          })} `;
                        }(__value);
                      }(Translate2("Save", "en", $langs))} `;
                    }
                  })} <div class="deps_div svelte-x9i0f"><div class="flexy-dad svelte-x9i0f">${each(data.operators, (operator, i) => {
                    return `${operator.group === item.name ? `<div class="${"mdc-elevation--z" + escape(i + 1, true) + " flexy-boy svelte-x9i0f"}">${validate_component(Item$1, "Item").$$render($$result, { style: "text-align: center;" }, {}, {
                      default: () => {
                        return `${operator.picture ? ` ${validate_component(Image, "Image").$$render(
                          $$result,
                          {
                            src: operator.picture,
                            style: "max-height:50px; max-width:max-content",
                            alt: "Image " + (i + 1)
                          },
                          {},
                          {}
                        )}` : `${validate_component(Image, "Image").$$render(
                          $$result,
                          {
                            src: "/assets/operator.svg",
                            style: "width:50px",
                            alt: "Image " + (i + 1)
                          },
                          {},
                          {}
                        )}`} ${validate_component(Supporting, "Supporting").$$render($$result, {}, {}, {
                          default: () => {
                            return `${validate_component(CommonLabel, "Label").$$render($$result, {}, {}, {
                              default: () => {
                                return `${escape(operator.name)}`;
                              }
                            })} `;
                          }
                        })} `;
                      }
                    })} </div>` : ``}`;
                  })}</div> <div class="add_user svelte-x9i0f">${validate_component(Button, "Button").$$render($$result, { variant: "outlined" }, {}, {
                    default: () => {
                      return `${function(__value) {
                        if (is_promise(__value)) {
                          __value.then(null, noop);
                          return ``;
                        }
                        return function(data2) {
                          return ` ${validate_component(CommonLabel, "Label").$$render($$result, {}, {}, {
                            default: () => {
                              return `${escape(data2)}`;
                            }
                          })} `;
                        }(__value);
                      }(Translate2("добавить пользователя", "ru", $langs))} `;
                    }
                  })}</div>  </div>`} `;
                }
              })} `;
            }
          })} `;
        }
      })} </div>`;
    })}</div> <div class="add_class svelte-x9i0f">${validate_component(Button, "Button").$$render(
      $$result,
      {
        class: "material-icons",
        variant: "outlined"
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
              return ` ${validate_component(CommonLabel, "Label").$$render($$result, {}, {}, {
                default: () => {
                  return `${escape(data2)}`;
                }
              })} `;
            }(__value);
          }(Translate2("добавить группу", "ru", $langs))}`;
        }
      }
    )} </div>`;
  } while (!$$settled);
  $$unsubscribe_langs();
  $$unsubscribe_dicts();
  return $$rendered;
});
const SortableList = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let list;
  let { class: className } = $$props;
  let { multiDragClass = null } = $$props;
  let { swapClass = null } = $$props;
  let { group = void 0 } = $$props;
  let { sort = true } = $$props;
  let { disabled = false } = $$props;
  let { store = void 0 } = $$props;
  let { handle = void 0 } = $$props;
  let { swapThreshold = 1 } = $$props;
  let { invertSwap = false } = $$props;
  let { invertedSwapThreshold = void 0 } = $$props;
  let { removeCloneOnHide = true } = $$props;
  let { ghostClass = "sortable-ghost" } = $$props;
  let { chosenClass = "sortable-chosen" } = $$props;
  let { dragClass = "sortable-drag" } = $$props;
  let { ignore = "a; img" } = $$props;
  let { filter = void 0 } = $$props;
  let { preventOnFilter = true } = $$props;
  let { animation = 0 } = $$props;
  let { easing = void 0 } = $$props;
  let { dataIdAttr = "data-id" } = $$props;
  let { delay = 0 } = $$props;
  let { delayOnTouchOnly = false } = $$props;
  let { forceFallback = false } = $$props;
  let { fallbackClass = "sortable-fallback" } = $$props;
  let { fallbackOnBody = false } = $$props;
  let { fallbackTolerance = 0 } = $$props;
  let { fallbackOffset = { x: 0, y: 0 } } = $$props;
  let { emptyInsertThreshold = 5 } = $$props;
  let { direction = void 0 } = $$props;
  let { touchStartThreshold = void 0 } = $$props;
  let { setData = void 0 } = $$props;
  let { draggable = null } = $$props;
  let { onChoose = void 0 } = $$props;
  let { onUnchoose = void 0 } = $$props;
  let { onStart = void 0 } = $$props;
  let { onEnd = void 0 } = $$props;
  let { onAdd = void 0 } = $$props;
  let { onUpdate = void 0 } = $$props;
  let { onRemove = void 0 } = $$props;
  let { onFilter = void 0 } = $$props;
  let { onSort = void 0 } = $$props;
  let { onClone = void 0 } = $$props;
  let { onMove = void 0 } = $$props;
  let { onChange = void 0 } = $$props;
  onDestroy(() => {
  });
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.multiDragClass === void 0 && $$bindings.multiDragClass && multiDragClass !== void 0)
    $$bindings.multiDragClass(multiDragClass);
  if ($$props.swapClass === void 0 && $$bindings.swapClass && swapClass !== void 0)
    $$bindings.swapClass(swapClass);
  if ($$props.group === void 0 && $$bindings.group && group !== void 0)
    $$bindings.group(group);
  if ($$props.sort === void 0 && $$bindings.sort && sort !== void 0)
    $$bindings.sort(sort);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.store === void 0 && $$bindings.store && store !== void 0)
    $$bindings.store(store);
  if ($$props.handle === void 0 && $$bindings.handle && handle !== void 0)
    $$bindings.handle(handle);
  if ($$props.swapThreshold === void 0 && $$bindings.swapThreshold && swapThreshold !== void 0)
    $$bindings.swapThreshold(swapThreshold);
  if ($$props.invertSwap === void 0 && $$bindings.invertSwap && invertSwap !== void 0)
    $$bindings.invertSwap(invertSwap);
  if ($$props.invertedSwapThreshold === void 0 && $$bindings.invertedSwapThreshold && invertedSwapThreshold !== void 0)
    $$bindings.invertedSwapThreshold(invertedSwapThreshold);
  if ($$props.removeCloneOnHide === void 0 && $$bindings.removeCloneOnHide && removeCloneOnHide !== void 0)
    $$bindings.removeCloneOnHide(removeCloneOnHide);
  if ($$props.ghostClass === void 0 && $$bindings.ghostClass && ghostClass !== void 0)
    $$bindings.ghostClass(ghostClass);
  if ($$props.chosenClass === void 0 && $$bindings.chosenClass && chosenClass !== void 0)
    $$bindings.chosenClass(chosenClass);
  if ($$props.dragClass === void 0 && $$bindings.dragClass && dragClass !== void 0)
    $$bindings.dragClass(dragClass);
  if ($$props.ignore === void 0 && $$bindings.ignore && ignore !== void 0)
    $$bindings.ignore(ignore);
  if ($$props.filter === void 0 && $$bindings.filter && filter !== void 0)
    $$bindings.filter(filter);
  if ($$props.preventOnFilter === void 0 && $$bindings.preventOnFilter && preventOnFilter !== void 0)
    $$bindings.preventOnFilter(preventOnFilter);
  if ($$props.animation === void 0 && $$bindings.animation && animation !== void 0)
    $$bindings.animation(animation);
  if ($$props.easing === void 0 && $$bindings.easing && easing !== void 0)
    $$bindings.easing(easing);
  if ($$props.dataIdAttr === void 0 && $$bindings.dataIdAttr && dataIdAttr !== void 0)
    $$bindings.dataIdAttr(dataIdAttr);
  if ($$props.delay === void 0 && $$bindings.delay && delay !== void 0)
    $$bindings.delay(delay);
  if ($$props.delayOnTouchOnly === void 0 && $$bindings.delayOnTouchOnly && delayOnTouchOnly !== void 0)
    $$bindings.delayOnTouchOnly(delayOnTouchOnly);
  if ($$props.forceFallback === void 0 && $$bindings.forceFallback && forceFallback !== void 0)
    $$bindings.forceFallback(forceFallback);
  if ($$props.fallbackClass === void 0 && $$bindings.fallbackClass && fallbackClass !== void 0)
    $$bindings.fallbackClass(fallbackClass);
  if ($$props.fallbackOnBody === void 0 && $$bindings.fallbackOnBody && fallbackOnBody !== void 0)
    $$bindings.fallbackOnBody(fallbackOnBody);
  if ($$props.fallbackTolerance === void 0 && $$bindings.fallbackTolerance && fallbackTolerance !== void 0)
    $$bindings.fallbackTolerance(fallbackTolerance);
  if ($$props.fallbackOffset === void 0 && $$bindings.fallbackOffset && fallbackOffset !== void 0)
    $$bindings.fallbackOffset(fallbackOffset);
  if ($$props.emptyInsertThreshold === void 0 && $$bindings.emptyInsertThreshold && emptyInsertThreshold !== void 0)
    $$bindings.emptyInsertThreshold(emptyInsertThreshold);
  if ($$props.direction === void 0 && $$bindings.direction && direction !== void 0)
    $$bindings.direction(direction);
  if ($$props.touchStartThreshold === void 0 && $$bindings.touchStartThreshold && touchStartThreshold !== void 0)
    $$bindings.touchStartThreshold(touchStartThreshold);
  if ($$props.setData === void 0 && $$bindings.setData && setData !== void 0)
    $$bindings.setData(setData);
  if ($$props.draggable === void 0 && $$bindings.draggable && draggable !== void 0)
    $$bindings.draggable(draggable);
  if ($$props.onChoose === void 0 && $$bindings.onChoose && onChoose !== void 0)
    $$bindings.onChoose(onChoose);
  if ($$props.onUnchoose === void 0 && $$bindings.onUnchoose && onUnchoose !== void 0)
    $$bindings.onUnchoose(onUnchoose);
  if ($$props.onStart === void 0 && $$bindings.onStart && onStart !== void 0)
    $$bindings.onStart(onStart);
  if ($$props.onEnd === void 0 && $$bindings.onEnd && onEnd !== void 0)
    $$bindings.onEnd(onEnd);
  if ($$props.onAdd === void 0 && $$bindings.onAdd && onAdd !== void 0)
    $$bindings.onAdd(onAdd);
  if ($$props.onUpdate === void 0 && $$bindings.onUpdate && onUpdate !== void 0)
    $$bindings.onUpdate(onUpdate);
  if ($$props.onRemove === void 0 && $$bindings.onRemove && onRemove !== void 0)
    $$bindings.onRemove(onRemove);
  if ($$props.onFilter === void 0 && $$bindings.onFilter && onFilter !== void 0)
    $$bindings.onFilter(onFilter);
  if ($$props.onSort === void 0 && $$bindings.onSort && onSort !== void 0)
    $$bindings.onSort(onSort);
  if ($$props.onClone === void 0 && $$bindings.onClone && onClone !== void 0)
    $$bindings.onClone(onClone);
  if ($$props.onMove === void 0 && $$bindings.onMove && onMove !== void 0)
    $$bindings.onMove(onMove);
  if ($$props.onChange === void 0 && $$bindings.onChange && onChange !== void 0)
    $$bindings.onChange(onChange);
  return ` <div${add_attribute("class", className, 0)}${add_attribute("this", list, 0)}>${slots.default ? slots.default({}) : ``}</div>`;
});
const TabIndicator = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, [
    "use",
    "class",
    "active",
    "type",
    "transition",
    "content$use",
    "content$class",
    "activate",
    "deactivate",
    "computeContentClientRect",
    "getElement"
  ]);
  forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { active = false } = $$props;
  let { type = "underline" } = $$props;
  let { transition = "slide" } = $$props;
  let { content$use = [] } = $$props;
  let { content$class = "" } = $$props;
  let element;
  let instance;
  let content;
  let internalClasses = {};
  let contentStyles = {};
  let changeSets = [];
  let oldTransition = transition;
  function getInstance() {
    const Foundation = {
      fade: MDCFadingTabIndicatorFoundation,
      slide: MDCSlidingTabIndicatorFoundation
    }[transition] || MDCSlidingTabIndicatorFoundation;
    return new Foundation({
      addClass: (...props) => doChange(() => addClass(...props)),
      removeClass: (...props) => doChange(() => removeClass(...props)),
      computeContentClientRect,
      setContentStyleProperty: (...props) => doChange(() => addContentStyle(...props))
    });
  }
  function doChange(fn) {
    if (changeSets.length) {
      changeSets[changeSets.length - 1].push(fn);
    } else {
      fn();
    }
  }
  function addClass(className2) {
    if (!internalClasses[className2]) {
      internalClasses[className2] = true;
    }
  }
  function removeClass(className2) {
    if (!(className2 in internalClasses) || internalClasses[className2]) {
      internalClasses[className2] = false;
    }
  }
  function addContentStyle(name, value) {
    if (contentStyles[name] != value) {
      if (value === "" || value == null) {
        delete contentStyles[name];
        contentStyles = contentStyles;
      } else {
        contentStyles[name] = value;
      }
    }
  }
  function activate(previousIndicatorClientRect) {
    active = true;
    instance.activate(previousIndicatorClientRect);
  }
  function deactivate() {
    active = false;
    instance.deactivate();
  }
  function computeContentClientRect() {
    changeSets.push([]);
    changeSets = changeSets;
    return content.getBoundingClientRect();
  }
  function getElement() {
    return element;
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.active === void 0 && $$bindings.active && active !== void 0)
    $$bindings.active(active);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  if ($$props.transition === void 0 && $$bindings.transition && transition !== void 0)
    $$bindings.transition(transition);
  if ($$props.content$use === void 0 && $$bindings.content$use && content$use !== void 0)
    $$bindings.content$use(content$use);
  if ($$props.content$class === void 0 && $$bindings.content$class && content$class !== void 0)
    $$bindings.content$class(content$class);
  if ($$props.activate === void 0 && $$bindings.activate && activate !== void 0)
    $$bindings.activate(activate);
  if ($$props.deactivate === void 0 && $$bindings.deactivate && deactivate !== void 0)
    $$bindings.deactivate(deactivate);
  if ($$props.computeContentClientRect === void 0 && $$bindings.computeContentClientRect && computeContentClientRect !== void 0)
    $$bindings.computeContentClientRect(computeContentClientRect);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  {
    if (oldTransition !== transition) {
      oldTransition = transition;
      instance && instance.destroy();
      internalClasses = {};
      contentStyles = {};
      instance = getInstance();
      instance.init();
    }
  }
  {
    if (changeSets.length) {
      requestAnimationFrame(() => {
        var _a;
        const changeSet = (_a = changeSets.shift()) !== null && _a !== void 0 ? _a : [];
        changeSets = changeSets;
        for (const fn of changeSet) {
          fn();
        }
      });
    }
  }
  return `<span${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [className]: true,
          "mdc-tab-indicator": true,
          "mdc-tab-indicator--active": active,
          "mdc-tab-indicator--fade": transition === "fade",
          ...internalClasses
        }))
      },
      escape_object(exclude($$restProps, ["content$"]))
    ],
    {}
  )}${add_attribute("this", element, 0)}><span${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [content$class]: true,
          "mdc-tab-indicator__content": true,
          "mdc-tab-indicator__content--underline": type === "underline",
          "mdc-tab-indicator__content--icon": type === "icon"
        }))
      },
      {
        style: escape_attribute_value(Object.entries(contentStyles).map(([name, value]) => `${name}: ${value};`).join(" "))
      },
      {
        "aria-hidden": escape_attribute_value(type === "icon" ? "true" : void 0)
      },
      escape_object(prefixFilter($$restProps, "content$"))
    ],
    {}
  )}${add_attribute("this", content, 0)}>${slots.default ? slots.default({}) : ``}</span> </span>`;
});
const { Object: Object_1$1 } = globals;
const Tab = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, [
    "use",
    "class",
    "style",
    "tab",
    "ripple",
    "stacked",
    "minWidth",
    "indicatorSpanOnlyContent",
    "href",
    "content$use",
    "content$class",
    "component",
    "tag",
    "activate",
    "deactivate",
    "focus",
    "getElement"
  ]);
  const forwardEvents = forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { style = "" } = $$props;
  let { tab: tabId } = $$props;
  let { ripple = true } = $$props;
  let { stacked = false } = $$props;
  let { minWidth = false } = $$props;
  let { indicatorSpanOnlyContent = false } = $$props;
  let { href = void 0 } = $$props;
  let { content$use = [] } = $$props;
  let { content$class = "" } = $$props;
  let element;
  let instance;
  let content;
  let tabIndicator;
  let internalClasses = {};
  let internalStyles = {};
  let internalAttrs = {};
  let focusOnActivate = getContext("SMUI:tab:focusOnActivate");
  let active = tabId === getContext("SMUI:tab:initialActive");
  let forceAccessible = false;
  let { component = SmuiElement } = $$props;
  let { tag = component === SmuiElement ? href == null ? "button" : "a" : void 0 } = $$props;
  setContext("SMUI:label:context", "tab");
  setContext("SMUI:icon:context", "tab");
  if (!tabId) {
    throw new Error("The tab property is required! It should be passed down from the TabBar to the Tab.");
  }
  function addClass(className2) {
    if (!internalClasses[className2]) {
      internalClasses[className2] = true;
    }
  }
  function removeClass(className2) {
    if (!(className2 in internalClasses) || internalClasses[className2]) {
      internalClasses[className2] = false;
    }
  }
  function addStyle(name, value) {
    if (internalStyles[name] != value) {
      if (value === "" || value == null) {
        delete internalStyles[name];
        internalStyles = internalStyles;
      } else {
        internalStyles[name] = value;
      }
    }
  }
  function activate(previousIndicatorClientRect, skipFocus) {
    active = true;
    if (skipFocus) {
      instance.setFocusOnActivate(false);
    }
    instance.activate(previousIndicatorClientRect);
    if (skipFocus) {
      instance.setFocusOnActivate(focusOnActivate);
    }
  }
  function deactivate() {
    active = false;
    instance.deactivate();
  }
  function focus() {
    getElement().focus();
  }
  function getElement() {
    return element.getElement();
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.style === void 0 && $$bindings.style && style !== void 0)
    $$bindings.style(style);
  if ($$props.tab === void 0 && $$bindings.tab && tabId !== void 0)
    $$bindings.tab(tabId);
  if ($$props.ripple === void 0 && $$bindings.ripple && ripple !== void 0)
    $$bindings.ripple(ripple);
  if ($$props.stacked === void 0 && $$bindings.stacked && stacked !== void 0)
    $$bindings.stacked(stacked);
  if ($$props.minWidth === void 0 && $$bindings.minWidth && minWidth !== void 0)
    $$bindings.minWidth(minWidth);
  if ($$props.indicatorSpanOnlyContent === void 0 && $$bindings.indicatorSpanOnlyContent && indicatorSpanOnlyContent !== void 0)
    $$bindings.indicatorSpanOnlyContent(indicatorSpanOnlyContent);
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  if ($$props.content$use === void 0 && $$bindings.content$use && content$use !== void 0)
    $$bindings.content$use(content$use);
  if ($$props.content$class === void 0 && $$bindings.content$class && content$class !== void 0)
    $$bindings.content$class(content$class);
  if ($$props.component === void 0 && $$bindings.component && component !== void 0)
    $$bindings.component(component);
  if ($$props.tag === void 0 && $$bindings.tag && tag !== void 0)
    $$bindings.tag(tag);
  if ($$props.activate === void 0 && $$bindings.activate && activate !== void 0)
    $$bindings.activate(activate);
  if ($$props.deactivate === void 0 && $$bindings.deactivate && deactivate !== void 0)
    $$bindings.deactivate(deactivate);
  if ($$props.focus === void 0 && $$bindings.focus && focus !== void 0)
    $$bindings.focus(focus);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${validate_component(component || missing_component, "svelte:component").$$render(
      $$result,
      Object_1$1.assign(
        {},
        { tag },
        {
          use: [
            [
              Ripple,
              {
                ripple,
                unbounded: false,
                addClass,
                removeClass,
                addStyle
              }
            ],
            forwardEvents,
            ...use
          ]
        },
        {
          class: classMap({
            [className]: true,
            "mdc-tab": true,
            "mdc-tab--active": active,
            "mdc-tab--stacked": stacked,
            "mdc-tab--min-width": minWidth,
            ...internalClasses
          })
        },
        {
          style: Object.entries(internalStyles).map(([name, value]) => `${name}: ${value};`).concat([style]).join(" ")
        },
        { role: "tab" },
        {
          "aria-selected": active ? "true" : "false"
        },
        {
          tabindex: active || forceAccessible ? "0" : "-1"
        },
        { href },
        internalAttrs,
        exclude($$restProps, ["content$", "tabIndicator$"]),
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
          return `<span${spread(
            [
              {
                class: escape_attribute_value(classMap({
                  [content$class]: true,
                  "mdc-tab__content": true
                }))
              },
              escape_object(prefixFilter($$restProps, "content$"))
            ],
            {}
          )}${add_attribute("this", content, 0)}>${slots.default ? slots.default({}) : ``} ${indicatorSpanOnlyContent ? `${validate_component(TabIndicator, "TabIndicator").$$render(
            $$result,
            Object_1$1.assign({}, { active }, prefixFilter($$restProps, "tabIndicator$"), { this: tabIndicator }),
            {
              this: ($$value) => {
                tabIndicator = $$value;
                $$settled = false;
              }
            },
            {
              default: () => {
                return `${slots["tab-indicator"] ? slots["tab-indicator"]({}) : ``}`;
              }
            }
          )}` : ``}</span> ${!indicatorSpanOnlyContent ? `${validate_component(TabIndicator, "TabIndicator").$$render(
            $$result,
            Object_1$1.assign({}, { active }, prefixFilter($$restProps, "tabIndicator$"), { this: tabIndicator }),
            {
              this: ($$value) => {
                tabIndicator = $$value;
                $$settled = false;
              }
            },
            {
              default: () => {
                return `${slots["tab-indicator"] ? slots["tab-indicator"]({}) : ``}`;
              }
            }
          )}` : ``} <span class="mdc-tab__ripple"></span>`;
        }
      }
    )}`;
  } while (!$$settled);
  return $$rendered;
});
const TabScroller = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, [
    "use",
    "class",
    "align",
    "scrollArea$use",
    "scrollArea$class",
    "scrollContent$use",
    "scrollContent$class",
    "getScrollPosition",
    "getScrollContentWidth",
    "incrementScroll",
    "scrollTo",
    "getElement"
  ]);
  forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { align = void 0 } = $$props;
  let { scrollArea$use = [] } = $$props;
  let { scrollArea$class = "" } = $$props;
  let { scrollContent$use = [] } = $$props;
  let { scrollContent$class = "" } = $$props;
  let element;
  let instance;
  let scrollArea;
  let scrollContent;
  let internalClasses = {};
  let scrollAreaClasses = {};
  let scrollAreaStyles = {};
  let scrollContentStyles = {};
  function getScrollPosition() {
    return instance.getScrollPosition();
  }
  function getScrollContentWidth() {
    return scrollContent.offsetWidth;
  }
  function incrementScroll(scrollXIncrement) {
    instance.incrementScroll(scrollXIncrement);
  }
  function scrollTo(scrollX) {
    instance.scrollTo(scrollX);
  }
  function getElement() {
    return element;
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.align === void 0 && $$bindings.align && align !== void 0)
    $$bindings.align(align);
  if ($$props.scrollArea$use === void 0 && $$bindings.scrollArea$use && scrollArea$use !== void 0)
    $$bindings.scrollArea$use(scrollArea$use);
  if ($$props.scrollArea$class === void 0 && $$bindings.scrollArea$class && scrollArea$class !== void 0)
    $$bindings.scrollArea$class(scrollArea$class);
  if ($$props.scrollContent$use === void 0 && $$bindings.scrollContent$use && scrollContent$use !== void 0)
    $$bindings.scrollContent$use(scrollContent$use);
  if ($$props.scrollContent$class === void 0 && $$bindings.scrollContent$class && scrollContent$class !== void 0)
    $$bindings.scrollContent$class(scrollContent$class);
  if ($$props.getScrollPosition === void 0 && $$bindings.getScrollPosition && getScrollPosition !== void 0)
    $$bindings.getScrollPosition(getScrollPosition);
  if ($$props.getScrollContentWidth === void 0 && $$bindings.getScrollContentWidth && getScrollContentWidth !== void 0)
    $$bindings.getScrollContentWidth(getScrollContentWidth);
  if ($$props.incrementScroll === void 0 && $$bindings.incrementScroll && incrementScroll !== void 0)
    $$bindings.incrementScroll(incrementScroll);
  if ($$props.scrollTo === void 0 && $$bindings.scrollTo && scrollTo !== void 0)
    $$bindings.scrollTo(scrollTo);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  return `<div${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [className]: true,
          "mdc-tab-scroller": true,
          "mdc-tab-scroller--align-start": align === "start",
          "mdc-tab-scroller--align-end": align === "end",
          "mdc-tab-scroller--align-center": align === "center",
          ...internalClasses
        }))
      },
      escape_object(exclude($$restProps, ["scrollArea$", "scrollContent$"]))
    ],
    {}
  )}${add_attribute("this", element, 0)}><div${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [scrollArea$class]: true,
          "mdc-tab-scroller__scroll-area": true,
          ...scrollAreaClasses
        }))
      },
      {
        style: escape_attribute_value(Object.entries(scrollAreaStyles).map(([name, value]) => `${name}: ${value};`).join(" "))
      },
      escape_object(prefixFilter($$restProps, "scrollArea$"))
    ],
    {}
  )}${add_attribute("this", scrollArea, 0)}><div${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [scrollContent$class]: true,
          "mdc-tab-scroller__scroll-content": true
        }))
      },
      {
        style: escape_attribute_value(Object.entries(scrollContentStyles).map(([name, value]) => `${name}: ${value};`).join(" "))
      },
      escape_object(prefixFilter($$restProps, "scrollContent$"))
    ],
    {}
  )}${add_attribute("this", scrollContent, 0)}>${slots.default ? slots.default({}) : ``}</div></div> </div>`;
});
const { Object: Object_1 } = globals;
const TabBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, [
    "use",
    "class",
    "tabs",
    "key",
    "focusOnActivate",
    "focusOnProgrammatic",
    "useAutomaticActivation",
    "active",
    "tabindex",
    "scrollIntoView",
    "getElement"
  ]);
  forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { tabs = [] } = $$props;
  let { key = (tab) => tab } = $$props;
  let { focusOnActivate = true } = $$props;
  let { focusOnProgrammatic = false } = $$props;
  let { useAutomaticActivation = true } = $$props;
  let { active = void 0 } = $$props;
  let { tabindex = 0 } = $$props;
  let element;
  let instance;
  let tabScroller;
  let activeIndex = tabs.indexOf(active);
  let tabAccessorMap = {};
  let tabAccessorWeakMap = /* @__PURE__ */ new WeakMap();
  setContext("SMUI:tab:focusOnActivate", focusOnActivate);
  setContext("SMUI:tab:initialActive", active);
  function scrollIntoView(index) {
    instance.scrollIntoView(index);
  }
  function getElement() {
    return element;
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.tabs === void 0 && $$bindings.tabs && tabs !== void 0)
    $$bindings.tabs(tabs);
  if ($$props.key === void 0 && $$bindings.key && key !== void 0)
    $$bindings.key(key);
  if ($$props.focusOnActivate === void 0 && $$bindings.focusOnActivate && focusOnActivate !== void 0)
    $$bindings.focusOnActivate(focusOnActivate);
  if ($$props.focusOnProgrammatic === void 0 && $$bindings.focusOnProgrammatic && focusOnProgrammatic !== void 0)
    $$bindings.focusOnProgrammatic(focusOnProgrammatic);
  if ($$props.useAutomaticActivation === void 0 && $$bindings.useAutomaticActivation && useAutomaticActivation !== void 0)
    $$bindings.useAutomaticActivation(useAutomaticActivation);
  if ($$props.active === void 0 && $$bindings.active && active !== void 0)
    $$bindings.active(active);
  if ($$props.tabindex === void 0 && $$bindings.tabindex && tabindex !== void 0)
    $$bindings.tabindex(tabindex);
  if ($$props.scrollIntoView === void 0 && $$bindings.scrollIntoView && scrollIntoView !== void 0)
    $$bindings.scrollIntoView(scrollIntoView);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      if (active !== tabs[activeIndex]) {
        activeIndex = tabs.indexOf(active);
      }
    }
    {
      if (tabs.length) {
        const accessor = tabs[0] instanceof Object ? tabAccessorWeakMap.get(tabs[0]) : tabAccessorMap[tabs[0]];
        if (accessor) {
          accessor.forceAccessible(activeIndex === -1);
        }
      }
    }
    $$rendered = `<div${spread(
      [
        {
          class: escape_attribute_value(classMap({ [className]: true, "mdc-tab-bar": true }))
        },
        { role: "tablist" },
        {
          tabindex: escape_attribute_value(tabindex)
        },
        escape_object(exclude($$restProps, ["tabScroller$"]))
      ],
      {}
    )}${add_attribute("this", element, 0)}>${validate_component(TabScroller, "TabScroller").$$render(
      $$result,
      Object_1.assign({}, prefixFilter($$restProps, "tabScroller$"), { this: tabScroller }),
      {
        this: ($$value) => {
          tabScroller = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${each(tabs, (tab) => {
            return `${slots.default ? slots.default({ tab }) : ``}`;
          })}`;
        }
      }
    )} </div>`;
  } while (!$$settled);
  return $$rendered;
});
const css$4 = {
  code: "main.svelte-mvbb3l{margin:20px}.content_generator.svelte-mvbb3l{height:40px;margin-top:25px;width:100%}.collapsible.svelte-mvbb3l{overflow:hidden;margin-top:1rem;margin-bottom:3rem;margin-left:1rem}.svelte-mvbb3l::selection{border:0;background-color:lightblue}table.svelte-mvbb3l{width:100%;border-collapse:collapse}th.svelte-mvbb3l{position:sticky;top:0;z-index:2}th.svelte-mvbb3l,td.svelte-mvbb3l{border:1px solid #ddd;padding:1px;text-align:center}.system_div.svelte-mvbb3l{margin-left:10px}.dialog-field.svelte-mvbb3l{display:inline-block;box-sizing:border-box;margin-right:10px}.dialog-field.svelte-mvbb3l:first-child{width:calc(\n      100% - 20% - 10% - 5px\n    )}.dialog-field.svelte-mvbb3l:nth-last-child(-n + 2){width:calc(\n      20% - 20px\n    )}.save.svelte-mvbb3l{margin-top:10px}textarea.svelte-mvbb3l{width:100%;resize:none}.remrec_but.svelte-mvbb3l{scale:2;width:25px;border-radius:35px;border:0;background-color:transparent;color:blue}.dialog_name.svelte-mvbb3l,.dialog_lang.svelte-mvbb3l,.dialog_level.svelte-mvbb3l{border:0}.container.svelte-mvbb3l{display:flex;justify-content:space-between}.dialog-field.svelte-mvbb3l{display:flex;flex-direction:column;margin-right:20px}.dialog-field.svelte-mvbb3l:last-child{margin-right:0}",
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
function splitHtmlContent(inputString) {
  const regex = /<(?:!DOCTYPE html|html(?:\s[^>]*)?)>(.*?)<\/html>/gs;
  const result = [];
  let match;
  while ((match = regex.exec(inputString)) !== null) {
    result.push(match[0]);
  }
  return result;
}
const DialogEdit = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $llang, $$unsubscribe_llang;
  let $langs, $$unsubscribe_langs;
  $$unsubscribe_llang = subscribe(llang, (value) => $llang = value);
  $$unsubscribe_langs = subscribe(langs, (value) => $langs = value);
  let { ChangeQuizName } = $$props;
  const abonent = getContext("abonent");
  const data = getContext("quiz_data");
  let num = 10;
  let dialog_data = {
    lang: "",
    content: [],
    words: [],
    html: [""],
    name: ""
  };
  const name = data.name;
  let menu, anchor;
  let anchorClasses = {};
  let prompt = ``, grammar = "", grammar_title = "Grammar", context_title = "Context", prompt_title = "Prompt", words_title = "Words", content_title = "Content";
  let active = "Prompt";
  fetch(`./lesson?dialog=${data.name[$llang]}&owner=${abonent}&level=${data.level}`).then((response) => response.json()).then(async (resp) => {
    dialog_data = resp.data.dialog;
    if (!dialog_data)
      dialog_data = { content: [] };
    if (resp.data.html) {
      dialog_data.html = splitHtmlContent(resp.data.html);
    }
    dialog_data.name = name;
    fetch(`./admin?prompt=dialog.basic&quiz_name=${data.name[$llang]}&prompt_owner=${abonent}&prompt_level=${data.level}&prompt_theme=${data.theme}`).then((response) => response.json()).then((resp2) => {
      prompt = resp2.resp.prompt.system + resp2.resp.prompt.user;
      prompt = prompt.replaceAll("${llang}", $llang);
      prompt = prompt.replaceAll("${name[$llang]}", name[$llang]);
      prompt = prompt.replaceAll("${langs}", $langs);
      prompt = prompt.replaceAll("${dialog_data.html}", dialog_data.html);
      prompt = prompt.replaceAll("${data.level}", data.level);
      prompt = prompt.replaceAll("${num}", num);
      dialog_data.words = JSON.stringify(resp2.resp.words[0].data.map((item) => extractWords(item.example[$llang])).join(","));
      if (resp2.resp.words[0].data) {
        prompt = prompt.replaceAll("[${dialog_data_words}]", resp2.resp.words[0].data.map((item) => item.infinitive));
      }
      dialog_data.html = resp2.resp.words[0]?.context;
      let quiz_grammar = resp2.resp.grammar?.quizes[data.name[$llang]];
      grammar = resp2.resp.grammar?.grammar.concat(quiz_grammar);
      if (grammar)
        prompt = prompt.replaceAll("${grammar}", grammar.map((element) => {
          return element;
        }));
      prompt = prompt;
    });
  }).catch((error) => {
    console.log(error);
  });
  async function TranslateContentToCurrentLang() {
    try {
      await Promise.all(dialog_data.content.map(async (item) => {
        await Promise.all(Object.keys(item).map(async (key) => {
          if (item[key][$llang] && !item[key][$langs]) {
            let tr = await Translate(item[key][$llang], $llang, $langs);
            item[key][$langs] = tr;
            dialog_data = dialog_data;
          }
        }));
      }));
    } catch (ex) {
    }
  }
  if ($$props.ChangeQuizName === void 0 && $$bindings.ChangeQuizName && ChangeQuizName !== void 0)
    $$bindings.ChangeQuizName(ChangeQuizName);
  $$result.css.add(css$4);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      if (dialog_data && $llang) {
        try {
          const dlg_content = dialog_data.content.map((line) => {
            return JSON.stringify(line);
          });
          let dialog_data_words = dialog_data.words || "";
        } catch (ex) {
        }
      }
    }
    {
      if (dialog_data && $langs) {
        TranslateContentToCurrentLang();
      }
    }
    {
      if (dialog_data.content.length > 0 && prompt) {
        let content2 = JSON.parse(JSON.stringify(dialog_data.content));
        try {
          content2?.forEach((item) => {
            item["user1"] = item["user1"][$llang] ? item["user1"][$llang] : item["user1"];
            item["user2"] = item["user2"][$llang] ? item["user2"][$llang] : item["user2"];
          });
        } catch (ex) {
        }
        prompt = prompt.replaceAll("${dialog_content}", JSON.stringify(content2));
      }
    }
    $$rendered = `<main class="svelte-mvbb3l"><div class="container svelte-mvbb3l"><div class="dialog-field svelte-mvbb3l">${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ``;
      }
      return function(data2) {
        return ` <label for="dialog_name" class="svelte-mvbb3l">${escape(data2)}</label> `;
      }(__value);
    }(Translate("Title", "en", $langs))} <input type="text" class="dialog_name svelte-mvbb3l" name="dialog_name"${add_attribute("value", data.name[$llang], 0)}></div> ${data.level ? `<div class="dialog-field svelte-mvbb3l">${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ``;
      }
      return function(data2) {
        return ` <label for="dialog_level" class="svelte-mvbb3l">${escape(data2)}</label> `;
      }(__value);
    }(Translate("Level", "en", $langs))} <div class="dialog_level svelte-mvbb3l" name="dialog_level">${escape(data.level)}</div></div>` : ``} ${$llang ? `<div class="dialog-field svelte-mvbb3l">${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ``;
      }
      return function(data2) {
        return ` <label for="dialog_lang" class="svelte-mvbb3l">${escape(data2)}</label> `;
      }(__value);
    }(Translate("Language", "en", $langs))} <div type="text" class="dialog_lang svelte-mvbb3l" name="dialog_lang">${escape($llang)}</div></div>` : ``}</div> ${validate_component(Accordion, "Accordion").$$render(
      $$result,
      {
        style: "  margin-top: 20px;\n  margin-bottom: 20px;"
      },
      {},
      {
        default: () => {
          return `${validate_component(Panel, "Panel").$$render($$result, {}, {}, {
            default: () => {
              return `${validate_component(Header$1, "Header").$$render($$result, {}, {}, {
                default: () => {
                  return `<b class="svelte-mvbb3l">${function(__value) {
                    if (is_promise(__value)) {
                      __value.then(null, noop);
                      return ``;
                    }
                    return function(data2) {
                      return ` ${escape(data2)} `;
                    }(__value);
                  }(Translate("Content Builder", "en", $langs))}</b>`;
                }
              })} ${validate_component(Content, "Content").$$render($$result, {}, {}, {
                default: () => {
                  return `<div class="collapsible svelte-mvbb3l"><div class="generator_container svelte-mvbb3l"> ${validate_component(TabBar, "TabBar").$$render(
                    $$result,
                    {
                      tabs: [
                        context_title,
                        grammar_title,
                        words_title,
                        prompt_title,
                        content_title
                      ],
                      active
                    },
                    {
                      active: ($$value) => {
                        active = $$value;
                        $$settled = false;
                      }
                    },
                    {
                      default: ({ tab }) => {
                        return `${validate_component(Tab, "Tab").$$render($$result, { tab, minWidth: true }, {}, {
                          default: () => {
                            return `${validate_component(CommonLabel, "Label").$$render($$result, {}, {}, {
                              default: () => {
                                return `${escape(tab)}`;
                              }
                            })}`;
                          }
                        })}`;
                      }
                    }
                  )} ${active === context_title ? `${`${validate_component(Paper, "Paper").$$render($$result, { variant: "unelevated" }, {}, {
                    default: () => {
                      return `${validate_component(Content, "Content").$$render($$result, {}, {}, {
                        default: () => {
                          return `<textarea rows="20" name="dialog_context" class="svelte-mvbb3l">${escape(dialog_data.html || "")}</textarea>`;
                        }
                      })}`;
                    }
                  })}`} <button class="paste_content svelte-mvbb3l" data-svelte-h="svelte-12l3g78">HTML</button>` : `${active === grammar_title ? `${validate_component(Paper, "Paper").$$render($$result, { variant: "unelevated" }, {}, {
                    default: () => {
                      return `${validate_component(Content, "Content").$$render($$result, {}, {}, {
                        default: () => {
                          return `<textarea rows="20" name="dialog_grammar" class="svelte-mvbb3l">${escape(grammar || "")}</textarea>`;
                        }
                      })}`;
                    }
                  })}` : `${active === words_title ? `${validate_component(Paper, "Paper").$$render($$result, { variant: "unelevated" }, {}, {
                    default: () => {
                      return `${validate_component(Content, "Content").$$render($$result, {}, {}, {
                        default: () => {
                          return `<textarea rows="20" name="dialog_words" class="svelte-mvbb3l">${escape(dialog_data.words || "")}</textarea>`;
                        }
                      })}`;
                    }
                  })}` : `${active === prompt_title ? `${validate_component(Paper, "Paper").$$render($$result, { variant: "unelevated" }, {}, {
                    default: () => {
                      return `${validate_component(Content, "Content").$$render($$result, {}, {}, {
                        default: () => {
                          return `<div class="${escape(null_to_empty(Object.keys(anchorClasses).join(" ")), true) + " svelte-mvbb3l"}"${add_attribute("this", anchor, 0)}>${validate_component(Button, "Button").$$render($$result, {}, {}, {
                            default: () => {
                              return `${validate_component(CommonLabel, "Label").$$render($$result, {}, {}, {
                                default: () => {
                                  return `Выбрать промпт`;
                                }
                              })}`;
                            }
                          })} ${validate_component(Menu, "Menu").$$render(
                            $$result,
                            {
                              anchor: false,
                              anchorCorner: "BOTTOM_LEFT",
                              this: menu,
                              anchorElement: anchor
                            },
                            {
                              this: ($$value) => {
                                menu = $$value;
                                $$settled = false;
                              },
                              anchorElement: ($$value) => {
                                anchor = $$value;
                                $$settled = false;
                              }
                            },
                            {
                              default: () => {
                                return `${validate_component(List, "List").$$render($$result, {}, {}, {
                                  default: () => {
                                    return `${validate_component(Item, "Item").$$render($$result, {}, {}, {
                                      default: () => {
                                        return `${validate_component(Text, "Text").$$render($$result, {}, {}, {
                                          default: () => {
                                            return `basic`;
                                          }
                                        })}`;
                                      }
                                    })} ${validate_component(Item, "Item").$$render($$result, {}, {}, {
                                      default: () => {
                                        return `${validate_component(Text, "Text").$$render($$result, {}, {}, {
                                          default: () => {
                                            return `context`;
                                          }
                                        })}`;
                                      }
                                    })} ${validate_component(Item, "Item").$$render($$result, {}, {}, {
                                      default: () => {
                                        return `${validate_component(Text, "Text").$$render($$result, {}, {}, {
                                          default: () => {
                                            return `grammar`;
                                          }
                                        })}`;
                                      }
                                    })}`;
                                  }
                                })}`;
                              }
                            }
                          )}</div> <textarea rows="20" name="dialog_task" class="svelte-mvbb3l">${escape(prompt || "")}</textarea>  <button class="copy_prompt svelte-mvbb3l">${function(__value) {
                            if (is_promise(__value)) {
                              __value.then(null, noop);
                              return ``;
                            }
                            return function(data2) {
                              return ` ${escape(data2)} `;
                            }(__value);
                          }(Translate("Copy", "en", $langs))}</button>`;
                        }
                      })}`;
                    }
                  })}` : `${active === content_title ? `${validate_component(Paper, "Paper").$$render($$result, { variant: "unelevated" }, {}, {
                    default: () => {
                      return `${validate_component(Content, "Content").$$render($$result, {}, {}, {
                        default: () => {
                          return `${function(__value) {
                            if (is_promise(__value)) {
                              __value.then(null, noop);
                              return ``;
                            }
                            return function(data2) {
                              return ` <textarea id="dialog_content" rows="20" name="dialog_content"${add_attribute("placeholder", data2, 0)} class="svelte-mvbb3l">${escape("")}</textarea> `;
                            }(__value);
                          }(Translate("Use chatGPT to run the copied prompt and paste result here", "en", $langs))} <button class="paste_content svelte-mvbb3l">${function(__value) {
                            if (is_promise(__value)) {
                              __value.then(null, noop);
                              return ``;
                            }
                            return function(data2) {
                              return ` ${escape(data2)} `;
                            }(__value);
                          }(Translate("Paste Content", "en", $langs))}</button>`;
                        }
                      })}`;
                    }
                  })}` : ``}`}`}`}`}</div> <div class="container svelte-mvbb3l"><button class="save svelte-mvbb3l" disabled>${function(__value) {
                    if (is_promise(__value)) {
                      __value.then(null, noop);
                      return ``;
                    }
                    return function(data2) {
                      return ` ${escape(data2)} `;
                    }(__value);
                  }(Translate("Create content", "en", $langs))}</button></div></div>`;
                }
              })}`;
            }
          })}`;
        }
      }
    )} <table class="svelte-mvbb3l"><thead class="svelte-mvbb3l"><tr class="svelte-mvbb3l">${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ``;
      }
      return function(data2) {
        return ` <th class="svelte-mvbb3l">${escape(data2)}</th>`;
      }(__value);
    }(Translate("User 1", "en", $langs))} ${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ``;
      }
      return function(data2) {
        return ` <th class="svelte-mvbb3l">${escape(data2)}</th>`;
      }(__value);
    }(Translate("User 2", "en", $langs))}</tr></thead> <tbody class="svelte-mvbb3l">${dialog_data ? `${each(dialog_data.content, (item, index) => {
      return `<tr class="svelte-mvbb3l"><td class="svelte-mvbb3l">${item.user1 ? `<textarea rows="3" type="text" class="svelte-mvbb3l">${escape(item.user1[$langs] || "")}</textarea>` : `<textarea rows="3" type="text" class="svelte-mvbb3l"></textarea>`}</td> <td class="svelte-mvbb3l">${item.user2 ? `<textarea rows="3" type="text" class="svelte-mvbb3l">${escape(item.user2[$langs] || "")}</textarea>` : `<textarea rows="3" type="text" class="svelte-mvbb3l"></textarea>`}</td> <td class="svelte-mvbb3l"><button class="remrec_but svelte-mvbb3l"${add_attribute("index", index, 0)} data-svelte-h="svelte-1orru4d">-</button></td> </tr>`;
    })}` : ``}</tbody></table> <div class="container svelte-mvbb3l">${validate_component(IconButton, "IconButton").$$render($$result, { class: "material-icons add-record" }, {}, {
      default: () => {
        return `add`;
      }
    })} <div class="container svelte-mvbb3l">${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ``;
      }
      return function(data2) {
        return ` <button class="save svelte-mvbb3l">${escape(data2)}</button>`;
      }(__value);
    }(Translate("Save", "en", $langs))}</div></div> </main>`;
  } while (!$$settled);
  $$unsubscribe_llang();
  $$unsubscribe_langs();
  return $$rendered;
});
const css$3 = {
  code: ".word_container.svelte-1jt2qa6{margin:10px}.content_generator.svelte-1jt2qa6{height:40px;margin-top:25px;width:100%}.collapsible.svelte-1jt2qa6{overflow:hidden;margin-top:1rem;margin-bottom:3rem;margin-left:1rem}.svelte-1jt2qa6::selection{border:0;background-color:lightblue}table.svelte-1jt2qa6{width:100%;border-collapse:collapse}th.svelte-1jt2qa6,td.svelte-1jt2qa6{border:0px solid black;padding:8px;text-align:left}.col-1.svelte-1jt2qa6{width:20%}.col-2.svelte-1jt2qa6{width:50%}.col-3.svelte-1jt2qa6{width:30%}.remrec_but.svelte-1jt2qa6{scale:2;width:25px;border-radius:35px;border:0;background-color:transparent;color:blue}.word_field.svelte-1jt2qa6{display:inline-block;box-sizing:border-box;margin-right:10px}.word_field.svelte-1jt2qa6:first-child{width:calc(\n      100% - 20% - 10% - 5px\n    )}.word_field.svelte-1jt2qa6:nth-last-child(-n + 2){width:calc(\n      20% - 20px\n    )}.save.svelte-1jt2qa6{margin-top:10px}textarea.svelte-1jt2qa6{width:100%;resize:none}.add-record.svelte-1jt2qa6{height:15px;border-radius:35px;border:0;scale:2;color:red}.dialog_name.svelte-1jt2qa6,.dialog_lang.svelte-1jt2qa6,.dialog_level.svelte-1jt2qa6{border:0}.container.svelte-1jt2qa6{display:flex;justify-content:space-between}.word_field.svelte-1jt2qa6{display:flex;flex-direction:column;margin-right:20px}.word_field.svelte-1jt2qa6:last-child{margin-right:0}",
  map: null
};
const ListenEdit = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $llang, $$unsubscribe_llang;
  let $langs, $$unsubscribe_langs;
  $$unsubscribe_llang = subscribe(llang, (value) => $llang = value);
  $$unsubscribe_langs = subscribe(langs, (value) => $langs = value);
  let { ChangeQuizName } = $$props;
  const abonent = getContext("abonent");
  const data = getContext("quiz_data");
  let words_data;
  data.name;
  let words = [], prompt;
  const output = `
  {original:'',example:'',translation:{ [${$langs}]: '',  en: '' }}
  `;
  fetch(`./lesson?listen=${data.name[$llang]}&owner=${abonent}&lang=${$llang}`).then((response) => response.json()).then((data2) => {
    words_data = data2.data.data;
    if (words_data) {
      words_data.map((item) => {
        words.push(item.original);
      });
    }
    fetch(`./admin?prompt=listen`).then((response) => response.json()).then((data3) => {
      prompt = data3.resp.system;
      prompt = prompt;
    }).catch((error) => {
      console.log(error);
    });
  }).catch((error) => {
    console.log(error);
    words_data = { content: [], lang: "" };
  });
  if ($$props.ChangeQuizName === void 0 && $$bindings.ChangeQuizName && ChangeQuizName !== void 0)
    $$bindings.ChangeQuizName(ChangeQuizName);
  $$result.css.add(css$3);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      if ($langs) {
        (async () => {
          await Translate("Words", "en", $langs);
          await Translate("Content", "en", $langs);
        })();
      }
    }
    {
      if ($langs && prompt) {
        prompt = prompt.replaceAll("${output}", output);
        prompt = prompt.replaceAll("${$llang}", $llang);
        prompt = prompt.replaceAll("${$langs}", $langs);
        prompt = prompt.replaceAll("${words}", words);
      }
    }
    $$rendered = `<div class="word_container svelte-1jt2qa6"><div class="container svelte-1jt2qa6"><div class="word_field svelte-1jt2qa6">${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ``;
      }
      return function(data2) {
        return ` <label for="dialog_name" class="svelte-1jt2qa6">${escape(data2)}:</label> `;
      }(__value);
    }(Translate("Название", "ru", $langs))} <input type="text" class="dialog_name svelte-1jt2qa6" name="dialog_name"${add_attribute("value", data.name[$llang], 0)}></div> ${data.level ? `<div class="word_field svelte-1jt2qa6">${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ``;
      }
      return function(data2) {
        return ` <label for="dialog_level" class="svelte-1jt2qa6">${escape(data2)}:</label> `;
      }(__value);
    }(Translate("Уровень", "ru", $langs))} <input type="text" class="dialog_level svelte-1jt2qa6" name="dialog_level"${add_attribute("value", data.level, 0)}></div>` : ``} ${$llang ? `<div class="word_field svelte-1jt2qa6">${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ``;
      }
      return function(data2) {
        return ` <label for="dialog_lang" class="svelte-1jt2qa6">${escape(data2)}:</label> `;
      }(__value);
    }(Translate("Язык", "ru", $langs))} <input type="text" class="dialog_lang svelte-1jt2qa6" name="dialog_lang"${add_attribute("value", $llang, 0)}></div>` : ``}</div> ${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ``;
      }
      return function(data2) {
        return ` <button class="content_generator svelte-1jt2qa6">${escape(data2)}</button> `;
      }(__value);
    }(Translate("Контент-генератор", "ru", $langs))} ${``} <br class="svelte-1jt2qa6"> <table class="svelte-1jt2qa6"><thead class="svelte-1jt2qa6"><tr class="svelte-1jt2qa6"><th class="col-1 svelte-1jt2qa6">${escape($llang)}</th> <th class="col-2 svelte-1jt2qa6" data-svelte-h="svelte-blrc0q">Example</th> <th class="col-3 svelte-1jt2qa6">${escape($langs)}</th></tr></thead> <tbody class="svelte-1jt2qa6">${words_data ? `${each(words_data, (item, index) => {
      return `<tr class="svelte-1jt2qa6"><td class="svelte-1jt2qa6">${item.original ? `<textarea rows="1" class="svelte-1jt2qa6">${escape(item.original || "")}</textarea> ${item.infinitive && item.infinitive !== item.original ? `<textarea rows="1" class="svelte-1jt2qa6">${escape(item.infinitive || "")}</textarea>` : ``}` : `<textarea rows="1" class="svelte-1jt2qa6"></textarea>`}</td> <td class="svelte-1jt2qa6">${item.example ? `<textarea rows="2" class="svelte-1jt2qa6">${escape(item.example || "")}</textarea>` : `<textarea rows="2" class="svelte-1jt2qa6"></textarea>`}</td> <td class="svelte-1jt2qa6">${item.translation && item.translation[$langs] ? `<textarea rows="1" class="svelte-1jt2qa6">${escape(item.translation[$langs] || "")}</textarea>` : ``}</td> <td class="svelte-1jt2qa6"><button class="remrec_but svelte-1jt2qa6"${add_attribute("index", index, 0)}>-</button></td> </tr>`;
    })}` : ``}</tbody></table> <div class="container svelte-1jt2qa6"><button class="add-record svelte-1jt2qa6" data-svelte-h="svelte-78bago">+</button> <div class="container svelte-1jt2qa6">${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ``;
      }
      return function(data2) {
        return ` <button class="save svelte-1jt2qa6">${escape(data2)}</button> `;
      }(__value);
    }(Translate("Сохранить", "ru", $langs))}</div></div> </div>`;
  } while (!$$settled);
  $$unsubscribe_llang();
  $$unsubscribe_langs();
  return $$rendered;
});
const css$2 = {
  code: "main.svelte-1srsjuq{text-align:center;width:90%;margin:0 auto}",
  map: null
};
const TextEdit = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const abonent = getContext("abonent");
  let { data } = $$props;
  data.words;
  let orig_text = "", text = "";
  async function init() {
    if (!orig_text)
      fetch(`/lesson?text=theme&level=${data.level}&theme=${data.theme}&title=${data.name}&abonent=${abonent}`).then((response) => response.json()).then((data2) => {
        orig_text = text = data2.data.text;
        fetchText();
      }).catch((error) => {
        console.log(error);
        return [];
      });
  }
  let active = "Words";
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css$2);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      if (data.name) {
        init();
      }
    }
    $$rendered = `<main class="svelte-1srsjuq"><div class="container"><div class="dialog-field"><label for="text_name" data-svelte-h="svelte-dthqwj">Название</label> <input type="text" class="text_name" name="text_name"${add_attribute("value", data.name, 0)}></div> ${data.level ? `<div class="dialog-field"><label for="dialog_level" data-svelte-h="svelte-ns9436">Уровень</label> <div class="dialog_level" name="dialog_level">${escape(data.level)}</div></div>` : ``} ${data.llang ? `<div class="dialog-field"><label for="dialog_lang" data-svelte-h="svelte-1ehkjlg">Язык</label> <div type="text" class="dialog_lang" name="dialog_lang">${escape(data.llang)}</div></div>` : ``}</div> <div class="accordion-container">${validate_component(Accordion, "Accordion").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(Panel, "Panel").$$render($$result, { class: "generator_container" }, {}, {
          default: () => {
            return `${validate_component(Header$1, "Header").$$render($$result, {}, {}, {
              default: () => {
                return `<h3 data-svelte-h="svelte-xz885d">Content-generator</h3> ${validate_component(IconButton, "IconButton").$$render($$result, { class: "material-icons" }, {}, {
                  default: () => {
                    return `${validate_component(CommonIcon, "Icon").$$render($$result, { tag: "svg", viewBox: "0 0 24 24" }, {}, {
                      default: () => {
                        return `<path fill="currentColor"${add_attribute("d", mdiChevronDownCircleOutline, 0)}></path>`;
                      }
                    })}`;
                  }
                })}`;
              }
            })} ${validate_component(Content, "Content").$$render($$result, {}, {}, {
              default: () => {
                return `${validate_component(TabBar, "TabBar").$$render(
                  $$result,
                  {
                    tabs: ["Format", "Words", "Prompt", "Content"],
                    active
                  },
                  {
                    active: ($$value) => {
                      active = $$value;
                      $$settled = false;
                    }
                  },
                  {
                    default: ({ tab }) => {
                      return `${validate_component(Tab, "Tab").$$render($$result, { tab, minWidth: true }, {}, {
                        default: () => {
                          return `${validate_component(CommonLabel, "Label").$$render($$result, {}, {}, {
                            default: () => {
                              return `${escape(tab)}`;
                            }
                          })}`;
                        }
                      })}`;
                    }
                  }
                )} ${active === "Format" ? `${validate_component(Paper, "Paper").$$render($$result, { variant: "unelevated" }, {}, {
                  default: () => {
                    return `${validate_component(Content, "Content").$$render($$result, {}, {}, {
                      default: () => {
                        return `<textarea rows="20" name="dialog_grammar">${escape("")}</textarea>`;
                      }
                    })}`;
                  }
                })}` : `${active === "Words" ? `${validate_component(Paper, "Paper").$$render($$result, { variant: "unelevated" }, {}, {
                  default: () => {
                    return `${validate_component(Content, "Content").$$render($$result, {}, {}, {
                      default: () => {
                        return `<textarea rows="20" name="dialog_words">${escape(data.words || "")}</textarea>`;
                      }
                    })}`;
                  }
                })}` : `${active === "Prompt" ? `${validate_component(Paper, "Paper").$$render($$result, { variant: "unelevated" }, {}, {
                  default: () => {
                    return `${validate_component(Content, "Content").$$render($$result, {}, {}, {
                      default: () => {
                        return `<textarea rows="20" name="dialog_task">${escape("")}</textarea>  <button class="copy_prompt" data-svelte-h="svelte-1s48hdj">Copy Prompt</button>`;
                      }
                    })}`;
                  }
                })}` : `${active === "Content" ? `${validate_component(Paper, "Paper").$$render($$result, { variant: "unelevated" }, {}, {
                  default: () => {
                    return `${validate_component(Content, "Content").$$render($$result, {}, {}, {
                      default: () => {
                        return `<textarea id="dialog_content" rows="10" name="dialog_content" placeholder="Run your favorite AI chat with the copied prompt and paste result here">${escape("")}</textarea> <button class="paste_content" data-svelte-h="svelte-1td7z66">Paste Content</button>`;
                      }
                    })}`;
                  }
                })}` : ``}`}`}`}`;
              }
            })}`;
          }
        })}`;
      }
    })}</div> <div class="accordion-container">${validate_component(Accordion, "Accordion").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(Panel, "Panel").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(Header$1, "Header").$$render($$result, {}, {}, {
              default: () => {
                return `<h3>${escape(data.name)}</h3> ${validate_component(IconButton, "IconButton").$$render($$result, { class: "material-icons" }, {}, {
                  default: () => {
                    return `${validate_component(CommonIcon, "Icon").$$render($$result, { tag: "svg", viewBox: "0 0 24 24" }, {}, {
                      default: () => {
                        return `<path fill="currentColor"${add_attribute("d", mdiChevronDownCircleOutline, 0)}></path>`;
                      }
                    })}`;
                  }
                })}`;
              }
            })} ${validate_component(Content, "Content").$$render($$result, { style: "line-height: 2.2;" }, {}, {
              default: () => {
                return `<div contenteditable class="text_container" style="${"height:" + escape(window.innerHeight, true) + ";"}"><!-- HTML_TAG_START -->${text}<!-- HTML_TAG_END --></div>`;
              }
            })}`;
          }
        })}`;
      }
    })}</div> </main>`;
  } while (!$$settled);
  return $$rendered;
});
const css$1 = {
  code: ".row.svelte-7g2az3{display:flex;align-items:center;gap:20px}.word_container.svelte-7g2az3{margin:10px}.content_generator.svelte-7g2az3{height:40px;margin-top:25px;width:100%}.collapsible.svelte-7g2az3{overflow:hidden;margin-top:1rem;margin-bottom:3rem;margin-left:1rem}.svelte-7g2az3::selection{border:0;background-color:lightblue}table.svelte-7g2az3{width:100%;border-collapse:collapse}th.svelte-7g2az3{border:0px solid black;padding:8px;text-align:left}.col-1.svelte-7g2az3{width:30%}.col-2.svelte-7g2az3{width:30%}.col-3.svelte-7g2az3{width:30%}.remrec_but.svelte-7g2az3{scale:2;width:25px;border-radius:35px;border:0;background-color:transparent;color:blue}.word_field.svelte-7g2az3{display:inline-block;box-sizing:border-box;margin-right:10px}.word_field.svelte-7g2az3:first-child{width:calc(\n      100% - 20% - 10% - 5px\n    )}.word_field.svelte-7g2az3:nth-last-child(-n + 2){width:calc(\n      20% - 20px\n    )}.save.svelte-7g2az3{margin-top:10px}textarea.svelte-7g2az3{width:100%;resize:none}.add-record.svelte-7g2az3{height:15px;border-radius:35px;border:0;scale:2;color:red}.dialog_name.svelte-7g2az3,.dialog_lang.svelte-7g2az3,.dialog_level.svelte-7g2az3{border:0}.container.svelte-7g2az3{display:flex;justify-content:space-between}.word_field.svelte-7g2az3{display:flex;flex-direction:column;margin-right:20px}.word_field.svelte-7g2az3:last-child{margin-right:0}",
  map: null
};
function handleSort$1(event, items) {
  const { oldIndex, newIndex } = event;
  function arrayMove(arr, fromIndex, toIndex) {
    const element = arr.splice(fromIndex, 1)[0];
    arr.splice(toIndex, 0, element);
    return arr;
  }
  items = arrayMove(items, oldIndex, newIndex);
}
const WordEdit = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $langs, $$unsubscribe_langs;
  let $llang, $$unsubscribe_llang;
  $$unsubscribe_langs = subscribe(langs, (value) => $langs = value);
  $$unsubscribe_llang = subscribe(llang, (value) => $llang = value);
  let { ChangeQuizName } = $$props;
  const abonent = getContext("abonent");
  const data = getContext("quiz_data");
  let words_data;
  data?.name[$llang];
  data?.module.themes[0].words || [];
  let prompt;
  const output = `
  {original:'',infinitive:'',example:'',translation:{ [${$langs}]: '',  en: '' }}
  `;
  LoadPrompt("basic");
  fetch(`./lesson?words=theme&name=${data.name[$llang]}&owner=${abonent}&level=${data.level}`).then((response) => response.json()).then((data2) => {
    words_data = data2.data.data || [];
    data2.data.context;
  }).catch((error) => {
    console.log(error);
    words_data = [];
  });
  function LoadPrompt(name2) {
    fetch(`/admin?prompt=words.${name2}`).then((response) => response.json()).then((data2) => {
      prompt = data2.resp.prompt.system;
      prompt = prompt;
    }).catch((error) => {
      console.log(error);
    });
  }
  if ($$props.ChangeQuizName === void 0 && $$bindings.ChangeQuizName && ChangeQuizName !== void 0)
    $$bindings.ChangeQuizName(ChangeQuizName);
  $$result.css.add(css$1);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      if ($langs && prompt) {
        prompt = prompt.replaceAll("${output}", output);
        prompt = prompt.replaceAll("${llang}", $llang);
        prompt = prompt.replaceAll("${langs}", $langs);
        prompt = prompt.replaceAll("${topic}", data.theme + "." + data.name[$llang]);
        prompt = prompt.replaceAll("${level}", data.level);
      }
    }
    $$rendered = `<div class="word_container svelte-7g2az3"><div class="container svelte-7g2az3"><div class="word_field svelte-7g2az3">${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ``;
      }
      return function(data2) {
        return ` <label for="dialog_name" class="svelte-7g2az3">${escape(data2)}:</label> `;
      }(__value);
    }(Translate("Название", "ru", $langs))} <input type="text" class="dialog_name svelte-7g2az3" name="dialog_name"${add_attribute("value", data.name[$llang], 0)}></div> ${data.level ? `<div class="word_field svelte-7g2az3">${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ``;
      }
      return function(data2) {
        return ` <label for="dialog_level" class="svelte-7g2az3">${escape(data2)}:</label> `;
      }(__value);
    }(Translate("Уровень", "ru", $langs))} <input type="text" class="dialog_level svelte-7g2az3" name="dialog_level"${add_attribute("value", data.level, 0)}></div>` : ``} ${$llang ? `<div class="word_field svelte-7g2az3">${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ``;
      }
      return function(data2) {
        return ` <label for="dialog_lang" class="svelte-7g2az3">${escape(data2)}:</label> `;
      }(__value);
    }(Translate("Язык", "ru", $langs))} <input type="text" class="dialog_lang svelte-7g2az3" name="dialog_lang"${add_attribute("value", $llang, 0)}></div>` : ``}</div> ${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ``;
      }
      return function(data2) {
        return ` <button class="content_generator svelte-7g2az3">${escape(data2)}</button> `;
      }(__value);
    }(Translate("Контент-генератор", "ru", $langs))} ${``} <br class="svelte-7g2az3"><br class="svelte-7g2az3"> <table class="svelte-7g2az3"><thead class="svelte-7g2az3"><tr class="svelte-7g2az3"><th class="col-1 svelte-7g2az3">${escape($llang)}</th> <th class="col-2 svelte-7g2az3">${escape($langs)}</th></tr></thead></table> ${words_data && words_data[0] ? `${validate_component(SortableList, "SortableList").$$render(
      $$result,
      {
        onSort: (ev) => {
          handleSort$1(ev, words_data);
        }
      },
      {},
      {
        default: () => {
          return `${each(words_data, (item, index) => {
            return ` <div class="row svelte-7g2az3"><textarea rows="2" class="svelte-7g2az3">${escape(item.example[$llang] || "")}</textarea> ${item.example[$llang] != item.example[$langs] ? `<textarea rows="2" class="svelte-7g2az3">${escape(item.example[$langs] || "")}</textarea>` : ``} <button class="remrec_but svelte-7g2az3"${add_attribute("index", index, 0)}>-</button> <br class="svelte-7g2az3"> </div>`;
          })}`;
        }
      }
    )}` : ``} <div class="container svelte-7g2az3"><button class="add-record svelte-7g2az3" data-svelte-h="svelte-78bago">+</button> <div class="container svelte-7g2az3">${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ``;
      }
      return function(data2) {
        return ` <button class="save svelte-7g2az3">${escape(data2)}</button> `;
      }(__value);
    }(Translate("Сохранить", "ru", $langs))}</div></div> </div>`;
  } while (!$$settled);
  $$unsubscribe_langs();
  $$unsubscribe_llang();
  return $$rendered;
});
const WordGameEdit = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return ``;
});
const Quiz = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $dc_state, $$unsubscribe_dc_state;
  let $call_but_status, $$unsubscribe_call_but_status;
  $$unsubscribe_dc_state = subscribe(dc_state, (value) => $dc_state = value);
  $$unsubscribe_call_but_status = subscribe(call_but_status, (value) => $call_but_status = value);
  let { data } = $$props;
  let { ChangeQuizName } = $$props;
  setContext("quiz_data", data);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.ChangeQuizName === void 0 && $$bindings.ChangeQuizName && ChangeQuizName !== void 0)
    $$bindings.ChangeQuizName(ChangeQuizName);
  $$unsubscribe_dc_state();
  $$unsubscribe_call_but_status();
  return ` ${data.quiz ? `${data.quiz.includes("dialog") ? `${validate_component(DialogEdit, "DialogEdit").$$render($$result, { ChangeQuizName }, {}, {})}` : `${data.quiz.includes("listen") ? `${validate_component(ListenEdit, "ListenEdit").$$render($$result, { data }, {}, {})}` : `${data.quiz === "text" ? `${validate_component(TextEdit, "TextEdit").$$render($$result, { data }, {}, {})}` : `${data.quiz === "word" ? `${$dc_state === "open" && $call_but_status === "talk" ? `${validate_component(WordGameEdit, "WordGameEdit").$$render($$result, { data }, {}, {})}` : `${validate_component(WordEdit, "WordEdit").$$render($$result, {}, {}, {})}`}` : ``}`}`}`}` : ``}`;
});
const css = {
  code: "main.svelte-z3kqxi.svelte-z3kqxi{margin-top:40px}.level_container.svelte-z3kqxi.svelte-z3kqxi{display:flex;justify-content:space-between;width:95%}.quiz_name.svelte-z3kqxi.svelte-z3kqxi{width:80%;margin-right:10px}.save.svelte-z3kqxi.svelte-z3kqxi{position:sticky;top:30px;margin:15px}.lesson-container.svelte-z3kqxi.svelte-z3kqxi{height:90vh;overflow-y:auto;overflow-x:hidden;max-width:100%;padding-top:10px;scrollbar-width:none;-ms-overflow-style:none}.quiz-container.svelte-z3kqxi.svelte-z3kqxi{display:flex;justify-content:space-between;align-items:center;padding:0px}.add_quiz.svelte-z3kqxi.svelte-z3kqxi,.add_theme.svelte-z3kqxi.svelte-z3kqxi,.add_module.svelte-z3kqxi.svelte-z3kqxi,.rem_quiz.svelte-z3kqxi.svelte-z3kqxi,.rem_theme.svelte-z3kqxi.svelte-z3kqxi,.rem_module.svelte-z3kqxi.svelte-z3kqxi{display:inline-flex;position:relative;background-color:aliceblue;border-radius:24px;width:24px;height:24px;scale:1.2}div.svelte-z3kqxi>.rem_quiz.svelte-z3kqxi,div.svelte-z3kqxi>.rem_theme.svelte-z3kqxi,div.svelte-z3kqxi>.rem_module.svelte-z3kqxi{display:flex;align-items:center}.rem_theme.svelte-z3kqxi.svelte-z3kqxi{position:absolute;right:0;top:5px}.add_theme.svelte-z3kqxi.svelte-z3kqxi{position:relative;top:10px}select.svelte-z3kqxi.svelte-z3kqxi{height:25px}input.svelte-z3kqxi.svelte-z3kqxi{border:0}.svelte-z3kqxi.svelte-z3kqxi::-moz-selection{background-color:grey;outline:none}.svelte-z3kqxi.svelte-z3kqxi::selection{background-color:lightblue;outline:none}.svelte-z3kqxi.svelte-z3kqxi::placeholder{font-weight:400}div.svelte-z3kqxi.svelte-z3kqxi:focus,input.svelte-z3kqxi.svelte-z3kqxi:focus{outline:none}select.svelte-z3kqxi.svelte-z3kqxi{border:0;background-color:lightgray}option.svelte-z3kqxi.svelte-z3kqxi{font-size:larger}",
  map: null
};
function handleSort(event, items2) {
  const { oldIndex, newIndex } = event;
  function arrayMove(arr, fromIndex, toIndex) {
    const element = arr.splice(fromIndex, 1)[0];
    arr.splice(toIndex, 0, element);
    return arr;
  }
  items2 = arrayMove(items2, oldIndex, newIndex);
}
const ModuleEditor = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $llang, $$unsubscribe_llang;
  let $view, $$unsubscribe_view;
  let $langs, $$unsubscribe_langs;
  $$unsubscribe_llang = subscribe(llang, (value) => $llang = value);
  $$unsubscribe_view = subscribe(view, (value) => $view = value);
  $$unsubscribe_langs = subscribe(langs, (value) => $langs = value);
  let menu;
  let { abonent } = $$props;
  setContext("abonent", abonent);
  let llang_input;
  let theme_sort_list, quiz_sort_list;
  let lesson_data = { data: { level: "" } };
  let levels = [];
  let module_input;
  const quizes = ["выбери quiz...", "listen", "dialog", "word"];
  async function fetchLesson(owner, level2) {
    try {
      let lev_str = level2 ? "&level=" + level2 : "";
      const response = await fetch(`./lesson?lesson=${abonent}&owner=${abonent}` + lev_str);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const resp = await response.json();
      set_store_value(llang, $llang = resp.lang, $llang);
      return resp;
    } catch (error) {
      return [];
    }
  }
  onDestroy(() => {
  });
  function findDeep(obj, predicate, path = "") {
    if (predicate(obj, path)) {
      return obj;
    }
    if (pkg.isObject(obj)) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          let found = findDeep(obj[key], predicate, `${path}.${key}`);
          if (found) {
            return found;
          }
        }
      }
    }
    return null;
  }
  function ChangeQuizName(name, new_name) {
    let item = findDeep(lesson_data.data.module, (value2) => value2.name === name, { childrenPath: "quizes" });
    if (item) {
      item.name = new_name;
    }
    lesson_data = lesson_data;
  }
  if ($$props.abonent === void 0 && $$bindings.abonent && abonent !== void 0)
    $$bindings.abonent(abonent);
  if ($$props.fetchLesson === void 0 && $$bindings.fetchLesson && fetchLesson !== void 0)
    $$bindings.fetchLesson(fetchLesson);
  if ($$props.findDeep === void 0 && $$bindings.findDeep && findDeep !== void 0)
    $$bindings.findDeep(findDeep);
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      if (lesson_data.data) {
        levels = lesson_data.levels;
      }
    }
    $$rendered = `<main class="svelte-z3kqxi">${$view === "quiz" ? `${validate_component(Quiz, "Quiz").$$render($$result, { data: lesson_data.data, ChangeQuizName }, {}, {})}` : `${lesson_data.data && lesson_data.data.module ? ` <div style="height:1500px; margin-top:20px" class="svelte-z3kqxi"><div class="level_container svelte-z3kqxi" style="">${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ``;
      }
      return function(data) {
        return ` <button class="save svelte-z3kqxi">${escape(data)}</button> `;
      }(__value);
    }(Translate("Save", "en", $langs))} <div class="svelte-z3kqxi"><div class="add_module svelte-z3kqxi" style="display:inline-flex">${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ``;
      }
      return function(data) {
        return ` ${validate_component(IconButton, "IconButton").$$render($$result, { class: "material-icons", title: data }, {}, {
          default: () => {
            return `add`;
          }
        })}`;
      }(__value);
    }(Translate("Добавить модуль", "ru", $langs))}</div> ${validate_component(Textfield, "Textfield").$$render(
      $$result,
      {
        class: "module_text",
        style: "width:50px; text-align:center",
        value: lesson_data.level,
        label: "Module",
        this: module_input
      },
      {
        this: ($$value) => {
          module_input = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${validate_component(Textfield, "Textfield").$$render(
      $$result,
      {
        class: "module_text",
        style: "display:inline-flex; width:55px;text-align:center",
        label: "Language",
        this: llang_input,
        value: $llang
      },
      {
        this: ($$value) => {
          llang_input = $$value;
          $$settled = false;
        },
        value: ($$value) => {
          $llang = $$value;
          $$settled = false;
        }
      },
      {}
    )} <div class="rem_module svelte-z3kqxi" style="display:inline-flex">${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ``;
      }
      return function(data) {
        return ` ${validate_component(IconButton, "IconButton").$$render(
          $$result,
          {
            class: "material-icons rem_module",
            title: data
          },
          {},
          {
            default: () => {
              return `remove`;
            }
          }
        )} `;
      }(__value);
    }(Translate("Удалить модуль", "ru", $langs))}</div> ${validate_component(Menu, "Menu").$$render(
      $$result,
      { this: menu },
      {
        this: ($$value) => {
          menu = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(List, "List").$$render($$result, {}, {}, {
            default: () => {
              return `${each(levels, (level) => {
                return `${validate_component(Item, "Item").$$render($$result, { level, style: "text-align:center" }, {}, {
                  default: () => {
                    return `${validate_component(Text, "Text").$$render($$result, {}, {}, {
                      default: () => {
                        return `${escape(level)}`;
                      }
                    })} `;
                  }
                })}`;
              })}`;
            }
          })}`;
        }
      }
    )}</div></div> <div class="lesson-container svelte-z3kqxi" style="">${validate_component(SortableList, "SortableList").$$render(
      $$result,
      {
        onSort: (ev) => {
          handleSort(ev, lesson_data.data.module.themes);
        },
        this: theme_sort_list
      },
      {
        this: ($$value) => {
          theme_sort_list = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${each(lesson_data.data.module.themes, (theme, t) => {
            return `<div class="accordion-container svelte-z3kqxi">${validate_component(Accordion, "Accordion").$$render($$result, { multiple: true }, {}, {
              default: () => {
                return `${validate_component(Panel, "Panel").$$render($$result, { class: "panel" }, {}, {
                  default: () => {
                    return `${validate_component(Header$1, "Header").$$render($$result, {}, {}, {
                      default: () => {
                        return `  ${function(__value) {
                          if (is_promise(__value)) {
                            __value.then(null, noop);
                            return ``;
                          }
                          return function(data) {
                            return ` <input${add_attribute("placeholder", data, 0)} style="font-weight: bold; width:90%" class="svelte-z3kqxi"${add_attribute("value", theme.name[$llang], 0)}>  `;
                          }(__value);
                        }(Translate("Input Theme Name", "en", $langs))} <div class="rem_theme svelte-z3kqxi">${function(__value) {
                          if (is_promise(__value)) {
                            __value.then(null, noop);
                            return ``;
                          }
                          return function(data) {
                            return ` ${validate_component(IconButton, "IconButton").$$render(
                              $$result,
                              {
                                class: "material-icons",
                                title: data,
                                name: theme.name[$llang]
                              },
                              {},
                              {
                                default: () => {
                                  return `remove`;
                                }
                              }
                            )} `;
                          }(__value);
                        }(Translate("Remove theme", "en", $langs))}</div> `;
                      }
                    })} ${validate_component(Content, "Content").$$render($$result, {}, {}, {
                      default: () => {
                        return `${theme.lessons ? `${each(theme.lessons, (lesson2) => {
                          return ` ${lesson2.quizes ? `${validate_component(SortableList, "SortableList").$$render(
                            $$result,
                            {
                              onSort: (ev) => {
                                handleSort(ev, lesson2.quizes);
                              },
                              this: quiz_sort_list
                            },
                            {
                              this: ($$value) => {
                                quiz_sort_list = $$value;
                                $$settled = false;
                              }
                            },
                            {
                              default: () => {
                                return `${each(lesson2.quizes, (quiz, q) => {
                                  return ` <div class="quiz-container svelte-z3kqxi">${validate_component(Checkbox, "Checkbox").$$render(
                                    $$result,
                                    {
                                      checked: quiz.published ? "true" : "",
                                      touch: true
                                    },
                                    {},
                                    {}
                                  )} <div${add_attribute("type", quiz.type, 0)}${add_attribute("name", quiz.name[$llang], 0)}${add_attribute("level", lesson_data.data.module.level, 0)}${add_attribute("highlight", quiz.highlight || "", 0)} class="svelte-z3kqxi">${quiz.type === "dialog" ? `${validate_component(CommonIcon, "Icon").$$render(
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
                                        return `<path fill="grey"${add_attribute("d", mdiAccountMultiple, 0)} class="svelte-z3kqxi"></path> `;
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
                                        return `<path fill="grey"${add_attribute("d", mdiTextBoxOutline, 0)} class="svelte-z3kqxi"></path> `;
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
                                        return `<path fill="grey"${add_attribute("d", mdiFileWordBoxOutline, 0)} class="svelte-z3kqxi"></path> `;
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
                                        return `<path fill="grey"${add_attribute("d", mdiEarHearing, 0)} class="svelte-z3kqxi"></path> `;
                                      }
                                    }
                                  )}` : `${quiz.type === "quiz" ? `<select${add_attribute("name", quiz.name[$llang], 0)} class="svelte-z3kqxi">${each(quizes, (quizOption) => {
                                    return `<option${add_attribute("value", quizOption, 0)} class="svelte-z3kqxi">${escape(quizOption)}</option>`;
                                  })}</select>` : ``}`}`}`}`}</div>  ${quiz.type === "quiz" ? `${function(__value) {
                                    if (is_promise(__value)) {
                                      __value.then(null, noop);
                                      return ``;
                                    }
                                    return function(data) {
                                      return ` <input class="quiz_name svelte-z3kqxi" autofocus contenteditable${add_attribute("t", t, 0)}${add_attribute("placeholder", data, 0)}${add_attribute("name", quiz.name[$langs], 0)}${add_attribute("theme", theme.num, 0)}${add_attribute("theme_name", theme.name[$llang], 0)}${add_attribute("value", quiz.name[$langs], 0)}> `;
                                    }(__value);
                                  }(Translate("Quiz Name", $llang, $langs))}` : `${function(__value) {
                                    if (is_promise(__value)) {
                                      __value.then(null, noop);
                                      return ``;
                                    }
                                    return function(data) {
                                      return ` <input style="width:80%"${add_attribute("t", t, 0)}${add_attribute("placeholder", data, 0)}${add_attribute("name", quiz.name[$llang], 0)}${add_attribute("level", lesson_data.data.level, 0)}${add_attribute("theme", theme.num, 0)}${add_attribute("theme_name", theme.name[$llang], 0)} class="svelte-z3kqxi"${add_attribute("value", quiz.name[$llang], 0)}> `;
                                    }(__value);
                                  }(Translate("Quiz Name", $llang, $langs))}`} <div class="rem_quiz svelte-z3kqxi">${function(__value) {
                                    if (is_promise(__value)) {
                                      __value.then(null, noop);
                                      return ``;
                                    }
                                    return function(data) {
                                      return ` ${validate_component(IconButton, "IconButton").$$render(
                                        $$result,
                                        {
                                          class: "material-icons",
                                          title: data,
                                          name: quiz.name[$llang]
                                        },
                                        {},
                                        {
                                          default: () => {
                                            return `remove`;
                                          }
                                        }
                                      )} `;
                                    }(__value);
                                  }(Translate("Remove quiz", "en", $langs))}</div> </div>`;
                                })} `;
                              }
                            }
                          )}` : ``}`;
                        })} <div class="add_quiz svelte-z3kqxi" style="left:10px">${function(__value) {
                          if (is_promise(__value)) {
                            __value.then(null, noop);
                            return ``;
                          }
                          return function(data) {
                            return ` ${validate_component(IconButton, "IconButton").$$render(
                              $$result,
                              {
                                class: "material-icons",
                                title: data,
                                name: theme.name[$llang]
                              },
                              {},
                              {
                                default: () => {
                                  return `add`;
                                }
                              }
                            )} `;
                          }(__value);
                        }(Translate("Add quiz", "en", $langs))} </div>` : ``} `;
                      }
                    })} `;
                  }
                })} `;
              }
            })} </div>`;
          })}`;
        }
      }
    )} ${lesson_data.level && $llang !== " " ? `<div class="add_theme svelte-z3kqxi">${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ``;
      }
      return function(data) {
        return ` ${validate_component(IconButton, "IconButton").$$render($$result, { class: "material-icons", title: data }, {}, {
          default: () => {
            return `add`;
          }
        })} `;
      }(__value);
    }(Translate("Add theme", "en", $langs))}</div>` : ``}</div> <div style="height:100px" class="svelte-z3kqxi"></div></div>` : ``}`} </main>`;
  } while (!$$settled);
  $$unsubscribe_llang();
  $$unsubscribe_view();
  $$unsubscribe_langs();
  return $$rendered;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $langs, $$unsubscribe_langs;
  let $nlang, $$unsubscribe_nlang;
  let $dicts, $$unsubscribe_dicts;
  let $view, $$unsubscribe_view;
  $$unsubscribe_langs = subscribe(langs, (value) => $langs = value);
  $$unsubscribe_nlang = subscribe(nlang, (value) => $nlang = value);
  $$unsubscribe_dicts = subscribe(dicts, (value) => $dicts = value);
  $$unsubscribe_view = subscribe(view, (value) => $view = value);
  let { data } = $$props;
  let operator = data.operator, abonent = data.abonent;
  data.name;
  if (data.lang) {
    set_store_value(nlang, $nlang = data.lang, $nlang);
    set_store_value(langs, $langs = data.lang, $langs);
  }
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  {
    if (data.dict[0]) {
      set_store_value(dicts, $dicts = data.dict[0], $dicts);
      setContext("dict", new Dict(data.dict[0]));
    }
  }
  $$unsubscribe_langs();
  $$unsubscribe_nlang();
  $$unsubscribe_dicts();
  $$unsubscribe_view();
  return `${operator ? `${validate_component(Header, "Header").$$render($$result, {}, {}, {})} ${$view === "group" ? `${validate_component(GroupEditor, "GroupEditor").$$render($$result, { data }, {}, {})}` : `${$view === "lesson" || $view === "quiz" ? ` ${validate_component(ModuleEditor, "ModuleEditor").$$render($$result, { abonent }, {}, {})}` : ``}`}` : `${validate_component(Login, "Login").$$render($$result, { operator, abonent }, {}, {})}`}`;
});
export {
  Page as default
};
