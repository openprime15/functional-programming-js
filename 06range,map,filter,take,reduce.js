/* map filter reduce go pipe curry*/

const curry = (f) => {
    return (a , ..._) => {
        return _.length? f(a, ..._) : (..._) => {
            return f(a, ..._)
        }
    }
}

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
// curry 추가
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

/* 지연 평가 함수 */
// 새로운 값을 바로 만들지 않고, 호출할때 만들어서 출력함
L.map = curry(function *(f, iter) {
    for (const a of iter) {
        yield f(a);
    }
})

L.filter = curry(function *(f, iter) {
    for (const a of iter) {
        if (f(a)) {
            yield a;
        }
    }
})

/* 일반 함수와 L 함수의 중첩사용 비교 */
go(range(10),
map(n=> n+10),
filter(n=>n%2),
take(2),
console.log)

go(L.range(10),
L.map(n=> n+10),
L.filter(n=>n%2),
take(2),
console.log)

// L함수의 go를 실행하면 3가지를 넘어가서 take가 실행됨
// L함수의 go는 각 코드가 세로로 실행됨