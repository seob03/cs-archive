---
notion-id: 312737bad00c801ea338ce8b46dc2773
---
ArgumentResolver(정확히는 스프링 MVC의 HandlerMethodArgumentResolver)는 **컨트롤러 메서드 파라미터를 “어떻게 만들어서 넣을지” 결정하는 컴포넌트**다.

ArgumentResolver는 컨트롤러 메서드를 호출하기 직전에 호출되며 `@RequestParam`, `@PathVariable`, `@RequestBody`, `@SessionAttribute`와 같은 곳에서 데이터 바인딩이 될 때 값을 찾아서 넣어주는 친구가 바로 ArgumentResolver다.

핸들러(컨트롤러 메서드)가 정해진 뒤에, 그 메서드의 각 파라미터를 채우기 위해 ArgumentResolver의 체인이 돌게 된다.

```java
public interface HandlerMethodArgumentResolver {

	boolean supportsParameter(MethodParameter parameter);

	@Nullable
	Object resolveArgument(MethodParameter parameter, @Nullable ModelAndViewContainer mavContainer,
			NativeWebRequest webRequest, @Nullable WebDataBinderFactory binderFactory) throws Exception;

}
```

- 이때 `supportsParameter()`로 “내가 처리할 수 있나?”를 확인하고 (`true`, `false`)
- `true`면 `resolveArgument()`로 값 생성/조회해서 주입해 준다.

## **ArgumentResolver 전체 흐름(끝까지)**

1. ==`**요청 들어옴 (HTTP Request)**`==
2. ==`**HandlerMapping이 컨트롤러 메서드 찾음**`==
3. ==`**컨트롤러 메서드(파라미터) 분석**`==
4. ==`**supportsParameter() 호출**`== → “이 파라미터를 내가 처리할 수 있나?”
5. ==`**resolveArgument() 호출**`== **→** 실제 값 생성/조회해서 파라미터 값으로 만듦==예) @RequestParam이면 쿼리에서 꺼냄, @Login이면 세션에서 회원 꺼냄==
6. ==`**모든 파라미터에 대해 4.~5. 반복**`== → 파라미터가 3개면 resolver 탐색도 3번 돈다
7. ==`**컨트롤러 메서드 호출(실행)**`== → 파라미터가 다 채워진 상태로 메서드 실행됨
8. ==`**반환값 처리(ReturnValueHandler)**`==  
	==**→** String이면 뷰 이름으로 처리**→** @ResponseBody면 HTTP 바디로 처리 (MessageConverter)**→** ResponseEntity면 상태코드/헤더/바디까지 확정==
9. ==`**응답 나감 (HTTP Response)**`==  
	==**→** 뷰 렌더링 후 HTML 응답 또는 JSON/Text 바디 응답==

---

```java
public class CustomArgumentResolver implements HandlerMethodArgumentResolver {

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return false;
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
        return null;
    }
}
```

- 이런 컨트롤러 메서드 전에 호출되는 특징을 이용해서 커스텀 애노테이션과 커스텀 ArgumentResolver를 만들어서 활용할 수도 있다.
	- ==Ex) `@Login`과 `LoginMemberArgumentResolver`==

### 참고

[[@Custom + ArgumentResolver로 세션 조회]]