---
notion-id: 313737bad00c8091bd80dba1eba06bb4
---
`@ControllerAdvice`는 **여러 컨트롤러에 공통으로 적용되는 “컨트롤러 전역 설정/처리 클래스”**를 만드는 스프링 MVC 애노테이션이다. 대표적으로 `@ExceptionHandler`를 한 곳에 모을 때 사용한다.

```java
// Target all Controllers annotated with @RestController
@ControllerAdvice(annotations = RestController.class)
public class ExampleAdvice1 {}

// Target all Controllers within specific packages
@ControllerAdvice("org.example.controllers")
public class ExampleAdvice2 {}

// Target all Controllers assignable to specific classes
@ControllerAdvice(assignableTypes = {ControllerInterface.class, AbstractController.class})
public class ExampleAdvice3 {}
```

- 설정 범위를 애노테이션의 옵션으로 조절할 수 있다.
	- 애노테이션 기준 필터
	- 패키지 기준 필터
	- 클래스 타입 기준 필터
- Rest 버전인 `@RestControllerAdvice`도 존재한다.

### 참고

[[@ExceptionHandler]]

[[@RestControllerAdvice]]