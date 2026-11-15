/* LG webOSTV.js compatible Luna Service bridge for webOS 7.6.0 */
(function () {
  'use strict';
  var webOS = window.webOS || {};
  var activeBridges = {};
  var nextRequestId = 1;

  webOS.platform = webOS.platform || { tv: true };

  webOS.fetchAppId = function () {
    try {
      if (window.PalmSystem && typeof window.PalmSystem.identifier === 'string') {
        return window.PalmSystem.identifier.split(' ')[0] || 'com.moldy.cleanframe';
      }
    } catch (e) { /* fallback */ }
    return 'com.moldy.cleanframe';
  };

  function buildFullUri(uri, method) {
    var base = String(uri || '').replace(/\/+$/, '');
    var m = method ? String(method).replace(/^\/+/, '') : '';
    if (!m) return base;
    if (base.slice(-(m.length + 1)) === '/' + m) return base;
    return base + '/' + m;
  }

  function cloneParams(src, subscribe) {
    var out = {}, k;
    if (src && typeof src === 'object') {
      for (k in src) {
        if (Object.prototype.hasOwnProperty.call(src, k)) {
          out[k] = src[k];
        }
      }
    }
    if (subscribe) out.subscribe = true;
    return out;
  }

  function request(uri, params) {
    var opts = params || {};
    var fullUri = buildFullUri(uri, opts.method);
    var payload = cloneParams(opts.parameters, opts.subscribe);
    var reqId = nextRequestId++;
    var cancelled = false;
    var bridge = null;

    var handle = {
      uri: fullUri,
      params: opts,
      cancel: function () {
        if (cancelled) return;
        cancelled = true;
        if (bridge && typeof bridge.cancel === 'function') {
          try { bridge.cancel(); } catch (e) { /* ignore */ }
        }
        delete activeBridges[reqId];
      }
    };

    if (typeof window.PalmServiceBridge !== 'function') {
      setTimeout(function () {
        if (cancelled) return;
        var err = { returnValue: false, errorCode: -1, errorText: 'PalmServiceBridge is not available in this environment.' };
        if (typeof opts.onFailure === 'function') opts.onFailure(err);
        if (typeof opts.onComplete === 'function') opts.onComplete(err);
      }, 0);
      return handle;
    }

    try {
      bridge = new window.PalmServiceBridge();
      activeBridges[reqId] = bridge;
      bridge.onservicecallback = function (msg) {
        if (cancelled) return;
        if (!payload.subscribe) {
          delete activeBridges[reqId];
        }
        var res;
        try {
          res = typeof msg === 'string' ? JSON.parse(msg) : (msg || {});
        } catch (err) {
          res = { returnValue: false, errorCode: -1, errorText: String(msg || err) };
        }
        if (res.returnValue === false || (res.returnValue === undefined && res.errorCode !== undefined)) {
          if (typeof opts.onFailure === 'function') opts.onFailure(res);
        } else {
          if (typeof opts.onSuccess === 'function') opts.onSuccess(res);
        }
        if (typeof opts.onComplete === 'function') opts.onComplete(res);
      };
      bridge.call(fullUri, JSON.stringify(payload));
    } catch (err) {
      delete activeBridges[reqId];
      setTimeout(function () {
        if (cancelled) return;
        var res = { returnValue: false, errorCode: -1, errorText: err && err.message ? err.message : String(err) };
        if (typeof opts.onFailure === 'function') opts.onFailure(res);
        if (typeof opts.onComplete === 'function') opts.onComplete(res);
      }, 0);
    }

    return handle;
  }

  webOS.service = webOS.service || {};
  if (typeof webOS.service.request !== 'function') {
    webOS.service.request = request;
  }

  window.webOS = webOS;
}());
