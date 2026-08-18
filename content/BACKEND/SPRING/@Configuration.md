---
created: 2026-02-14T19:39:00+09:00
notion-id: 307737bad00c804da589fe670d3fa257
---
`@Configuration`은 “**해당 클래스를 스프링 설정 클래스로 등록하고, @Bean들을 프록시(CGLIB)로 관리해서 싱글톤을 보장**”해주는 애노테이션이다.

```java
@Configuration
public class AppConfig {

  @Bean
  public MemberRepository memberRepository() {
    return new MemoryMemberRepository();
  }
}
```

- 스프링 컨테이너는 `@Configuration`이 붙은 `AppConfig` 파일을 설정 정보로 등록한다.
	- 만약 설정 정보 파일에서 `@Configuration`이 없다면 `@Bean`이 등록이 안 된다.
- 스프링이 클래스를 인식하기 위해서는 클래스 단위의 애노테이션이 필요하다.
	- 여기서는 해당 설정 클래스을 인식하기 위해 클래스 단위의 `@Configuration`이 필요한 것.
	- 물론 `@Component` + `@Bean`를 사용해도 등록은 되는데 그러면 싱글톤 보장이 안 됨
- `@Configuration`은 프록시를 통해 `@Bean`이 여러 번 호출돼도 같은 빈을 쓰도록 보장 가능. (싱글톤)
	- 설정 정보 파일에서는 싱글톤 보장이 사실상 필수여서 `@Configuration`을 사용해야 한다.
- 결론 → 설정 클래스에서는 `@Configuration` + `@Bean` 조합으로 사용하면 된다.

## 참고

[[@Bean]]

[[싱글톤 패턴]]