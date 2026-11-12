export class StoryPlayer {
  constructor(count, duration = 5000) {
    this.count = count;
    this.duration = duration;
    this.index = 0;
    this.elapsed = 0;
  }

  goTo(index) {
    this.index = (index % this.count + this.count) % this.count;
    this.elapsed = 0;
  }

  next() { this.goTo(this.index + 1); }
  previous() { this.goTo(this.index - 1); }

  tick(delta) {
    this.elapsed += Math.max(0, delta);
    const steps = Math.floor(this.elapsed / this.duration);
    if (!steps) return false;
    this.index = (this.index + steps) % this.count;
    this.elapsed %= this.duration;
    return true;
  }
}
