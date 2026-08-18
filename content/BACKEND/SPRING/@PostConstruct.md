---
created: 2026-08-14T18:08:55+09:00
notion-id: 30d737bad00c8014b325c3001d6e12d9
---
`@PostConstruct`는 **스프링 컨테이너가 빈을 생성하고 의존성 주입(DI)까지 완료한 직후**, **초기화 메서드를 자동으로 1회 호출**하게 하는 애노테이션이다.

```java
@Configuration
public class LifeCycleConfig 
    @Bean
    public NetworkClient networkClient() {
		    // 1) 생성
        NetworkClient client = new NetworkClient();
				// 2) 값 세팅(DI/설정)
        client.setUrl("http://hello-spring.dev");        
				// 3) 반환 후 @PostConstruct 실행됨
        return client;
    }
}
```

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

- DI가 끝나면 `@PostConstruct`가 달린 메서드를 자동으로 1회 호출된다.
	- 여기서는 DI가 처음에 스프링이 실행된 뒤에 `@Bean` 메서드 호출을 통해 setter를 통해 DI를 수행한다.
	- 따라서 `@Bean` 메서드에서 DI까지 마친 뒤, return 후에 바로 `@PosrConstruct`가 실행된다.
- `@PreDestory`는 반대로 컨테이너가 죽을 때 실행된다.

### 참고

[[@PreDestroy]]