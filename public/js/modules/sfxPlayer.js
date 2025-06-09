class SFXPlayer {
  constructor() {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.buffers = new Map();
  }

  async load(name, url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
    this.buffers.set(name, audioBuffer);
  }

  async loadAll(sounds) {
    const promises = Object.entries(sounds).map(([name, url]) => this.load(name, url));
    await Promise.all(promises);
  }

  play(name) {
    const buffer = this.buffers.get(name);
    if (!buffer) {
      console.warn(`Sound "${name}" not loaded`);
      return;
    }
    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.context.destination);
    source.start(0);
  }
}


export default SFXPlayer;