/* map filter reduce go pipe curry*/

const curry = (f) => {
    return (a , ..._) => {
        return _.length? f(a, ..._) : (..._) => {
            return f(a, ..._)
        }
    }
}

const map = curry((f, iter) => {
    let result = [];
    for (const a of iter) {
        result.push(f(a));
    }
    return result;
})

const filter = curry((f, iter) => {
    let result = [];
    for (const a of iter) {
        if(f(a)){
            result.push(a);
        }
    }
    return result;
})

const reduce = curry((f, acc, iter) => {
    if(!iter){
        iter = acc[Symbol.iterator]();
        acc = iter.next().value;
    }
    for (const a of iter) {
        acc = f(acc, a);
    }
    return acc;
})

const go = (...args) => {
    return reduce((a,f)=>f(a), args);
}

const pipe = (...fs) => {
    return (a) => {
        return go(a, ...fs);
    }
}

/* range */

const range = (l) => {
    let i = -1;
    let res = [];
    while (++i < l) {
        res.push(i);
    }
    return res;
}
// console.log(reduce((a,b)=>a+b, range(4)));

//  L.range
const L = {};
// 제너레이터를 활용해 이터레이터를 만들어냄
// next를 쓰기 전까지는 함수 내부는 실행되지 않음
L.range = function *(l) {
    let i=-1;
    while (++i<l) {
        yield i;
    }
};
// let list = L.range(4)
// console.log(list.next().value);
// console.log(reduce((a,b)=>a+b), list);

// 테스트
function test(name, time, f) {
    console.time(name);
    while (time--) {
        f();
    }
    console.timeEnd(name);
}

test('range', 10, ()=> reduce((a,b)=>a+b, range(1000000)));
test('L.range', 10, ()=> reduce((a,b)=>a+b, L.range(1000000)));