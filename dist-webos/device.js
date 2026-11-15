/* LG webOS 7.6.0 Luna Service & SSAP device adapter for CleanFrame. */
(function () {
  'use strict';

  var SELF = 'com.moldy.cleanframe';
  var SSAP_KEY_STORAGE = 'cleanframe.webos.ssapKey';
  var APPS_CACHE_STORAGE = 'cleanframe.webos.cachedLaunchPoints';

  var IDS = {
    youtube: 'youtube.leanback.v4',
    netflix: 'netflix',
    hbomax: 'com.wbd.stream',
    disneyplus: 'com.disney.disneyplus-prod',
    voyo: 'voyo',
    antenaplay: 'antenaplay',
    primevideo: 'amazon',
    stremio: 'com.stremio.heromes',
    spotify: 'spotify-beehive',
    appletv: 'com.apple.appletv',
    applemusic: 'com.apple.applemusic'
  };

  var CANDIDATES = {
    youtube: ['youtube.leanback.v4'],
    netflix: ['netflix'],
    hbomax: ['com.wbd.stream', 'com.hbo.hbomax'],
    disneyplus: ['com.disney.disneyplus-prod', 'com.disney.disneyplus-eu'],
    voyo: ['ro.protv.voyo', 'voyo', 'com.cetv.voyo'],
    antenaplay: ['antenaplay', 'ro.antenaplay.app', 'com.antenaplay.app'],
    primevideo: ['amazon', 'amazon.html5', 'lovefilm.de'],
    stremio: ['com.stremio.heromes', 'com.stremio.app', 'stremio.tv.app'],
    spotify: ['spotify-beehive'],
    appletv: ['com.apple.appletv'],
    applemusic: ['com.apple.applemusic'],
    skyshowtime: ['com.skyshowtime.lg', 'skyshowtime'],
    twitch: ['tv.twitch.tv.starshot.lg'],
    plex: ['cdp-30'],
    rakuten: ['ui30', 'rakuten.tv']
  };

  var DEFAULT_CATALOG = [
    { appId: 'youtube.leanback.v4', name: 'YouTube', brand: 'youtube', rank: 0 },
    { appId: 'netflix', name: 'Netflix', brand: 'netflix', rank: 1 },
    { appId: 'com.wbd.stream', name: 'Max', brand: 'hbomax', rank: 2 },
    { appId: 'com.disney.disneyplus-prod', name: 'Disney+', brand: 'disneyplus', rank: 3 },
    { appId: 'ro.protv.voyo', name: 'VOYO', brand: 'voyo', rank: 4 },
    { appId: 'antenaplay', name: 'AntenaPlay', brand: 'antenaplay', rank: 5 },
    { appId: 'amazon', name: 'Prime Video', brand: 'primevideo', rank: 6 },
    { appId: 'com.stremio.heromes', name: 'Stremio', brand: 'stremio', rank: 7 },
    { appId: 'spotify-beehive', name: 'Spotify', brand: 'spotify', rank: 8 },
    { appId: 'com.apple.appletv', name: 'Apple TV', brand: 'appletv', rank: 9 },
    { appId: 'com.webos.app.hdmi1', name: 'HDMI 1', brand: '', rank: 8 },
    { appId: 'com.webos.app.hdmi2', name: 'HDMI 2', brand: '', rank: 9 },
    { appId: 'com.webos.app.hdmi3', name: 'HDMI 3', brand: '', rank: 10 },
    { appId: 'com.webos.app.livetv', name: 'Live TV', brand: '', rank: 11 },
    { appId: 'com.webos.app.browser', name: 'Web Browser', brand: '', rank: 12 },
    { appId: 'com.skyshowtime.lg', name: 'SkyShowtime', brand: '', rank: 13 },
    { appId: 'com.apple.applemusic', name: 'Apple Music', brand: 'applemusic', rank: 14 },
    { appId: 'tv.twitch.tv.starshot.lg', name: 'Twitch', brand: '', rank: 15 },
    { appId: 'cdp-30', name: 'Plex', brand: '', rank: 16 },
    { appId: 'com.webos.app.photovideo', name: 'Media Player', brand: '', rank: 17 },
    { appId: 'com.palm.app.settings', name: 'TV Settings', brand: '', rank: 18 }
  ];

  var HDMI_APPS = [
    { number: 1, id: 'com.webos.app.hdmi1', name: 'HDMI 1' },
    { number: 2, id: 'com.webos.app.hdmi2', name: 'HDMI 2' },
    { number: 3, id: 'com.webos.app.hdmi3', name: 'HDMI 3' }
  ];

  var BRAND_ALIASES = {
    'IkWsFHtOY9.Stremio': 'stremio',
    'com.stremio.app': 'stremio',
    'com.stremio.heromes': 'stremio',
    'stremio': 'stremio',
    'org.tizen.netflix-app': 'netflix',
    'netflix': 'netflix',
    'MCmYXNxgcu.DisneyPlus': 'disneyplus',
    'com.disney.disneyplus-prod': 'disneyplus',
    'disneyplus': 'disneyplus',
    '9Ur5IzDKqV.TizenYouTube': 'youtube',
    'youtube.leanback.v4': 'youtube',
    'youtube': 'youtube',
    'com.samsung.tv.aria-video': 'appletv',
    'com.apple.appletv': 'appletv',
    'appletv': 'appletv',
    'org.tizen.primevideo': 'primevideo',
    'amazon': 'primevideo',
    'primevideo': 'primevideo',
    'org.tizen.apple.apple-music': 'applemusic',
    'com.apple.applemusic': 'applemusic',
    'applemusic': 'applemusic',
    'rJeHak5zRg.Spotify': 'spotify',
    'spotify-beehive': 'spotify',
    'spotify': 'spotify',
    '5b8c3eb16b.BeamCTVDev': 'hbomax',
    'cj37Ni3qXM.HBONow': 'hbomax',
    'com.hbo.hbomax': 'hbomax',
    'com.wbd.stream': 'hbomax',
    'hbomax': 'hbomax',
    'com.skyshowtime.lg': 'skyshowtime',
    'tv.twitch.tv.starshot.lg': 'twitch',
    'cdp-30': 'plex',
    'hdmi1': 'com.webos.app.hdmi1',
    'hdmi2': 'com.webos.app.hdmi2',
    'hdmi3': 'com.webos.app.hdmi3'
  };

  var SSAP_MANIFEST = {
    manifestVersion: 1,
    appVersion: '1.0.0',
    signed: {
      created: '20140509',
      appId: 'com.lge.test',
      vendorId: 'com.lge',
      localizedAppNames: {
        '': 'CleanFrame',
        'en-US': 'CleanFrame',
        'ro-RO': 'CleanFrame'
      },
      localizedVendorNames: {
        '': 'LG Electronics'
      },
      permissions: [
        'TEST_SECURE',
        'CONTROL_INPUT_TEXT',
        'CONTROL_MOUSE_AND_KEYBOARD',
        'READ_INSTALLED_APPS',
        'READ_LGE_SDX',
        'READ_NOTIFICATIONS',
        'SEARCH',
        'WRITE_SETTINGS',
        'WRITE_NOTIFICATION_ALERT',
        'CONTROL_POWER',
        'READ_CURRENT_CHANNEL',
        'READ_RUNNING_APPS',
        'READ_UPDATE_INFO',
        'UPDATE_FROM_REMOTE_APP',
        'READ_LGE_TV_INPUT_EVENTS',
        'READ_TV_CURRENT_TIME'
      ],
      serial: '2f930e2d2cfe083771f68e4fe7bb07'
    },
    permissions: [
      'LAUNCH',
      'LAUNCH_WEBAPP',
      'APP_TO_APP',
      'CLOSE',
      'TEST_OPEN',
      'TEST_PROTECTED',
      'CONTROL_AUDIO',
      'CONTROL_DISPLAY',
      'CONTROL_INPUT_JOYSTICK',
      'CONTROL_INPUT_MEDIA_RECORDING',
      'CONTROL_INPUT_MEDIA_PLAYBACK',
      'CONTROL_INPUT_TV',
      'CONTROL_POWER',
      'READ_APP_STATUS',
      'READ_CURRENT_CHANNEL',
      'READ_INPUT_DEVICE_LIST',
      'READ_NETWORK_STATE',
      'READ_RUNNING_APPS',
      'READ_TV_CHANNEL_LIST',
      'WRITE_NOTIFICATION_TOAST',
      'READ_POWER_STATE',
      'READ_COUNTRY_INFO',
      'READ_INSTALLED_APPS'
    ]
  };

  var discoveredByBrand = {};
  var discoveredById = {};
  var activeBridges = {};
  var nextBridgeId = 1;

  function ensureWebOS() {
    if (window.webOS && window.webOS.service && typeof window.webOS.service.request === 'function') {
      return window.webOS;
    }
    if (typeof window.PalmServiceBridge !== 'function') {
      return null;
    }
    window.webOS = window.webOS || {};
    window.webOS.service = {
      request: function (uri, params) {
        var opts = params || {};
        var base = String(uri || '').replace(/\/+$/, '');
        var method = opts.method ? String(opts.method).replace(/^\/+/, '') : '';
        var fullUri = method && base.slice(-(method.length + 1)) !== '/' + method ? base + '/' + method : base;
        var payload = {}, k;
        if (opts.parameters && typeof opts.parameters === 'object') {
          for (k in opts.parameters) {
            if (Object.prototype.hasOwnProperty.call(opts.parameters, k)) {
              payload[k] = opts.parameters[k];
            }
          }
        }
        if (opts.subscribe) payload.subscribe = true;
        var id = nextBridgeId++;
        var bridge = new window.PalmServiceBridge();
        activeBridges[id] = bridge;
        bridge.onservicecallback = function (msg) {
          if (!payload.subscribe) delete activeBridges[id];
          var res;
          try {
            res = typeof msg === 'string' ? JSON.parse(msg) : (msg || {});
          } catch (e) {
            res = { returnValue: false, errorText: String(msg || e) };
          }
          if (res.returnValue === false) {
            if (typeof opts.onFailure === 'function') opts.onFailure(res);
          } else {
            if (typeof opts.onSuccess === 'function') opts.onSuccess(res);
          }
          if (typeof opts.onComplete === 'function') opts.onComplete(res);
        };
        bridge.call(fullUri, JSON.stringify(payload));
        return {
          cancel: function () {
            try { if (typeof bridge.cancel === 'function') bridge.cancel(); } catch (e) { /* ignore */ }
            delete activeBridges[id];
          }
        };
      }
    };
    return window.webOS;
  }

  function selfId() {
    try {
      if (window.webOS && typeof window.webOS.fetchAppId === 'function') {
        return window.webOS.fetchAppId() || SELF;
      }
      if (window.PalmSystem && typeof window.PalmSystem.identifier === 'string') {
        return window.PalmSystem.identifier.split(' ')[0] || SELF;
      }
    } catch (err) { /* ignore */ }
    return SELF;
  }

  function unavailable(done) {
    done({ message: 'Open CleanFrame on the LG TV to use this control.', detail: 'The web preview cannot control the TV.' });
  }

  function failure(err) {
    var detail = (err && (err.errorText || err.message || err.name)) || 'Make sure this app is installed on your LG TV.';
    return { message: 'Could not open this app on the TV.', detail: detail };
  }

  function bounded(done, timeout) {
    var finished = false;
    var timer = setTimeout(function () {
      finish({ message: 'The TV did not respond. Please try again.' });
    }, timeout || 8000);
    function finish(err, value) {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      done(err, value);
    }
    return finish;
  }

  function detectBrand(appId, title) {
    var id = String(appId || '');
    var name = String(title || '');
    var combined = (id + ' ' + name).toLowerCase();
    if (BRAND_ALIASES[id] && IDS[BRAND_ALIASES[id]]) return BRAND_ALIASES[id];
    if (combined.indexOf('voyo') >= 0) return 'voyo';
    if (/antena\s*play|antenaplay/i.test(combined)) return 'antenaplay';
    if (combined.indexOf('stremio') >= 0) return 'stremio';
    if (id === 'netflix' || /\bnetflix\b/i.test(name)) return 'netflix';
    if (combined.indexOf('disney') >= 0) return 'disneyplus';
    if (id === 'youtube.leanback.v4' || /^youtube$/i.test(name.trim())) return 'youtube';
    if (/apple\s*tv/i.test(name) || /appletv/i.test(id)) return 'appletv';
    if (id === 'amazon' || /prime\s*video/i.test(name) || /^amazon/i.test(id)) return 'primevideo';
    if (/apple\s*music/i.test(name) || /applemusic/i.test(id)) return 'applemusic';
    if (combined.indexOf('spotify') >= 0) return 'spotify';
    if (/hbo\s*max|^max$/i.test(name.trim()) || /hbomax|wbd\.stream/i.test(id)) return 'hbomax';
    return '';
  }

  function normalizeIcon(path) {
    if (!path || typeof path !== 'string') return '';
    if (/^(?:\/[^\/]|file:\/\/\/|wgt-package:\/\/\/)/.test(path)) return path;
    if (/^file:\/\//.test(path)) return 'file:///' + path.replace(/^file:\/\/+/, '');
    return '';
  }

  function loadCachedLaunchPoints() {
    try {
      var raw = localStorage.getItem(APPS_CACHE_STORAGE);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveCachedLaunchPoints(points) {
    try {
      if (Array.isArray(points) && points.length > 0) {
        localStorage.setItem(APPS_CACHE_STORAGE, JSON.stringify(points));
      }
    } catch (e) { /* ignore */ }
  }

  function fetchLaunchPointsViaSSAP(done) {
    if (typeof window.WebSocket !== 'function') {
      done(new Error('WebSocket unavailable'), []);
      return;
    }
    var finished = false;
    var ws = null;
    var timer = setTimeout(function () {
      complete(new Error('SSAP timeout'), []);
    }, 15000);

    function complete(err, points) {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      try { if (ws) ws.close(); } catch (e) { /* ignore */ }
      done(err, points || []);
    }

    try {
      ws = new window.WebSocket('ws://127.0.0.1:3000');
    } catch (err) {
      complete(err, []);
      return;
    }

    ws.onopen = function () {
      var savedKey = null;
      try { savedKey = localStorage.getItem(SSAP_KEY_STORAGE); } catch (e) { /* ignore */ }
      var regPayload = {
        forcePairing: false,
        pairingType: 'PROMPT',
        manifest: SSAP_MANIFEST
      };
      if (savedKey) regPayload['client-key'] = savedKey;
      try {
        ws.send(JSON.stringify({
          id: 'reg_1',
          type: 'register',
          payload: regPayload
        }));
      } catch (e) {
        complete(e, []);
      }
    };

    ws.onmessage = function (ev) {
      var msg;
      try { msg = JSON.parse(ev.data); } catch (e) { return; }
      if (!msg) return;
      if (msg.type === 'registered') {
        if (msg.payload && msg.payload['client-key']) {
          try { localStorage.setItem(SSAP_KEY_STORAGE, msg.payload['client-key']); } catch (e) { /* ignore */ }
        }
        try {
          ws.send(JSON.stringify({
            id: 'lp_1',
            type: 'request',
            uri: 'ssap://com.webos.applicationManager/listLaunchPoints'
          }));
        } catch (e) {
          complete(e, []);
        }
      } else if (msg.id === 'lp_1' && msg.type === 'response') {
        var pts = (msg.payload && Array.isArray(msg.payload.launchPoints)) ? msg.payload.launchPoints : [];
        if (pts.length > 0) saveCachedLaunchPoints(pts);
        complete(null, pts);
      } else if (msg.type === 'error') {
        complete(new Error(msg.error || 'SSAP error'), []);
      }
    };

    ws.onerror = function () {
      complete(new Error('WebSocket connection error'), []);
    };
  }

  function listLaunchPointsRaw(done) {
    var wos = ensureWebOS();
    if (!wos) {
      done(null, loadCachedLaunchPoints());
      return;
    }
    var finish = bounded(done, 18000);
    try {
      wos.service.request('luna://com.webos.applicationManager/listLaunchPoints', {
        parameters: {},
        onSuccess: function (res) {
          var points = (res && Array.isArray(res.launchPoints)) ? res.launchPoints : [];
          if (points.length > 0) {
            saveCachedLaunchPoints(points);
            finish(null, points);
            return;
          }
          fetchLaunchPointsViaSSAP(function (ssapErr, ssapPoints) {
            finish(null, ssapPoints && ssapPoints.length ? ssapPoints : loadCachedLaunchPoints());
          });
        },
        onFailure: function () {
          fetchLaunchPointsViaSSAP(function (ssapErr, ssapPoints) {
            finish(null, ssapPoints && ssapPoints.length ? ssapPoints : loadCachedLaunchPoints());
          });
        }
      });
    } catch (err) {
      fetchLaunchPointsViaSSAP(function (ssapErr, ssapPoints) {
        finish(null, ssapPoints && ssapPoints.length ? ssapPoints : loadCachedLaunchPoints());
      });
    }
  }

  function candidateIdsFor(id) {
    var list = [];
    function add(x) {
      if (x && list.indexOf(x) < 0) list.push(x);
    }
    if (!id) return list;
    if (id === 'hdmi1' || id === 'hdmi2' || id === 'hdmi3') {
      add('com.webos.app.' + id);
      return list;
    }
    var brand = BRAND_ALIASES[id] || (CANDIDATES[id] ? id : '');
    if (brand && discoveredByBrand[brand]) add(discoveredByBrand[brand]);
    if (brand && CANDIDATES[brand]) {
      CANDIDATES[brand].forEach(add);
    }
    if (brand && IDS[brand]) add(IDS[brand]);
    add(id);
    return list;
  }

  var sourceCancel = null;
  function cancelSource() {
    if (sourceCancel) sourceCancel();
  }

  function sources(done) {
    var list = HDMI_APPS.map(function (hdmi) {
      return {
        number: hdmi.number,
        id: hdmi.id,
        name: hdmi.name,
        connected: true,
        active: false,
        source: hdmi
      };
    });
    done(null, list);
  }

  function setSource(port, done) {
    cancelSource();
    var wos = ensureWebOS();
    if (typeof port !== 'number' || !isFinite(port) || port < 1 || port > 3 || Math.floor(port) !== port) {
      done({ message: 'This HDMI input is not available.' });
      return;
    }
    if (!wos) {
      unavailable(done);
      return;
    }
    var finished = false;
    var timer = setTimeout(function () {
      finish({ message: 'The TV did not respond. Please try again.' });
    }, 8000);
    function finish(err, value) {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      if (sourceCancel === cancel) sourceCancel = null;
      done(err, value);
    }
    function cancel() {
      finish({ message: 'Input change cancelled.', cancelled: true });
    }
    sourceCancel = cancel;
    var hdmiId = 'com.webos.app.hdmi' + port;
    try {
      wos.service.request('luna://com.webos.applicationManager/launch', {
        parameters: { id: hdmiId },
        onSuccess: function () {
          finish(null, { number: port, id: hdmiId, name: 'HDMI ' + port, connected: true, active: true });
        },
        onFailure: function (err) {
          finish(failure(err));
        }
      });
    } catch (err) {
      finish(failure(err));
    }
  }

  function launchApp(id, done) {
    var wos = ensureWebOS();
    if (!wos) {
      unavailable(done);
      return;
    }
    var finish = bounded(done);
    var candidates = candidateIdsFor(id);
    if (!candidates.length) {
      finish({ message: 'This app has no launch target.' });
      return;
    }
    function tryIndex(idx, lastErr) {
      if (idx >= candidates.length) {
        finish(failure(lastErr));
        return;
      }
      var targetId = candidates[idx];
      try {
        wos.service.request('luna://com.webos.applicationManager/launch', {
          parameters: { id: targetId },
          onSuccess: function () {
            finish(null);
          },
          onFailure: function (err) {
            tryIndex(idx + 1, err);
          }
        });
      } catch (err) {
        tryIndex(idx + 1, err);
      }
    }
    tryIndex(0, null);
  }

  function launch(brand, done) {
    launchApp(brand, done);
  }

  function art(done) {
    launchApp('com.webos.app.igallery', function (err) {
      if (!err) { done(null); return; }
      launchApp('com.webos.app.photovideo', done);
    });
  }

  function home(done) {
    launchApp('com.webos.app.livetv', function (err) {
      if (!err) { done(null); return; }
      try { window.close(); done(null); }
      catch (e) { done(failure(err)); }
    });
  }

  function settings(done) {
    launchApp('com.palm.app.settings', done);
  }

  function apps(done) {
    var finish = bounded(done, 20000);
    var primaryKeys = Object.keys(IDS);
    listLaunchPointsRaw(function (err, list) {
      var seen = {}, result = [], self = selfId();
      var points = (!err && Array.isArray(list) && list.length > 0) ? list : loadCachedLaunchPoints();
      if (Array.isArray(points) && points.length > 0) {
        points.forEach(function (lp) {
          if (!lp || !lp.id || lp.id === self || lp.id === SELF || seen[lp.id] || lp.visible === false) return;
          var title = String(lp.title || lp.appDescription || '').trim();
          if (!title) return;
          seen[lp.id] = true;
          discoveredById[lp.id] = true;
          var brand = detectBrand(lp.id, title);
          if (brand && !discoveredByBrand[brand]) {
            discoveredByBrand[brand] = lp.id;
            if (IDS[brand]) IDS[brand] = lp.id;
          }
          var primaryIdx = brand ? primaryKeys.indexOf(brand) : -1;
          var isPrimary = primaryIdx >= 0;
          result.push({
            appId: lp.id,
            name: title,
            brand: brand,
            icon: normalizeIcon(lp.icon || lp.largeIcon || ''),
            rank: isPrimary ? primaryIdx : 15
          });
        });
      }

      DEFAULT_CATALOG.forEach(function (item) {
        if (seen[item.appId]) return;
        if (item.brand && discoveredByBrand[item.brand]) return;
        seen[item.appId] = true;
        result.push({
          appId: item.appId,
          name: item.name,
          brand: item.brand || '',
          icon: '',
          rank: item.rank + 30
        });
      });

      result.sort(function (a, b) {
        return a.rank - b.rank || a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      });
      finish(null, result);
    });
  }

  window.FrameDevice = {
    launch: launch,
    launchApp: launchApp,
    art: art,
    home: home,
    settings: settings,
    apps: apps,
    sources: sources,
    setSource: setSource,
    cancelSource: cancelSource
  };
}());
