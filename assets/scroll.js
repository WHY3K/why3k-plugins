/* =========================================================
   WHY3K PLUGINS — スクロール演出
   ・reveal / stagger：ビューに入ったらフワッと出す
   ・header：スクロールで締まる
   ・[data-countup]：本物みたいにカウントアップ
   依存ライブラリなし。動きが苦手な人（reduce）には演出を抑制。
   ========================================================= */
(function () {
  var reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- スクロール・リビール ---- */
  var items = document.querySelectorAll('.reveal, .stagger');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---- ヘッダー：スクロールで締まる ---- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- カウントアップ・タイマー ---- */
  var timers = document.querySelectorAll('[data-countup]');
  if (timers.length && !reduce) {
    var pad = function (n, l) { n = String(n); while (n.length < l) n = '0' + n; return n; };
    var start = performance.now();
    var tick = function (now) {
      var t = Math.floor(now - start);
      var ms = t % 1000;
      var totalSec = Math.floor(t / 1000);
      var s = totalSec % 60;
      var m = Math.floor(totalSec / 60) % 60;
      var h = Math.floor(totalSec / 3600) % 100;
      var main = pad(h, 2) + ':' + pad(m, 2) + ':' + pad(s, 2);
      var html = main + '<span class="ms">.' + pad(ms, 3) + '</span>';
      timers.forEach(function (el) { el.innerHTML = html; });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
})();


/* =========================================================
   戻る/進むボタン＋ページ表示は毎回一番上から
   ========================================================= */
(function () {
  /* 凍結保存(bfcache)を無効化：戻る時は常に作りたてを読み込む */
  window.addEventListener('unload', function () {});
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  function toTop(e) {
    /* キャッシュ復元(bfcache)はヘッダー描画が壊れるので作り直す */
    if (e && e.persisted) { location.reload(); return; }
    if (location.hash) return;
    window.scrollTo(0, 0);
    requestAnimationFrame(function () { window.scrollTo(0, 0); });
    setTimeout(function () { window.scrollTo(0, 0); }, 80); /* iOSの非同期復元に勝つ */
    setTimeout(function () { window.scrollTo(0, 1); window.scrollTo(0, 0); }, 160); /* 固定ヘッダーの半切れ対策 */
  }
  window.addEventListener('pageshow', toTop);

  var b = document.getElementById('histBack');
  var f = document.getElementById('histFwd');
  if (!b || !f) return;
  function canBack() {
    if (window.navigation && 'canGoBack' in window.navigation) return window.navigation.canGoBack;
    return history.length > 1;
  }
  function update() {
    /* ←は常に有効：履歴がなければメインサイトへ戻る */
    b.disabled = false;
    if (window.navigation && 'canGoBack' in window.navigation) {
      f.disabled = !window.navigation.canGoForward;
    }
  }
  b.addEventListener('click', function () {
    if (canBack()) { history.back(); }
    else { window.location.href = 'https://why3k.github.io/'; }
  });
  f.addEventListener('click', function () { history.forward(); });
  update();
  window.addEventListener('pageshow', function (e) {
    update();
    if (!(window.navigation && 'canGoBack' in window.navigation)) {
      var nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
      if (e.persisted || (nav && nav.type === 'back_forward')) f.disabled = false;
    }
  });
  if (window.navigation && window.navigation.addEventListener) {
    window.navigation.addEventListener('currententrychange', update);
  }
})();
