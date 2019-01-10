const omniclone = require("../src/omniclone");

describe("it works", () => {
  it("should work", () => {
    expect(true).toBe(true);
  });
});

describe("omniclone", () => {
  it("should import omniclone", () => {
    const t = omniclone();
    expect(t).toBeDefined();
  });

  it(`should set setPrototype to false, invokeConstructors to true, discardErrorObjects to true,
      copyNonEnumerables to false, copySymbols to false, copyGettersSetters to false and
      allowCircularReferences to true if the config argument is undefined`, () => {
    (() => {
      let i = 0;
      class Test {
        constructor() {
          i += 1;
        }
      }
      const testObj = new Test();

      Object.defineProperty(testObj, "notEnum", {
        enumerable: false,
        value: 42
      });
      testObj[Symbol("symbol")] = "value";
      Object.defineProperty(testObj, "g&s", {
        get: () => 42,
        set: () => {}
      });

      const res = omniclone(testObj);

      expect(i).toBe(2); // +1 because of the call to create testObj
      expect(res.constructor).toBe(Test);
      expect(Object.getPrototypeOf(res)).toBe(Test.prototype);
      expect(res.notEnum).toBeUndefined();
      expect(res[Symbol("symbol")]).toBeUndefined();
      expect(res["g&s"]).toBeUndefined();
    })();

    expect(() => {
      const ob1 = {};
      ob1.ob1 = ob1;
      omniclone(ob1);
    }).not.toThrow(TypeError("TypeError: circular reference found"));

    (() => {
      class MyError extends Error {}
      const res = omniclone(new MyError());
      expect(res).toBeNull();
    })();

    (() => {
      class MyError extends Error {}
      const ob1 = { e: new MyError() };
      const res = omniclone(ob1);
      expect(res.e).toBeUndefined();
    })();
  });

  it("should throw a TypeError when omniclone is called with an invalid 'customHandler' argument's type", () => {
    expect(() => {
      omniclone({}, {}, null);
    }).toThrow(
      TypeError("TypeError: invalid 'customHandler' arguments's type")
    );

    expect(() => {
      omniclone({}, {}, {});
    }).toThrow(
      TypeError("TypeError: invalid 'customHandler' arguments's type")
    );

    expect(() => {
      omniclone({}, {}, "foo");
    }).toThrow(
      TypeError("TypeError: invalid 'customHandler' arguments's type")
    );

    expect(() => {
      omniclone({}, {}, 42);
    }).toThrow(
      TypeError("TypeError: invalid 'customHandler' arguments's type")
    );

    expect(() => {
      omniclone({}, {}, Symbol("test"));
    }).toThrow(
      TypeError("TypeError: invalid 'customHandler' arguments's type")
    );
  });

  it("should throw a TypeError when omniclone is called with an invalid 'obj' argument's type", () => {
    expect(() => {
      omniclone(null);
    }).toThrow(TypeError("TypeError: invalid 'obj' argument's type"));

    expect(() => {
      omniclone(() => {});
    }).toThrow(TypeError("TypeError: invalid 'obj' argument's type"));

    expect(() => {
      omniclone("foo");
    }).toThrow(TypeError("TypeError: invalid 'obj' argument's type"));

    expect(() => {
      omniclone(42);
    }).toThrow(TypeError("TypeError: invalid 'obj' argument's type"));

    expect(() => {
      omniclone(Symbol("test"));
    }).toThrow(TypeError("TypeError: invalid 'obj' argument's type"));
  });

  it("should throw a TypeError when omniclone is called with an Error object and the discardErrorObjects is set to false", () => {
    expect(() => {
      omniclone(new Error(), { discardErrorObjects: false });
    }).toThrow(TypeError("TypeError: cannot copy Error objects"));

    expect(() => {
      class CustomError extends Error {}
      omniclone(new CustomError(), { discardErrorObjects: false });
    }).toThrow(TypeError("TypeError: cannot copy Error objects"));
  });

  it("should throw a TypeError when the discardErrorObjects flag setted into the config object passed to omniclone has not Boolean type", () => {
    expect(() => {
      omniclone({}, { discardErrorObjects: () => {} });
    }).toThrow(
      TypeError("TypeError: invalid 'discardErrorObjects' flag's type")
    );

    expect(() => {
      omniclone({}, { discardErrorObjects: {} });
    }).toThrow(
      TypeError("TypeError: invalid 'discardErrorObjects' flag's type")
    );

    expect(() => {
      omniclone({}, { discardErrorObjects: 42 });
    }).toThrow(
      TypeError("TypeError: invalid 'discardErrorObjects' flag's type")
    );

    expect(() => {
      omniclone({}, { discardErrorObjects: "" });
    }).toThrow(
      TypeError("TypeError: invalid 'discardErrorObjects' flag's type")
    );

    expect(() => {
      omniclone({}, { discardErrorObjects: "foo" });
    }).toThrow(
      TypeError("TypeError: invalid 'discardErrorObjects' flag's type")
    );

    expect(() => {
      omniclone({}, { discardErrorObjects: null });
    }).toThrow(
      TypeError("TypeError: invalid 'discardErrorObjects' flag's type")
    );
  });

  it("should throw a TypeError when the setPrototype flag setted into the config object passed to omniclone has not Boolean type", () => {
    expect(() => {
      omniclone({}, { setPrototype: () => {} });
    }).toThrow(TypeError("TypeError: invalid 'setPrototype' flag's type"));

    expect(() => {
      omniclone({}, { setPrototype: {} });
    }).toThrow(TypeError("TypeError: invalid 'setPrototype' flag's type"));

    expect(() => {
      omniclone({}, { setPrototype: 42 });
    }).toThrow(TypeError("TypeError: invalid 'setPrototype' flag's type"));

    expect(() => {
      omniclone({}, { setPrototype: "" });
    }).toThrow(TypeError("TypeError: invalid 'setPrototype' flag's type"));

    expect(() => {
      omniclone({}, { setPrototype: "foo" });
    }).toThrow(TypeError("TypeError: invalid 'setPrototype' flag's type"));

    expect(() => {
      omniclone({}, { setPrototype: null });
    }).toThrow(TypeError("TypeError: invalid 'setPrototype' flag's type"));
  });

  it("should throw a TypeError when the invokeConstructors flag setted into the config object passed to omniclone has not Boolean type", () => {
    expect(() => {
      omniclone({}, { invokeConstructors: () => {} });
    }).toThrow(
      TypeError("TypeError: invalid 'invokeConstructors' flag's type")
    );

    expect(() => {
      omniclone({}, { invokeConstructors: {} });
    }).toThrow(
      TypeError("TypeError: invalid 'invokeConstructors' flag's type")
    );

    expect(() => {
      omniclone({}, { invokeConstructors: 42 });
    }).toThrow(
      TypeError("TypeError: invalid 'invokeConstructors' flag's type")
    );

    expect(() => {
      omniclone({}, { invokeConstructors: "" });
    }).toThrow(
      TypeError("TypeError: invalid 'invokeConstructors' flag's type")
    );

    expect(() => {
      omniclone({}, { invokeConstructors: "foo" });
    }).toThrow(
      TypeError("TypeError: invalid 'invokeConstructors' flag's type")
    );

    expect(() => {
      omniclone({}, { invokeConstructors: null });
    }).toThrow(
      TypeError("TypeError: invalid 'invokeConstructors' flag's type")
    );
  });

  it("should throw a TypeError when the copyNonEnumerables flag setted into the config object passed to omniclone has not Boolean type", () => {
    expect(() => {
      omniclone({}, { copyNonEnumerables: () => {} });
    }).toThrow(
      TypeError("TypeError: invalid 'copyNonEnumerables' flag's type")
    );

    expect(() => {
      omniclone({}, { copyNonEnumerables: {} });
    }).toThrow(
      TypeError("TypeError: invalid 'copyNonEnumerables' flag's type")
    );

    expect(() => {
      omniclone({}, { copyNonEnumerables: 42 });
    }).toThrow(
      TypeError("TypeError: invalid 'copyNonEnumerables' flag's type")
    );

    expect(() => {
      omniclone({}, { copyNonEnumerables: "" });
    }).toThrow(
      TypeError("TypeError: invalid 'copyNonEnumerables' flag's type")
    );

    expect(() => {
      omniclone({}, { copyNonEnumerables: "foo" });
    }).toThrow(
      TypeError("TypeError: invalid 'copyNonEnumerables' flag's type")
    );

    expect(() => {
      omniclone({}, { copyNonEnumerables: null });
    }).toThrow(
      TypeError("TypeError: invalid 'copyNonEnumerables' flag's type")
    );
  });

  it("should throw a TypeError when the copySymbols flag setted into the config object passed to omniclone has not Boolean type", () => {
    expect(() => {
      omniclone({}, { copySymbols: () => {} });
    }).toThrow(TypeError("TypeError: invalid 'copySymbols' flag's type"));

    expect(() => {
      omniclone({}, { copySymbols: {} });
    }).toThrow(TypeError("TypeError: invalid 'copySymbols' flag's type"));

    expect(() => {
      omniclone({}, { copySymbols: 42 });
    }).toThrow(TypeError("TypeError: invalid 'copySymbols' flag's type"));

    expect(() => {
      omniclone({}, { copySymbols: "" });
    }).toThrow(TypeError("TypeError: invalid 'copySymbols' flag's type"));

    expect(() => {
      omniclone({}, { copySymbols: "foo" });
    }).toThrow(TypeError("TypeError: invalid 'copySymbols' flag's type"));

    expect(() => {
      omniclone({}, { copySymbols: null });
    }).toThrow(TypeError("TypeError: invalid 'copySymbols' flag's type"));
  });

  it("should throw a TypeError when the copyGettersSetters flag setted into the config object passed to omniclone has not Boolean type", () => {
    expect(() => {
      omniclone({}, { copyGettersSetters: () => {} });
    }).toThrow(
      TypeError("TypeError: invalid 'copyGettersSetters' flag's type")
    );

    expect(() => {
      omniclone({}, { copyGettersSetters: {} });
    }).toThrow(
      TypeError("TypeError: invalid 'copyGettersSetters' flag's type")
    );

    expect(() => {
      omniclone({}, { copyGettersSetters: 42 });
    }).toThrow(
      TypeError("TypeError: invalid 'copyGettersSetters' flag's type")
    );

    expect(() => {
      omniclone({}, { copyGettersSetters: "" });
    }).toThrow(
      TypeError("TypeError: invalid 'copyGettersSetters' flag's type")
    );

    expect(() => {
      omniclone({}, { copyGettersSetters: "foo" });
    }).toThrow(
      TypeError("TypeError: invalid 'copyGettersSetters' flag's type")
    );

    expect(() => {
      omniclone({}, { copyGettersSetters: null });
    }).toThrow(
      TypeError("TypeError: invalid 'copyGettersSetters' flag's type")
    );
  });

  it("should throw a TypeError when the allowCircularReferences flag setted into the config object passed to omniclone has not Boolean type", () => {
    expect(() => {
      omniclone({}, { allowCircularReferences: () => {} });
    }).toThrow(
      TypeError("TypeError: invalid 'allowCircularReferences' flag's type")
    );

    expect(() => {
      omniclone({}, { allowCircularReferences: {} });
    }).toThrow(
      TypeError("TypeError: invalid 'allowCircularReferences' flag's type")
    );

    expect(() => {
      omniclone({}, { allowCircularReferences: 42 });
    }).toThrow(
      TypeError("TypeError: invalid 'allowCircularReferences' flag's type")
    );

    expect(() => {
      omniclone({}, { allowCircularReferences: "" });
    }).toThrow(
      TypeError("TypeError: invalid 'allowCircularReferences' flag's type")
    );

    expect(() => {
      omniclone({}, { allowCircularReferences: "foo" });
    }).toThrow(
      TypeError("TypeError: invalid 'allowCircularReferences' flag's type")
    );

    expect(() => {
      omniclone({}, { allowCircularReferences: null });
    }).toThrow(
      TypeError("TypeError: invalid 'allowCircularReferences' flag's type")
    );
  });

  it("should set proper constructor property and the [[Prototype]] property equals to the constructor.prototype when the invokeConstructors flag is set to true", () => {
    (() => {
      let i = 0;
      class Test {
        constructor() {
          i += 1;
        }
      }
      const testObj = new Test();
      const res = omniclone(testObj);

      expect(i).toBe(2); // +1 because of the call to create testObj
      expect(res.constructor).toBe(Test);
      expect(Object.getPrototypeOf(res)).toBe(Test.prototype);
    })();

    (() => {
      let i = 0;
      class Test {
        constructor() {
          i += 1;
        }
      }
      const testObj = new Test();
      const res = omniclone(testObj, { invokeConstructors: true });

      expect(i).toBe(2); // +1 because of the call to create testObj
      expect(res.constructor).toBe(Test);
      expect(Object.getPrototypeOf(res)).toBe(Test.prototype);
    })();

    (() => {
      let i = 0;
      class Test {
        constructor() {
          i += 1;
        }
      }
      const testObj = new Test();
      const res = omniclone(testObj, {
        invokeConstructors: true,
        setPrototype: true
      });

      expect(i).toBe(2); // +1 because of the call to create testObj
      expect(res.constructor).toBe(Test);
      expect(Object.getPrototypeOf(res)).toBe(Test.prototype);
    })();

    (() => {
      let i = 0;
      class Test {
        constructor() {
          i += 1;
        }
      }
      const testObj = new Test();
      const res = omniclone(testObj, { setPrototype: true });

      expect(i).toBe(2); // +1 because of the call to create testObj
      expect(res.constructor).toBe(Test);
      expect(Object.getPrototypeOf(res)).toBe(Test.prototype);
    })();
  });

  it("should set proper constructor property and the [[Prototype]] property equals to the source [[Prototype]] when the invokeConstructors flag is set to false and setPrototype flag is set to true", () => {
    (() => {
      let i = 0;
      class Test {
        constructor() {
          i += 1;
        }
      }
      const testObj = new Test();
      const res = omniclone(testObj, {
        invokeConstructors: false,
        setPrototype: true
      });

      expect(i).toBe(1); // +1 because of the call to create testObj
      expect(res.constructor).toBe(Test);
      expect(Object.getPrototypeOf(res)).toBe(Object.getPrototypeOf(testObj));
    })();
  });

  it("should set the `constructor` prop to the `Object` function, and the `[[Prototype]]` prop to `Object.prototype` when both the invokeConstructors and the setPrototype flag are set to false", () => {
    (() => {
      let i = 0;
      class Test {
        constructor() {
          i += 1;
        }
      }
      const testObj = new Test();
      const res = omniclone(testObj, {
        invokeConstructors: false,
        setPrototype: false
      });

      expect(i).toBe(1); // +1 because of the call to create testObj
      expect(res.constructor).toBe(Object);
      expect(Object.getPrototypeOf(res)).toBe(Object.prototype);
    })();
  });

  it("should not copy non-enumerables properties if the copyNonEnumerables flag is set to false", () => {
    (() => {
      const obj = {};
      Object.defineProperty(obj, "prop", { enumerable: false, value: 42 });

      const res = omniclone(obj);

      expect(res.prop).toBeUndefined();
    })();

    (() => {
      const obj = {};
      Object.defineProperty(obj, "prop", { enumerable: false, value: 42 });

      const res = omniclone(obj, { copyNonEnumerables: false });

      expect(res.prop).toBeUndefined();
    })();
  });

  it("should copy non-enumerables properties if the copyNonEnumerables flag is set to true", () => {
    (() => {
      const obj = {};
      Object.defineProperty(obj, "prop", { enumerable: false, value: 42 });

      const res = omniclone(obj, { copyNonEnumerables: true });

      expect(res.prop).toBe(42);
    })();
  });

  it("should not copy symbols if the copySymbols flag is set to false", () => {
    (() => {
      const obj = {};
      obj[Symbol("s")] = "s";
      const res = omniclone(obj);
      expect(res[Symbol("s")]).toBeUndefined();
    })();

    (() => {
      const obj = {};
      obj[Symbol("s")] = "s";
      const res = omniclone(obj, { copySymbols: false });
      expect(res[Symbol("s")]).toBeUndefined();
    })();
  });

  it("should shallow copy symbols if the copySymbols flag is set to true", () => {
    (() => {
      const obj = {};
      obj[Symbol("s")] = "s";
      const res = omniclone(obj, { copySymbols: true });
      expect(res[Symbol("s")]).toBe(obj[Symbol("s")]);
    })();
  });

  it("should not copy getters&setters if the copyGettersSetters flag is set to false", () => {
    (() => {
      const testObj = {};
      Object.defineProperty(testObj, "g&s", {
        get: () => 42,
        set: () => {}
      });
      // copyNonEnumerables: true because in this case set&get are not enumerable
      const res = omniclone(testObj, { copyNonEnumerables: true });
      expect(res["g&s"]).toBeUndefined();
    })();

    (() => {
      const testObj = {};
      Object.defineProperty(testObj, "g&s", {
        get: () => 42,
        set: () => {}
      });
      const res = omniclone(testObj, { copyGettersSetters: false });
      expect(res["g&s"]).toBeUndefined();
    })();
  });

  it("should shallow copy getters&setters if the copyGettersSetters flag is set to true", () => {
    (() => {
      const testObj = {};
      Object.defineProperty(testObj, "g&s", {
        get: () => 42,
        set: () => {}
      });
      // copyNonEnumerables: true because in this case set&get are also not enumerable
      const res = omniclone(testObj, {
        copyGettersSetters: true,
        copyNonEnumerables: true
      });
      expect(res["g&s"]).toBeDefined();
    })();
  });

  it("should throw a TypeError when there is a circular reference and the allowCircularReferences is set to false", () => {
    (() => {
      const ob1 = {};
      ob1.ob1 = ob1;
      expect(() => {
        omniclone(ob1, { allowCircularReferences: false });
      }).toThrow(TypeError("TypeError: circular reference found"));
    })();
  });

  it("should not throw a TypeError when there is a circular reference and the allowCircularReferences is set to true", () => {
    (() => {
      const ob1 = {};
      ob1.ob1 = ob1;
      expect(() => {
        omniclone(ob1, { allowCircularReferences: true });
      }).toBeDefined();
    })();

    (() => {
      const ob1 = {};
      const ob2 = { ob1 };
      ob1.ob2 = ob2;
      expect(() => {
        omniclone(ob1);
      }).toBeDefined();
    })();

    (() => {
      const ob1 = {};
      const ob2 = {};
      const ob3 = {};
      const ob4 = {};
      ob1.ob2 = ob2;
      ob1.ob4 = ob4;
      ob2.ob3 = ob3;
      ob4.ob3 = ob3;
      ob3.ob1 = ob1;

      expect(() => {
        omniclone(ob1, { allowCircularReferences: true });
      }).toBeDefined();
    })();
  });

  it("should throw a TypeError when a prop is an Error object and the discardErrorObjects flag is set to false", () => {
    (() => {
      class MyError extends Error {}
      const ob1 = { p: new MyError() };
      expect(() => {
        omniclone(ob1, { discardErrorObjects: false });
      }).toThrow(TypeError("TypeError: cannot copy Error objects"));
    })();
  });

  it("should discard an Error object prop if the discardErrorObjects flag is set to true", () => {
    (() => {
      class MyError extends Error {}
      const ob1 = { p: new MyError() };

      const res = omniclone(ob1, { discardErrorObjects: true });
      expect(res.p).toBeUndefined();
    })();

    (() => {
      class MyError extends Error {}
      const ob1 = { p: new MyError() };

      const res = omniclone(ob1);
      expect(res.p).toBeUndefined();
    })();
  });

  it("should return null when a String object is passed as source", () => {
    const str = new String("foo");
    expect(omniclone(str)).toBeNull();
  });

  it("should convert String objects into primitive values ", () => {
    (() => {
      const str = { s: new String("foo") };
      const res = omniclone(str);
      expect(res.s).toBe("foo");
    })();
  });

  it("should return null when a Number object is passed as source", () => {
    const n = new Number("1");
    expect(omniclone(n)).toBeNull();
  });

  it("should convert Number objects into primitive values ", () => {
    (() => {
      const nb = { n: new Number("1") };
      const res = omniclone(nb);
      expect(res.n).toBe(1);
    })();
  });

  it("should return null when a Boolean object is passed as source", () => {
    const b = new Boolean(true);
    expect(omniclone(b)).toBeNull();
  });

  it("should convert Boolean objects into primitive values ", () => {
    (() => {
      const bo = { b: new Boolean(true) };
      const res = omniclone(bo);
      expect(res.b).toBe(true);
    })();
  });

  it("should return the promise when a Promise object is passed as source", () => {
    const p = Promise.resolve();
    const res = omniclone(p);
    expect(res).toBe(p);
  });

  it("should return the weakmap when a WeakMap object is passed as source", () => {
    const wm = new WeakMap();
    const res = omniclone(wm);
    expect(res).toBe(wm);
  });

  it("should return the weakset when a WeakSet object is passed as source", () => {
    const ws = new WeakSet();
    const res = omniclone(ws);
    expect(res).toBe(ws);
  });

  it("should shallow copy a Promise prop", () => {
    const p = Promise.resolve();
    const ob1 = { p };
    const res = omniclone(ob1);
    expect(res.p).toBe(ob1.p);
  });

  it("should shallow copy a WeakMap prop", () => {
    const wm = new WeakMap();
    const ob1 = { wm };
    const res = omniclone(ob1);
    expect(res.vm).toBe(ob1.vm);
  });

  it("should shallow copy a WeakSet prop", () => {
    const ws = new WeakSet();
    const ob1 = { ws };
    const res = omniclone(ob1);
    expect(res.ws).toBe(ob1.ws);
  });

  it("should clone a RegExp if it is passed as source", () => {
    (() => {
      const r = new RegExp("foo", "g");
      r.lastIndex = 10;
      const res = omniclone(r);
      expect(res.flags).toBe(r.flags);
      expect(res.source).toBe(r.source);
      expect(res.lastIndex).toBe(r.lastIndex);
    })();
  });

  it("should clone a RegExp property", () => {
    (() => {
      const r = new RegExp("foo", "g");
      r.lastIndex = 10;
      const ob1 = { r };
      const res = omniclone(ob1);
      expect(res.r.flags).toBe(ob1.r.flags);
      expect(res.r.source).toBe(ob1.r.source);
      expect(res.r.lastIndex).toBe(ob1.r.lastIndex);
    })();
  });

  it("should clone a Date if it is passed as source", done => {
    (() => {
      const d = new Date();
      new Promise(ok => {
        setTimeout(ok, 2000);
      }).then(() => {
        const res = omniclone(d);
        expect(res.getTime()).toBe(d.getTime());
        done();
      });
    })();
  });

  it("should clone a Date property", done => {
    (() => {
      const d = new Date();
      const ob1 = { d };
      new Promise(ok => {
        setTimeout(ok, 2000);
      }).then(() => {
        const res = omniclone(ob1);
        expect(res.d.getTime()).toBe(ob1.d.getTime());
        done();
      });
    })();
  });

  it("should properly clone an Array if the invokeConstructors flag is set", () => {
    (() => {
      const arr = [1, 2, 3, 4, 5];
      const res = omniclone(arr);

      expect(Array.isArray(res)).toBeTruthy();
      expect(res).toEqual(arr);
      expect(res === arr).toBeFalsy();
    })();

    (() => {
      const arr = [1, 2, 3, 4, 5];
      const res = omniclone(arr, {
        invokeConstructors: true
      });

      expect(Array.isArray(res)).toBeTruthy();
      expect(res).toEqual(arr);
    })();

    (() => {
      const arr = [1, 2, 3, 4, 5];
      const ob1 = { arr };
      const res = omniclone(ob1);

      expect(Array.isArray(res.arr)).toBeTruthy();
      expect(res.arr).toEqual(ob1.arr);
    })();

    (() => {
      const arr = [1, 2, 3, 4, 5];
      const ob1 = { arr };
      const res = omniclone(ob1);

      expect(Array.isArray(res.arr)).toBeTruthy();
      expect(res.arr).toEqual(ob1.arr);
    })();
  });

  it(`should not copy a non config prop setted by the calling to a constructor`, () => {
    (() => {
      class Test {
        constructor() {
          Object.defineProperty(this, "prop", {
            configurable: false,
            writable: false,
            enumerable: true,
            value: 42
          });
        }
      }
      const test = new Test();
      expect(() => {
        omniclone(test);
      }).not.toThrow(
        `TypeError: can't redefine non-configurable property prop`
      );
    })();
  });

  it(`should properly copy [[Prototype]], constructor, props, non-enum props, gets&sets and shallow copy symbols`, () => {
    (() => {
      const testObj = {};
      testObj.foo = "bar";
      Object.defineProperty(testObj, "notEnum", {
        enumerable: false,
        value: 42
      });
      Object.defineProperty(testObj, "g&s", {
        get: () => 42,
        set: () => {}
      });
      testObj.symbol = Symbol("symbol");

      const res = omniclone(testObj, {
        copyGettersSetters: true,
        copySymbols: true,
        copyNonEnumerables: true
      });

      expect(res === testObj).toBeFalsy();
      expect(res).toEqual(testObj);
      expect(res.constructor).toEqual(testObj.constructor);
      expect(Object.getPrototypeOf(res)).toEqual(
        Object.getPrototypeOf(testObj)
      );

      expect(res.foo).toBe("bar");
      expect(Object.getOwnPropertyDescriptor(res, "notEnum")).toEqual(
        Object.getOwnPropertyDescriptor(testObj, "notEnum")
      );
      expect(Object.getOwnPropertyDescriptor(res, "g&s")).toEqual(
        Object.getOwnPropertyDescriptor(testObj, "g&s")
      );
      expect(res.symbol).toBe(testObj.symbol); // shallow copy symbols
    })();

    (() => {
      const testObj = {};
      testObj.foo = "bar";
      Object.defineProperty(testObj, "notEnum", {
        enumerable: false,
        value: 42
      });
      Object.defineProperty(testObj, "g&s", {
        get: () => 42,
        set: () => {}
      });
      testObj.symbol = Symbol("symbol");
      testObj.innerObj = {
        prop: "value",
        symbol: Symbol("innerSymbol")
      };

      const res = omniclone(testObj, {
        copyGettersSetters: true,
        copySymbols: true,
        copyNonEnumerables: true
      });

      expect(res === testObj).toBeFalsy();
      expect(res.innerObj === testObj.innerObj).toBeFalsy();
      expect(res).toEqual(testObj);
      expect(res.innerObj).toEqual(testObj.innerObj);
      expect(res.constructor).toEqual(testObj.constructor);
      expect(Object.getPrototypeOf(res)).toEqual(
        Object.getPrototypeOf(testObj)
      );

      expect(res.foo).toBe("bar");
      expect(Object.getOwnPropertyDescriptor(res, "notEnum")).toEqual(
        Object.getOwnPropertyDescriptor(testObj, "notEnum")
      );
      expect(Object.getOwnPropertyDescriptor(res, "g&s")).toEqual(
        Object.getOwnPropertyDescriptor(testObj, "g&s")
      );
      expect(res.symbol).toBe(testObj.symbol); // shallow copy symbols
      expect(res.innerObj.symbol).toBe(testObj.innerObj.symbol); // shallow copy symbols
      expect(res.innerObj.prop).toBe(testObj.innerObj.prop);
    })();
  });

  it(`should properly restore a circular references structure`, () => {
    (() => {
      const ob1 = { value: 1 };

      const ob2 = { value: 2 };

      const ob3 = { value: 3 };

      const ob4 = { value: 4 };

      ob1.ob2 = ob2;
      ob1.ob4 = ob4;
      ob2.ob3 = ob3;
      ob3.ob1 = ob1;
      ob4.ob3 = ob3;

      const res = omniclone(ob1, {
        allowCircularReferences: true
      });

      // checks for differents references between old and new structure
      expect(res === ob1).toBeFalsy();
      expect(res.ob2 === ob1.ob2).toBeFalsy();
      expect(res.ob4 === ob1.ob4).toBeFalsy();
      expect(res.ob2.ob3 === ob1.ob2.ob3).toBeFalsy();
      expect(res.ob2.ob3.ob1 === ob1.ob2.ob3.ob1).toBeFalsy();

      // check for equals references inside the returned object
      expect(res.ob2.ob3.ob1 === res).toBeTruthy();
      expect(res.ob4.ob3 === res.ob2.ob3).toBeTruthy();

      // check for props equality
      expect(res).toEqual(ob1);
    })();
  });

  it(`should properly handle duplicated sibiling object references without circular references`, () => {
    (() => {
      const duplicatedObj = {};
      const source = {
        a: duplicatedObj,
        b: duplicatedObj
      };
      duplicatedObj.prop = "value";

      const res = omniclone(source);

      expect(res.a).toBe(res.b);
      expect(res === source).toBeFalsy();
      expect(res.a === source.a).toBeFalsy();

      // props check
      expect(res).toEqual(source);
    })();
  });

  it(`should properly handle duplicated sibiling object references with circular references`, () => {
    (() => {
      const duplicatedObj = {};
      const source = {
        a: duplicatedObj,
        b: duplicatedObj
      };
      duplicatedObj.prop = "value";
      duplicatedObj.source = source;

      const res = omniclone(source, {
        allowCircularReferences: true
      });

      expect(res.a).toBe(res.b);
      expect(res === source).toBeFalsy();
      expect(res.a === source.a).toBeFalsy();
      expect(res.a.source === source.a.source).toBeFalsy();
      expect(res.a.source === res).toBeTruthy();

      // props check
      expect(res).toEqual(source);
    })();
  });

  it(`should properly duplicate a simple Map (without circular references)`, () => {
    (() => {
      const map = new Map();
      const key = {};
      map.set("prop1", "value1");
      map.set(key, {
        a: {
          a: "a"
        },
        b: 42
      });

      map.set(Symbol.iterator, 42); // symbols should be copied because in a Map them aren't 'hidden' keys

      const res = omniclone(map);

      expect(map === res).toBeFalsy();
      expect(map.get("prop1") === res.get("prop1")).toBeTruthy();
      expect(map.get(key) === res.get(key)).toBeFalsy();
      expect(map.get(key)).toEqual(res.get(key));
      expect(
        map.get(Symbol.iterator) === res.get(Symbol.iterator)
      ).toBeTruthy();
      expect(map.size).toBe(res.size);
    })();
  });

  it(`should properly duplicate a Map with circular references`, () => {
    (() => {
      const map = new Map();
      const key = {};
      map.set("prop1", "value1");
      map.set(key, {
        a: {
          a: "a"
        },
        b: 42,
        map
      });
      map.set(map, map);

      const res = omniclone(map, {
        allowCircularReferences: true
      });

      expect(map === res).toBeFalsy();
      expect(map.get("prop1") === res.get("prop1")).toBeTruthy();
      expect(map.get(key) === res.get(key)).toBeFalsy();
      expect(map.size).toBe(res.size);

      expect(map.get(key).map).toBe(map);
      expect(res.get(key).map).toBe(res);

      // map and object keys remains untouched, values needs to be updated
      expect(res.get(map) === res).toBeTruthy();
      expect(res.get(key).a === map.get(key).a).toBeFalsy();
      expect(res.get(key).map === res).toBeTruthy();
    })();
  });

  it(`it should throw a TypeError when a circular reference is found into a Map object and the allowCircularReferences flag is set to false`, () => {
    (() => {
      const map = new Map();
      map.set(map, map);
      expect(() => {
        omniclone(map, {
          allowCircularReferences: false
        });
      }).toThrow(TypeError("TypeError: circular reference found"));
    })();

    (() => {
      const map = new Map();
      map.set(map, map);
      expect(() => {
        omniclone(map, {
          allowCircularReferences: false
        });
      }).toThrow(TypeError("TypeError: circular reference found"));
    })();
  });

  it(`should properly handle duplicated sibiling object references into a Map without circular references`, () => {
    (() => {
      const duplicatedObj = {};
      const map = new Map();
      map.set("a", duplicatedObj);
      map.set("b", duplicatedObj);

      const res = omniclone(map);

      expect(res.get("a")).toBe(res.get("b"));
      expect(res === map).toBeFalsy();
      expect(res.get("a") === map.get("a")).toBeFalsy();
    })();
  });

  it(`should properly handle duplicated sibiling object references into a Map with circular references`, () => {
    (() => {
      const duplicatedObj = {};
      const map = new Map();
      map.set("a", duplicatedObj);
      map.set("b", duplicatedObj);

      duplicatedObj.map = map;
      duplicatedObj.a = "a";

      const res = omniclone(map, {
        allowCircularReferences: true
      });

      expect(res.get("a")).toBe(res.get("b"));
      expect(res === map).toBeFalsy();
      expect(res.get("a") === map.get("a")).toBeFalsy();
      expect(res.get("a").map === res).toBeTruthy();
    })();
  });

  it(`should call the proper constructor for an object into a Map`, () => {
    (() => {
      class Test {}
      const map = new Map();
      map.set("a", new Test());

      const res = omniclone(map);

      expect(res.get("a").constructor).toBe(Test);
      expect(res === map).toBeFalsy();
      expect(res.get("a") === map.get("a")).toBeFalsy();
      expect(
        Object.getPrototypeOf(res.get("a")) === Test.prototype
      ).toBeTruthy();
    })();
  });

  it("should throw a TypeError when a value in a Map object is an Error object and the discardErrorObjects flag is set to false", () => {
    (() => {
      class MyError extends Error {}
      const map = new Map();
      map.set("p", new MyError());

      expect(() => {
        omniclone(map, { discardErrorObjects: false });
      }).toThrow(TypeError("TypeError: cannot copy Error objects"));
    })();
  });

  it("should discard an Error map element object if the discardErrorObjects flag is set to true", () => {
    (() => {
      class MyError extends Error {}
      const map = new Map();
      map.set("e", new MyError());

      const res = omniclone(map, { discardErrorObjects: true });
      expect(res.get("e")).toBeUndefined();
    })();

    (() => {
      class MyError extends Error {}
      const map = new Map();
      map.set("e", new MyError());

      const res = omniclone(map);

      expect(res.get("e")).toBeUndefined();
    })();
  });

  it("should convert String map elements into primitive values ", () => {
    (() => {
      const map = new Map();
      const str = new String("foo");
      map.set("s", str);
      const res = omniclone(map);
      expect(res.get("s")).toBe("foo");
    })();
  });

  it("should convert Number map elements into primitive values ", () => {
    (() => {
      const map = new Map();
      const n = new Number(1);
      map.set("n", n);
      const res = omniclone(map);
      expect(res.get("n")).toBe(1);
    })();
  });

  it("should convert Boolean map elements into primitive values ", () => {
    (() => {
      const map = new Map();
      const b = new Boolean(true);
      map.set("b", b);
      const res = omniclone(map);
      expect(res.get("b")).toBe(true);
    })();
  });

  it("should shallow copy a Promise map element ", () => {
    const map = new Map();
    const p = Promise.resolve();
    map.set("p", p);
    const res = omniclone(map);
    expect(res.get("p")).toBe(map.get("p"));
  });

  it("should shallow copy a WeakMap map element", () => {
    const wm = new WeakMap();
    const map = new Map();
    map.set("wm", wm);
    const res = omniclone(map);
    expect(res.get("wm")).toBe(map.get("wm"));
  });

  it("should shallow copy a WeakSet map element", () => {
    const ws = new WeakSet();
    const map = new Map();
    map.set("ws", ws);
    const res = omniclone(map);
    expect(res.get("ws")).toBe(map.get("ws"));
  });

  it("should clone a RegExp map element", () => {
    (() => {
      const map = new Map();
      const r = new RegExp("foo", "g");
      r.lastIndex = 10;
      map.set("r", r);

      const res = omniclone(map);
      expect(res.get("r") === map.get("r")).toBe(false);
      expect(res.get("r").flags).toBe(map.get("r").flags);
      expect(res.get("r").source).toBe(map.get("r").source);
      expect(res.get("r").lastIndex).toBe(map.get("r").lastIndex);
    })();
  });

  it("should clone a Date map element", done => {
    (() => {
      const map = new Map();
      const d = new Date();
      map.set("d", d);

      new Promise(ok => {
        setTimeout(ok, 2000);
      }).then(() => {
        const res = omniclone(map);
        expect(res.get("d") === map.get("d")).toBe(false);
        expect(res.get("d").getTime()).toBe(map.get("d").getTime());
        done();
      });
    })();
  });

  it("should properly clone an Array into a map if the invokeConstructors flag is set", () => {
    (() => {
      const arr = [1, 2, 3, 4, 5];
      const map = new Map();
      map.set("arr", arr);

      const res = omniclone(map);

      expect(Array.isArray(res.get("arr"))).toBeTruthy();
      expect(res).toEqual(map);
      expect(res.get("arr") === map.get("arr")).toBeFalsy();
    })();

    (() => {
      const arr = [1, 2, 3, 4, 5];
      const map = new Map();
      map.set("arr", arr);
      arr.push(map);
      arr.push(map);

      const res = omniclone(map, {
        allowCircularReferences: true
      });

      expect(Array.isArray(res.get("arr"))).toBeTruthy();
      expect(res.get("arr") === map.get("arr")).toBeFalsy();
      expect(res.get("arr")[5] === map.get("arr")[5]).toBeFalsy();
      expect(res.get("arr")[5] === res.get("arr")[6]).toBeTruthy();
      expect(res.get("arr")[5] === res).toBeTruthy();
    })();
  });

  it(`should properly duplicate a simple Set (without circular references)`, () => {
    (() => {
      const set = new Set();
      set.add("prop1", "value1");
      set.add({
        a: {
          a: "a"
        },
        b: 42
      });

      set.add(Symbol.iterator, 42); // symbols should be copied because in a Set them aren't 'hidden' keys

      const res = omniclone(set);
      expect(set === res).toBeFalsy();

      const setIt = set.values();
      const resIt = res.values();

      expect(setIt.next().value === resIt.next().value).toBeTruthy(); // prop1

      // the object
      const setObj = setIt.next().value;
      const resObj = resIt.next().value;
      expect(setObj === resObj).toBeFalsy();
      expect(setObj).toEqual(resObj);

      expect(setIt.next().value === resIt.next().value).toBeTruthy(); // the symbol
      expect(set.size).toBe(res.size);
    })();
  });

  it(`should properly duplicate a Set with circular references`, () => {
    (() => {
      const set = new Set();
      set.add("prop1", "value1");
      set.add({
        a: {
          a: "a"
        },
        b: 42,
        set
      });
      set.add(set);

      const res = omniclone(set, {
        allowCircularReferences: true
      });
      expect(set === res).toBeFalsy();

      const setIt = set.values();
      const resIt = res.values();

      expect(setIt.next().value === resIt.next().value).toBeTruthy(); // prop1

      // the object
      const setObj = setIt.next().value;
      const resObj = resIt.next().value;
      expect(setObj === resObj).toBeFalsy();

      expect(setObj.set === set).toBeTruthy();
      expect(resObj.set === res).toBeTruthy();

      // the inner reference to the Set
      const setSet = setIt.next().value;
      const resSet = resIt.next().value;

      expect(resSet === res).toBeTruthy();
      expect(setSet === resSet).toBeFalsy();

      expect(set.size).toBe(res.size);
    })();
  });

  it(`it should throw a TypeError when a circular reference is found into a Set object and the allowCircularReferences flag is set to false`, () => {
    (() => {
      const set = new Set();
      set.add(set);
      expect(() => {
        omniclone(set, {
          allowCircularReferences: false
        });
      }).toThrow(TypeError("TypeError: circular reference found"));
    })();

    (() => {
      const set = new Set();
      set.add(set);
      expect(() => {
        omniclone(set, {
          allowCircularReferences: false
        });
      }).toThrow(TypeError("TypeError: circular reference found"));
    })();
  });

  it(`should call the proper constructor for an object into a Set`, () => {
    (() => {
      let i = 0;
      class Test {
        constructor() {
          i += 1;
        }
      }
      const set = new Set();
      set.add(new Test());
      const res = omniclone(set);

      expect(i).toBe(2);

      const setTestEntry = set.values().next().value;
      const resTestEntry = res.values().next().value;

      expect(resTestEntry.constructor).toBe(Test);
      expect(res === set).toBeFalsy();
      expect(setTestEntry === resTestEntry).toBeFalsy();
      expect(
        Object.getPrototypeOf(resTestEntry) === Test.prototype
      ).toBeTruthy();
    })();
  });

  it("should throw a TypeError when a value in a Set object is an Error object and the discardErrorObjects flag is set to false", () => {
    (() => {
      class MyError extends Error {}
      const set = new Set();
      set.add(new MyError());

      expect(() => {
        omniclone(set, { discardErrorObjects: false });
      }).toThrow(TypeError("TypeError: cannot copy Error objects"));
    })();
  });

  it("should discard an Error set element object if the discardErrorObjects flag is set to true", () => {
    (() => {
      class MyError extends Error {}
      const set = new Set();
      const e = new MyError();
      set.add(e);

      const res = omniclone(set, { discardErrorObjects: true });
      expect(res.has(e)).toBeFalsy();
    })();

    (() => {
      class MyError extends Error {}
      const set = new Set();
      const e = new MyError();
      set.has(e);

      const res = omniclone(set);
      expect(res.has(e)).toBeFalsy();
    })();
  });

  it("should convert String set elements into primitive values ", () => {
    (() => {
      const set = new Set();
      const str = new String("foo");
      set.add(str);
      const res = omniclone(set);
      expect(res.has("foo")).toBe(true);
    })();
  });

  it("should convert Number set elements into primitive values ", () => {
    (() => {
      const set = new Set();
      const n = new Number(42);
      set.add(n);
      const res = omniclone(set);
      expect(res.has(42)).toBe(true);
    })();
  });

  it("should convert Boolean set elements into primitive values ", () => {
    (() => {
      const set = new Set();
      const b = new Boolean(true);
      set.add(b);
      const res = omniclone(set);
      expect(res.has(true)).toBe(true);
    })();
  });

  it("should shallow copy a Promise set element ", () => {
    const set = new Set();
    const p = Promise.resolve();
    set.add(p);
    const res = omniclone(set);
    expect(res.has(p)).toBe(true);
  });

  it("should shallow copy a WeakMap set element", () => {
    const wm = new WeakMap();
    const set = new Set();
    set.add(wm);
    const res = omniclone(set);
    expect(res.has(wm)).toBe(true);
  });

  it("should shallow copy a WeakSet set element", () => {
    const ws = new WeakSet();
    const set = new Set();
    set.add(ws);
    const res = omniclone(set);
    expect(res.has(ws)).toBe(true);
  });

  it("should clone a RegExp set element", () => {
    (() => {
      const set = new Set();
      const r = new RegExp("foo", "g");
      r.lastIndex = 10;
      set.add(r);
      const res = omniclone(set);

      const resRegExp = res.values().next().value;

      expect(r === resRegExp).toBe(false);
      expect(resRegExp.flags).toBe(r.flags);
      expect(resRegExp.source).toBe(r.source);
      expect(resRegExp.lastIndex).toBe(r.lastIndex);
    })();
  });

  it("should clone a Date set element", done => {
    (() => {
      const set = new Set();
      const d = new Date();
      set.add(d);

      new Promise(ok => {
        setTimeout(ok, 2000);
      }).then(() => {
        const res = omniclone(set);
        const resDate = res.values().next().value;
        expect(resDate === d).toBe(false);
        expect(resDate.getTime() === d.getTime()).toBe(true);
        done();
      });
    })();
  });

  it("should properly clone an Array into a set if the invokeConstructors flag is set", () => {
    (() => {
      const arr = [1, 2, 3, 4, 5];
      const set = new Set();
      set.add(arr);

      const res = omniclone(set);
      const resArr = res.values().next().value;

      expect(Array.isArray(resArr)).toBeTruthy();
      expect(res).toEqual(set);
      expect(resArr === arr).toBeFalsy();
      expect(resArr).toEqual(arr);
    })();

    (() => {
      const arr = [1, 2, 3, 4, 5];
      const set = new Set();
      set.add(arr);

      arr.push(set);
      arr.push(set);

      const res = omniclone(set, {
        allowCircularReferences: true
      });
      const resArr = res.values().next().value;

      expect(Array.isArray(resArr)).toBeTruthy();
      expect(resArr === arr).toBeFalsy();

      expect(resArr[5] === arr[5]).toBeFalsy();
      expect(resArr[5] === resArr[6]).toBeTruthy();
      expect(resArr[5] === res).toBeTruthy();
    })();
  });

  it("should pass when there are circ references into a Set object contained into an object", () => {
    (() => {
      const obj = {};
      const obj2 = { a: "a" };
      obj.obj2 = obj2;
      const set = new Set();
      set.add(obj);
      set.add(obj2);
      obj.set = set;

      const res = omniclone(obj, {
        allowCircularReferences: true
      });

      expect(obj === res).toBe(false);
      expect(obj.obj2 === res.obj2).toBe(false);
      expect(obj.set === res.set).toBe(false);

      const objSetIt = obj.set.values();
      const objSetObj = objSetIt.next().value;
      const objSetObj2 = objSetIt.next().value;
      const resSetIt = res.set.values();
      const resSetObj = resSetIt.next().value;
      const resSetObj2 = resSetIt.next().value;

      // them are inverted, idk why
      expect(resSetObj2 === objSetObj).toBe(false);
      expect(resSetObj === objSetObj2).toBe(false);
      expect(objSetObj === obj).toBe(true);
      expect(resSetObj === res.obj2).toBe(true);
      expect(resSetObj2 === res).toBe(true);
    })();
  });

  it("should not throw a TypeError because there are not circ references", () => {
    (() => {
      const ob0 = {};
      const ob1 = {};
      const ob2 = {};
      const ob3 = {};

      ob0.ob1 = ob1;
      ob0.ob2 = ob2;

      ob1.ob3 = ob3;
      ob2.ob3 = ob3;
      expect(() => {
        omniclone(ob0, { allowCircularReferences: false });
      }).not.toThrow(TypeError("TypeError: circular reference found"));
    })();

    (() => {
      const ob0 = {};
      const ob1 = {};
      const ob2 = {};
      ob0.ob1 = ob1;
      ob0.ob2 = ob2;

      ob1.ob2 = ob2;
      expect(() => {
        omniclone(ob0, { allowCircularReferences: false });
      }).not.toThrow(TypeError("TypeError: circular reference found"));
    })();

    (() => {
      const ob0 = {};
      const ob1 = {};
      const ob2 = {};
      const ob3 = {};

      ob0.ob1 = ob1;
      ob0.ob2 = ob2;

      ob2.ob3 = ob3;
      ob3.ob1 = ob1;

      expect(() => {
        omniclone(ob0, { allowCircularReferences: false });
      }).not.toThrow(TypeError("TypeError: circular reference found"));
    })();
  });

  it("should properly clone a Node Buffer when we pass an appropriate customHandler callback", () => {
    (() => {
      const buffer = Buffer.from([1, 2, 3, 4]);

      const resBuffer = omniclone(buffer, {}, node => {
        if (node instanceof Buffer) {
          return Buffer.from(node);
        }
        return undefined;
      });

      const comp = Buffer.compare(buffer, resBuffer);

      expect(comp).toBe(0);
      expect(resBuffer.constructor).toBe(Buffer);
    })();
  });

  it("should properly clone the custom type object", () => {
    (() => {
      class Test {
        constructor(a, b) {
          this.a = a;
          this.b = b;
        }

        setC(val) {
          this.c = val;
        }
      }

      const test = new Test();
      test.setC(10);

      const res = omniclone(test, {}, node => {
        if (node instanceof Test) {
          const result = new Test(node.a, node.b);
          return result;
        }
        return undefined;
      });
      expect(res instanceof Test).toBe(true);
      expect(res.a === test.a).toBe(true);
      expect(res.b === test.b).toBe(true);
      expect(res.c).toBeUndefined();
    })();

    (() => {
      class Test {
        constructor(a, b) {
          this.a = a;
          this.b = b;
        }

        setC(val) {
          this.c = val;
        }
      }

      const test = new Test();
      test.setC(10);
      const source = { test };

      const res = omniclone(source, {}, node => {
        if (node instanceof Test) {
          const result = new Test(node.a, node.b);
          return result;
        }
        return undefined;
      });
      expect(res.test instanceof Test).toBe(true);
      expect(res.test.a === test.a).toBe(true);
      expect(res.test.b === test.b).toBe(true);
      expect(res.test.c).toBeUndefined();
    })();

    (() => {
      class Test {
        constructor(a, b) {
          this.a = a;
          this.b = b;
        }

        setC(val) {
          this.c = val;
        }
      }

      const test = new Test();
      test.setC(10);

      const map = new Map();
      map.set("t", test);

      const res = omniclone(map, {}, node => {
        if (node instanceof Test) {
          const result = new Test(node.a, node.b);
          return result;
        }
        return undefined;
      });
      expect(res.get("t") instanceof Test).toBe(true);
      expect(res.get("t").a === test.a).toBe(true);
      expect(res.get("t").b === test.b).toBe(true);
      expect(res.get("t").c).toBeUndefined();
    })();

    (() => {
      class Test {
        constructor(a, b) {
          this.a = a;
          this.b = b;
        }

        setC(val) {
          this.c = val;
        }
      }

      const test = new Test();
      test.setC(10);

      const set = new Set();
      set.add(test);

      const resSet = omniclone(set, {}, node => {
        if (node instanceof Test) {
          const result = new Test(node.a, node.b);
          return result;
        }
        return undefined;
      });

      const res = resSet.values().next().value;

      expect(res instanceof Test).toBe(true);
      expect(res.a === test.a).toBe(true);
      expect(res.b === test.b).toBe(true);
      expect(res.c).toBeUndefined();
    })();
  });
});
