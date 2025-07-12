window.dataLayer = window.dataLayer || [];
function gtag() {
  window.dataLayer.push(arguments);
}
gtag("js", new Date());
gtag("config", "G-75JX2Q4LS8");

(() => {
  function u() {
    function n(t, e, i) {
      let r = document.createElement("a");
      (r.href = t),
        (r.target = i),
        (r.rel = e),
        document.body.appendChild(r),
        r.click(),
        r.remove();
    }
    function o(t) {
      if (this.dataset.hydrated) {
        this.removeEventListener("click", o);
        return;
      }
      t.preventDefault(), t.stopPropagation();
      let e = this.getAttribute("href");
      if (!e) return;
      if (
        /Mac|iPod|iPhone|iPad/u.test(navigator.userAgent)
          ? t.metaKey
          : t.ctrlKey
      )
        return n(e, "", "_blank");
      let r = this.getAttribute("rel") ?? "",
        c = this.getAttribute("target") ?? "";
      n(e, r, c);
    }
    function a(t) {
      if (this.dataset.hydrated) {
        this.removeEventListener("auxclick", o);
        return;
      }
      t.preventDefault(), t.stopPropagation();
      let e = this.getAttribute("href");
      e && n(e, "", "_blank");
    }
    function s(t) {
      if (this.dataset.hydrated) {
        this.removeEventListener("keydown", s);
        return;
      }
      if (t.key !== "Enter") return;
      t.preventDefault(), t.stopPropagation();
      let e = this.getAttribute("href");
      if (!e) return;
      let i = this.getAttribute("rel") ?? "",
        r = this.getAttribute("target") ?? "";
      n(e, i, r);
    }
    document.querySelectorAll("[data-nested-link]").forEach((t) => {
      t instanceof HTMLElement &&
        (t.addEventListener("click", o),
        t.addEventListener("auxclick", a),
        t.addEventListener("keydown", s));
    });
  }
  return u;
})()()(() => {
  function i() {
    for (let e of document.querySelectorAll("[data-framer-original-sizes]")) {
      let t = e.getAttribute("data-framer-original-sizes");
      t === "" ? e.removeAttribute("sizes") : e.setAttribute("sizes", t),
        e.removeAttribute("data-framer-original-sizes");
    }
  }
  function a() {
    window.__framer_onRewriteBreakpoints = i;
  }
  return a;
})()();

!(function () {
  function c(t, r) {
    let e = r.indexOf("#"),
      n = e === -1 ? r : r.substring(0, e),
      o = e === -1 ? "" : r.substring(e),
      a = n.indexOf("?");
    if (a === -1) return n + t + o;
    let d = new URLSearchParams(t),
      h = n.substring(a + 1),
      s = new URLSearchParams(h);
    for (let [i, m] of d) s.has(i) || s.append(i, m);
    return n.substring(0, a + 1) + s.toString() + o;
  }
  var l = 'div#main a[href^="#"],div#main a[href^="/"],div#main a[href^="."]',
    u = "div#main a[data-framer-preserve-params]",
    f,
    g =
      (f = document.currentScript) == null
        ? void 0
        : f.hasAttribute("data-preserve-internal-params");
  if (
    window.location.search &&
    !/bot|-google|google-|yandex|ia_archiver|crawl|spider/iu.test(
      navigator.userAgent
    )
  ) {
    let t = document.querySelectorAll(g ? `${l},${u}` : u);
    for (let r of t) {
      let e = c(window.location.search, r.href);
      r.setAttribute("href", e);
    }
  }
})();
