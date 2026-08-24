---
created: 2026-02-27T21:31:00+09:00
notion-id: 312737bad00c80e288bff8139322700a
---
![[images/스크린샷_2026-02-25_오후_7.58.04.png]]

- 로그인 유저
	- HTTP 요청 → WAS → 필터 → 서블릿 → 스프링 인터셉터 → 컨트롤러
- 비 로그인 유저
	- HTTP 요청 -> WAS -> 필터 -> 서블릿 -> 스프링 인터셉터 (STOP)

---

```java
public class LogInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
    }
}
```

- 인터셉터 구현 → `HandlerInterceptor` 인터페이스 구현
	- `preHandle` → 컨트롤러 호출 전
	- `postHandle` → 컨트롤러 호출 후
	- `afterCompletion` → 요청 완료 후

---

![[images/스크린샷_2026-02-25_오후_7.58.23.png]]

- 만약에 컨트롤러에서 예외가 발생하면 `postHandle`은 호출되지 않는다.
- `afterCompletion`은 항상 호출된다. 예외가 터져도 예외를 파라미터로 받아온다.

---

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LogInterceptor())
                .order(1)
                .addPathPatterns("/**")
                .excludePathPatterns("/css/**", "/*.ico", "/error");

        registry.addInterceptor(new LoginCheckInterceptor())
                .order(2)
                .addPathPatterns("/**")
                .excludePathPatterns("/", "/members/add", "/login", "logout", "/css/**", "/*.ico", "/error");
    }
}
```

- 인터셉터를 구현한 뒤에 `WebMvcConfigurer` 구현체에 등록을 해주면 된다.
- `WebMvcConfigurer`가 제공하는 `addInterceptors()`를 사용해서 등록하면 된다.

### 참고

[[스프링 인터셉터를 통해 회원 인증 기능 구현]]

[[WebMvcConfigurer]]