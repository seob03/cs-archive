---
notion-id: 312737bad00c8088a3d6f653acb04a38
---
`@ExceptionHandler`는 **컨트롤러(또는 @ControllerAdvice) 안에서 발생한 예외를 잡아서, 예외별로 “대체 응답”을 만들어 반환**하게 해주는 스프링 MVC 애노테이션이다.

```java
@ExceptionHandler(IllegalArgumentException.class)
public ErrorResult illegalExHandle(IllegalArgumentException e) {
		log.error("[exceptionHandle] ex", e);
		return new ErrorResult("BAD", e.getMessage());
}
```

- 이런 식으로 애노테이션을 붙여준 뒤에 처리하고 싶은 예외를 지정하면 된다.
	- 해당 컨트롤러에서 예외가 발생하면 매핑되어 있는 메서드가 호출된다.
	- 지정한 예외와 그 예외의 자식 클래스까지 모두 잡을 수 있다.
- 컨트롤러에 정상 코드와 예외 처리 코드가 섞여 있는 건 좋지 않다.
	- `@ControllerAdvice`를 사용해서 해결할 수 있다.

```java
@Slf4j
@RestControllerAdvice
public class ExControllerAdvice {

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(IllegalArgumentException.class)
    public ErrorResult illegalExHandler(IllegalArgumentException e) {
        log.error("[exceptionHandler] ex", e);
        return new ErrorResult("BAD", e.getMessage());
    }

    @ExceptionHandler
    public ResponseEntity<ErrorResult> userExHandler(UserException e) {
        log.error("[exceptionHandler] ex", e);
        ErrorResult errorResult = new ErrorResult("USER-EX", e.getMessage());
        return new ResponseEntity(errorResult, HttpStatus.BAD_REQUEST);
    }

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler
    public ErrorResult exHandler(Exception e) {
        log.error("[exceptionHandler] ex", e);
        return new ErrorResult("EX", "내부 오류");
    }
}
```

- 분리할 때는 `@ControllerAdvice` 또는 `@RestControllerAdvice`를 사용할 수 있다.
	- 클래스 레벨에 선언해 두면 에러 메서드를 모아둘 수 있게 된다.
	- API 예외 처리에서는 보통 `@RestControllerAdvice`를 사용한다.
- `@ControllerAdvice` 옵션에 아무 값도 넣지 않으면 모든 컨트롤러에 적용된다.
	- 옵션으로 범위를 지정하는 방법은 애노테이션, 패키지, 클래스 타입 등이 있다.
	- `@ControllerAdvice`에 대해 자세한 건 아래 참고하자.
- 설정 파일을 따로 분리했으면 컨트롤러의 `@ExceptionHandler`는 없어도 된다.
	- 설정 파일에서 원격으로 관리를 해주기 때문이다.
- 설정 파일에서 `@ResponseStatus`로 HTTP 상태 코드를 지정해 주는 것이 좋다.
	- 정확하게 지정해 두면 기본값(500)으로 새는 것을 막을 수 있다.

### 참고

[[@ControllerAdvice]]

[[@RestControllerAdvice]]