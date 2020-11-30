const map = (f, iter) => {
    let result = []
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
    if(!iter){
        iter = acc[Symbol.iterator]();
        acc = iter.next().value;
    }
    for (const a of iter) {
        acc = f(acc, a);
    }
    return acc;
}



const data = [{name:'a', price: 15000},{name:'b', price: 20000},
{name:'c', price: 30000}, {name:'d', price: 50000}];

const mapData = map(v=>v.name, data)

const filterData = filter(v=>v.price > 20000, data);

const reduceData = reduce((a,b)=>a+b, 1, [2, 3, 4, 5]);

console.log('mapData :>> ', mapData);
console.log('filterData :>> ', filterData);
console.log('reduceData :>> ', reduceData);
