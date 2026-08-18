---
created: 2026-08-14T18:08:55+09:00
notion-id: 30d737bad00c80de99fdf12e35bce375
---
`@Primary`는 **같은 타입의 스프링 빈이 여러 개일 때, 별도 지정(@Qualifier)이 없으면 이 빈을 “기본 후보(우선 주입 대상)”로 선택**하게 하는 애노테이션이다.

```java
@Component
@Primary
public class RateDiscountPolicy implements DiscountPolicy {}

@Component
public class FixDiscountPolicy implements DiscountPolicy {}
```

- 더 우선으로 하고 싶은 구현체에 `@Primary`만 붙여주게 되면 우선 순위를 갖게 된다.
- `@Qualifier`와 다르게 모든 곳에 애노테이션을 붙일 필요가 없어서 편리하다.
	- 참고로 `@Qualifier`와 `@Primary` 중에서는 `@Qualifier`가 더 우선권이 높다.

### 참고

[[@Autowired]]

[[@Qualifier]]