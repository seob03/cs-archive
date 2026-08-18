---
created: 2026-02-26T21:05:00+09:00
notion-id: 313737bad00c80448249dde3970b56bc
---
`@RestControllerAdvice`는 **여러 컨트롤러(API)에 공통으로 적용되는 “전역 처리 클래스”**를 만들 때 쓰는 애노테이션이다. **@ControllerAdvice + @ResponseBody**라서, 처리 결과를 **뷰가 아니라 JSON(응답 바디)** 로 바로 내려준다. 주로 API 예외 메서드들을 모아둘 때 사용한다.

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler(IllegalArgumentException.class)
  public Map<String, Object> handle(IllegalArgumentException e) {
    return Map.of("message", e.getMessage());
  }
}
```

### 참고

[[@ControllerAdvice]]

[[@ResponseBody]]