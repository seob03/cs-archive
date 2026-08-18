---
created: 2026-02-26T19:53:00+09:00
notion-id: 310737bad00c80a386dbc2b187429ac3
---
`@Data`는 Lombok이 클래스에 대해 getter/setter, toString(), equals/hashCode(), required args constructor(final/@NonNull 필드 대상)를 한 번에 자동 생성해주는 애노테이션이다.

```java
package hello.springmvc.basic;

import lombok.Data;

@Data
public class HelloData {
    private String username;
    private int age;
}
```

- 아래의 애노테이션을 `@Data`로 한 번에 적용시킬 수 있다.
	- ==`@Getter`==
	- ==`@Setter`==
	- ==`@ToString`==
	- ==`@EqualsAndHashCode`==
	- ==`@RequiredArgsConstructor`==

### 참고

[[@Getter]]

[[@Setter]]

[[@ToString]]

[[@EqualsAndHashCode]]

[[@RequiredArgsConstructor]]