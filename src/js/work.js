const containers = document.querySelectorAll('.article-image-container')
const bodies = document.querySelectorAll('.article-body')
let expanded = null

const EventFunction = (event) => {
  const originalElement = event.currentTarget
  
  if (expanded === originalElement) {
    originalElement.classList.remove('expand')
    expanded = null
  } else {
    if (expanded) {
      expanded.classList.remove('expand')
    }
    originalElement.classList.add('expand')
    expanded = originalElement
  }
}

const AddListeners = (elements) => {
  if (elements.length !== 0) {
    elements.forEach((element) => {
      element.addEventListener('click', EventFunction, false)
    })
  }
}

AddListeners(containers)
AddListeners(bodies)