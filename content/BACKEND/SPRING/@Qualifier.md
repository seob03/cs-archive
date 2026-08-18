---
created: 2026-02-20T15:41:00+09:00
notion-id: 30d737bad00c809caa18ec8e2963d3da
---
`@Qualifier`는 **같은 타입의 스프링 빈이 여러 개일 때, 주입할 빈을 “이름(식별자)”로 지정해서 딱 하나로 선택**하게 해주는 애노테이션이다.

```java
@Component
public class FixDiscountPolicy implements DiscountPolicy {}
```

```java
@Component
public class RateDiscountPolicy implements DiscountPolicy {}
```

- 이렇게 2개의 구현체가 있다고 가정하자.

```java
@Autowired
private DiscountPolicy discountPolicy
```

- 실행하면 아래와 같은 예외가 발생한다.

```
NoUniqueBeanDefinitionException: No qualifying bean of type
'hello.core.discount.DiscountPolicy' available: expected single matching bean
but found 2: fixDiscountPolicy,rateDiscountPolicy
```

- 오류 메시지를 해석해 보면, 하나의 빈을 기대했지만, 2개가 발견되었다고 한다.

---

```java
@Component
@Qualifier("mainDiscountPolicy")
public class RateDiscountPolicy implements DiscountPolicy {}
```

- 그럴 때 이렇게 `@Qualifier`를 사용해서 이름을 지정할 수 있다.

```java
@Autowired
public OrderServiceImpl(MemberRepository memberRepository,
		@Qualifier("mainDiscountPolicy") DiscountPolicy discountPolicy) {
				this.memberRepository = memberRepository;
				this.discountPolicy = discountPolicy;
}
```

- 불러올 때 마찬가지로 `@Qualifier`로 이름을 지정해서 생성자의 파라미터에 붙여주게 되면 된다.
- 근데 이러면 모든 생성자의 파라미터에 애노테이션과 이름을 붙여야 해서 매우 불편하다.
	- 그래서 `@Primary`를 사용하는 방법도 있다.

### 참고

[[@Autowired]]

[[@Primary]]