import { define } from "./zowf.js";

const name = "todo-app"

const initialState = () => ({
	items: []
})

const listeners = {
	".add click": (evt, instance) => {
		const value = instance.shadowRoot.querySelector("#new-item").value;
		instance.$state.items.push(value)
		instance.$refresh();
	},
	".remove click": (evt, instance) => {
		const index = evt.target.dataset.index;
		instance.$state.items.splice(index, 1);
		instance.$refresh(".items, .counter");
	}
}

const template = state => `
<div class="title" style="box-shadow: 0 10px 10px rgba(0,0,0,0.2);padding: 50px">
	<h1>Todo list</h1>
	<div class="items" style="display: flex; align-items: stretch;flex-direction: column">
		${state.items.map((item,index) =>
			`<div class="item" style="display: flex;">
				<label style="flex-grow: 1">${item}</label>
				<button class="remove" data-index="${index}">&times;</button>
			</div>`
		).join("")}
	</div>
	<div class="new-item">
		<input id="new-item"/><button class="add">add</button>
	</div>
	<small class="counter">${state.items.length} items</small>
</div>`

define({
	name,
	initialState,
	template,
	listeners
});
