export function jsx(type, props, ...children) {
  return { type, props: props || {}, children };
}

export function createElement(node) {
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }

  const element = document.createElement(node.type);
  Object.entries(node.props).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

  node.children.map(createElement).forEach((child) => element.appendChild(child));

  return element;
}

function updateAttributes(target, newProps, oldProps = {}) {
  Object.entries(newProps).forEach(([key, value]) => {
    if (oldProps[key] !== value) {
      target.setAttribute(key, value);
    }
  });

  Object.keys(oldProps).forEach((key) => {
    if (!(key in newProps)) {
      target.removeAttribute(key);
    }
  });
}

export function render(parent, newNode, oldNode = {}, index = 0) {
  if (!parent) return;

  if (!oldNode || typeof newNode !== typeof oldNode || newNode.type !== oldNode.type) {
    const newElement = createElement(newNode);
    if (parent.childNodes[index]) {
      parent.replaceChild(newElement, parent.childNodes[index]);
    } else {
      parent.appendChild(newElement);
    }
    return;
  }

  if (typeof newNode === 'string' && newNode !== oldNode) {
    parent.childNodes[index].nodeValue = newNode;
    return;
  }

  updateAttributes(parent.childNodes[index], newNode.props, oldNode.props);

  const max = Math.max(newNode.children.length, oldNode.children.length);
  for (let i = 0; i < max; i++) {
    render(parent.childNodes[index], newNode.children[i], oldNode.children[i] || {}, i);
  }

  while (parent.childNodes[index].childNodes.length > newNode.children.length) {
    parent.childNodes[index].removeChild(parent.childNodes[index].lastChild);
  }
}
