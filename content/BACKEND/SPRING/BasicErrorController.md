---
created: 2026-08-14T18:08:55+09:00
notion-id: 313737bad00c80cb9341c229d99193fc
---
`BasicErrorController`는 스프링 부트의 “기본 에러 처리 컨트롤러”다. 이 컨트롤러는 자동으로 컴포넌트 등록이 되어있고, 예외가 터지거나(500) 존재하지 않는 URL을 치면(404) 서블릿 컨테이너가 요청을 **/error로 포워딩**하고, BasicErrorController가 받아서 **HTML 에러 페이지(뷰)** 또는 **JSON 에러 바디(API)** 중 하나로 응답한다.

---

`BasicErrorController`의 처리 순서

1. 뷰 템플릿
	- `resources/templates/error/500.html`
	- `resources/templates/error/5xx.html`
2. 정적 리소스 (static, public)
	- `resources/static/error/400.html`
	- `resources/static/error/404.html`
	- `resources/static/error/4xx.html`
3. 적용 대상이 없을 때 (error)
	- `resources/templates/error.html`

해당 위치에 HTTP 상태 코드 이름의 뷰 파일 이름을 넣어두기만 하면 해당 에러가 발생하면 자동으로 해당 HTML 페이지가 클라이언트에게 랜더링된다.

```java
* timestamp: Fri Feb 05 00:00:00 KST 2021
* status: 400
* error: Bad Request
* exception: org.springframework.validation.BindException
* trace: 예외 trace
* message: Validation failed for object='data'. Error count: 1
* errors: Errors(BindingResult)
* path: 클라이언트 요청 경로 (`/hello`)
```

- 그리고 `BasicErrorController`는 다음 정보들을 모델에 담아서 뷰에 전달해 준다.
- 그냥 출력하려고 하면 보안상 막혀있고, `application.properties`에서 설정을 바꾸어야 한다.
	- `server.error.include-exception=false`: exception 포함 여부
	- `server.error.include-message=never`: message 포함 여부
	- `server.error.include-stacktrace=never`: trace 포함 여부
	- `server.error.include-binding-errors=never`: errors 포함 여부