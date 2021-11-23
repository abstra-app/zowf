const eventListeners = [];
export function define({
	name,
	initialState,
	template,
	listeners
}) {
		customElements.define(name,
		class extends HTMLElement {
			$state = initialState();

			$refresh(partialSelector) {
				if (partialSelector) {
					const clone = this.cloneNode();
					clone.shadowRoot.innerHTML = template(this.$state);
					const newPartials = Array.from(clone.shadowRoot.querySelectorAll(partialSelector));
					const oldPartials = Array.from(this.shadowRoot.querySelectorAll(partialSelector));
					if (newPartials.length !== oldPartials.length) throw new Error(`Can't partially refresh when selection count changes ${newPartials.length} !== ${oldPartials.length}`);
					oldPartials.forEach((item,index) => item.outerHTML = newPartials[index].outerHTML);
				} else {
					this.shadowRoot.innerHTML = template(this.$state);
				}
				Object.keys(listeners ?? {}).forEach(key => {
					const [selector, eventName] = key.split(" ");
					const elements = Array.from(this.shadowRoot.querySelectorAll(selector));
					const listener = event => listeners[key](event, this);
					elements.forEach(element => eventListeners.forEach(l => element.removeEventListener(eventName, l)));
					elements.forEach(element => element.addEventListener(eventName, listener));
					eventListeners.push(listener);
				});
			}
			constructor() {
				super();
				this.attachShadow({mode: 'open'});
				this.$refresh();
			}
		}
	);
}
