// Initial scrollbar
Scrollbar.use(OverscrollPlugin)
let hoverTag = false
const scrollbar = Scrollbar.init(document.querySelector('.wrapper'))
const sectionDark = Array.from(
	document.querySelector('main').querySelectorAll('section')
).filter((_, i) => i % 2 !== 0)

function throttle(callback, delay = 1000) {
	let shouldWait = false

	return (...args) => {
		if (shouldWait) return

		callback(...args)
		shouldWait = true
		setTimeout(() => {
			shouldWait = false
		}, delay)
	}
}

// Typewriter text
;(() => {
	var TxtType = function (el, toRotate, period) {
		this.toRotate = toRotate
		this.el = el
		this.loopNum = 0
		this.period = parseInt(period, 10) || 2000
		this.txt = ''
		this.tick()
		this.isDeleting = false
	}

	TxtType.prototype.tick = function () {
		var i = this.loopNum % this.toRotate.length
		var fullTxt = this.toRotate[i]

		if (this.isDeleting) {
			this.txt = fullTxt.substring(0, this.txt.length - 1)
		} else {
			this.txt = fullTxt.substring(0, this.txt.length + 1)
		}

		this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>'

		var that = this
		var delta = 200 - Math.random() * 100

		if (this.isDeleting) {
			delta /= 2
		}

		if (!this.isDeleting && this.txt === fullTxt) {
			delta = this.period
			this.isDeleting = true
		} else if (this.isDeleting && this.txt === '') {
			this.isDeleting = false
			this.loopNum++
			delta = 500
		}

		setTimeout(function () {
			that.tick()
		}, delta)
	}

	window.onload = function () {
		var elements = document.getElementsByClassName('typewrite')
		for (var i = 0; i < elements.length; i++) {
			var toRotate = elements[i].getAttribute('data-type')
			var period = elements[i].getAttribute('data-period')
			if (toRotate) {
				new TxtType(elements[i], JSON.parse(toRotate), period)
			}
		}
		// INJECT CSS
		var css = document.createElement('style')
		css.type = 'text/css'
		css.innerHTML = '.typewrite > .wrap { border-right: 0.08em solid #fff}'
		document.body.appendChild(css)
	}
})()

// Mouse cursor
;(() => {
	if (window.innerWidth < 767) return
	const cursor = document.createElement('div')
	cursor.className = 'cursor'
	const cursorinner = document.createElement('div')

	cursorinner.className = 'cursor-inner'

	document.body.append(cursor, cursorinner)
	const tagA = document.querySelectorAll('a')

	document.addEventListener('mousemove', function (e) {
		if (hoverTag) return
		cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`
	})

	document.addEventListener('mousemove', function (e) {
		cursorinner.style.left = e.clientX + 'px'
		cursorinner.style.top = e.clientY + 'px'
	})

	document.addEventListener('mousedown', function () {
		cursor.classList.add('click')
		cursorinner.classList.add('cursorinnerhover')
	})

	document.addEventListener('mouseup', function () {
		cursor.classList.remove('click')
		cursorinner.classList.remove('cursorinnerhover')
	})

	tagA.forEach((item) => {
		item.addEventListener('mouseover', () => {
			cursor.style.width = `${item.offsetWidth}px`
			cursor.style.height = `${item.offsetHeight}px`

			cursor.style.transform = `translate3d(calc(${
				item.getBoundingClientRect().left + item.offsetWidth / 2
			}px - 50%), calc(${
				item.getBoundingClientRect().top + item.offsetHeight / 2
			}px - 50%), 0)`
			cursor.classList.add('hover')
			cursorinner.classList.add('hover')

			hoverTag = true
		})
		item.addEventListener('mouseleave', () => {
			cursor.classList.remove('hover')
			cursorinner.classList.remove('hover')
			cursor.style.width = null
			cursor.style.height = null
			hoverTag = false
		})
	})

	sectionDark.forEach((item) => {
		item.addEventListener('mouseover', () => {
			cursor.classList.add('dark')
			cursorinner.classList.add('dark')
		})
		item.addEventListener('mouseleave', () => {
			cursor.classList.remove('dark')
			cursorinner.classList.remove('dark')
		})
	})

	document.addEventListener('mouseleave', function () {
		cursor.style.opacity = '0'
		cursorinner.style.opacity = '0'
	})
	document.addEventListener('mouseenter', function () {
		cursor.style.opacity = '1'
		cursorinner.style.opacity = '1'
	})
})()

// Skills hover
;(() => {
	const liHover = Array.from(
		document.querySelector('#skills ul').querySelectorAll('li')
	)

	const cursor = document.querySelector('.cursor')
	const cursorinner = document.querySelector('.cursor-inner')

	liHover.map((li) => {
		li.addEventListener('touchstart', function () {
			if (this.getAttribute('color-hover')) {
				this.style.color = this.getAttribute('color-hover')
			}
		})
		li.addEventListener('touchend', function () {
			this.style.color = null
		})

		li.addEventListener('mouseover', function () {
			// get color
			if (this.getAttribute('color-hover')) {
				this.style.color = this.getAttribute('color-hover')
				cursor.style.borderColor = this.getAttribute('color-hover')
				cursorinner.style.backgroundColor = this.getAttribute('color-hover')
			}
		})
		li.addEventListener('mouseleave', function () {
			this.style.color = null
			cursor.style.borderColor = null
			cursorinner.style.backgroundColor = null
		})
	})
})()

// Scrollbar
;(() => {
	if (window.location.hash) {
		const id = window.location.hash
		const element = document.querySelector(id)
		scrollbar.scrollIntoView(element)
	}

	const menu = document.querySelector('header ul').querySelectorAll('li')
	menu.forEach((item) => {
		item.addEventListener('click', (e) => {
			e.preventDefault()
			const id = item.querySelector('a').getAttribute('href')
			scrollbar.scrollIntoView(document.querySelector(id))
		})
	})

	const observerActiveMenu = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					menu.forEach((item) => {
						const id = item.querySelector('a').getAttribute('href')
						if (entry.target.id === id.replace('#', '')) {
							menu.forEach((item) => {
								item.classList.remove('active')
							})
							item.classList.add('active')
						}
					})
				}
			})
		},
		{
			threshold: 0.7,
		}
	)

	const section = document.querySelectorAll('section')
	section.forEach((item) => {
		observerActiveMenu.observe(item)
	})

	let timer = null
	scrollbar.addListener(() => {
		scrollbar.track.yAxis.element.style.opacity = 1
		if (timer !== null) {
			clearTimeout(timer)
		}
		timer = setTimeout(function () {
			scrollbar.track.yAxis.element.style.opacity = 0
		}, 1000)
	})
})()

// context menu
;(() => {
	const contextMenu = document.querySelector('header')

	function setContextMenuPostion(event) {
		var mousePosition = {}
		var menuPostion = {}
		var menuDimension = {}

		menuDimension.x = contextMenu.offsetWidth
		menuDimension.y = contextMenu.offsetHeight
		mousePosition.x = event.pageX ?? event.touches[0].pageX
		mousePosition.y = event.pageY ?? event.touches[0].pageY

		if (mousePosition.x + menuDimension.x > window.innerWidth) {
			menuPostion.x = mousePosition.x - menuDimension.x + scrollbar.scrollLeft
		} else {
			menuPostion.x = mousePosition.x + scrollbar.scrollLeft
		}

		if (mousePosition.y + menuDimension.y > window.innerHeight) {
			menuPostion.y = mousePosition.y - menuDimension.y + scrollbar.scrollTop
		} else {
			menuPostion.y = mousePosition.y + scrollbar.scrollTop
		}

		return menuPostion
	}

	function removeContextMenu() {
		contextMenu.classList.remove('active')
		contextMenu.style.top = null
		contextMenu.style.left = null
	}

	function activeContextMenu({ x, y }) {
		contextMenu.classList.add('active')
		contextMenu.style.top = `${y}px`
		contextMenu.style.left = `${x}px`
	}

	document.addEventListener('contextmenu', function (e) {
		e.preventDefault()

		activeContextMenu(setContextMenuPostion(e))

		document.addEventListener('click', removeContextMenu)

		document.addEventListener('scroll', removeContextMenu)

		document.addEventListener('wheel', removeContextMenu)

		document.addEventListener('keydown', removeContextMenu)
	})
})()

const help = document.querySelector('.help')

window.addEventListener('load', () => {
	if (window.innerWidth < 768) return
	setTimeout(() => {
		help.classList.add('active')
	}, 3000)

	help.addEventListener('click', () => {
		help.classList.remove('active')
	})

	setTimeout(() => {
		help.classList.remove('active')
	}, 15000)
})
