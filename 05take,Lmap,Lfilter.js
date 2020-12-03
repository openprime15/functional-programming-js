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

// 길이만큼 리턴
let take = (l, iter) => { 
    let res = [];
    for (const a of iter) {
        res.push(a);
        if (res.length === l) {
            return res;
        }
    }
    return res;
}

console.log(take(5, L.range(Infinity)));

// curry 추가
take = curry((l, iter) => { 
    let res = [];
    for (const a of iter) {
        res.push(a);
        if (res.length === l) {
            return res;
        }
    }
    return res;
})

// 몇가지의 연산을 꺼내서 쓸때 잘 쓰는 방법
go(L.range(10000),
take(5),
console.log);

/* 지연 평가 함수 */
// 새로운 값을 바로 만들지 않고, 호출할때 만들어서 출력함
L.map = function *(f, iter) {
    for (const a of iter) {
        yield f(a);
    }
}

L.filter = function *(f, iter) {
    for (const a of iter) {
        if (f(a)) {
            yield a;
        }
    }
}

let it = L.map(a=>a+10, [1,2,3])
// console.log(it.next());

it = L.filter(a=>a %2, [1, 2, 3, 4]);
console.log(it.next());

