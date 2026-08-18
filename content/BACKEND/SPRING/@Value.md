---
created: 2026-03-04T18:33:00+09:00
notion-id: 319737bad00c8093944bfe37c4f3ae0b
---
`@Value`는 **설정값(properties/yml·환경변수·SpEL 표현식 결과)**을 읽어 **스프링 빈의 필드/파라미터에 주입**하는 애노테이션이다.

```java
// application.properties
file.dir=/Users/seob/uploads/
app.name=DayToo
```

```java
@Value("${file.dir}")
private String fileDir; // fileDir = "/Users/seob/uploads/"

@Value("${app.name:default}")
private String appName; // appName = "DayToo"
```

- 참고로 정적 필드에는 주입할 수 없다. (스프링의 관리 대상이 아니기 때문)
- `:` (콜론) 뒤에 값을 작성하면 주입할 값이 없을 때 설정할 기본 값을 설정할 수 있다.