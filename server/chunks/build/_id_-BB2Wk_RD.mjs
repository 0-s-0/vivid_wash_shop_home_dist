import { defineComponent, ref, withAsyncContext, unref, computed, toValue, reactive, useAttrs, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrRenderSlot } from 'vue/server-renderer';
import { K as hash, C as defu } from '../nitro/nitro.mjs';
import { g as useRoute, f as useI18n, e as useHead, a as useNuxtApp, i as fetchDefaults, k as useRequestFetch, b as useRuntimeConfig, l as withLeadingSlash, h as hasProtocol, j as joinURL, m as parseURL, o as encodeParam, q as encodePath } from './server.mjs';
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
    const { width, height } = metadata;
    const meta = {
      width,
      height,
      ratio: width && height ? width / height : void 0
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
function getProvider(ctx, name) {
  const provider = ctx.options.providers[name];
  if (!provider) {
    throw new Error("Unknown provider: " + name);
  }
  return provider;
}
function getPreset(ctx, name) {
  if (!name) {
    return {};
  }
  if (!ctx.options.presets[name]) {
    throw new Error("Unknown preset: " + name);
  }
  return ctx.options.presets[name];
}
function getSizes(ctx, input, opts) {
  const width = parseSize(opts.modifiers?.width);
  const height = parseSize(opts.modifiers?.height);
  const sizes = parseSizes(opts.sizes);
  const densities = opts.densities?.trim() ? parseDensities(opts.densities.trim()) : ctx.options.densities;
  checkDensities(densities);
  const hwRatio = width && height ? height / width : 0;
  const sizeVariants = [];
  const srcsetVariants = [];
  if (Object.keys(sizes).length >= 1) {
    for (const key in sizes) {
      const variant = getSizesVariant(key, String(sizes[key]), height, hwRatio, ctx);
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
      let variant = key ? getSizesVariant(key, String(sizes[key]), height, hwRatio, ctx) : void 0;
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
function getSizesVariant(key, size, height, hwRatio, ctx) {
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
  const _cHeight = hwRatio ? Math.round(_cWidth * hwRatio) : height;
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
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/image/dist/runtime/components/NuxtImg.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$1, { __name: "NuxtImg" });
const _imports_0 = "data:image/png;base64,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";
const _imports_1 = "" + __buildAssetsURL("car.DshGGnqa.png");
const _imports_2 = "" + __buildAssetsURL("map-icon.CXgqVMOt.png");
const _imports_3 = "" + __buildAssetsURL("phone.Cq8pmntr.png");
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    dayjs.extend(customParseFormat);
    const route = useRoute();
    const tabsActive = ref(0);
    const { t } = useI18n();
    const tabs = [t("套餐"), t("服务")];
    const shop = ref(null);
    const { data } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      `https://app.tailwindtrade.com/api/user/shop/${route.params.id}`,
      "$Q81OCvPEid"
    )), __temp = await __temp, __restore(), __temp);
    if (data.value?.success) {
      shop.value = data.value.data;
      const description = t("智能预约洗车，轻松焕然一新");
      const url = route.fullPath;
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
      _push(`<div${ssrRenderAttrs(_attrs)}><header class="w-full h-[250px] overflow-hidden">`);
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
      _push(`<span class="line-clamp-1 bg-gradient-to-r from-[#B969FF] to-[#00DDD3] bg-clip-text text-transparent">${ssrInterpolate(unref(shop)?.address)}</span></div></div><div class="bg-gradient-to-b from-[#F7FEF7] to-[#F1FFF1] rounded-lg p-2 pb-5 mb-5"><div class="flex items-center -ml-2 -mt-2 mb-3"><div class="w-[64px] h-[38px] bg-[url(&#39;~/assets/images/score.png&#39;)] bg-cover flex-c font-bold text-[18px] font-[heavy] text-white pl-1">${ssrInterpolate(unref(shop)?.best_star.toFixed(1))}</div><span class="text-[15px text-[#00C103] mx-1.5 flex-1">${ssrInterpolate(unref(shop)?.best_review || _ctx.$t("暂无评论"))}</span><img class="w-[24px] h-[21px]"${ssrRenderAttr("src", _imports_0)}></div><div class="flex items-center justify-between"><span>&quot;${ssrInterpolate(unref(shop)?.serviceData.length)}+ ${ssrInterpolate(_ctx.$t("服务"))} | ${ssrInterpolate(unref(shop)?.reviews.length)} ${ssrInterpolate(_ctx.$t("位车主评论"))} &quot;</span>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:chevron-right",
        class: "text-[20px] mr-1"
      }, null, _parent));
      _push(`</div></div><div class="flex mb-6"><div class="h-[65px] flex-1 bg-[radial-gradient(ellipse_at_50%_50%,_#F8FEF8_0%,_#F1FFFD_100%)] bg-[#F6FCFE] rounded-lg p-3 flex items-center"><img class="size-[40px] mr-3"${ssrRenderAttr("src", _imports_1)} alt="car"><div class="flex flex-col"><span>${ssrInterpolate(_ctx.$t("时间"))}：${ssrInterpolate(unref(dayjs)(unref(shop)?.start_time, "HH:mm:ss").format("HH:mm") || "09:00")}-${ssrInterpolate(unref(dayjs)(unref(shop)?.end_time, "HH:mm:ss").format("HH:mm") || "18:00")}</span>`);
      if (unref(shop)?.status === 1) {
        _push(`<span class="text-[#00C312]">${ssrInterpolate(_ctx.$t("营业中"))}</span>`);
      } else {
        _push(`<span class="text-red-400">${ssrInterpolate(_ctx.$t("已打烊"))}</span>`);
      }
      _push(`</div></div><div class="w-[62px] h-[65px] bg-[url(&#39;~/assets/images/map-bg.png&#39;)] bg-cover mx-[9px] flex-c"><img class="w-[35px] h-[33px]"${ssrRenderAttr("src", _imports_2)} alt=""></div><div class="w-[62px] h-[65px] rounded-lg flex-c bg-gradient-to-bl from-[#E8FEE9] to-[#E7FCFD]"><img class="w-[35px] h-[33px] ml-3"${ssrRenderAttr("src", _imports_3)} alt=""></div></div><div class="flex gap-4 mb-5 ml-1"><!--[-->`);
      ssrRenderList(tabs, (item, index) => {
        _push(`<div class="${ssrRenderClass([
          unref(tabsActive) === index ? "from-[#3551A4] to-[#2FBEB7] text-white" : "from-[#F9F9F9] to-[#EAEAEA] text-[#969696]",
          "bg-gradient-to-b transition select-none h-[40px] min-w-[116px] flex-c rounded-lg -skew-y-12 rotate-12 font-bold px-2"
        ])}"><span class="skew-y-12 -rotate-12 text-[16px]">${ssrInterpolate(item)}</span></div>`);
      });
      _push(`<!--]--></div>`);
      if (unref(tabsActive) === 0) {
        _push(`<!--[-->`);
        ssrRenderList(unref(shop)?.packageData, (item) => {
          _push(`<div class="border-2 border-[#EEEEEE] rounded-lg mb-4 bg-gradient-to-b from-[#FFF] to-[#F1FFF1]"><div class="py-3 px-3"><div class="font-[heavy] font-bold text-[20px] text-[#08A000] mb-3">${ssrInterpolate(item.name)}</div><ul class="text-[16px] text-[#333333]"><!--[-->`);
          ssrRenderList(item.serviceData, (services) => {
            _push(`<li> • ${ssrInterpolate(services.name)}</li>`);
          });
          _push(`<!--]--></ul></div><div class="bg-gradient-to-b py-2 px-4 from-[#3458A9] to-[#3FC2BD] rounded-lg text-[20px] text-white"> RSD${ssrInterpolate(item.price)}</div></div>`);
        });
        _push(`<!--]-->`);
      } else {
        _push(`<!--[-->`);
        ssrRenderList(unref(shop)?.serviceData, (item) => {
          _push(`<div class="border-2 border-[#EEEEEE] rounded-lg mb-4 bg-gradient-to-b from-[#FFF] to-[#F1FFF1]"><div class="py-3 px-3"><div class="font-[heavy] font-bold text-[20px] text-[#08A000] mb-3">${ssrInterpolate(item.name)}</div><div class="text-[16px] text-[#333333]">${ssrInterpolate(item.description)}</div></div><div class="bg-gradient-to-b py-2 px-4 from-[#3458A9] to-[#3FC2BD] rounded-lg text-[20px] text-white"> RSD${ssrInterpolate(item.price)}</div></div>`);
        });
        _push(`<!--]-->`);
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
//# sourceMappingURL=_id_-BB2Wk_RD.mjs.map
