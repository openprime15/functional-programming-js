
// 기존 콜백
function add10(a, callback) {
    setTimeout(()=> callback(a+10), 1000)
}

// add10(5, res=>{
//     add10(res, res=>{
//         console.log(res);
//     })
// })


// Promise 사용
function add20(a) {
    // 리턴이 중요
    return new Promise(resolve=> setTimeout(()=> resolve(a+20), 1000))
}

// add20(5).then(add20).then(console.log)

// Promise의 장점 : 비동기상황을 1급값으로 다루게 해준다.(대기, 성공, 실패를 다루는)
// 1급이면 변수로 할당될 수 있고, 전달도 가능함, 무언가 일을 이어나갈 수 있게 해준다.


/* 1급 활용 */
 const go1 = (a, f) => f(a);
 const add5 = a => a+5;

 console.log(go1(10, add5));

 /* 모나드 */

 const g = (a) => {
     return a+1;
 }

 const f = (a) => {
     return a*a;
 }

 console.log(f(g(1)));
//  NaN이 나와버려 안전한 합성함수로 볼 수없다.
 console.log(f(g()));

// 모나드는 [] 와 같은 박스를 만듬
console.log([1].map(g).map(f));

// 그렇다고 [](Array)가 사용자의 값에 노출되는건 아님
// 그래서 이렇게 배열이 나오는 부분을 지운다
[1].map(g).map(f).forEach(r => console.log(r));
[].map(g).map(f).forEach(r => console.log(r));

// 프로미스도 이러한 확장함수와 비슷한 방법으로 움직임
// 대기가 필요한 상황에서 안전한 합성을 일으킴
Promise.resolve(1).then(g).then(f).then(r => console.log(r));

/* Kleisli Composition */
// 오류가 있을 수 있는 상황에서 함수합성을 안전하게하는 하나의 규칙
// rule : f(g(x)) = f(g(x)), f(g(x)) = g(x) <= g(x)가 오류가 난 경우

