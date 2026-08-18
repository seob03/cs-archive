---
created: 2026-02-26T20:00:00+09:00
notion-id: 313737bad00c80d78d4df5a50df01316
---
`@AllArgsConstructor`는 **Lombok 애노테이션**이고, **클래스의 모든 필드(멤버 변수)를 파라미터로 받는 생성자 1개를 자동 생성**한다.

```java
@AllArgsConstructor
class Member {
    private String name;
    private int age;
}
```

- Lombok이 내부적으로 아래와 같은 생성자를 만들어 준다.

```java
class Member {
    private String name;
    private int age;

    public Member(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

- 모든 필드가 생성자 주입 대상이 되기 때문에 의도치 않은 주입/순환참조가 생길 수 있다.
	- 따라서 거의 DTO/테스트용 객체를 만들 때 자주 사용한다.
- 스프링 DI 용도로는 보통 `@RequiredArgsConstructor`를 사용한다.

### 참고

[[@RequiredArgsConstructor]]