/* dc-lite: renders a Beerland design page (template + logic class) with Preact. */
(function () {
  var h = preact.h, render = preact.render;
  var HOLE_ALL = /^\{\{\s*([^}]+?)\s*\}\}$/;
  var HOLE = /\{\{\s*([^}]+?)\s*\}\}/g;

  function literal(path) {
    if (path === 'true') return { ok: true, v: true };
    if (path === 'false') return { ok: true, v: false };
    if (path === 'null') return { ok: true, v: null };
    if (/^-?\d+(\.\d+)?$/.test(path)) return { ok: true, v: Number(path) };
    var m = path.match(/^(['"])(.*)\1$/);
    if (m) return { ok: true, v: m[2] };
    return { ok: false };
  }

  function lookup(path, scopes) {
    var lit = literal(path);
    if (lit.ok) return lit.v;
    var parts = path.split('.');
    var head = parts[0], cur;
    for (var i = 0; i < scopes.length; i++) {
      if (scopes[i] && Object.prototype.hasOwnProperty.call(scopes[i], head)) { cur = scopes[i][head]; break; }
    }
    for (var j = 1; j < parts.length && cur != null; j++) cur = cur[parts[j]];
    return cur;
  }

  function interp(str, scopes) {
    return str.replace(HOLE, function (_, p) { var v = lookup(p, scopes); return v == null ? '' : String(v); });
  }

  function attrVal(value, scopes) {
    var m = value.match(HOLE_ALL);
    if (m) return lookup(m[1], scopes);
    return value.indexOf('{{') !== -1 ? interp(value, scopes) : value;
  }

  function build(node, scopes) {
    if (node.nodeType === 3) {
      var t = node.nodeValue;
      return t.indexOf('{{') === -1 ? t : interp(t, scopes);
    }
    if (node.nodeType !== 1) return null;
    var tag = node.tagName.toLowerCase();
    if (tag === 'sc-if') {
      var cond = attrVal(node.getAttribute('value') || '', scopes);
      return cond ? kids(node, scopes) : null;
    }
    if (tag === 'sc-for') {
      var list = attrVal(node.getAttribute('list') || '', scopes) || [];
      var as = node.getAttribute('as') || 'item';
      var out = [];
      for (var i = 0; i < list.length; i++) {
        var s = {}; s[as] = list[i]; s.$index = i;
        out.push(kids(node, [s].concat(scopes)));
      }
      return out;
    }
    var props = {};
    for (var a = 0; a < node.attributes.length; a++) {
      var at = node.attributes[a];
      if (at.name.indexOf('hint-') === 0) continue;
      props[at.name] = attrVal(at.value, scopes);
    }
    var name = node.namespaceURI === 'http://www.w3.org/2000/svg' ? node.localName : tag;
    return h.apply(null, [name, props].concat(kids(node, scopes)));
  }

  function kids(node, scopes) {
    var src = node.content ? node.content.childNodes : node.childNodes, out = [];
    for (var i = 0; i < src.length; i++) {
      var v = build(src[i], scopes);
      if (v !== null && v !== undefined) out.push(v);
    }
    return out;
  }

  function DCLogic() { this.state = {}; this.props = {}; }
  DCLogic.prototype.setState = function (part) {
    var next = typeof part === 'function' ? part(this.state, this.props) : part;
    this.state = Object.assign({}, this.state, next);
    this.__render();
  };
  DCLogic.prototype.forceUpdate = function () { this.__render(); };
  DCLogic.prototype.renderVals = function () { return {}; };

  function boot() {
    var tpl = document.getElementById('dc-template');
    var logic = document.getElementById('dc-logic');
    var mount = document.getElementById('app');
    var defs = {};
    try { defs = JSON.parse(logic.getAttribute('data-props') || '{}'); } catch (e) {}
    var props = {};
    Object.keys(defs).forEach(function (k) { if (k.charAt(0) !== '$' && defs[k] && 'default' in defs[k]) props[k] = defs[k].default; });
    var Component = new Function('DCLogic', logic.textContent + '\n;return Component;')(DCLogic);
    var c = new Component();
    c.props = props;
    if (!c.state) c.state = {};
    c.__render = function () { render(h(preact.Fragment, null, kids(tpl, [c.renderVals() || {}])), mount); };
    c.__render();
    if (typeof c.componentDidMount === 'function') c.componentDidMount();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
