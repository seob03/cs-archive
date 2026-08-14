---
notion-id: 30d737bad00c80409504dd19da98a7ae
---
`@Setter`는 **Lombok이 클래스/필드의 setter 메서드(setX(value))를 자동 생성**해주는 애노테이션이다.

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

[[@Getter]]

[[@ToString]]