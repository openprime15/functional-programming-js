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


/* queryStr */
let queryStr = (obj) => {
    return go(obj, Object.entries,map(([k, v])=> `${k}=${v}`), reduce((a,b) => `${a}&${b}`));
}

// 리팩토링
queryStr = pipe(
    Object.entries,map(([k, v])=> `${k}=${v}`), reduce((a,b) => `${a}&${b}`)
)

// join 활용
const join = curry((sep = ',', iter) => {
    return reduce((a, b)=> `${a}${sep}${b}`, iter)
})
queryStr = pipe(
    Object.entries,map(([k, v])=> `${k}=${v}`), join('&')
)

// Lazy 사용
L.entries = function *(obj) {
    for (const k in obj) {
        yield [k, obj[k]];
    }
}

queryStr = pipe(
    L.entries,L.map(([k, v])=> `${k}=${v}`), join('&')
)

// Object.entries : 각 값을 키/밸류의 배열로 만들어줌

console.log(queryStr({ limit: 10, offset: 10, type: 'notice'}));


const users = [
    {age: 35},
    {age: 20},
    {age: 31},
    {age: 36},
    {age: 24},
    {age: 27},
    {age: 34}
]

const find = curry((f, iter) => {
    return go(
        iter,
        L.filter(f),
        take(1),  // 처음으로 만난 조건 꺼내기
        ([a]) => a
    )
});

console.log(find(u => u.age<30)(users));