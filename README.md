# omniclone  [![NPM version](https://img.shields.io/npm/v/omniclone.svg)](https://www.npmjs.com/package/omniclone) [![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/jfet97/omniclone/blob/master/LICENSE) ![](https://img.shields.io/npm/dt/omniclone.svg) ![](https://img.shields.io/badge/dependencies-no%20dependencies-%231e88e5%20.svg)
An isomorphic and configurable javascript function for object deep cloning.
```js
omniclone(source [, config, [, visitor]]);
```

Example:
```js
const obj = { foo: { bar: 'baz' } };
const obj2 = omniclone(obj);

obj2; // { foo: { bar: 'baz' } };
obj === obj2; // false
obj.foo === obj2.foo; // false
```
## installation
```
$ npm install --save omniclone
```

## usage
```
const omniclone = require('omniclone');
import omniclone from 'omniclone';
```

## test
[Test it](https://npm.runkit.com/omniclone) in no time with RunKit!

## strengths
1. automatically invoke object constructors before copying properties (customizable behavior)
2. let you to share the `[[Prototype]]` object between source and the resulting object (customizable behavior)
3. let you to clone objects with circular references (customizable behavior)
4. let you to copy getters and setters, non enumerables properties and also symbols (customizable behavior)
5. correct handling of String, Boolean, Number, Error, Promise, Map, Set, WeakMap, WeakSet, ArrayBuffer, TypedArray and DataView objects
6. similar references are not duplicated
7. correct cloning of Array objects
8. correct cloning of RegExp and Date objects
9. let you define custom cloning logic

## config

### invokeConstructors (default true)
If you need to invoke the objects constructors for each object prop set the `invokeConstructors` flag to `true`:
```js
const res = omniclone(source, {
  invokeConstructors: true
});
```
This option will correctly set up the new object, because __constructors are invoked to create it__. The resulting object and each of its object property therefore will have the `[[Prototype]]` and the `constructor` props correctly setted up, corresponding to the source object and its object properties for everyone.

```js
class Test {
  constructor() {
    console.log('constructor invoked');
  }
};

const t = new Test(); // 'constructor invoked'
t.foo = new Test(); // 'constructor invoked'
t; // Test { t: Test {} }

const res = omniclone(t, {
  invokeConstructors: true
}); // 'constructor invoked' 'constructor invoked'

res; // Test { t: Test {} }
res instanceof Test; // true
res.foo instanceof Test; // true
```

It is actually a default enabled setting, but you can disable it (Array, Map and Set objects will be properly cloned anyway).\
__It is highly discouraged to disable this flag__, do it only if you know what you are doing.

If the `invokeConstructors` flag is set to `false`, a plain new object will be created for each object prop and for the resulting object as well. So the `constructor` prop will be set to the `Object` function, and the `[[Prototype]]` prop will be `Object.prototype`.\
Unless you use the `setPrototype` flag.


### setPrototype (default false)
If the `invokeConstructors` flag is setted to `false` we could anyway share the `[[Prototype]]` object between the source object and the resulting object thanks to the `setPrototype` flag, __without calling the constructors__.\
(Array, Map and Set objects will be properly cloned anyway because for them the constructor will be always called).\
This means that the `constructor` prop will be shared as well because it is related to the `[[Prototype]]` prop.\
This flag affects all the object properties as weel, like the previous flag.\
If the `invokeConstructors` flag is setted to `true`, the `setPrototype` flag will be is ignored.

```js
const res = omniclone(source, {
  invokeConstructors: false,
  setPrototype: true
});
```

The resulting object therefore will have the `[[Prototype]]` and the `constructor` props correctly setted up, but the constructors are not invoked.

```js
class Test {
  constructor() {
    console.log('constructor invoked');
  }
};

const t = new Test(); // 'constructor invoked'
t.foo = new Test(); // 'constructor invoked'
t; // Test { t: Test {} }

const res = omniclone(t, {
  invokeConstructors: false,
  setPrototype: true
});

res; // Test { t: Test {} }
res instanceof Test; // true
res.foo instanceof Test; // true
```

```js
const prot = { foo:'bar' };

const obj1 = Object.create(prot);
Object.getPrototypeOf(obj1) === prot; // true

const res = omniclone(obj1, {
  invokeConstructors: false,
  setPrototype: true
});
Object.getPrototypeOf(res) === prot; // true
```

### copyNonEnumerables (default false)
Enable it to deep copy also non enumerables properties.\
Disable it to ignore them.
```js
const res = omniclone(source, {
  copyNonEnumerables: true
});
```

### copySymbols (default false)
Enable it to deep copy also symbol properties.\
Disable it to ignore them.\
Symbols are shallow copied;
```js
const res = omniclone(source, {
  copySymbols: true
});
```

### copyGettersSetters (default false)
Enable it to copy also getters and setters.\
Disable it to ignore them.
```js
const res = omniclone(source, {
  copyGettersSetters: true
});
```
Odds are that to properly copy gets&setts you have also to enable the `copyNonEnumerables` flag.

### allowCircularReferences (default true)
Enable it to allow circular references.\
Disable it to throw an error if one is met.
Know that `omniclone` is more performing with this flag __enabled__, so disable it only if you really need.
```js
const res = omniclone(source, {
  allowCircularReferences: true
});
```

### discardErrorObjects (default true)
Enable it to discard Error objects props.\
Know that `omnicopy` will return `null` if one is passed as source.\
Disable it to throw an error if one is met.
```js
const res = omniclone(source, {
  discardErrorObjects: true
});
```

## default config
The default config is the following:
```js
omniclone(source, {
    invokeConstructors : true,
    setPrototype : false,
    copyNonEnumerables : false,
    copySymbols : false,
    copyGettersSetters : false,
    allowCircularReferences: true,
    discardErrorObjects: true,
});
```

## what about String, Boolean, Number, Error, Promise, Map, Set, WeakMap, WeakSet, ArrayBuffer, TypedArray and DataView objects?

String, Boolean and Number objects passed to `omniclone` as sources will produce `null`.\
Error objects passed to `omniclone` as sources will produce `null` if the `discardErrorObjects` is set to `true` (as default).\
Error objects passed to `omniclone` as sources will produce a `TypeError` if the `discardErrorObjects` is set to `false` (not the predefined behaviour).

String, Boolean and Number objects props will be unwrapped.\
Error objects props will be discarded if the `discardErrorObjects` is set to `true` (as default).\
Error objects props will produce a `TypeError` if the `discardErrorObjects` is set to `false` (not the predefined behaviour).

Promise, WeakMap and WeakSet objects will be returned if passed to `omniclone` as sources.\
Promise, WeakMap and WeakSet objects props will be copied by reference.

Map objects (keys/values) will be always deeply cloned, but any properties added to the map object itself will not be copied.\
Set objects will be always deeply cloned, but any properties added to the set object itself will not be copied.\
ArrayBuffer and TypedArray objects will be always deeply cloned, but any properties added to the array objects themselves will not be copied.
DataView objects are copied by reference.

## what about the 6th strength?

To understand it, let's compare the function `omniclone` with the well-know `JSON.parse(JSON.stringify(source))`:
```js
const obj = { foo: 'bar'};
const source = {
  a: obj,
  b: obj,
};

JSON.stringify(source); // '{"a":{"foo":"bar"},"b":{"foo":"bar"}}'
```
When you will use `JSON.parse()`, an `{"foo":"bar"}` object will be created for the `a` prop and a `{"foo":"bar"}` distinct object will be created for the `b` prop. But this is not the initial situation where `source.a == source.b; // true`.

## how to define custom cloning logic?
You can define a callback function that will be called on each node which copy can be customized:
```js
function visitor(node, config) {
  // do stuff
}
```
The function will receive the `node` and a copy of the `config` object. If the function returns something different than `undefined`, that returned value will become the cloned value. On the contrary if the function returns `undefined` the default cloning algorithm will be used.

You cannot overwrite the default algorithm logic for String, Boolean, Number, Error, Promise, Map, Set, WeakMap, WeakSet, Date and RegExp objects.
You can overwrite the default algorithm logic for Array, ArrayBuffer, TypedArray, DataView, plain js and custom objects.

Let's see an example where we add custom logic to properly clone a Node.js Buffer object:
```js
const buffer = Buffer.from([1, 2, 3, 4]);

const resBuffer = omniclone(buffer, {}, node => {
  if (node instanceof Buffer) { // it affects only Buffer objects
    return Buffer.from(node);
  }
  return undefined; // all the other nodes will be cloned as usual
});
```
Thanks to the `instanceof` check, only Buffer objects will be affected by the intervention of the visitor callback.


## warnings and limitations
1. promises and methods are always copied by reference
2. `super` is statically bound to a class heirarchy, remember it
3. `Error` objects cannot be properly copied because of js limitations
4. currently there is no isomorphic way to detect if an object is a `Proxy` nor is possible to access the handler object. Because of transparent virtualization, `omniclone` will copy each properties, the `constructor` and the `[[Prototype]]` directly from the proxed object.

## support
Let me know that you like this project: star it! Thanks :)
