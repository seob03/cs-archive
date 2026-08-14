---
notion-id: 30d737bad00c80c1952dc7e05ea87363
---
`@ResponseBody`는 **컨트롤러 메서드의 반환값을 뷰 이름으로 해석하지 않고**, **HTTP 응답 바디(Body)에 그대로 써서 클라이언트에 반환**하게 만드는 애노테이션이다.

```java
@ResponseBody
@ResponseStatus(HttpStatus.CREATED) // 201
@PostMapping("/response-json")
public MemberCreateRequest create(@RequestBody MemberCreateRequest dto) {
    return dto;
}
```

- 반환 타입이 `String`이면 JSON이 아니라 그냥 텍스트로 반환해 버리고
- 반환 타입이 객체면 JSON으로 변환한 뒤에 반환한다.
- 응답 HTTP 상태 코드를 지정해서 보내주고 싶다면 `@ResponseStatus`를 사용하면 된다.

### 참고

[[@RequestBody]]

[[@ResponseStatus]]