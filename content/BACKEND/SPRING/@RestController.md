---
created: 2026-02-23T15:53:00+09:00
notion-id: 30d737bad00c809294dbc9d70168e8db
---
`@RestController`는 **컨트롤러의 모든 메서드 반환값을 뷰가 아니라 HTTP 응답 바디(JSON 등)로 바로 내려주는** 스프링 MVC 애노테이션이다. (@Controller + @ResponseBody 합친 효과)

```java
@Slf4j
@RestController
public class MappingController {

    @RequestMapping("/hello-basic")
    public String helloBasic() {
        log.info("helloBasic");
        return "ok";
    }
}
```

- 기존 ==`@Controller`에서는 반환형이 문자열이면 view 템플릿을 찾게 된다.==
- ==다만 `@RestController`==는 view 템플릿이 아니라 HTTP 응답을 클라이언트에게 보내버린다.
	- 따라서 실제로 “ok”라는 문자열이 클라이언트에게 노출된다.
- ==`@RestController = @Controller + @ResponseBody`와 동일하다.==
	- ==`@ResponseBody`==는 아래 참고

### 참고

[[@Controller]]

[[@ResponseBody]]