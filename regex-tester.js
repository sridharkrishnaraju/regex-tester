/**
 * <regex-tester> — test a regular expression against a string, with live match highlighting.
 * Starts pre-loaded with a working example. Zero dependencies.
 * Built & maintained by SGBP — Singapore Build Partners (https://sgbp.tech). MIT.
 */
class RegexTester extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: "open" }); }
  connectedCallback() { this.render(); }
  _esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  _run() {
    const $ = (s) => this.shadowRoot.querySelector(s);
    const pat = $("#pattern").value, flags = $("#flags").value, str = $("#in").value, out = $("#out");
    if (!pat) { out.innerHTML = ""; return; }
    let re;
    try { re = new RegExp(pat, flags); } catch (e) { out.innerHTML = `<p class="err">Invalid regex: ${this._esc(e.message)}</p>`; return; }
    const matches = [];
    if (flags.includes("g")) { let m; while ((m = re.exec(str)) !== null) { matches.push(m); if (m.index === re.lastIndex) re.lastIndex++; } }
    else { const m = re.exec(str); if (m) matches.push(m); }
    let html = "", last = 0;
    for (const m of matches) { html += this._esc(str.slice(last, m.index)) + "<mark>" + this._esc(m[0]) + "</mark>"; last = m.index + m[0].length; }
    html += this._esc(str.slice(last));
    const list = matches.length
      ? matches.map((m, i) => `<div class="m"><b>Match ${i + 1}:</b> <code>${this._esc(m[0])}</code>${m.length > 1 ? ` <span class="g">groups: ${m.slice(1).map((g) => this._esc(g == null ? "—" : g)).join(", ")}</span>` : ""}</div>`).join("")
      : `<div class="m none">No matches.</div>`;
    out.innerHTML = `<div class="hl">${html || "&nbsp;"}</div><div class="cnt">${matches.length} match(es)</div>${list}`;
  }
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        *,*::before,*::after{box-sizing:border-box}
        :host{display:block;width:100%;max-width:620px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
        .card{border:1px solid #e2e2e2;border-radius:12px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.06);padding:16px}
        .top{display:flex;gap:8px;align-items:flex-end;margin-bottom:10px;flex-wrap:wrap}
        .fld{flex:1;min-width:140px}
        label{display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:600;color:#555;margin-bottom:5px}
        .mini{font:inherit;font-size:11px;font-weight:700;color:#EB0028;background:none;border:0;cursor:pointer}
        input,textarea{width:100%;padding:9px 10px;border:1px solid #ccc;border-radius:8px;font-family:ui-monospace,Menlo,monospace;font-size:14px}
        .flags{flex:0 0 90px;min-width:70px}
        textarea{min-height:80px;resize:vertical}
        .hl{margin-top:14px;padding:10px;border:1px solid #eee;border-radius:8px;background:#fafafa;font-family:ui-monospace,monospace;font-size:13px;line-height:1.6;white-space:pre-wrap;word-break:break-word}
        mark{background:#ffe39a;color:#5a4500;border-radius:3px;padding:0 1px}
        .cnt{font-size:12px;font-weight:700;color:#137333;margin:10px 0 6px}
        .m{font-size:12.5px;color:#444;padding:3px 0}.m code{background:#f1f1f1;border-radius:4px;padding:1px 5px}
        .g{color:#888;font-size:11px}.none{color:#888}
        .err{color:#c5221f;font-size:13px}
      </style>
      <div class="card">
        <div class="top">
          <div class="fld"><label>Pattern</label><input id="pattern" value="(\\w+)@(\\w+\\.\\w+)" spellcheck="false"></div>
          <div class="flags"><label>Flags</label><input id="flags" value="g" spellcheck="false"></div>
        </div>
        <label>Test string <button class="mini" id="clear">Clear</button></label>
        <textarea id="in" spellcheck="false">Contact us at hello@sgbp.tech or sales@example.com for a quote.</textarea>
        <div id="out"></div>
      </div>`;
    const $ = (s) => this.shadowRoot.querySelector(s);
    ["#pattern", "#flags", "#in"].forEach((s) => $(s).addEventListener("input", () => this._run()));
    $("#clear").addEventListener("click", () => { $("#pattern").value = ""; $("#in").value = ""; $("#out").innerHTML = ""; $("#pattern").focus(); });
    this._run();
  }
}
if (!customElements.get("regex-tester")) customElements.define("regex-tester", RegexTester);
