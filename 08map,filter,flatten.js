const curry = (f) => {
    return (a , ..._) => {
        return _.length? f(a, ..._) : (..._) => {
            return f(a, ..._)
        }
    }
}

const L = {};

L.range = function *(l) {
    let i=-1;
    while (++i<l) {
        yield i;
    }
};

L.entries = function* (obj) {
  for (const k in obj) yield [k, obj[k]];
};

const take = curry((l, iter) => { 
    let res = [];
    for (const a of iter) {
        res.push(a);
        if (res.length === l) {
            return res;
        }
    }
    return res;
})

const reduce = curry((f, acc, iter) => {
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  } else {
    iter = iter[Symbol.iterator]();
  }
  let cur;
  while (!(cur = iter.next()).done) {
    const a = cur.value;
    acc = f(acc, a);
  }
  return acc;
});

const find = curry((f, iter) => go(
  iter,
  L.filter(f),
  take(1),
  ([a]) => a));

const go = (...args) => {
    return reduce((a,f)=>f(a), args);
}

const pipe = (f, ...fs) => (...as) => go(f(...as), ...fs);

var add = (a, b) => a + b;

const range = l => {
  let i = -1;
  let res = [];
  while (++i < l) {
    res.push(i);
  }
  return res;
};
  
  // ## L.map + take로 map 만들기

  L.map = curry(function *(f, iter) {
    for (const a of iter) {
        yield f(a);
    }
})

  const takeAll = take(Infinity);

  const map = curry(pipe(L.map, takeAll));

//   console.log(map(a => a + 10, L.range(4)));

  // ## L.filter + take로 filter 만들기

  L.filter = curry(function *(f, iter) {
    for (const a of iter) {
        if (f(a)) {
            yield a;
        }
    }
})

  const filter = curry(pipe(L.filter, takeAll));

//   console.log(filter(a => a % 2, range(4)));


/* L.flatten 들어온 값을 다 펼쳐서 배열로 만드는 함수 */

const isIterable = a => a && a[Symbol.iterator];

L.flatten = function *(iter) {
    for (const a of iter) {
        if(isIterable(a)){
            for (const b of a) {
                yield b;
            }
        }
        else yield a;
    }
}

let it = L.flatten([[1, 2], 3, [4], 5, 6, [7, 8, 9]]);
console.log([...it]);