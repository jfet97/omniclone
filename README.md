# deepClone
A customizable javascript deepClone function for object cloning that is fool proof
```
deepClone(source, config);
```

Example:
```js
const obj = { foo: { bar: 'baz' } };
const obj2 = deepClone(obj);

obj2; // { foo: { bar: 'baz' } };
obj == obj2; // false
```

## strengths
1. automatically invoke object constructors before copying properties (customizable behavior)
2. let you to share the `[[Prototype]]` object between source and the resulting object (customizable behavior)
3. throw an error if a circular reference is detected with O(1) time complexity
4. handle String, Boolean, Number and Date objects in the right way:  String, Boolean, and Number objects are unwrapped - Date objects are exactly copied
5. let you to copy getters and setters, non enumerables properties and also symbols (customizable behavior)
6. safe similar sibilings references are not duplicated
7. implicit support for Array and RegExp objects 

## config

### invokeConstructors (default true)
If you need to invoke the objects constructors for each object prop set the `invokeConstructors` flag to `true`:
```js
const res = deepClone(source, {
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

const res = deepClone(t, {
  invokeConstructors: true
}); // 'constructor invoked' 'constructor invoked'

res; // Test { t: Test {} }
res instanceof Test; // true
res.foo instanceof Test; // true
```

It is actually a default enabled setting, but you can disable it.\
If the `invokeConstructors` flag is setted to `false`, a plain new object will be created for each object prop and for the resulting object as well. So the `constructor` prop will be set to the `Object` function, and the `[[Prototype]]` prop will be `Object.prototype`.\
Unless you use the `setPrototype` flag.


### setPrototype (default false)
If the `invokeConstructors` flag is setted to `false` we could anyway share the `[[Prototype]]` object between the source object and the resulting object thanks to the `setPrototype` flag, __without calling the constructors__.\
This means that the `constructor` prop will be shared as well because it is related to the `[[Prototype]]` prop.\
This flag affects all the object properties as weel, like the previous flag.\
If the `invokeConstructors` flag is setted to `true`, the `setPrototype` flag will be is ignored.

```js
const res = deepClone(source, {
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

const res = deepClone(t, {
  invokeConstructors: false,
  setPrototype: true
});

res; // Test { t: Test {} }
res instanceof Test; // true
res.foo instanceof Test; // true
```

### copyNonEnumerables (default false)
Enable it to deep copy also non enumerables properties.\
Disable it to ignore them.
```js
const res = deepClone(source, {
  copyNonEnumerables: true
});
```

### copySymbols (default false)
Enable it to deep copy also symbol properties.\
Disable it to ignore them.
```js
const res = deepClone(source, {
  copySymbols: true
});
```

### copyGettersSetters (default false)
Enable it to copy also getters and setters.\
Disable it to ignore them.
```js
const res = deepClone(source, {
  copyGettersSetters: true
});
```

## default config
The default config is the following:
```js
deepClone(source, {
    invokeConstructors = true,
    setPrototype = false,
    copyNonEnumerables = false,
    copySymbols = false,
    copyGettersSetters = false,
});
```


## what about the 6th strength?

To understand it, let's compare the function `deepClone` with the well-know `JSON.parse(JSON.stringify(source))`:
```js
const obj = { foo: 'bar'};
const source = {
  a: obj,
  b: obj,
};

JSON.stringify(source); // '{"a":{"foo":"bar"},"b":{"foo":"bar"}}'
```
When you will use `JSON.parse()`, an `{"foo":"bar"}` object will be created for the `a` prop and a `{"foo":"bar"}` distinct object will be created for the `b` prop. But this is not the initial situation where `source.a == source.b; // true`.


## warnings
1. methods are always copied by reference
2. `super` is statically bound to a class heirarchy, remember it
