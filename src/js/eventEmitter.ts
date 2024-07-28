export class EventEmitter {
  subscribers = {};

  subscribe(eventName: string, callback: Function) {
    if (!this.subscribers[eventName]) {
      this.subscribers[eventName] = [];
    }
    this.subscribers[eventName].push(callback);
  }

  emit(eventName: string,...args) {
    if (this.subscribers[eventName]) {
      this.subscribers[eventName].forEach(callback => callback(...args));
    }
  }

  unSubscribe(eventName: string, callback) {
    this.subscribers[eventName] = this.subscribers[eventName].filter(call => call !== callback);
  }
}