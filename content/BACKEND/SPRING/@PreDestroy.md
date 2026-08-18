---
created: 2026-02-27T21:44:00+09:00
notion-id: 30d737bad00c80abbeb6e4be92c8a0fc
---
`@PreDestroy`는 **스프링 컨테이너가 종료되기 직전**, 빈의 **종료(정리) 메서드를 자동으로 1번 호출**하게 하는 애노테이션이다.

```java
public class NetworkClient {

    private String url;
/* ------------------------------------------------ */
		// 생성자 호출
    public NetworkClient() {
        System.out.println("[constructor] url = " + url); // 아직 주입 전이라 null
    }
    public void setUrl(String url) {
        this.url = url;
    }
/* ------------------------------------------------ */
    // 서비스 시작 시 사용 (@PostConstruct에서 사용)
    private void connect() {
        System.out.println("[connect] url = " + url);
    }
    private void call(String message) {
        System.out.println("[call] url = " + url + ", message = " + message);
    }
/* ------------------------------------------------ */
    // 서비스 종료 시 사용 (@PreDestroy에서 사용)
    private void disconnect() {
        System.out.println("[disconnect] url = " + url);
    }
/* ------------------------------------------------ */
    /**
     * DI(세팅) 완료 후 "자동으로" 1회 호출
     */
    @PostConstruct
    public void init() {
        System.out.println("[init]");
        connect();
        call("초기화 연결 메시지");
    }
/* ------------------------------------------------ */
    /**
     * 스프링 컨테이너 종료 직전 "자동으로" 1회 호출
     */
    @PreDestroy
    public void close() {
        System.out.println("[close]");
        disconnect();
    }
    
/*
	[constructor] url = null
	[init]
	[connect] url = http://hello-spring.dev
	[call] url = http://hello-spring.dev, message = 초기화 연결 메시지
	[close]
	[disconnect] url = http://hello-spring.dev
*/
```

- 스프링 컨테이너가 종료되기 전에 1회 자동으로 호출된다.
- `@PostConstruct`에 비하면 비교적 사용 난이도가 쉽다.

### 참고

[[@PostConstruct]]