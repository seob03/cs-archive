---
created: 2026-02-27T21:43:00+09:00
notion-id: 310737bad00c8064bdd9d2d63a54b8a6
---
`@RequestHeader`**는** HTTP 요청 헤더(Header) 값을 컨트롤러 메서드 파라미터로 바인딩해주는 애노테이션이다.

```java
@GetMapping("/who")
public String who(
        @RequestHeader("User-Agent") String userAgent,
        @RequestHeader(value = "Authorization", required = false) String auth
) {
    return "UA=" + userAgent + ", auth=" + auth;
}
```