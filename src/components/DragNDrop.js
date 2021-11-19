

class DragNDrop {

    defaults = {
        draggableClass: 'draggable', // to get draggable elements
        droppableClass: 'droppable', // to get droppable elements
        draggingClass: 'dragging',  // a className to be applied on draggable during the drag
        dropHoverClass: 'can-drop', // a className to be applied on droppable while some draggable is over
        animationTime: 120,         // animations duration on catch (if centerOnGet), drop and cancel
        centerOnGet: false,         // center element with mouse pointer on catch
        dragIndex: 9999             // z-index to be applied on draggable during the drag
    };
    config = {};
    info = {};

    constructor(cfg = {}) {
		if (Object.keys(cfg).length) {
			this.start(cfg);
		}
    }

	start(cfg) {
		this.config = { ...this.defaults, ...cfg };
        this.resetInfo();
		// this.destroy();
		// this.applyBehaviors();
	}

	css(el, obj) {
		Object.assign(el.style, obj);
	}

	getStyle(el, prop = '') {
		const style = getComputedStyle(el);
		if (prop) {
			return style[prop];
		}
		return style;
	}

	apply(selector, fn) {
		const elms = Array.from(document.querySelectorAll(selector));
		for (let i = 0; i < elms.length; i++) {
			fn(elms[i]);
		}
	}

	offset(el) {
		const { top, left, width, height } = el.getBoundingClientRect();
        return { top, left, width, height };
	}

	getOffset(el) {
		let parent = el;
		let ret = { top: 0, left: 0 };
		while (parent.tagName.toLowerCase() !== 'body') {
			parent = parent.offsetParent;
			if (this.getStyle(parent, 'position') !== 'static') {
				let { top, left } = this.offset(parent);
				ret = this.addScroll({ top, left });
			}
		}
		if ('body' == parent.tagName.toLowerCase()) {
			ret = this.addScroll({ top: 0, left: 0 });
		}
		return ret;
	}

	addScroll(coords) {
		coords.top = coords.top - window.scrollY;
		coords.left = coords.left - window.scrollX;
		return coords;
	}

	addOffset(coords) {
		coords.top = coords.top - this.info.offset.top;
		coords.left = coords.left - this.info.offset.left;
		return coords;
	}

	cancel() {
		const { top, left } = this.addOffset(this.info.elementStartPos);
		this.move(left, top);
		this.finish(false);
	}

	move(x, y, time = this.config.animationTime) {
		const el = this.info.element;
		this.css(el, { transition: `all ${time}ms ease-out 0s` });
		setTimeout(() => {
			this.css(el, {top: y + 'px', left: x + 'px'});
			setTimeout(() => this.css(el, { transition: 'none' }), time);
		}, 1);
	}

	getClone() {
		let placeholder;
		placeholder = this.info.element.cloneNode();
		placeholder.classList.add('dnd-placeholder');
		this.css(placeholder, { opacity: 0, position: 'static' });
		return placeholder;
	}

	finish(drop = true) {
		if (drop) {
			if (typeof this.onDrop === 'function') {
				this.onDrop(this.info);
			}
			let placeholder = this.getClone();
			this.info.dropTarget.appendChild(placeholder);
			const os = this.addOffset(this.offset(placeholder));
			this.move(os.left, os.top, this.config.animationTime);
		}
		setTimeout(() => {
			if (drop) {
				this.info.dropTarget.appendChild(this.info.element);
			} else {
				if (typeof this.onCancel === 'function') {
					this.onCancel(this.info);
				}
			}
			this.apply('.dnd-placeholder', e => e.parentNode.removeChild(e));
			this.apply(this.config.draggingClass, e => e.classList.remove(this.config.draggingClass));
			this.apply(`.${this.config.dropHoverClass}`, e => e.classList.remove(this.config.dropHoverClass));
			this.info.element.style.cssText = '';
			this.resetInfo();
		}, this.config.animationTime);
	}

	showDroppable(x, y) {
		this.apply(`.${this.config.dropHoverClass}`, e => e.classList.remove(this.config.dropHoverClass));
		const drop = this.getDroppable(x - window.scrollX, y - window.scrollY);
		if (drop) {
			if (!drop.isSameNode(this.info.element.parentNode)) {
				drop.classList.add(this.config.dropHoverClass);
			}
		}
	}

	mouseMove = ev => {
		if (this.info.dragging) {
			console.log(ev.pageX, ev.pageY)
			this.info.mouseX = ev.pageX;
			this.info.mouseY = ev.pageY;
			this.showDroppable(ev.pageX, ev.pageY);
			let { top, left } = this.addScroll(this.addOffset({left: this.info.mouseX, top: this.info.mouseY}));
			if (this.config.centerOnGet) {
				top = Math.round(top - (this.info.elementHeight * .5)) + 'px';
				left = Math.round(left - (this.info.elementWidth * .5)) + 'px';
			} else {
				top = top - this.info.yDiff + 'px';
				left = left - this.info.xDiff + 'px';
			}
			this.css(this.info.element, {top, left});
		}
		return true;
	};

	mouseUp = ev => {
		if (!this.info.dragging) {
			return true;
		}

		if (this.info.mouseX === this.info.mouseStartPos.x && this.info.mouseY === this.info.mouseStartPos.y) {
			this.cancel();
			return false;
		}

		this.info.dragging = false;

		const { top, left } = this.addScroll({ left: ev.pageX, top: ev.pageY });

		const dropTarget = this.getDroppable(left, top);

		if (!dropTarget) {
			this.cancel();
			return false;
		}

		const to = this.getCoords(dropTarget);
		this.info = { ...this.info, ...{ dropTarget, to, mouseX: ev.pageX, mouseY: ev.pageY } };

		if(typeof this.canDrop === 'function') {
			if(!this.canDrop(this.info)) {
				this.cancel();
				return false;
			}
		}

		if (!this.shouldDrop()) {
			this.cancel();
			return false;
		}

		this.finish();
		return true;
	};

	mouseDown = e => {
		console.log('mouseDown', e.target)
		if (e.button !== 0) {
			return true;
		}
		const el = e.target;
		let elInfo = this.offset(el);
		this.info = {
			dragging: true,
			mouseX: e.pageX,
			mouseY: e.pageY,
			elementX: elInfo.left,
			elementY: elInfo.top,
			elementWidth: elInfo.width,
			elementHeight: elInfo.height,
			xDiff: e.pageX - elInfo.left,
			yDiff: e.pageY - elInfo.top,
			elementStartPos: {
				left: elInfo.left,
				top: elInfo.top
			},
			mouseStartPos: {
				x: e.pageX,
				y: e.pageY
			},
			element: el,
			dropTarget: null,
			from: this.getCoords(el),
			to: '',
			offset: this.getOffset(el)
		}

		if (!this.shouldDrag()) {
			this.resetInfo();
			return true;
		}

		if(typeof this.onCatch === 'function') {
			this.onCatch(this.info);
		}

		el.classList.add(this.config.draggingClass);
		elInfo = this.addOffset(elInfo);
		this.css(el, {
			position: 'absolute',
			top: elInfo.top + 'px',
			left: elInfo.left + 'px',
			width: elInfo.width + 'px',
			height: elInfo.height + 'px',
			zIndex: this.config.dragIndex
		});
		let placeholder = this.getClone();
		el.parentNode.insertBefore(placeholder, el);

		const { top, left } = this.addOffset(this.addScroll({ top: this.info.mouseY, left: this.info.mouseX }));

		if (this.config.centerOnGet) {
			this.move(
				Math.round(left - (this.info.elementWidth * .5)),
				Math.round(top - (this.info.elementHeight * .5)),
				this.config.animationTime
			);
		}
		return true;
	};

	getCoords(el) {
		if (!el) {
			this.cancel();
			return false;
		}
		const square = el.closest('.square');
		let coords = '';
		if (square && /\b([a-h][1-8])\b/.test(square.className)) {
			coords = RegExp.$1;
		}
		return coords;
	}

    applyBehaviors() {
		document.addEventListener('mousemove', this.mouseMove);
		document.addEventListener('mouseup', this.mouseUp);
    }

    shouldDrag() {
        if (typeof this.canDrag === 'function') {
            return this.canDrag(this.info);
        }
        return true;
    }

    shouldDrop() {
		if (this.info.dropTarget.isSameNode(this.info.element.parentNode)) {
			return false;
		}
        if (typeof this.info.dropTarget === 'object' && typeof this.canDrop === 'function') {
            return this.canDrop(this.info);
        }
        return (typeof this.info.dropTarget === 'object');
    }

	resetInfo() {
		this.info = {
			dragging: false,
			element: null,
			mouseX: 0,
			mouseY: 0,
			elementX: 0,
			elementY: 0,
            elementWidth: 0,
            elementHeight: 0,
            xDiff: 0,
            yDiff: 0,
			elementStartPos: { left: 0, topy: 0 },
			mouseStartPos: { x: 0, y: 0 },
			offset: { top: 0, left: 0 },
			dropTarget: null,
			from: '',
			to: ''
		};
	}

	getDroppable(x, y) {
		let elements = [], previousPointerEvents = [], current;
		while ((current = document.elementFromPoint(x, y)) && !elements.includes(current) && current != null) {
			elements.push(current);
			previousPointerEvents.push({
				value: current.style.getPropertyValue('pointer-events'),
				priority: current.style.getPropertyPriority('pointer-events')
			});
			current.style.setProperty('pointer-events', 'none', 'important');
		}
		previousPointerEvents.forEach((d, i) => {
			elements[i].style.setProperty('pointer-events', d.value || '', d.priority);
		});
		elements = elements.filter(e => e.matches(`.${this.config.droppableClass}`));
        return elements.length ? elements[0] : null;
	}

}

// export default DragNDrop;

const DnD = {
	install(Vue) {
		Vue.DnD = null;
		Vue.prototype.$dragndrop = {
			start(cfg) {
				Vue.DnD = new DragNDrop(cfg);
				return {
					draggableAttrs: {
						'v-on:dragstart': () => false,
						'v-on:selectstart': () => false,
						'v-on:mousedown': Vue.DnD.mouseDown.bind(Vue.DnD)
					},
					draggableMouseDown: Vue.DnD.mouseDown.bind(Vue.DnD),
					draggableMouseMove: Vue.DnD.mouseMove.bind(Vue.DnD),
					draggableMouseUp: Vue.DnD.mouseUp.bind(Vue.DnD),
					draggableClass: Vue.DnD.config.draggableClass,
					droppableClass: Vue.DnD.config.droppableClass,
					instance: Vue.DnD
				}
			}
		};
	}
}

export default DnD;