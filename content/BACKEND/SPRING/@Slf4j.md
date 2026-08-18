---
created: 2026-08-14T18:08:55+09:00
notion-id: 30d737bad00c801aa4bec9f5d9e647f0
---
`@Slf4j`은 클래스에 **SLF4J Logger(log) 필드**를 자동 생성해서 log.info(), log.error() 같은 로그를 바로 쓰게 해주는 **Lombok 애노테이션**이다.

```java
\#전체 로그 레벨 설정(기본 info)
logging.level.root=info

\#hello.springmvc 패키지와 그 하위 로그 레벨 설정
logging.level.hello.springmvc=debug
```

- 로그 계층 레벨이 존재한다.
	- (약) ==`TRACE > DEBUG > INFO > WARN > ERROR`== (강)
- 개발 서버는 debug로 출력하고 운영 서버는 info로 출력
	- 만약에 설정 레벨이 `INFO`면 `INFO`, `WARN`, `ERROR`만 뜨게 된다.
	- 설정한 레벨의 하위 레벨은 출력이 무시된다.  
		→ 바꿀려면 `application.properties`에서 설정하면 된다.

```java
@Slf4j
@RestController
public class LogTestController {

    @RequestMapping("/log-test")
    public String logTest() {

        String name = "Spring";
        System.out.println("name = " + name); //name = Spring

        log.trace("trace log={}", name);
        log.debug("trace debug={}", name);
        log.info("info log={}", name); // 2026-01-24T18:37:41.836+09:00  INFO 5474 --- [springmvc] [nio-8080-exec-1] h.springmvc.basic.LogTestController      : info log=Spring
        log.warn("warn log={}", name);
        log.error("error log={}", name);

        return "ok";
    }
}
```

![[image.png]]

- `/log-test`에 요청을 보내게 되면 아래와 같이 로그가 남게 된다.

### 참고

[[@RestController]]