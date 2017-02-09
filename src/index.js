import React from 'preact-compat';
import ReactDOM from 'preact-compat';
import simulateEvents from 'simulate-event';
import events from './events';

//TODO
class ReactShallowRenderer {
    render(node, context) {
        
    }
    getRenderOutput() {

    }
}

const ReactTestUtils = {
    renderIntoDocument(element) {
        let div = document.createElement('div');
        return ReactDOM.render(element, div);
    },
    isElement(element) {
        return React.isValidElement(element);
    },
    isElementOfType(inst, convenienceConstructor) {
        return (
            React.isValidElement(inst) &&
            inst.type === convenienceConstructor
        );
    },
    isDOMComponent(inst) {
         return !!(inst && inst.nodeType === 1 && inst.tagName);
    },
    isCompositeComponent(inst) {
        if (ReactTestUtils.isDOMComponent(inst)) {
            return false;
        }
        return inst != null &&
           typeof inst.render === 'function' &&
           typeof inst.setState === 'function';
    },
    isCompositeComponentWithType(inst, type) {
        if (!ReactTestUtils.isCompositeComponent(inst)) {
            return false;
        }
        const constructor = inst.type;
        return (constructor === type);
    },
    isCompositeComponentElement(inst) {
        if (!React.isValidElement(inst)) {
        return false;
        }
        // We check the prototype of the type that will get mounted, not the
        // instance itself. This is a future proof way of duck typing.
        let prototype = inst.type.prototype;
        return (
        typeof prototype.render === 'function' &&
        typeof prototype.setState === 'function'
        );
   },
   findAllInRenderedTree(inst, test) {
       if (!inst) {
           return [];
       }
       const findTreeFromDOM = function(dom, test) {
           let ret = [];
           const inc = dom._component;
           if (inc && test(inc)) {
               ret.push(inc, dom);
               for(let i = 0; i < dom.childNodes.length; i++) {
                   const childNode = dom.childNodes[i];
                   ret = ret.concat(findTreeFromDOM(childNode, test));
               }
           } else if(React.isDOMComponent(dom)){
               ret.push(dom);
           }
           return ret;
       }
       return findTreeFromDOM(inst.base, test);
   },
   mockComponent(module, mockTagName) {
    mockTagName = mockTagName || module.mockTagName || 'div';

    module.prototype.render.mockImplementation(function() {
      return React.createElement(
        mockTagName,
        null,
        this.props.children
      );
    });
    return this;
   },
   batchedUpdates(callback) {
       callback();
   },
   createRenderer() {
       return new ReactShallowRenderer();
   },
   Simulate: {}
}

function buildSimulate() {
    events.forEach(event => {
        ReactTestUtils.Simulate[event] = function(node, mock){
            simulateEvents.simulate(node, event.toLowerCase(), mock);
        }
    });
}

buildSimulate();

export default ReactTestUtils;