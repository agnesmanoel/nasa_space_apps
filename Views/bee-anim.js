// UMD simples: window.BeeAnimator
(function(){
  class BeeAnimator {
    /**
     * @param {HTMLImageElement} el  <img> alvo
     * @param {Object} opts
     *  - basePath: caminho da pasta (ex: "../assets/abelha")
     *  - prefix:   prefixo dos arquivos (ex: "abelha")
     *  - ext:      extensão ("png" | "jpg" | "webp")
     *  - frames:   total de frames (ex: 10 p/ 0..9)
     *  - fps:      quadros por segundo (ex: 12)
     *  - scale:    escala numérica (1 = 100%)
     *  - autoplay: se inicia tocando
     *  - loop:     se repete
     */
    constructor(el, {
      basePath="../assets/abelha",
      prefix="abelha",
      ext="png",
      frames=10,
      fps=12,
      scale=1,
      autoplay=true,
      loop=true
    } = {}) {
      this.el = el;
      this.basePath = basePath;
      this.prefix = prefix;
      this.ext = ext;
      this.total = frames;
      this.fps = fps;
      this.msPerFrame = 1000 / Math.max(1, fps);
      this.loop = loop;

      this._images = [];
      this._loaded = 0;
      this._playing = false;
      this._raf = 0;
      this._last = 0;
      this._acc = 0;
      this._frame = 0;

      // aplica escala via CSS var (mais fácil de reaproveitar por página)
      this.setScale(scale);

      // pré-carrega
      this._preload().then(() => {
        // garante primeiro frame visível
        this._applyFrame(0);
        if (autoplay) this.play();
      });

      // pausa quando a aba fica oculta
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) this.pause();
        else if (autoplay) this.play();
      });
    }

    setScale(v=1){
      if (!this.el) return;
      this.el.style.setProperty('--bee-scale', String(v));
    }

    setFPS(fps=12){
      this.fps = fps;
      this.msPerFrame = 1000 / Math.max(1, fps);
    }

    play(){
      if (this._playing) return;
      this._playing = true;
      this._last = performance.now();
      const tick = (now) => {
        if (!this._playing) return;
        const dt = now - this._last;
        this._last = now;
        this._acc += dt;
        while (this._acc >= this.msPerFrame) {
          this._acc -= this.msPerFrame;
          this._nextFrame();
        }
        this._raf = requestAnimationFrame(tick);
      };
      this._raf = requestAnimationFrame(tick);
    }

    pause(){
      this._playing = false;
      cancelAnimationFrame(this._raf);
    }

    stop(){
      this.pause();
      this._frame = 0;
      this._applyFrame(0);
    }

    destroy(){
      this.pause();
      this._images = [];
    }

    /* ---------------------- internos ---------------------- */
    _preload(){
      return new Promise((resolve) => {
        if (this.total <= 0) return resolve();
        for (let i = 0; i < this.total; i++){
          const img = new Image();
          img.decoding = 'async';
          img.loading = 'eager';
          img.src = `${this.basePath}/${this.prefix}${i}.${this.ext}`;
          img.onload = () => {
            this._loaded++;
            if (this._loaded === this.total) resolve();
          };
          img.onerror = () => {
            // mesmo com erro, avança para não travar
            this._loaded++;
            if (this._loaded === this.total) resolve();
          };
          this._images.push(img);
        }
      });
    }

    _applyFrame(i){
      const frame = this._images[i];
      if (frame && frame.src) this.el.src = frame.src;
    }

    _nextFrame(){
      this._frame++;
      if (this._frame >= this.total){
        if (this.loop) this._frame = 0;
        else { this._frame = this.total - 1; this.pause(); }
      }
      this._applyFrame(this._frame);
    }
  }

  window.BeeAnimator = BeeAnimator;
})();

