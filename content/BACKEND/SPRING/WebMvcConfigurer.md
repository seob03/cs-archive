---
created: 2026-08-14T18:08:55+09:00
notion-id: 312737bad00c8088bdddc3b6470f62ce
---
WebMvcConfigurer는 **스프링 MVC 설정을 “내가 필요한 부분만” 커스터마이징(확장)할 수 있게 해주는 설정용 인터페이스**다.

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(new LoginMemberArgumentResolver());
    }

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

- 이런 식으로 오버라이딩을 통해 스프링 MVC 설정을 확장할 수 있다.
- 인터셉터 등록, CORS 설정, 포메터/컨버터, ArgumentResolver를 등록한다.