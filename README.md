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
3. throw an error if a circular reference is detected
4. handle String, Boolean, Number and Date objects in the right way:  String, Boolean, and Number objects are unwrapped - Date objects are exactly copied
5. let you to copy getters and setters, non enumerables properties and also symbols (customizable behavior)
6. safe similar sibilings references are not duplicated

## config

### invokeConstructor (default true)
If you need to invoke the objects constructors for each object prop set the `invokeConstructor` flag to `true`:
```js
const res = deepClone(source, {
  invokeConstructor: true
});
```
This option will correctly set up the new object, because __the source's constructor is invoked to create it__. The new object therefore will have the `[[Prototype]]` and the `constructor` props correctly setted up.

It is actually a default enabled setting, but you can disable it.\
If the `invokeConstructor` flag is setted to `false`, a plain new object will be created for each object prop. So the `constructor` prop will be set to the `Object` function, and the `[[Prototype]]` prop will be `Object.prototype`.\
Unless you use the `setPrototype` following flag.

### setPrototype (default false)
If the `invokeConstructor` flag is setted to `false` we could anyway share the `[[Prototype]]` object between each source object prop and each resulting object prop - this means that the `constructor` prop will be shared as well - thanks to the `setPrototype` flag, __without calling the constructors__.
If the `invokeConstructor` flag is setted to `true`, the `setPrototype` flag will be is ignored.

```js
const res = deepClone(source, {
  setPrototype: true
});
```

The new object therefore will have the `[[Prototype]]` and the `constructor` props correctly setted up, but the constructor is not invoked.

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
  copySymbol: true
});
```

### copyGettersSetters
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
2. a method that uses `super` must not be copied
