---
created: 2026-02-21T02:21:00+09:00
notion-id: 30d737bad00c804a8acef7cb2d128e01
---
`@Getter`는 **Lombok이 클래스/필드의 getter 메서드(getX(), boolean이면 isX())를 자동 생성**해주는 애노테이션이다. 주로 `@Setter`와 같이 사용한다.

```java
package hello.core;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class HelloLombok {
    private String name;
    private int age;

    public static void main(String[] args) {
        HelloLombok helloLombok = new HelloLombok();
        helloLombok.setName("spring");
        String name = helloLombok.getName();

        // 출력 : name = spring
        System.out.println("name = " + name);
        // 출력 : helloLombok = HelloLombok(name=spring, age=0)
        System.out.println("helloLombok = " + helloLombok);
    }
}
```

### 참고

[[@Setter]]

[[@ToString]]