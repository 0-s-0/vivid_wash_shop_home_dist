import { defineComponent, ref, withAsyncContext, unref, computed, toValue, reactive, createVNode, mergeProps, withCtx, createTextVNode, toDisplayString, useAttrs, getCurrentInstance, provide, watchEffect, inject, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrRenderList, ssrRenderSlot } from 'vue/server-renderer';
import { K as hash, C as defu } from '../nitro/nitro.mjs';
import { g as useRoute$1, f as useI18n, e as useHead, a as useNuxtApp, i as fetchDefaults, k as useRequestFetch, b as useRuntimeConfig, l as withLeadingSlash, h as hasProtocol, j as joinURL, m as parseURL, o as encodeParam, q as encodePath } from './server.mjs';
import { _ as __nuxt_component_1, u as useAsyncData } from './index-CUutJytn.mjs';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import { isPlainObject } from '@vue/shared';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@intlify/utils';
import 'vue-router';
import 'node:url';
import '@iconify/utils';
import 'consola';
import 'ipx';
import '@iconify/vue';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import '@iconify/utils/lib/css/icon';
import 'perfect-debounce';

function useFetch(request, arg1, arg2) {
  const [opts = {}, autoKey] = [{}, arg1];
  const _request = computed(() => toValue(request));
  const key = computed(() => toValue(opts.key) || "$f" + hash([autoKey, typeof _request.value === "string" ? _request.value : "", ...generateOptionSegments(opts)]));
  if (!opts.baseURL && typeof _request.value === "string" && (_request.value[0] === "/" && _request.value[1] === "/")) {
    throw new Error('[nuxt] [useFetch] the request URL must not start with "//".');
  }
  const {
    server,
    lazy,
    default: defaultFn,
    transform,
    pick,
    watch: watchSources,
    immediate,
    getCachedData,
    deep,
    dedupe,
    ...fetchOptions
  } = opts;
  const _fetchOptions = reactive({
    ...fetchDefaults,
    ...fetchOptions,
    cache: typeof opts.cache === "boolean" ? void 0 : opts.cache
  });
  const _asyncDataOptions = {
    server,
    lazy,
    default: defaultFn,
    transform,
    pick,
    immediate,
    getCachedData,
    deep,
    dedupe,
    watch: watchSources === false ? [] : [...watchSources || [], _fetchOptions]
  };
  let controller;
  const asyncData = useAsyncData(watchSources === false ? key.value : key, () => {
    controller?.abort?.(new DOMException("Request aborted as another request to the same endpoint was initiated.", "AbortError"));
    controller = typeof AbortController !== "undefined" ? new AbortController() : {};
    const timeoutLength = toValue(opts.timeout);
    let timeoutId;
    if (timeoutLength) {
      timeoutId = setTimeout(() => controller.abort(new DOMException("Request aborted due to timeout.", "AbortError")), timeoutLength);
      controller.signal.onabort = () => clearTimeout(timeoutId);
    }
    let _$fetch = opts.$fetch || globalThis.$fetch;
    if (!opts.$fetch) {
      const isLocalFetch = typeof _request.value === "string" && _request.value[0] === "/" && (!toValue(opts.baseURL) || toValue(opts.baseURL)[0] === "/");
      if (isLocalFetch) {
        _$fetch = useRequestFetch();
      }
    }
    return _$fetch(_request.value, { signal: controller.signal, ..._fetchOptions }).finally(() => {
      clearTimeout(timeoutId);
    });
  }, _asyncDataOptions);
  return asyncData;
}
function generateOptionSegments(opts) {
  const segments = [
    toValue(opts.method)?.toUpperCase() || "GET",
    toValue(opts.baseURL)
  ];
  for (const _obj of [opts.params || opts.query]) {
    const obj = toValue(_obj);
    if (!obj) {
      continue;
    }
    const unwrapped = {};
    for (const [key, value] of Object.entries(obj)) {
      unwrapped[toValue(key)] = toValue(value);
    }
    segments.push(unwrapped);
  }
  if (opts.body) {
    const value = toValue(opts.body);
    if (!value) {
      segments.push(hash(value));
    } else if (value instanceof ArrayBuffer) {
      segments.push(hash(Object.fromEntries([...new Uint8Array(value).entries()].map(([k, v]) => [k, v.toString()]))));
    } else if (value instanceof FormData) {
      const obj = {};
      for (const entry of value.entries()) {
        const [key, val] = entry;
        obj[key] = val instanceof File ? val.name : val;
      }
      segments.push(hash(obj));
    } else if (isPlainObject(value)) {
      segments.push(hash(reactive(value)));
    } else {
      try {
        segments.push(hash(value));
      } catch {
        console.warn("[useFetch] Failed to hash body", value);
      }
    }
  }
  return segments;
}
const extend = Object.assign;
const isObject = (val) => val !== null && typeof val === "object";
const isDef = (val) => val !== void 0 && val !== null;
const isFunction = (val) => typeof val === "function";
const isNumeric = (val) => typeof val === "number" || /^\d+(\.\d+)?$/.test(val);
function get(object, path) {
  const keys = path.split(".");
  let result = object;
  keys.forEach((key) => {
    var _a;
    result = isObject(result) ? (_a = result[key]) != null ? _a : "" : "";
  });
  return result;
}
const numericProp = [Number, String];
const truthProp = {
  type: Boolean,
  default: true
};
const makeStringProp = (defaultVal) => ({
  type: String,
  default: defaultVal
});
var width;
var height;
function useWindowSize() {
  if (!width) {
    width = ref(0);
    height = ref(0);
  }
  return { width, height };
}
function preventDefault(event, isStopPropagation) {
  if (typeof event.cancelable !== "boolean" || event.cancelable) {
    event.preventDefault();
  }
}
useWindowSize();
function addUnit(value) {
  if (isDef(value)) {
    return isNumeric(value) ? `${value}px` : String(value);
  }
  return void 0;
}
function getSizeStyle(originSize) {
  if (isDef(originSize)) {
    if (Array.isArray(originSize)) {
      return {
        width: addUnit(originSize[0]),
        height: addUnit(originSize[1])
      };
    }
    const size = addUnit(originSize);
    return {
      width: size,
      height: size
    };
  }
}
const camelizeRE = /-(\w)/g;
const camelize = (str) => str.replace(camelizeRE, (_, c) => c.toUpperCase());
const kebabCase = (str) => str.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, "");
const { hasOwnProperty } = Object.prototype;
function assignKey(to, from, key) {
  const val = from[key];
  if (!isDef(val)) {
    return;
  }
  if (!hasOwnProperty.call(to, key) || !isObject(val)) {
    to[key] = val;
  } else {
    to[key] = deepAssign(Object(to[key]), val);
  }
}
function deepAssign(to, from) {
  Object.keys(from).forEach((key) => {
    assignKey(to, from, key);
  });
  return to;
}
var stdin_default$6 = {
  name: "姓名",
  tel: "电话",
  save: "保存",
  clear: "清空",
  cancel: "取消",
  confirm: "确认",
  delete: "删除",
  loading: "加载中...",
  noCoupon: "暂无优惠券",
  nameEmpty: "请填写姓名",
  addContact: "添加联系人",
  telInvalid: "请填写正确的电话",
  vanCalendar: {
    end: "结束",
    start: "开始",
    title: "日期选择",
    weekdays: ["日", "一", "二", "三", "四", "五", "六"],
    monthTitle: (year, month) => `${year}年${month}月`,
    rangePrompt: (maxRange) => `最多选择 ${maxRange} 天`
  },
  vanCascader: {
    select: "请选择"
  },
  vanPagination: {
    prev: "上一页",
    next: "下一页"
  },
  vanPullRefresh: {
    pulling: "下拉即可刷新...",
    loosing: "释放即可刷新..."
  },
  vanSubmitBar: {
    label: "合计:"
  },
  vanCoupon: {
    unlimited: "无门槛",
    discount: (discount) => `${discount}折`,
    condition: (condition) => `满${condition}元可用`
  },
  vanCouponCell: {
    title: "优惠券",
    count: (count) => `${count}张可用`
  },
  vanCouponList: {
    exchange: "兑换",
    close: "不使用",
    enable: "可用",
    disabled: "不可用",
    placeholder: "输入优惠码"
  },
  vanAddressEdit: {
    area: "地区",
    areaEmpty: "请选择地区",
    addressEmpty: "请填写详细地址",
    addressDetail: "详细地址",
    defaultAddress: "设为默认收货地址"
  },
  vanAddressList: {
    add: "新增地址"
  }
};
const lang = ref("zh-CN");
const messages = reactive({
  "zh-CN": stdin_default$6
});
const Locale = {
  messages() {
    return messages[lang.value];
  },
  use(newLang, newMessages) {
    lang.value = newLang;
    this.add({ [newLang]: newMessages });
  },
  add(newMessages = {}) {
    deepAssign(messages, newMessages);
  }
};
var stdin_default$5 = Locale;
function createTranslate(name2) {
  const prefix = camelize(name2) + ".";
  return (path, ...args) => {
    const messages2 = stdin_default$5.messages();
    const message = get(messages2, prefix + path) || get(messages2, path);
    return isFunction(message) ? message(...args) : message;
  };
}
function genBem(name2, mods) {
  if (!mods) {
    return "";
  }
  if (typeof mods === "string") {
    return ` ${name2}--${mods}`;
  }
  if (Array.isArray(mods)) {
    return mods.reduce(
      (ret, item) => ret + genBem(name2, item),
      ""
    );
  }
  return Object.keys(mods).reduce(
    (ret, key) => ret + (mods[key] ? genBem(name2, key) : ""),
    ""
  );
}
function createBEM(name2) {
  return (el, mods) => {
    if (el && typeof el !== "string") {
      mods = el;
      el = "";
    }
    el = el ? `${name2}__${el}` : name2;
    return `${el}${genBem(el, mods)}`;
  };
}
function createNamespace(name2) {
  const prefixedName = `van-${name2}`;
  return [
    prefixedName,
    createBEM(prefixedName),
    createTranslate(prefixedName)
  ];
}
const BORDER = "van-hairline";
const BORDER_SURROUND = `${BORDER}--surround`;
function withInstall(options) {
  options.install = (app) => {
    const { name: name2 } = options;
    if (name2) {
      app.component(name2, options);
      app.component(camelize(`-${name2}`), options);
    }
  };
  return options;
}
const routeProps = {
  to: [String, Object],
  url: String,
  replace: Boolean
};
function route({
  to,
  url,
  replace,
  $router: router
}) {
  if (to && router) {
    router[replace ? "replace" : "push"](to);
  } else if (url) {
    replace ? (void 0).replace(url) : (void 0).href = url;
  }
}
function useRoute() {
  const vm = getCurrentInstance().proxy;
  return () => route(vm);
}
const [name$5, bem$5] = createNamespace("badge");
const badgeProps = {
  dot: Boolean,
  max: numericProp,
  tag: makeStringProp("div"),
  color: String,
  offset: Array,
  content: numericProp,
  showZero: truthProp,
  position: makeStringProp("top-right")
};
var stdin_default$4 = defineComponent({
  name: name$5,
  props: badgeProps,
  setup(props, {
    slots
  }) {
    const hasContent = () => {
      if (slots.content) {
        return true;
      }
      const {
        content,
        showZero
      } = props;
      return isDef(content) && content !== "" && (showZero || content !== 0 && content !== "0");
    };
    const renderContent = () => {
      const {
        dot,
        max,
        content
      } = props;
      if (!dot && hasContent()) {
        if (slots.content) {
          return slots.content();
        }
        if (isDef(max) && isNumeric(content) && +content > +max) {
          return `${max}+`;
        }
        return content;
      }
    };
    const getOffsetWithMinusString = (val) => val.startsWith("-") ? val.replace("-", "") : `-${val}`;
    const style = computed(() => {
      const style2 = {
        background: props.color
      };
      if (props.offset) {
        const [x, y] = props.offset;
        const {
          position
        } = props;
        const [offsetY, offsetX] = position.split("-");
        if (slots.default) {
          if (typeof y === "number") {
            style2[offsetY] = addUnit(offsetY === "top" ? y : -y);
          } else {
            style2[offsetY] = offsetY === "top" ? addUnit(y) : getOffsetWithMinusString(y);
          }
          if (typeof x === "number") {
            style2[offsetX] = addUnit(offsetX === "left" ? x : -x);
          } else {
            style2[offsetX] = offsetX === "left" ? addUnit(x) : getOffsetWithMinusString(x);
          }
        } else {
          style2.marginTop = addUnit(y);
          style2.marginLeft = addUnit(x);
        }
      }
      return style2;
    });
    const renderBadge = () => {
      if (hasContent() || props.dot) {
        return createVNode("div", {
          "class": bem$5([props.position, {
            dot: props.dot,
            fixed: !!slots.default
          }]),
          "style": style.value
        }, [renderContent()]);
      }
    };
    return () => {
      if (slots.default) {
        const {
          tag
        } = props;
        return createVNode(tag, {
          "class": bem$5("wrapper")
        }, {
          default: () => [slots.default(), renderBadge()]
        });
      }
      return renderBadge();
    };
  }
});
const Badge = withInstall(stdin_default$4);
const setGlobalZIndex = (val) => {
};
const [name$4, bem$4] = createNamespace("config-provider");
const CONFIG_PROVIDER_KEY = Symbol(name$4);
const configProviderProps = {
  tag: makeStringProp("div"),
  theme: makeStringProp("light"),
  zIndex: Number,
  themeVars: Object,
  themeVarsDark: Object,
  themeVarsLight: Object,
  themeVarsScope: makeStringProp("local"),
  iconPrefix: String
};
function insertDash(str) {
  return str.replace(/([a-zA-Z])(\d)/g, "$1-$2");
}
function mapThemeVarsToCSSVars(themeVars) {
  const cssVars = {};
  Object.keys(themeVars).forEach((key) => {
    const formattedKey = insertDash(kebabCase(key));
    cssVars[`--van-${formattedKey}`] = themeVars[key];
  });
  return cssVars;
}
defineComponent({
  name: name$4,
  props: configProviderProps,
  setup(props, {
    slots
  }) {
    const style = computed(() => mapThemeVarsToCSSVars(extend({}, props.themeVars, props.theme === "dark" ? props.themeVarsDark : props.themeVarsLight)));
    provide(CONFIG_PROVIDER_KEY, props);
    watchEffect(() => {
      if (props.zIndex !== void 0) {
        setGlobalZIndex(props.zIndex);
      }
    });
    return () => createVNode(props.tag, {
      "class": bem$4(),
      "style": props.themeVarsScope === "local" ? style.value : void 0
    }, {
      default: () => {
        var _a;
        return [(_a = slots.default) == null ? void 0 : _a.call(slots)];
      }
    });
  }
});
const [name$3, bem$3] = createNamespace("icon");
const isImage = (name2) => name2 == null ? void 0 : name2.includes("/");
const iconProps = {
  dot: Boolean,
  tag: makeStringProp("i"),
  name: String,
  size: numericProp,
  badge: numericProp,
  color: String,
  badgeProps: Object,
  classPrefix: String
};
var stdin_default$3 = defineComponent({
  name: name$3,
  props: iconProps,
  setup(props, {
    slots
  }) {
    const config = inject(CONFIG_PROVIDER_KEY, null);
    const classPrefix = computed(() => props.classPrefix || (config == null ? void 0 : config.iconPrefix) || bem$3());
    return () => {
      const {
        tag,
        dot,
        name: name2,
        size,
        badge,
        color
      } = props;
      const isImageIcon = isImage(name2);
      return createVNode(Badge, mergeProps({
        "dot": dot,
        "tag": tag,
        "class": [classPrefix.value, isImageIcon ? "" : `${classPrefix.value}-${name2}`],
        "style": {
          color,
          fontSize: addUnit(size)
        },
        "content": badge
      }, props.badgeProps), {
        default: () => {
          var _a;
          return [(_a = slots.default) == null ? void 0 : _a.call(slots), isImageIcon && createVNode("img", {
            "class": bem$3("image"),
            "src": name2
          }, null)];
        }
      });
    };
  }
});
const Icon = withInstall(stdin_default$3);
const [name$2, bem$2] = createNamespace("loading");
const SpinIcon = Array(12).fill(null).map((_, index) => createVNode("i", {
  "class": bem$2("line", String(index + 1))
}, null));
const CircularIcon = createVNode("svg", {
  "class": bem$2("circular"),
  "viewBox": "25 25 50 50"
}, [createVNode("circle", {
  "cx": "50",
  "cy": "50",
  "r": "20",
  "fill": "none"
}, null)]);
const loadingProps = {
  size: numericProp,
  type: makeStringProp("circular"),
  color: String,
  vertical: Boolean,
  textSize: numericProp,
  textColor: String
};
var stdin_default$2 = defineComponent({
  name: name$2,
  props: loadingProps,
  setup(props, {
    slots
  }) {
    const spinnerStyle = computed(() => extend({
      color: props.color
    }, getSizeStyle(props.size)));
    const renderIcon = () => {
      const DefaultIcon = props.type === "spinner" ? SpinIcon : CircularIcon;
      return createVNode("span", {
        "class": bem$2("spinner", props.type),
        "style": spinnerStyle.value
      }, [slots.icon ? slots.icon() : DefaultIcon]);
    };
    const renderText = () => {
      var _a;
      if (slots.default) {
        return createVNode("span", {
          "class": bem$2("text"),
          "style": {
            fontSize: addUnit(props.textSize),
            color: (_a = props.textColor) != null ? _a : props.color
          }
        }, [slots.default()]);
      }
    };
    return () => {
      const {
        type,
        vertical
      } = props;
      return createVNode("div", {
        "class": bem$2([type, {
          vertical
        }]),
        "aria-live": "polite",
        "aria-busy": true
      }, [renderIcon(), renderText()]);
    };
  }
});
const Loading = withInstall(stdin_default$2);
const [name$1, bem$1] = createNamespace("button");
const buttonProps = extend({}, routeProps, {
  tag: makeStringProp("button"),
  text: String,
  icon: String,
  type: makeStringProp("default"),
  size: makeStringProp("normal"),
  color: String,
  block: Boolean,
  plain: Boolean,
  round: Boolean,
  square: Boolean,
  loading: Boolean,
  hairline: Boolean,
  disabled: Boolean,
  iconPrefix: String,
  nativeType: makeStringProp("button"),
  loadingSize: numericProp,
  loadingText: String,
  loadingType: String,
  iconPosition: makeStringProp("left")
});
var stdin_default$1 = defineComponent({
  name: name$1,
  props: buttonProps,
  emits: ["click"],
  setup(props, {
    emit,
    slots
  }) {
    const route2 = useRoute();
    const renderLoadingIcon = () => {
      if (slots.loading) {
        return slots.loading();
      }
      return createVNode(Loading, {
        "size": props.loadingSize,
        "type": props.loadingType,
        "class": bem$1("loading")
      }, null);
    };
    const renderIcon = () => {
      if (props.loading) {
        return renderLoadingIcon();
      }
      if (slots.icon) {
        return createVNode("div", {
          "class": bem$1("icon")
        }, [slots.icon()]);
      }
      if (props.icon) {
        return createVNode(Icon, {
          "name": props.icon,
          "class": bem$1("icon"),
          "classPrefix": props.iconPrefix
        }, null);
      }
    };
    const renderText = () => {
      let text;
      if (props.loading) {
        text = props.loadingText;
      } else {
        text = slots.default ? slots.default() : props.text;
      }
      if (text) {
        return createVNode("span", {
          "class": bem$1("text")
        }, [text]);
      }
    };
    const getStyle = () => {
      const {
        color,
        plain
      } = props;
      if (color) {
        const style = {
          color: plain ? color : "white"
        };
        if (!plain) {
          style.background = color;
        }
        if (color.includes("gradient")) {
          style.border = 0;
        } else {
          style.borderColor = color;
        }
        return style;
      }
    };
    const onClick = (event) => {
      if (props.loading) {
        preventDefault(event);
      } else if (!props.disabled) {
        emit("click", event);
        route2();
      }
    };
    return () => {
      const {
        tag,
        type,
        size,
        block,
        round,
        plain,
        square,
        loading,
        disabled,
        hairline,
        nativeType,
        iconPosition
      } = props;
      const classes = [bem$1([type, size, {
        plain,
        block,
        round,
        square,
        loading,
        disabled,
        hairline
      }]), {
        [BORDER_SURROUND]: hairline
      }];
      return createVNode(tag, {
        "type": nativeType,
        "class": classes,
        "style": getStyle(),
        "disabled": disabled,
        "onClick": onClick
      }, {
        default: () => [createVNode("div", {
          "class": bem$1("content")
        }, [iconPosition === "left" && renderIcon(), renderText(), iconPosition === "right" && renderIcon()])]
      });
    };
  }
});
let current = 0;
function useId() {
  const vm = getCurrentInstance();
  const { name: name2 = "unknown" } = (vm == null ? void 0 : vm.type) || {};
  return `${name2}-${++current}`;
}
const defaultOptions = {
  icon: "",
  type: "text",
  message: "",
  className: "",
  overlay: false,
  onClose: void 0,
  onOpened: void 0,
  duration: 2e3,
  teleport: "body",
  iconSize: void 0,
  iconPrefix: void 0,
  position: "middle",
  transition: "van-fade",
  forbidClick: false,
  loadingType: void 0,
  overlayClass: "",
  overlayStyle: void 0,
  closeOnClick: false,
  closeOnClickOverlay: false
};
extend({}, defaultOptions);
function showToast(options = {}) {
  {
    return {};
  }
}
const [name, bem] = createNamespace("empty");
const emptyProps = {
  image: makeStringProp("default"),
  imageSize: [Number, String, Array],
  description: String
};
var stdin_default = defineComponent({
  name,
  props: emptyProps,
  setup(props, {
    slots
  }) {
    const renderDescription = () => {
      const description = slots.description ? slots.description() : props.description;
      if (description) {
        return createVNode("p", {
          "class": bem("description")
        }, [description]);
      }
    };
    const renderBottom = () => {
      if (slots.default) {
        return createVNode("div", {
          "class": bem("bottom")
        }, [slots.default()]);
      }
    };
    const baseId = useId();
    const getId = (num) => `${baseId}-${num}`;
    const getUrlById = (num) => `url(#${getId(num)})`;
    const renderStop = (color, offset, opacity) => createVNode("stop", {
      "stop-color": color,
      "offset": `${offset}%`,
      "stop-opacity": opacity
    }, null);
    const renderStops = (fromColor, toColor) => [renderStop(fromColor, 0), renderStop(toColor, 100)];
    const renderShadow = (id) => [createVNode("defs", null, [createVNode("radialGradient", {
      "id": getId(id),
      "cx": "50%",
      "cy": "54%",
      "fx": "50%",
      "fy": "54%",
      "r": "297%",
      "gradientTransform": "matrix(-.16 0 0 -.33 .58 .72)",
      "data-allow-mismatch": "attribute"
    }, [renderStop("#EBEDF0", 0), renderStop("#F2F3F5", 100, 0.3)])]), createVNode("ellipse", {
      "fill": getUrlById(id),
      "opacity": ".8",
      "cx": "80",
      "cy": "140",
      "rx": "46",
      "ry": "8",
      "data-allow-mismatch": "attribute"
    }, null)];
    const renderBuilding = () => [createVNode("defs", null, [createVNode("linearGradient", {
      "id": getId("a"),
      "x1": "64%",
      "y1": "100%",
      "x2": "64%",
      "data-allow-mismatch": "attribute"
    }, [renderStop("#FFF", 0, 0.5), renderStop("#F2F3F5", 100)])]), createVNode("g", {
      "opacity": ".8",
      "data-allow-mismatch": "children"
    }, [createVNode("path", {
      "d": "M36 131V53H16v20H2v58h34z",
      "fill": getUrlById("a")
    }, null), createVNode("path", {
      "d": "M123 15h22v14h9v77h-31V15z",
      "fill": getUrlById("a")
    }, null)])];
    const renderCloud = () => [createVNode("defs", null, [createVNode("linearGradient", {
      "id": getId("b"),
      "x1": "64%",
      "y1": "97%",
      "x2": "64%",
      "y2": "0%",
      "data-allow-mismatch": "attribute"
    }, [renderStop("#F2F3F5", 0, 0.3), renderStop("#F2F3F5", 100)])]), createVNode("g", {
      "opacity": ".8",
      "data-allow-mismatch": "children"
    }, [createVNode("path", {
      "d": "M87 6c3 0 7 3 8 6a8 8 0 1 1-1 16H80a7 7 0 0 1-8-6c0-4 3-7 6-7 0-5 4-9 9-9Z",
      "fill": getUrlById("b")
    }, null), createVNode("path", {
      "d": "M19 23c2 0 3 1 4 3 2 0 4 2 4 4a4 4 0 0 1-4 3v1h-7v-1l-1 1c-2 0-3-2-3-4 0-1 1-3 3-3 0-2 2-4 4-4Z",
      "fill": getUrlById("b")
    }, null)])];
    const renderNetwork = () => createVNode("svg", {
      "viewBox": "0 0 160 160"
    }, [createVNode("defs", {
      "data-allow-mismatch": "children"
    }, [createVNode("linearGradient", {
      "id": getId(1),
      "x1": "64%",
      "y1": "100%",
      "x2": "64%"
    }, [renderStop("#FFF", 0, 0.5), renderStop("#F2F3F5", 100)]), createVNode("linearGradient", {
      "id": getId(2),
      "x1": "50%",
      "x2": "50%",
      "y2": "84%"
    }, [renderStop("#EBEDF0", 0), renderStop("#DCDEE0", 100, 0)]), createVNode("linearGradient", {
      "id": getId(3),
      "x1": "100%",
      "x2": "100%",
      "y2": "100%"
    }, [renderStops("#EAEDF0", "#DCDEE0")]), createVNode("radialGradient", {
      "id": getId(4),
      "cx": "50%",
      "cy": "0%",
      "fx": "50%",
      "fy": "0%",
      "r": "100%",
      "gradientTransform": "matrix(0 1 -.54 0 .5 -.5)"
    }, [renderStop("#EBEDF0", 0), renderStop("#FFF", 100, 0)])]), createVNode("g", {
      "fill": "none"
    }, [renderBuilding(), createVNode("path", {
      "fill": getUrlById(4),
      "d": "M0 139h160v21H0z",
      "data-allow-mismatch": "attribute"
    }, null), createVNode("path", {
      "d": "M80 54a7 7 0 0 1 3 13v27l-2 2h-2a2 2 0 0 1-2-2V67a7 7 0 0 1 3-13z",
      "fill": getUrlById(2),
      "data-allow-mismatch": "attribute"
    }, null), createVNode("g", {
      "opacity": ".6",
      "stroke-linecap": "round",
      "stroke-width": "7",
      "data-allow-mismatch": "children"
    }, [createVNode("path", {
      "d": "M64 47a19 19 0 0 0-5 13c0 5 2 10 5 13",
      "stroke": getUrlById(3)
    }, null), createVNode("path", {
      "d": "M53 36a34 34 0 0 0 0 48",
      "stroke": getUrlById(3)
    }, null), createVNode("path", {
      "d": "M95 73a19 19 0 0 0 6-13c0-5-2-9-6-13",
      "stroke": getUrlById(3)
    }, null), createVNode("path", {
      "d": "M106 84a34 34 0 0 0 0-48",
      "stroke": getUrlById(3)
    }, null)]), createVNode("g", {
      "transform": "translate(31 105)"
    }, [createVNode("rect", {
      "fill": "#EBEDF0",
      "width": "98",
      "height": "34",
      "rx": "2"
    }, null), createVNode("rect", {
      "fill": "#FFF",
      "x": "9",
      "y": "8",
      "width": "80",
      "height": "18",
      "rx": "1.1"
    }, null), createVNode("rect", {
      "fill": "#EBEDF0",
      "x": "15",
      "y": "12",
      "width": "18",
      "height": "6",
      "rx": "1.1"
    }, null)])])]);
    const renderMaterial = () => createVNode("svg", {
      "viewBox": "0 0 160 160"
    }, [createVNode("defs", {
      "data-allow-mismatch": "children"
    }, [createVNode("linearGradient", {
      "x1": "50%",
      "x2": "50%",
      "y2": "100%",
      "id": getId(5)
    }, [renderStops("#F2F3F5", "#DCDEE0")]), createVNode("linearGradient", {
      "x1": "95%",
      "y1": "48%",
      "x2": "5.5%",
      "y2": "51%",
      "id": getId(6)
    }, [renderStops("#EAEDF1", "#DCDEE0")]), createVNode("linearGradient", {
      "y1": "45%",
      "x2": "100%",
      "y2": "54%",
      "id": getId(7)
    }, [renderStops("#EAEDF1", "#DCDEE0")])]), renderBuilding(), renderCloud(), createVNode("g", {
      "transform": "translate(36 50)",
      "fill": "none"
    }, [createVNode("g", {
      "transform": "translate(8)"
    }, [createVNode("rect", {
      "fill": "#EBEDF0",
      "opacity": ".6",
      "x": "38",
      "y": "13",
      "width": "36",
      "height": "53",
      "rx": "2"
    }, null), createVNode("rect", {
      "fill": getUrlById(5),
      "width": "64",
      "height": "66",
      "rx": "2",
      "data-allow-mismatch": "attribute"
    }, null), createVNode("rect", {
      "fill": "#FFF",
      "x": "6",
      "y": "6",
      "width": "52",
      "height": "55",
      "rx": "1"
    }, null), createVNode("g", {
      "transform": "translate(15 17)",
      "fill": getUrlById(6),
      "data-allow-mismatch": "attribute"
    }, [createVNode("rect", {
      "width": "34",
      "height": "6",
      "rx": "1"
    }, null), createVNode("path", {
      "d": "M0 14h34v6H0z"
    }, null), createVNode("rect", {
      "y": "28",
      "width": "34",
      "height": "6",
      "rx": "1"
    }, null)])]), createVNode("rect", {
      "fill": getUrlById(7),
      "y": "61",
      "width": "88",
      "height": "28",
      "rx": "1",
      "data-allow-mismatch": "attribute"
    }, null), createVNode("rect", {
      "fill": "#F7F8FA",
      "x": "29",
      "y": "72",
      "width": "30",
      "height": "6",
      "rx": "1"
    }, null)])]);
    const renderError = () => createVNode("svg", {
      "viewBox": "0 0 160 160"
    }, [createVNode("defs", null, [createVNode("linearGradient", {
      "x1": "50%",
      "x2": "50%",
      "y2": "100%",
      "id": getId(8),
      "data-allow-mismatch": "attribute"
    }, [renderStops("#EAEDF1", "#DCDEE0")])]), renderBuilding(), renderCloud(), renderShadow("c"), createVNode("path", {
      "d": "m59 60 21 21 21-21h3l9 9v3L92 93l21 21v3l-9 9h-3l-21-21-21 21h-3l-9-9v-3l21-21-21-21v-3l9-9h3Z",
      "fill": getUrlById(8),
      "data-allow-mismatch": "attribute"
    }, null)]);
    const renderSearch = () => createVNode("svg", {
      "viewBox": "0 0 160 160"
    }, [createVNode("defs", {
      "data-allow-mismatch": "children"
    }, [createVNode("linearGradient", {
      "x1": "50%",
      "y1": "100%",
      "x2": "50%",
      "id": getId(9)
    }, [renderStops("#EEE", "#D8D8D8")]), createVNode("linearGradient", {
      "x1": "100%",
      "y1": "50%",
      "y2": "50%",
      "id": getId(10)
    }, [renderStops("#F2F3F5", "#DCDEE0")]), createVNode("linearGradient", {
      "x1": "50%",
      "x2": "50%",
      "y2": "100%",
      "id": getId(11)
    }, [renderStops("#F2F3F5", "#DCDEE0")]), createVNode("linearGradient", {
      "x1": "50%",
      "x2": "50%",
      "y2": "100%",
      "id": getId(12)
    }, [renderStops("#FFF", "#F7F8FA")])]), renderBuilding(), renderCloud(), renderShadow("d"), createVNode("g", {
      "transform": "rotate(-45 113 -4)",
      "fill": "none",
      "data-allow-mismatch": "children"
    }, [createVNode("rect", {
      "fill": getUrlById(9),
      "x": "24",
      "y": "52.8",
      "width": "5.8",
      "height": "19",
      "rx": "1"
    }, null), createVNode("rect", {
      "fill": getUrlById(10),
      "x": "22.1",
      "y": "67.3",
      "width": "9.9",
      "height": "28",
      "rx": "1"
    }, null), createVNode("circle", {
      "stroke": getUrlById(11),
      "stroke-width": "8",
      "cx": "27",
      "cy": "27",
      "r": "27"
    }, null), createVNode("circle", {
      "fill": getUrlById(12),
      "cx": "27",
      "cy": "27",
      "r": "16"
    }, null), createVNode("path", {
      "d": "M37 7c-8 0-15 5-16 12",
      "stroke": getUrlById(11),
      "stroke-width": "3",
      "opacity": ".5",
      "stroke-linecap": "round",
      "transform": "rotate(45 29 13)"
    }, null)])]);
    const renderImage = () => {
      var _a;
      if (slots.image) {
        return slots.image();
      }
      const PRESET_IMAGES = {
        error: renderError,
        search: renderSearch,
        network: renderNetwork,
        default: renderMaterial
      };
      return ((_a = PRESET_IMAGES[props.image]) == null ? void 0 : _a.call(PRESET_IMAGES)) || createVNode("img", {
        "src": props.image
      }, null);
    };
    return () => createVNode("div", {
      "class": bem()
    }, [createVNode("div", {
      "class": bem("image"),
      "style": getSizeStyle(props.imageSize)
    }, [renderImage()]), renderDescription(), renderBottom()]);
  }
});
async function imageMeta(_ctx, url) {
  const meta = await _imageMeta(url).catch((err) => {
    console.error("Failed to get image meta for " + url, err + "");
    return {
      width: 0,
      height: 0,
      ratio: 0
    };
  });
  return meta;
}
async function _imageMeta(url) {
  {
    const imageMeta2 = await import('image-meta').then((r) => r.imageMeta);
    const data = await fetch(url).then((res) => res.buffer());
    const metadata = imageMeta2(data);
    if (!metadata) {
      throw new Error(`No metadata could be extracted from the image \`${url}\`.`);
    }
    const { width: width2, height: height2 } = metadata;
    const meta = {
      width: width2,
      height: height2,
      ratio: width2 && height2 ? width2 / height2 : void 0
    };
    return meta;
  }
}
function createMapper(map) {
  return (key) => {
    return key ? map[key] || key : map.missingValue;
  };
}
function createOperationsGenerator({ formatter, keyMap, joinWith = "/", valueMap } = {}) {
  if (!formatter) {
    formatter = (key, value) => `${key}=${value}`;
  }
  if (keyMap && typeof keyMap !== "function") {
    keyMap = createMapper(keyMap);
  }
  const map = valueMap || {};
  Object.keys(map).forEach((valueKey) => {
    if (typeof map[valueKey] !== "function") {
      map[valueKey] = createMapper(map[valueKey]);
    }
  });
  return (modifiers = {}) => {
    const operations = Object.entries(modifiers).filter(([_, value]) => typeof value !== "undefined").map(([key, value]) => {
      const mapper = map[key];
      if (typeof mapper === "function") {
        value = mapper(modifiers[key]);
      }
      key = typeof keyMap === "function" ? keyMap(key) : key;
      return formatter(key, value);
    });
    return operations.join(joinWith);
  };
}
function parseSize(input = "") {
  if (typeof input === "number") {
    return input;
  }
  if (typeof input === "string") {
    if (input.replace("px", "").match(/^\d+$/g)) {
      return Number.parseInt(input, 10);
    }
  }
}
function parseDensities(input = "") {
  if (input === void 0 || !input.length) {
    return [];
  }
  const densities = /* @__PURE__ */ new Set();
  for (const density of input.split(" ")) {
    const d = Number.parseInt(density.replace("x", ""));
    if (d) {
      densities.add(d);
    }
  }
  return Array.from(densities);
}
function checkDensities(densities) {
  if (densities.length === 0) {
    throw new Error("`densities` must not be empty, configure to `1` to render regular size only (DPR 1.0)");
  }
}
function parseSizes(input) {
  const sizes = {};
  if (typeof input === "string") {
    for (const entry of input.split(/[\s,]+/).filter((e) => e)) {
      const s = entry.split(":");
      if (s.length !== 2) {
        sizes["1px"] = s[0].trim();
      } else {
        sizes[s[0].trim()] = s[1].trim();
      }
    }
  } else {
    Object.assign(sizes, input);
  }
  return sizes;
}
function createImage(globalOptions) {
  const ctx = {
    options: globalOptions
  };
  const getImage2 = (input, options = {}) => {
    const image = resolveImage(ctx, input, options);
    return image;
  };
  const $img = (input, modifiers = {}, options = {}) => {
    return getImage2(input, {
      ...options,
      modifiers: defu(modifiers, options.modifiers || {})
    }).url;
  };
  for (const presetName in globalOptions.presets) {
    $img[presetName] = (source, modifiers, options) => $img(source, modifiers, { ...globalOptions.presets[presetName], ...options });
  }
  $img.options = globalOptions;
  $img.getImage = getImage2;
  $img.getMeta = (input, options) => getMeta(ctx, input, options);
  $img.getSizes = (input, options) => getSizes(ctx, input, options);
  ctx.$img = $img;
  return $img;
}
async function getMeta(ctx, input, options) {
  const image = resolveImage(ctx, input, { ...options });
  if (typeof image.getMeta === "function") {
    return await image.getMeta();
  } else {
    return await imageMeta(ctx, image.url);
  }
}
function resolveImage(ctx, input, options) {
  if (input && typeof input !== "string") {
    throw new TypeError(`input must be a string (received ${typeof input}: ${JSON.stringify(input)})`);
  }
  if (!input || input.startsWith("data:")) {
    return {
      url: input
    };
  }
  const { provider, defaults } = getProvider(ctx, options.provider || ctx.options.provider);
  const preset = getPreset(ctx, options.preset);
  input = hasProtocol(input) ? input : withLeadingSlash(input);
  if (!provider.supportsAlias) {
    for (const base in ctx.options.alias) {
      if (input.startsWith(base)) {
        const alias = ctx.options.alias[base];
        if (alias) {
          input = joinURL(alias, input.slice(base.length));
        }
      }
    }
  }
  if (provider.validateDomains && hasProtocol(input)) {
    const inputHost = parseURL(input).host;
    if (!ctx.options.domains.find((d) => d === inputHost)) {
      return {
        url: input
      };
    }
  }
  const _options = defu(options, preset, defaults);
  _options.modifiers = { ..._options.modifiers };
  const expectedFormat = _options.modifiers.format;
  if (_options.modifiers?.width) {
    _options.modifiers.width = parseSize(_options.modifiers.width);
  }
  if (_options.modifiers?.height) {
    _options.modifiers.height = parseSize(_options.modifiers.height);
  }
  const image = provider.getImage(input, _options, ctx);
  image.format = image.format || expectedFormat || "";
  return image;
}
function getProvider(ctx, name2) {
  const provider = ctx.options.providers[name2];
  if (!provider) {
    throw new Error("Unknown provider: " + name2);
  }
  return provider;
}
function getPreset(ctx, name2) {
  if (!name2) {
    return {};
  }
  if (!ctx.options.presets[name2]) {
    throw new Error("Unknown preset: " + name2);
  }
  return ctx.options.presets[name2];
}
function getSizes(ctx, input, opts) {
  const width2 = parseSize(opts.modifiers?.width);
  const height2 = parseSize(opts.modifiers?.height);
  const sizes = parseSizes(opts.sizes);
  const densities = opts.densities?.trim() ? parseDensities(opts.densities.trim()) : ctx.options.densities;
  checkDensities(densities);
  const hwRatio = width2 && height2 ? height2 / width2 : 0;
  const sizeVariants = [];
  const srcsetVariants = [];
  if (Object.keys(sizes).length >= 1) {
    for (const key in sizes) {
      const variant = getSizesVariant(key, String(sizes[key]), height2, hwRatio, ctx);
      if (variant === void 0) {
        continue;
      }
      sizeVariants.push({
        size: variant.size,
        screenMaxWidth: variant.screenMaxWidth,
        media: `(max-width: ${variant.screenMaxWidth}px)`
      });
      for (const density of densities) {
        srcsetVariants.push({
          width: variant._cWidth * density,
          src: getVariantSrc(ctx, input, opts, variant, density)
        });
      }
    }
    finaliseSizeVariants(sizeVariants);
  } else {
    for (const density of densities) {
      const key = Object.keys(sizes)[0];
      let variant = key ? getSizesVariant(key, String(sizes[key]), height2, hwRatio, ctx) : void 0;
      if (variant === void 0) {
        variant = {
          size: "",
          screenMaxWidth: 0,
          _cWidth: opts.modifiers?.width,
          _cHeight: opts.modifiers?.height
        };
      }
      srcsetVariants.push({
        width: density,
        src: getVariantSrc(ctx, input, opts, variant, density)
      });
    }
  }
  finaliseSrcsetVariants(srcsetVariants);
  const defaultVariant = srcsetVariants[srcsetVariants.length - 1];
  const sizesVal = sizeVariants.length ? sizeVariants.map((v) => `${v.media ? v.media + " " : ""}${v.size}`).join(", ") : void 0;
  const suffix = sizesVal ? "w" : "x";
  const srcsetVal = srcsetVariants.map((v) => `${v.src} ${v.width}${suffix}`).join(", ");
  return {
    sizes: sizesVal,
    srcset: srcsetVal,
    src: defaultVariant?.src
  };
}
function getSizesVariant(key, size, height2, hwRatio, ctx) {
  const screenMaxWidth = ctx.options.screens && ctx.options.screens[key] || Number.parseInt(key);
  const isFluid = size.endsWith("vw");
  if (!isFluid && /^\d+$/.test(size)) {
    size = size + "px";
  }
  if (!isFluid && !size.endsWith("px")) {
    return void 0;
  }
  let _cWidth = Number.parseInt(size);
  if (!screenMaxWidth || !_cWidth) {
    return void 0;
  }
  if (isFluid) {
    _cWidth = Math.round(_cWidth / 100 * screenMaxWidth);
  }
  const _cHeight = hwRatio ? Math.round(_cWidth * hwRatio) : height2;
  return {
    size,
    screenMaxWidth,
    _cWidth,
    _cHeight
  };
}
function getVariantSrc(ctx, input, opts, variant, density) {
  return ctx.$img(
    input,
    {
      ...opts.modifiers,
      width: variant._cWidth ? variant._cWidth * density : void 0,
      height: variant._cHeight ? variant._cHeight * density : void 0
    },
    opts
  );
}
function finaliseSizeVariants(sizeVariants) {
  sizeVariants.sort((v1, v2) => v1.screenMaxWidth - v2.screenMaxWidth);
  let previousMedia = null;
  for (let i = sizeVariants.length - 1; i >= 0; i--) {
    const sizeVariant = sizeVariants[i];
    if (sizeVariant.media === previousMedia) {
      sizeVariants.splice(i, 1);
    }
    previousMedia = sizeVariant.media;
  }
  for (let i = 0; i < sizeVariants.length; i++) {
    sizeVariants[i].media = sizeVariants[i + 1]?.media || "";
  }
}
function finaliseSrcsetVariants(srcsetVariants) {
  srcsetVariants.sort((v1, v2) => v1.width - v2.width);
  let previousWidth = null;
  for (let i = srcsetVariants.length - 1; i >= 0; i--) {
    const sizeVariant = srcsetVariants[i];
    if (sizeVariant.width === previousWidth) {
      srcsetVariants.splice(i, 1);
    }
    previousWidth = sizeVariant.width;
  }
}
const operationsGenerator = createOperationsGenerator({
  keyMap: {
    format: "f",
    fit: "fit",
    width: "w",
    height: "h",
    resize: "s",
    quality: "q",
    background: "b"
  },
  joinWith: "&",
  formatter: (key, val) => encodeParam(key) + "_" + encodeParam(val)
});
const getImage = (src, { modifiers = {}, baseURL } = {}, ctx) => {
  if (modifiers.width && modifiers.height) {
    modifiers.resize = `${modifiers.width}x${modifiers.height}`;
    delete modifiers.width;
    delete modifiers.height;
  }
  const params = operationsGenerator(modifiers) || "_";
  if (!baseURL) {
    baseURL = joinURL(ctx.options.nuxt.baseURL, "/_ipx");
  }
  return {
    url: joinURL(baseURL, params, encodePath(src))
  };
};
const validateDomains = true;
const supportsAlias = true;
const ipxRuntime$KK6_trvL1EhgXKeNEqDCbeV5sdQ7bu2G80ouurbOWFk = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getImage,
  operationsGenerator,
  supportsAlias,
  validateDomains
}, Symbol.toStringTag, { value: "Module" }));
const imageOptions = {
  ...{
    "screens": {
      "xs": 320,
      "sm": 640,
      "md": 768,
      "lg": 1024,
      "xl": 1280,
      "xxl": 1536,
      "2xl": 1536
    },
    "presets": {},
    "provider": "ipx",
    "domains": [],
    "alias": {},
    "densities": [
      1,
      2
    ],
    "format": [
      "webp"
    ]
  },
  providers: {
    ["ipx"]: { provider: ipxRuntime$KK6_trvL1EhgXKeNEqDCbeV5sdQ7bu2G80ouurbOWFk, defaults: {} }
  }
};
const useImage = (event) => {
  const config = useRuntimeConfig();
  const nuxtApp = useNuxtApp();
  return nuxtApp.$img || nuxtApp._img || (nuxtApp._img = createImage({
    ...imageOptions,
    event: nuxtApp.ssrContext?.event,
    nuxt: {
      baseURL: config.app.baseURL
    },
    runtimeConfig: config
  }));
};
const baseImageProps = {
  // input source
  src: { type: String, required: false },
  // modifiers
  format: { type: String, required: false },
  quality: { type: [Number, String], required: false },
  background: { type: String, required: false },
  fit: { type: String, required: false },
  modifiers: { type: Object, required: false },
  // options
  preset: { type: String, required: false },
  provider: { type: String, required: false },
  sizes: { type: [Object, String], required: false },
  densities: { type: String, required: false },
  preload: {
    type: [Boolean, Object],
    required: false
  },
  // <img> attributes
  width: { type: [String, Number], required: false },
  height: { type: [String, Number], required: false },
  alt: { type: String, required: false },
  referrerpolicy: { type: String, required: false },
  usemap: { type: String, required: false },
  longdesc: { type: String, required: false },
  ismap: { type: Boolean, required: false },
  loading: {
    type: String,
    required: false,
    validator: (val) => ["lazy", "eager"].includes(val)
  },
  crossorigin: {
    type: [Boolean, String],
    required: false,
    validator: (val) => ["anonymous", "use-credentials", "", true, false].includes(val)
  },
  decoding: {
    type: String,
    required: false,
    validator: (val) => ["async", "auto", "sync"].includes(val)
  },
  // csp
  nonce: { type: [String], required: false }
};
const useBaseImage = (props) => {
  const options = computed(() => {
    return {
      provider: props.provider,
      preset: props.preset
    };
  });
  const attrs = computed(() => {
    return {
      width: parseSize(props.width),
      height: parseSize(props.height),
      alt: props.alt,
      referrerpolicy: props.referrerpolicy,
      usemap: props.usemap,
      longdesc: props.longdesc,
      ismap: props.ismap,
      crossorigin: props.crossorigin === true ? "anonymous" : props.crossorigin || void 0,
      loading: props.loading,
      decoding: props.decoding,
      nonce: props.nonce
    };
  });
  const $img = useImage();
  const modifiers = computed(() => {
    return {
      ...props.modifiers,
      width: parseSize(props.width),
      height: parseSize(props.height),
      format: props.format,
      quality: props.quality || $img.options.quality,
      background: props.background,
      fit: props.fit
    };
  });
  return {
    options,
    attrs,
    modifiers
  };
};
const imgProps = {
  ...baseImageProps,
  placeholder: { type: [Boolean, String, Number, Array], required: false },
  placeholderClass: { type: String, required: false },
  custom: { type: Boolean, required: false }
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "NuxtImg",
  __ssrInlineRender: true,
  props: imgProps,
  emits: ["load", "error"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const attrs = useAttrs();
    const isServer = true;
    const $img = useImage();
    const _base = useBaseImage(props);
    const placeholderLoaded = ref(false);
    const imgEl = ref();
    const sizes = computed(() => $img.getSizes(props.src, {
      ..._base.options.value,
      sizes: props.sizes,
      densities: props.densities,
      modifiers: {
        ..._base.modifiers.value,
        width: parseSize(props.width),
        height: parseSize(props.height)
      }
    }));
    const imgAttrs = computed(() => {
      const attrs2 = { ..._base.attrs.value, "data-nuxt-img": "" };
      if (!props.placeholder || placeholderLoaded.value) {
        attrs2.sizes = sizes.value.sizes;
        attrs2.srcset = sizes.value.srcset;
      }
      return attrs2;
    });
    const placeholder = computed(() => {
      let placeholder2 = props.placeholder;
      if (placeholder2 === "") {
        placeholder2 = true;
      }
      if (!placeholder2 || placeholderLoaded.value) {
        return false;
      }
      if (typeof placeholder2 === "string") {
        return placeholder2;
      }
      const size = Array.isArray(placeholder2) ? placeholder2 : typeof placeholder2 === "number" ? [placeholder2, placeholder2] : [10, 10];
      return $img(props.src, {
        ..._base.modifiers.value,
        width: size[0],
        height: size[1],
        quality: size[2] || 50,
        blur: size[3] || 3
      }, _base.options.value);
    });
    const mainSrc = computed(
      () => props.sizes ? sizes.value.src : $img(props.src, _base.modifiers.value, _base.options.value)
    );
    const src = computed(() => placeholder.value ? placeholder.value : mainSrc.value);
    if (props.preload) {
      const isResponsive = Object.values(sizes.value).every((v) => v);
      useHead({
        link: [{
          rel: "preload",
          as: "image",
          nonce: props.nonce,
          ...!isResponsive ? { href: src.value } : {
            href: sizes.value.src,
            imagesizes: sizes.value.sizes,
            imagesrcset: sizes.value.srcset
          },
          ...typeof props.preload !== "boolean" && props.preload.fetchPriority ? { fetchpriority: props.preload.fetchPriority } : {}
        }]
      });
    }
    const nuxtApp = useNuxtApp();
    nuxtApp.isHydrating;
    return (_ctx, _push, _parent, _attrs) => {
      if (!_ctx.custom) {
        _push(`<img${ssrRenderAttrs(mergeProps({
          ref_key: "imgEl",
          ref: imgEl,
          class: placeholder.value && !placeholderLoaded.value ? _ctx.placeholderClass : void 0
        }, {
          ...unref(isServer) ? { onerror: "this.setAttribute('data-error', 1)" } : {},
          ...imgAttrs.value,
          ...unref(attrs)
        }, { src: src.value }, _attrs))}>`);
      } else {
        ssrRenderSlot(_ctx.$slots, "default", {
          ...unref(isServer) ? { onerror: "this.setAttribute('data-error', 1)" } : {},
          imgAttrs: {
            ...imgAttrs.value,
            ...unref(attrs)
          },
          isLoaded: placeholderLoaded.value,
          src: src.value
        }, null, _push, _parent);
      }
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/image/dist/runtime/components/NuxtImg.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$2, { __name: "NuxtImg" });
const _imports_0$1 = "data:image/png;base64,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";
const _imports_1 = "" + __buildAssetsURL("car.DshGGnqa.png");
const _imports_2 = "" + __buildAssetsURL("map-icon.CXgqVMOt.png");
const _imports_3 = "" + __buildAssetsURL("phone.Cq8pmntr.png");
const _imports_0 = "" + __buildAssetsURL("app-icon-white.CzEACC0U.png");
const useOpenAdd = () => {
  const { t } = useI18n();
  const route2 = useRoute$1();
  const getMobileOS = () => {
    const ua = (void 0).userAgent;
    if (/android/i.test(ua)) {
      return "Android";
    }
    if (/iPad|iPhone|iPod/.test(ua)) {
      return "iOS";
    }
    return "unknown";
  };
  const openApp = () => {
    if (getMobileOS() === "Android") {
      (void 0).location.href = `vividwash://?page=shopdetail&id=${route2.query.id}`;
      showToast(t("正在跳转，请稍等..."));
      setTimeout(() => {
        download();
      }, 2e3);
    } else {
      download();
    }
  };
  const download = () => {
    if (getMobileOS() === "iOS") {
      (void 0).location.href = "https://apps.apple.com/app/vivid-wash/id6742226153";
    } else {
      (void 0).location.href = "https://play.google.com/store/apps/details?id=com.tailwind.vivid1";
    }
  };
  return { openApp };
};
const headShow = ref(true);
const useHeadShow = () => {
  return {
    headShow,
    changeShow: (v) => {
      headShow.value = v;
    }
  };
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Download",
  __ssrInlineRender: true,
  setup(__props) {
    const { openApp } = useOpenAdd();
    const { headShow: headShow2, changeShow } = useHeadShow();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_1;
      const _component_van_button = stdin_default$1;
      if (unref(headShow2)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center px-4 py-1 sticky top-0 bg-white z-50 shadow-lg" }, _attrs))}>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "mdi:close",
          class: "text-[18px]",
          onClick: ($event) => unref(changeShow)(false)
        }, null, _parent));
        _push(`<img${ssrRenderAttr("src", _imports_0)} class="w-[50px] h-[50px] mx-2" alt="logo"><div class="flex-1"><div class="font-bold">${ssrInterpolate(_ctx.$t("Vivid Wash 应用程序"))}</div><div class="text-[12px] text-gray-500">${ssrInterpolate(_ctx.$t("轻松订购"))}</div><div>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "mdi:star",
          class: "text-yellow-500 text-[18px]"
        }, null, _parent));
        _push(ssrRenderComponent(_component_Icon, {
          name: "mdi:star",
          class: "text-yellow-500 text-[18px]"
        }, null, _parent));
        _push(ssrRenderComponent(_component_Icon, {
          name: "mdi:star",
          class: "text-yellow-500 text-[18px]"
        }, null, _parent));
        _push(ssrRenderComponent(_component_Icon, {
          name: "mdi:star",
          class: "text-yellow-500 text-[18px]"
        }, null, _parent));
        _push(ssrRenderComponent(_component_Icon, {
          name: "mdi:star",
          class: "text-yellow-500 text-[18px]"
        }, null, _parent));
        _push(`</div></div>`);
        _push(ssrRenderComponent(_component_van_button, {
          type: "primary",
          class: "!bg-gradient-to-b from-[#3458A9] to-[#3FC2BD] min-w-[90px] !h-9 !rounded-[10px]",
          onClick: unref(openApp)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(_ctx.$t("打开"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(_ctx.$t("打开")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Download.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const Download = Object.assign(_sfc_main$1, { __name: "Download" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    dayjs.extend(customParseFormat);
    const route2 = useRoute$1();
    const tabsActive = ref(0);
    const { t } = useI18n();
    useOpenAdd();
    const tabs = [t("套餐"), t("服务")];
    const { headShow: headShow2 } = useHeadShow();
    ref(null);
    const downloadRef = ref(null);
    const isTabsSticky = ref(false);
    const shop = ref(null);
    const { data } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      `https://app.tailwindtrade.com/api/user/shop/${route2.params.id}`,
      "$Q81OCvPEid"
    )), __temp = await __temp, __restore(), __temp);
    if (data.value?.success) {
      shop.value = data.value.data;
      const description = t("智能预约洗车，轻松焕然一新");
      const url = route2.fullPath;
      const image = shop.value.cover_image_uri;
      const title = shop.value.name;
      useHead({
        title,
        link: [{ rel: "icon", type: "image/png", href: shop.value.imageUri }],
        meta: [
          {
            name: "description",
            content: description
          },
          {
            name: "keywords",
            content: `${title}, Vivid Wash, ${t("智能预约洗车")}, ${t("在线洗车支付")}, ${t("附近洗车优惠")}, ${t("快速车辆清洁")}`
          },
          // Open Graph
          { property: "og:title", content: title },
          { property: "og:description", content: description },
          { property: "og:type", content: "website" },
          { property: "og:url", content: url },
          { property: "og:image", content: image },
          { property: "og:locale", content: useNuxtApp().$i18n.locale.value },
          { property: "og:site_name", content: title },
          // Twitter Card
          { name: "twitter:card", content: "summary_large_image" },
          { name: "twitter:title", content: title },
          { name: "twitter:description", content: description },
          { name: "twitter:image", content: image }
        ]
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_0;
      const _component_Icon = __nuxt_component_1;
      const _component_van_empty = stdin_default;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(Download, {
        ref_key: "downloadRef",
        ref: downloadRef
      }, null, _parent));
      _push(`<header class="w-full h-[250px] overflow-hidden">`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        class: "w-full h-full block object-cover",
        src: unref(shop)?.cover_image_uri
      }, null, _parent));
      _push(`<div class="h-[40px] bg-white w-full mt-[-30px] relative z-10" style="${ssrRenderStyle({ "clip-path": "ellipse(55% 100% at 50% 100%)" })}"></div></header><div class="px-3"><div class="flex flex-col items-center -mt-22 relative z-10 mb-4">`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        class: "size-[90px] rounded-xl mb-4",
        src: unref(shop)?.imageUri
      }, null, _parent));
      _push(`<span class="text-[30px] font-bold line-clamp-2 font-[heavy] leading-[1.2] text-center mb-1">${ssrInterpolate(unref(shop)?.name)}</span><div class="text-[13px] flex items-center">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:map-marker",
        class: "text-[14px] mr-1 text-[#808080]"
      }, null, _parent));
      _push(`<span class="line-clamp-1 bg-gradient-to-r from-[#B969FF] to-[#00DDD3] bg-clip-text text-transparent">${ssrInterpolate(unref(shop)?.address)}</span></div></div><div class="bg-gradient-to-b from-[#F7FEF7] to-[#F1FFF1] rounded-lg p-2 pb-5 mb-5"><div class="flex items-center -ml-2 -mt-2 mb-3"><div class="w-[64px] h-[38px] bg-[url(&#39;~/assets/images/score.png&#39;)] bg-cover flex-c font-bold text-[18px] font-[heavy] text-white pl-1">${ssrInterpolate(unref(shop)?.best_star.toFixed(1))}</div><span class="text-[15px text-[#00C103] mx-1.5 flex-1">${ssrInterpolate(unref(shop)?.best_review || _ctx.$t("暂无评论"))}</span><img class="w-[24px] h-[21px]"${ssrRenderAttr("src", _imports_0$1)}></div><div class="flex items-center justify-between"><span>&quot;${ssrInterpolate(unref(shop)?.serviceData.length)}+ ${ssrInterpolate(_ctx.$t("服务"))} | ${ssrInterpolate(unref(shop)?.reviews.length)} ${ssrInterpolate(_ctx.$t("位车主评论"))} &quot;</span>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:chevron-right",
        class: "text-[20px] mr-1"
      }, null, _parent));
      _push(`</div></div><div class="flex mb-4"><div class="h-[65px] flex-1 bg-[radial-gradient(ellipse_at_50%_50%,_#F8FEF8_0%,_#F1FFFD_100%)] bg-[#F6FCFE] rounded-lg p-3 flex items-center"><img class="size-[40px] mr-3"${ssrRenderAttr("src", _imports_1)} alt="car"><div class="flex flex-col"><span>${ssrInterpolate(_ctx.$t("时间"))}：${ssrInterpolate(unref(dayjs)(unref(shop)?.start_time, "HH:mm:ss").format("HH:mm") || "09:00")}-${ssrInterpolate(unref(dayjs)(unref(shop)?.end_time, "HH:mm:ss").format("HH:mm") || "18:00")}</span>`);
      if (unref(shop)?.status === 1) {
        _push(`<span class="text-[#00C312]">${ssrInterpolate(_ctx.$t("营业中"))}</span>`);
      } else {
        _push(`<span class="text-red-400">${ssrInterpolate(_ctx.$t("已打烊"))}</span>`);
      }
      _push(`</div></div><div class="w-[62px] h-[65px] bg-[url(&#39;~/assets/images/map-bg.png&#39;)] bg-cover mx-[9px] flex-c"><img class="w-[35px] h-[33px]"${ssrRenderAttr("src", _imports_2)} alt=""></div><div class="w-[62px] h-[65px] rounded-lg flex-c bg-gradient-to-bl from-[#E8FEE9] to-[#E7FCFD]"><img class="w-[35px] h-[33px] ml-3"${ssrRenderAttr("src", _imports_3)} alt=""></div></div><div class="${ssrRenderClass([[unref(headShow2) ? "top-[70px]" : "top-0", unref(isTabsSticky) ? "shadow-lg" : ""], "flex gap-4 sticky bg-white z-50 py-2 mb-3 -mx-3 px-3 pl-4"])}"><!--[-->`);
      ssrRenderList(tabs, (item, index) => {
        _push(`<div class="${ssrRenderClass([
          unref(tabsActive) === index ? "from-[#3551A4] to-[#2FBEB7] text-white" : "from-[#F9F9F9] to-[#EAEAEA] text-[#969696]",
          "bg-gradient-to-b transition select-none h-[40px] min-w-[116px] flex-c rounded-lg -skew-y-12 rotate-12 font-bold px-2"
        ])}"><span class="skew-y-12 -rotate-12 text-[16px]">${ssrInterpolate(item)}</span></div>`);
      });
      _push(`<!--]--></div>`);
      if (unref(tabsActive) === 0) {
        _push(`<!--[-->`);
        if (unref(shop)?.packageData.length === 0) {
          _push(ssrRenderComponent(_component_van_empty, {
            description: _ctx.$t("暂无套餐")
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(unref(shop)?.packageData, (item) => {
          _push(`<div class="border-2 border-[#EEEEEE] rounded-lg mb-4 bg-gradient-to-b from-[#FFF] to-[#F1FFF1]"><div class="py-3 px-3"><div class="font-[heavy] font-bold text-[20px] text-[#08A000] mb-3">${ssrInterpolate(item.name)}</div><ul class="text-[16px] text-[#333333]"><!--[-->`);
          ssrRenderList(item.serviceData, (services) => {
            _push(`<li> • ${ssrInterpolate(services.name)}</li>`);
          });
          _push(`<!--]--></ul></div><div class="bg-gradient-to-b py-2 px-4 from-[#3458A9] to-[#3FC2BD] rounded-lg text-[20px] text-white"> RSD${ssrInterpolate(item.price)}</div></div>`);
        });
        _push(`<!--]--><!--]-->`);
      } else {
        _push(`<!--[-->`);
        if (unref(shop)?.serviceData.length === 0) {
          _push(ssrRenderComponent(_component_van_empty, {
            description: _ctx.$t("暂无服务")
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(unref(shop)?.serviceData, (item) => {
          _push(`<div class="border-2 border-[#EEEEEE] rounded-lg mb-4 bg-gradient-to-b from-[#FFF] to-[#F1FFF1]"><div class="py-3 px-3"><div class="font-[heavy] font-bold text-[20px] text-[#08A000] mb-3">${ssrInterpolate(item.name)}</div><div class="text-[16px] text-[#333333]">${ssrInterpolate(item.description)}</div></div><div class="bg-gradient-to-b py-2 px-4 from-[#3458A9] to-[#3FC2BD] rounded-lg text-[20px] text-white"> RSD${ssrInterpolate(item.price)}</div></div>`);
        });
        _push(`<!--]--><!--]-->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/car-shop/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-S3h0WHH2.mjs.map
