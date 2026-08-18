---
created: 2026-02-21T02:21:00+09:00
notion-id: 30d737bad00c803abec5e2d2ca456af1
---
`@ToString`은 **Lombok이 toString() 메서드를 자동 생성**해주는 애노테이션이다. 클래스의 필드들을 이용해 ClassName(field=..., ...) 형태로 만들어준다.

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

[[@Setter]]