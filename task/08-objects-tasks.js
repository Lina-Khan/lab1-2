'use strict';

/**************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 **************************************************************************************************/


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    var r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
    return {width,height,getArea: () =>width*height};
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
    return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    var r = fromJSON(Rectangle.prototype, '{"width":10, "height":20}');
 *
 */
function fromJSON(proto, json) {
    var o = JSON.parse(json);
    Object.setPrototypeOf(o,Rectangle.prototype);
    return o;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy and implement the functionality
 * to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple, clear and readable as possible.
 *
 * @example
 *
 *  var builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()  => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()  => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()        =>    'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */
class Element {
   constructor()
   {
       this._id = [];
       this._element = [];
       this._class = [];
       this._attr = [];
       this._pseudoClass = [];
       this._pseudoElement = [];

       //last element priority
       this._last = -1;
   }

    stringify(){
        let rez = "";
        if(this._element.length !== 0)
        {
            rez += this._element.join('.');
        }
        if(this._id.length !== 0)
        {
            rez +='#'+this._id;
        }
        if(this._class.length !== 0)
        {
            rez +='.'+this._class.join('.');
        }
        if(this._attr.length !== 0)
        {
            rez +='['+this._attr+']';
        }
        if(this._pseudoClass.length !== 0)
        {
            rez +=':'+this._pseudoClass.join(':');
        }
        if(this._pseudoElement.length !== 0)
        {
            rez +='::'+this._pseudoElement;
        }
        return rez;
    }

    element(input) {
        if(this._element.length === 1)
            throw new ElementException(0);
        if(this._last > 0)
            throw new ElementException(1);
        this._element.push(input);
        this._last = 0;
        return this;
    }

    id(input){
        if(this._id.length === 1)
            throw new ElementException(0);
        if(this._last > 1)
            throw new ElementException(1);
        this._id.push(input);
        this._last = 1;
        return this;
    }

    class(input) {
        if(this._last > 2)
            throw new ElementException(1);
        this._class.push(input);

        this._last = 2;
        return this;
    }

    attr(input) {
        if(this._last > 3)
            throw new ElementException(1);
        this._attr.push(input);

        this._last = 3;
        return this;
    }

    pseudoClass(input) {
        if(this._last > 4)
            throw new ElementException(1);
        this._pseudoClass.push(input);
        this._last = 4;
        return this;
    }

    pseudoElement(input) {
        if(this._pseudoElement.length === 1)
            throw new ElementException(0);
        if(this._last > 5)
            throw new ElementException(1);
        this._pseudoElement.push(input);
        this._last = 5;
        return this;
    }



}

class ComboElement
{
    constructor(){
        this._elements = [];
        this._combinators = [];
    }

    push(element,combinator){
        this._elements.push(element);
        this._combinators.push(combinator);
        return this;
    }

    stringify() {
        let rez = "";
        for(let i=0;i<this._elements.length;i++)
        {
            rez += this._elements[i].stringify();
            if(this._combinators[i] !== undefined)
                rez += " " + this._combinators[i] + " ";
        }
        return rez;
    }

}

class ElementException
{
    constructor(id)
    {
        switch(id)
        {
            case 0:
                throw `Element, id and pseudo-element should not occur more then one time inside the selector`;
            case 1:
                throw  `/Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element/`;
        }
    }
}

const cssSelectorBuilder = {

    element: function(value) {
        return new Element().element(value);
    },

    id: function(value) {
        return new Element().id(value);
    },

    class: function(value) {
        return new Element().class(value);
    },

    attr: function(value) {
        return new Element().attr(value);
    },

    pseudoClass: function(value) {
        return new Element().pseudoClass(value);
    },

    pseudoElement: function(value) {
        return new Element().pseudoElement(value);
    },

    combine: function(selector1, combinator, selector2) {
        return new ComboElement().push(selector1,combinator).push(selector2);
    },
};


module.exports = {
    Rectangle: Rectangle,
    getJSON: getJSON,
    fromJSON: fromJSON,
    cssSelectorBuilder: cssSelectorBuilder
};
