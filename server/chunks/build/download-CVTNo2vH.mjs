import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { f as useI18n, g as useRoute } from './server.mjs';
import '../nitro/nitro.mjs';
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

const _imports_0 = "" + __buildAssetsURL("logo.DFQ_uvoR.png");
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "download",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    useRoute();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col h-screen pb-8" }, _attrs))}><img class="size-[140px] mx-auto mt-[32vw] mb-4"${ssrRenderAttr("src", _imports_0)} alt="logo"><div class="p-6 text-gray-500 text-[13px]">${ssrInterpolate(_ctx.$t("Vivid wash description"))}</div><div class="mt-auto flex flex-col items-center"><button class="w-[300px] border border-green-600 h-[44px] bg-green-600 rounded-full !text-white mb-4">${ssrInterpolate(_ctx.$t("打开 Vivid wash"))}</button><button class="w-[300px] border border-green-600 h-[44px] rounded-full !text-green-600 mb-4">${ssrInterpolate(_ctx.$t("下载 Vivid wash"))}</button></div><div class="text-center text-gray-400">${ssrInterpolate(_ctx.$t("应用名"))}：Vivid wash <br> ${ssrInterpolate(_ctx.$t("开发者"))}：Tailwind Trade </div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/download.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=download-CVTNo2vH.mjs.map
