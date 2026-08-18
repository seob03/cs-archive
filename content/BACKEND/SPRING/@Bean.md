---
created: 2026-08-14T18:08:55+09:00
notion-id: 307737bad00c806cbdf2dc46bd75170f
---
`@Bean`은 **“이 메서드가 반환하는 객체를 스프링 컨테이너에 빈(Bean)으로 등록”**하는 기능이다.

```java
@Configuration
public class AppConfig {

  @Bean
  public MemberRepository memberRepository() {
    return new MemoryMemberRepository();
  }
}
```

- 빈 이름: `memberRepository`
	- 빈 이름의 규칙은 기본적으로 메서드 이름이 된다. (= 클래스 명에서 맨 앞 글자만 소문자로)
	- 만약 바꾸고 싶다면 `@Bean(name=”지정할 이름”)`로 지정이 가능
- 빈 타입: `MemberRepository`
- 설정 클래스 `AppConfig`에서 스프링 컨테이너에 객체를 수동으로 등록할 때 사용
	- 이때, 스프링 컨테이너에 등록된 객체를 스프링 빈이라고 한다.

## 사용 방법

```java
ApplicationContext applicationContext  = new AnnotationConfigApplicationContext(AppConfig.class);
```

- 사용할 곳에서 이렇게 컨테이너(`AnnotationConfigApplicationContext`)를 부른 뒤에

```java
MemberService memberService = applicationContext.getBean("memberService", MemberService.class);
OrderService orderService = applicationContext.getBean("orderService", OrderService.class);
```

- 이런 식으로 컨테이너에 스프링 빈으로 등록된 객체를 불러와서 사용할 수 있다.
	- `getBean(”메서드명”, 메서드 타입)`으로 찾아서 꺼내쓰면 된다.

## 참고

[[@Configuration]]