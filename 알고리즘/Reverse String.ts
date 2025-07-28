/**
 Do not return anything, modify s in-place instead.
 */

// 배열울 바꾸는 문제이고,
// 가장 간단하게 둘의 위치를 바꾸는 방법으로 풀 수 있습니다.
// temp 변수로 s[i] 값을 저장하고, s[i] 값을 s[s.length - i - 1] 값으로 바꾸고,
// s[s.length - i - 1] 값을 temp 값으로 바꾸면 됩니다.
// for문은 배열의 길이의 절반만 돌면 됩니다.
// 왜냐하면 배열의 길이의 절반만 돌면 배열의 중간까지 돌기 때문입니다.
// 예를 들어, 배열의 길이가 5라면, 0, 1, 2, 3, 4 인덱스를 돌면 됩니다.
// 그리고 배열의 길이가 홀수일 때는 중간 인덱스는 그대로 두고, 좌우를 바꾸면 됩니다.

function reverseString(s: string[]): void {
  for (let i = 0; i < s.length / 2; i++) {
    const temp = s[i];
    s[i] = s[s.length - i - 1];
    s[s.length - i - 1] = temp;
  }
}
const ss = ["h", "e", "l", "l", "o"];

reverseString(ss);

console.log(ss);
