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

// 테스트


const data = [
    {name:'a', price: 15000},{name:'b', price: 20000},
{name:'c', price: 30000}, {name:'d', price: 50000}];

go(data,
    filter(p=>p.price > 25000),
    map(p=>p.price),
    reduce((a,b)=>a+b),
    console.log)

// 활용
const products = [
    {name:'a', price: 15000, quantity: 1},
    {name:'b', price: 20000, quantity: 2},
    {name:'c', price: 30000, quantity: 3}, 
    {name:'d', price: 50000, quantity: 4}, 
    {name:'e', price: 70000, quantity: 5}];

const total_price = pipe(
    map(p=>p.quantity*p.price),
    reduce((a, b)=> a+b));
console.log(total_price(products));
