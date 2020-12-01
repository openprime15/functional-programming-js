const map = (f, iter) => {
    let result = [];
    for (const a of iter) {
        result.push(f(a));
    }   
    return result;
}

const filter = (f, iter) => {
    let result = [];
    for (const a of iter) {
        if (f(a)) {
            result.push(a);
        }
    }
    return result;
}

const reduce = (f, acc, iter) => {
    if (!iter) {
        iter = acc[Symbol.iterator]();
        acc = iter.next().value;
    }
    for (const a of iter) {
        acc = f(acc, a);
    }

    return acc;
}

const go = (...args) => {
    return reduce((a, f)=>f(a), args);
}

// 함수들이 나열되어있는 합성된 함수를 만드는 함수
let pipe = (...fs) => {
    return (a) => {
        return go(a, ...fs);
    }
}

go(0, a=>a+1, a=>a+10, a=>a+100, console.log);

let testPipe = pipe(a=>a+1,a=>a+10,a=>a+100);
console.log(testPipe(1));

pipe(a=>a+1,a=>a+10,a=>a+100,console.log)(0);

// pipe 함수의 첫번째인자부분에 2개가 올 수 있도록 수정
pipe = (f, ...fs) => {
    return (...as) => {
        return go(f(...as), ...fs);
    }
};

// 받아두었던 함수를 나중에 평가시키는 함수
const curry = (f) => {
    return (a, ..._) => {
        return _.length? f(a, ..._) : (..._) => f(a, ..._);
    }
}

const mult = curry((a, b) => {
    return a*b;
})

// curry를 사용하면 다음 인자를 늦게 보내도 같은 실행을 시킬 수 있음
console.log(mult(3,2));
console.log(mult(3)(2));

const multTest = curry((a, b, c)=>{
    return a*b*c
})

console.log(multTest(3,3,3));
console.log(multTest(3)(3,3));
