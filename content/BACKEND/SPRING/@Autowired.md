---
created: 2026-02-20T15:39:00+09:00
notion-id: 307737bad00c8027865ce76f20d97e0a
---
`@Autowired`는 **스프링 컨테이너에 등록된 빈(Bean)을 타입 기준으로 찾아서 해당 필드/생성자/세터에 자동 주입(DI)해주는 애노테이션**이다.

```java
@Component
public class MemberServiceImpl implements MemberService {

		private final MemberRepository memberRepository;
		
		@Autowired // 이때 생략 가능 (생성자 주입에서 생성자가 1개인 경우)
		public MemberServiceImpl(MemberRepository memberRepository) {
				this.memberRepository = memberRepository;
		}
}
```

- `@ComponentScan`으로 자동으로 설정 파일을 만드는 경우에는 `@Autowired`가 필수다.
- 그냥 의존 관계를 주입받고 싶은 객체 생성자나 필드에 `@Autowired`를 붙여주면 된다.
	- 물론 주입받기 위해서는 주입할 객체도 스프링 빈으로 미리 등록되어 있어야 한다.
- 생성자 주입의 경우에는 생성자가 1개인 경우에는 `@Autowired`를 생략도 가능하다.
	- 필드 주입의 경우에는 1개여도 반드시 붙여야 한다.
- 참고로 자동으로 주입할 대상이 스프링 빈으로 등록되지 않은 경우에는 오류가 발생한다.
	- `@Autowired(required=false)` 옵션으로 주입할 대상이 없으면 호출을 막을 수 있다.

## 참고

[[@ComponentScan]]

[[@Component]]