

/**
 * Object.spawn for a more terse form of Object.create,
 * with the super added bonus of giving all overriden
 * functions a "parent" property which refers back to
 * thing it was overriding ... like "parent" or "super"
 * in classical OOP
 * 
 * @link http://howtonode.org/prototypical-inheritance
 * @param  {Object} parent  The parent object used in Object.create
 * @param  {Object} props   The object containing properties, unlike
                                                        Object.create doesn't need an extra level
                                                        of abstraction, and all properties will be
                                                        enumerable
 * @return {Object}         The newly created object
 */
Object.spawn = function (parent, props) {
    var defs = {}, key;
    for (key in props) {
        if (props.hasOwnProperty(key)) {
            defs[key] = {
                value: props[key],
                enumerable: true
            };
            // here's the "parent" magic.
            // we make sure that both keys are functions,
            // and the "child" doesn't already have a "parent"
            if (
                typeof props[key] === 'function' &&
                typeof parent[key] === 'function' &&
                typeof props[key].parent === 'undefined'
            ) {
                props[key].parent = parent[key];
            }
        }
    }
    return Object.create(parent, defs);
};


/**
 * Get the first member matching the passed function
 * @param  {Function} searchFn The matching function
 * @return {Mixed}          The matching member, or undefined
 */
Array.prototype.first = function(searchFn) {
    var i, imax;
    for ( i=0, imax=this.length; i<imax; i++ ) {
        if ( searchFn(this[i], i, this) ) {
            return this[i];
        }
    }
};
/**
 * Get the last member matching the passed function
 * @param  {Function} searchFn The matching function
 * @return {Mixed}          The matching member, or undefined
 */
Array.prototype.last = function(searchFn) {
    var i = this.length;
    while ( i-- ) {
        if ( searchFn(this[i], i, this) ) {
            return this[i];
        }
    }
};

/**
 * Get the index of the first member matching the passed function
 * @param  {Function} searchFn The matching function
 * @return {Number}          The index of the matching member, or -1
 */
Array.prototype.firstIndexOf = function(searchFn) {
    var i, imax;
    for ( i=0, imax=this.length; i<imax; i++ ) {
        if ( searchFn(this[i], i, this) ) {
            return i;
        }
    }
    return -1;
};
/**
 * Get the index of the last member matching the passed function
 * @param  {Function} searchFn The matching function
 * @return {Number}          The index of the matching member, or -1
 */
Array.prototype.lastIndexOf = function(searchFn) {
    var i = this.length;
    while ( i-- ) {
        if ( searchFn(this[i], i, this) ) {
            return this[i];
        }
    }
    return -1;
};
/**
 * Remove empty indexes from an array
 * @return {Array} The cleaned array
 */
Array.prototype.clean = function() {
    return this.filter(function() {return true;});
};





