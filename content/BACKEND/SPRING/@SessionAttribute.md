---
created: 2026-08-14T18:08:55+09:00
notion-id: 312737bad00c807083aaec8d89734376
---
`@SessionAttribute`는 **세션에 이미 저장돼 있는 값을 꺼내서 컨트롤러 메서드 파라미터에 바로 주입**받는 애노테이션이다. 이미 로그인 된 사용자를 찾을 때 사용하면 된다. 참고로 세션이 없는 경우에 세션을 생성하지는 않는다.

```java
@GetMapping("/")
public String homeLogin(@SessionAttribute(name = "loginMember", required = false) Member loginMember, Model model) {
    // 세션 조회를 name(=key) 값으로 하고 있으면 value인 Object 객체를 자동으로 loginMember에 바인딩함.

    // 세션이 없는 유저면 home
    if (loginMember == null) {
        return "home";
    }

    // 세션이 유지되어 있으면 oK
    model.addAttribute("member", loginMember);
    return "loginHome";
}
```

- `@SessionAtrribute`는 `HttpSession.getAttribute("loginMember")`를 대신 해준다.
	- 세션에 `“loginMember”`(key)에 저장된 객체(value)를 파라미터 `loginMember`에 주입한다.==→ `session.setAttribute("loginMember", loginMember)`로 저장했기 때문에 가능==
	- 만약 세션이 없으면 예외 대신에 `null`이 주입된다. (`required=false` 옵션)
- `@ModelAtrribute`와 동일한데, Model 대신에 Session을 처리한다고 생각하면 쉽다.
- 로그인과 로그아웃 기능같이 세션을 관리하는 코드는 따로 컨트롤러에서 담당해야 한다.
	- `@SessionAttribute`는 세션을 만들어주는 애노테이션이 아니기 때문이다.

---

근데 사실 이렇게 페이지 입장 전에 회원 여부를 확인하는 공통 관심사의 경우에는 인터셉터를 활용하는 것이 좋다. 그래야 유지보수가 쉬워진다. (아래 참고)

따라서 회원 인증의 경우에는 인터셉터가 담당하도록 구현하고, `@SessionAttribute`는 실제로 세션 값이 컨트롤러에서 필요한 경우에만 사용하는 것이 좋다.

물론 `@SessionAttribute`를 사용하면 세션 키 문자열이 노출되기 때문에 커스텀 애노테이션과 커스텀 ArgumentResolver를 활용해서 숨기는 방법도 존재한다.

### 참고

[[로그인 • 로그아웃 기능 구현 (세션 관리)]]

[[스프링 인터셉터를 통해 회원 인증 기능 구현]]

[[@Custom + ArgumentResolver로 세션 조회]]