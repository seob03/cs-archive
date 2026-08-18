---
created: 2026-08-14T18:08:55+09:00
notion-id: 30d737bad00c804baf04e85ddd047464
---
`@Scope`는 **스프링 빈의 생성/유지 범위(생명주기)** 를 지정하는 애노테이션이다.

---

- 싱글톤
	- 기본 스코프, 컨테이너의 시작과 종료까지 유지되는 가장 넓은 범위의 스코프
- 프로토타입
	- 스프링 컨테이너는 프로토타입 빈의 생성과 의존관계 주입까지만 관여하는 매우 짧은 범위의 스코프
- 웹 관련 스코프
	- request : 웹 요청이 들어오고 나갈 때까지 유지되는 스코프  
		→ 참고로 `@Scope("request")`빈은 요청 1개당 1개 인스턴스가 원칙
	- session : 웹 세션이 생성되고 종료될 때까지 유지되는 스코프
	- application : 웹의 서블릿 컨텍스트와 같은 범위로 유지되는 스코프

---

```java
@Component
@Scope(value = "request", 
			 proxyMode = ScopedProxyMode.TARGET_CLASS
)
public class MyLogger {
    private String uuid;
    private String requestURL;

    public void setRequestURL(String requestURL) {
        this.requestURL = requestURL;
    }

    public void log(String message) {
        System.out.println("[" + uuid + "]" + "[" + requestURL + "] " +
                message);
    }

    @PostConstruct
    public void init() {
        uuid = UUID.randomUUID().toString();
        System.out.println("[" + uuid + "] request scope bean create:" + this);
    }

    @PreDestroy
    public void close() {
        System.out.println("[" + uuid + "] request scope bean close:" + this);
    }
}
```

- 이런 식으로 스코프를 지정할 수 있다. 이제 이 빈은 HTTP 요청당 1개씩 생성된다.
- 이때 `proxyMode` 프록시 설정은 필수다. (궁금하면 아래 참고)

```java
[d06b992f...] request scope bean create
[d06b992f...][http://localhost:8080/log-demo] controller test
[d06b992f...][http://localhost:8080/log-demo] service id = testId
[d06b992f...] request scope bean close
```

- 이제 HTTP 요청마다 이런 식으로 로그를 남길 수 있게 된다.

### 참고

[[request 빈 스코프에서 프록시의 필요성]]