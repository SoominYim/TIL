// 32비트 정수 범위를 벗어나면 0을 반환해야 되는데, 처음에 범위를 벗어났는지, result가 벗어났는지 알아야 하는지 두군데서 사용하기 때문에 변수를 뒀습니다
// 음수인지 확인하고 음수면 양수로 변환하고 뒤집은 후 다시 음수로 변환해서 반환하게 로직을 짰습니다.

function reverse(x: number): any {
  const max = Math.pow(2, 31) - 1;
  const min = Math.pow(-2, 31);

  if (max <= x || x <= min) return 0;

  const isNegative = x < 0;
  const reversed = +[...((isNegative ? -x : x) + "")].reverse().join("");

  if (max <= reversed || reversed <= min) return 0;

  return isNegative ? -reversed : reversed;
}

console.log(reverse(-123));
console.log(reverse(1534236469));
