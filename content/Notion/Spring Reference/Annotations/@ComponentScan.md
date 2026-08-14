---
notion-id: 307737bad00c80b28a79da2b279dfdf6
---
`@ComponentScan`은 “**@Component 계열(@Service/@Repository/@Controller 등) 붙은 클래스를 찾아 스프링 빈으로 자동 등록하는 설정”**이다.

```java
@Configuration
@ComponentScan(basePackages = "hello.core", excludeFilters = @ComponentScan.Filter(type = FilterType.ANNOTATION, classes = Configuration.class))
public class AutoAppConfig {
}
```

- [[@Configuration]]에서와 다르게 `@Bean`이 없는 걸 볼 수 있다.
- 필터도 `includeFilters`와 `excludeFilters`로 스캔에 필터링을 걸 수 있다.
- `AutoAppConfig`의 사용 방법은 `AppConfig`와 똑같이 컨테이너 선언하고 꺼내서 쓰면 된다.

```java
@Component
public class MemoryMemberRepository implements MemberRepository {}
```

```java
@Component
public class RateDiscountPolicy implements DiscountPolicy {}
```

- `@Component`를 클래스 단위에 걸어서 스캔 대상으로 지정해야 한다.
- 다만, [[@Configuration]] 에서 다룬 `AppConfig`와 다르게 의존관계 명시가 안 되어 있다.
	- 그래서 `@Autowired`로 의존관계를 애노테이션으로 명시해야 한다.

## 참고

[[@Configuration]]

[[@Component]]

[[@Autowired]]