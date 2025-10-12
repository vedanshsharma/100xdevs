//arrow function 
function sum(a,b){
    return a + b;
}

const sum1 = (a,b) => {
    return a+b;
}
let x = 1
const obj = {
  x: 42,
  regular: function() {
    return this;
  },
  arrow: () => {
    return this;
  }
};

console.log(obj.regular()); // 42
console.log(obj.arrow()); // undefined

function Counter() {
  this.value = 0;

  // Regular function: 'this' changes inside setInterval
  setInterval(function() {
    this.value++; // 'this' is not the Counter instance—it's the global object!
    console.log(this.value); // NaN or undefined in strict mode
  }, 1000);

  // Arrow function: 'this' stays the Counter instance
  setInterval(() => {
    this.value++; // 'this' is correctly the Counter instance
    console.log(this.value); // Works as expected
  }, 1000);
}

// const c = new Counter();



//////MAP

let arr = [1,2,3,4,5];

function tranform(i){
    return i * 2;
}
// console.log(arr.map(i => 2 * i ));

// map function implementation 

function Map(arr , fn){
  for(let i = 0 ; i < arr.length ; i ++){
    arr[i] = fn(i);
  }
}

Map(arr , i => 2 * i );

console.log(arr)