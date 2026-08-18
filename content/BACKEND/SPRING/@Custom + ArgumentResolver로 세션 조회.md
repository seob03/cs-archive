---
created: 2026-08-14T18:08:55+09:00
notion-id: 312737bad00c80e987a8c39d52f3040a
---
`@SessionAttribute`를 통해서 세션 정보를 파라미터로 받아올 때 문제점이 있는데, 세션 키 문자열을 노출해야 한다는 문제가 있다. 그래서 `ArgumentResolver`과 커스텀 애노테이션을 활용해서 이 문제를 해결해 보자.

```java
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
public @interface Login {
}
```

- 직접 커스텀 애노테이션을 하나 만들어 두자.
- 여기서는 `@SessionAttribute` 대신에 사용할 애노테이션이다.

---

```java
@Slf4j
public class LoginMemberArgumentResolver implements HandlerMethodArgumentResolver {

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        log.info("supportsParameter 실행");

        boolean hasParameterAnnotation = parameter.hasParameterAnnotation(Login.class);
        boolean hasMemberType = Member.class.isAssignableFrom(parameter.getParameterType());

        return hasParameterAnnotation && hasMemberType;
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {

        log.info("resolverArgument 실행");

        HttpServletRequest request = (HttpServletRequest) webRequest.getNativeRequest();
        HttpSession session = request.getSession(false);

        if (session == null) {
            return null;
        }
        return session.getAttribute("loginMember");
    }
}
```

- 회원의 정보를 갖다주는 ArgumentResolver도 만들어주자.
- `supportsParameter()`는 `@Login` 애노테이션이 있으면서 `Member` 타입이면 해당 ArgumentResolver가 사용되도록 구현했다.
- `resolveArgument()`는 세션에 있는 회원 정보인 `member` 객체를 찾아서 반환해 준다.
	- 만약 회원 정보가 없다면 `null`을 반환하도록 구현했다.

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(new LoginMemberArgumentResolver());
    }
}
```

- 커스텀 ArgumentResolver도 `WebMvcConfigurer` 구현체에 등록을 해야한다.

```java
@GetMapping("/")
public String homeLoginByArgumentResolver(@Login Member loginMember, Model model) {

    // 세션이 없는 유저면 home
    if (loginMember == null) {
        return "home";
    }

    // 세션이 유지되어 있으면 oK
    model.addAttribute("member", loginMember);
    return "loginHome";
}
```

이제 `LoginMemberArgumentResolver` 덕분에 `@Login` 애노테이션을 `Member` 파라미터 앞에만 붙여주면 회원 정보를 조회한 뒤에 실제 회원이라면 정보를 `@Login`이 붙은 `Member` 파라미터에 바인딩해 준다.

기존의 `@SessionAttribute` 방식과 동일하게 작동하면서도 애노테이션 이름 자체의 가독성도 좋아지고 추가로 세션 키 문자열이 노출이 안 되기 때문에 보안이 더 좋아진 것을 확인할 수 있다.

### 참고

[[ArgumentResolver]]

[[@SessionAttribute]]

[[WebMvcConfigurer]]