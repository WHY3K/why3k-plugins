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
