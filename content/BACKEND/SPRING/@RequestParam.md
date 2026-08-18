---
created: 2026-08-14T18:08:55+09:00
notion-id: 30d737bad00c80b38c7ffeb93a168be0
---
`@RequestParam`은 **요청 파라미터(query string/form 데이터)를 메서드 파라미터로 바인딩**해주는 애노테이션이다.

```java
@GetMapping("/search")
public String search(@RequestParam String keyword) {
    // /search?keyword=spring
    return "keyword = " + keyword;
}
```

- 메서드 파라미터 명과 URL 파라미터의 이름이 같은 경우에는 name 옵션 생략 가능하다.
- 만약에 이름을 지정하고 싶다면 `@RequestParam(”??”)`으로 지정할 수 있다.
	- `required=`와 같은 옵션이 없다면 `value=` 생략 가능

```java
@GetMapping("/search")
public String search(@RequestParam(value = "keyword", required=false) String keyword) {
    // /search?keyword=spring
    return "keyword = " + keyword;
}
```

- 만약에 필수로 받아야 하는 파라미터가 아닌 경우에는 `required=false`로 바꾸면 된다.
	- `required=` 옵션의 기본 값은 `true`
- 만약에 이런 경우에 들어온 값이 없는 경우에는 `keyword`의 값이 `null`이 된다.

```java
@RequestMapping("/search")
public String requestParamDefault(
        @RequestParam(required = true, defaultValue = "guest") String username,
        @RequestParam(required = false, defaultValue = "-1") int age) {
    log.info("username={}, age={}", username, age);
    return "ok";
}
```

- 값을 입력하지 않는 경우를 대비해서 기본 값으로 `defaultValue=` 옵션을 설정할 수 있음
- 근데 이러면 반드시 값이 존재하게 되기 때문에 `required` 옵션 자체가 의미가 없어진다.
	- 참고로 빈 문자를 입력해도 `defaultValue=` 옵션이 발동된다.

### @RequestParam 주의할 점

1. `/search?keyword=`로 요청을 보내는 경우에는 `keyword`에 빈 문자가 들어간 판정이라서 통과가 되고, 진짜 `null`이 들어가게 하려면 `keyword=` 자체가 없어야 한다.
2. 숫자를 받는 경우에는 `int`에 `null`이 들어갈 수 없기 때문에 `required=` 옵션을 사용하려면 `int` 대신에 `Integer` 타입을 사용해야 한다.