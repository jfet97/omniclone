# deepClone
A customizable javascript deepClone function for object cloning that is fool proof
```

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
2. let you to share the `[[Prototype]]` object between source and the result object (customizable behavior)
2. throw an error if a circular reference is detected
3. handle String, Boolean, Number and Date objects in the right way:  String, Boolean, and Number objects are unwrapped - Date objects are exactly copied
4. let you to copy getters and setters, non enumerables properties and also symbols (customizable behavior)

## config
If you need to invoke the objects constructors 
